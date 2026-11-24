#!/usr/bin/env node
// Stamps every local `@import url('x.css')` in css/ with a content hash:
// `@import url('x.css?v=1a2b3c4d')`.
//
// Why: the Webflow head loads css/styles.css with a fresh `?v=` on every page view,
// but files it @imports are fetched by plain URL, and jsDelivr tells browsers to
// cache those for 7 days. With a content hash the URL changes exactly when the
// file changes, so returning visitors never get stale page CSS.
//
// Run by .github/workflows/update-readme.yml on every push touching css/**.
// Safe to run locally: `node scripts/version-css-imports.js` (prints changed files).

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CSS_DIR = path.resolve(__dirname, '..', 'css');
const IMPORT_RE = /@import\s+url\(\s*(['"])([^'"]+)\1\s*\)/g;

const hashes = new Map(); // abs path -> hash of final (already stamped) content
const changed = [];

function isLocal(url) {
    return !/^(https?:)?\/\//.test(url) && !url.startsWith('data:');
}

// Depth-first: stamp a file's own imports first, so its hash reflects them too
function stamp(file, seen = new Set()) {
    if (hashes.has(file)) return hashes.get(file);
    if (seen.has(file)) throw new Error(`@import cycle at ${file}`);
    seen.add(file);

    const original = fs.readFileSync(file, 'utf8');
    // Commented-out imports (/* @import ... */) are left alone
    const comments = [...original.matchAll(/\/\*[\s\S]*?\*\//g)].map((m) => [m.index, m.index + m[0].length]);
    const inComment = (i) => comments.some(([a, b]) => i >= a && i < b);
    const updated = original.replace(IMPORT_RE, (match, quote, url, offset) => {
        if (!isLocal(url) || inComment(offset)) return match;
        const bare = url.split('?')[0];
        const target = path.resolve(path.dirname(file), bare);
        if (!fs.existsSync(target)) throw new Error(`${path.relative(CSS_DIR, file)}: missing import ${bare}`);
        return `@import url(${quote}${bare}?v=${stamp(target, seen)}${quote})`;
    });

    if (updated !== original) {
        fs.writeFileSync(file, updated);
        changed.push(path.relative(path.resolve(CSS_DIR, '..'), file));
    }

    const hash = crypto.createHash('sha1').update(updated).digest('hex').slice(0, 8);
    hashes.set(file, hash);
    return hash;
}

function walk(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
        d.isDirectory() ? walk(path.join(dir, d.name)) : d.name.endsWith('.css') ? [path.join(dir, d.name)] : []
    );
}

walk(CSS_DIR).forEach((file) => stamp(file));
changed.forEach((f) => console.log(f));

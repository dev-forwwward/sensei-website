// Shared helpers, passed to every init function by script-loader.js
// (modules don't import each other — static imports get cached by jsDelivr/browsers).

// Runs each named block in isolation: a throw (or rejected promise) in one block
// is logged and doesn't stop the others — same as separate <script> tags behaved.
export function runBlocks(scope, blocks) {
    Object.entries(blocks).forEach(([name, block]) => {
        try {
            Promise.resolve(block()).catch((err) => console.warn(`[${scope}] ${name} failed:`, err));
        } catch (err) {
            console.warn(`[${scope}] ${name} failed:`, err);
        }
    });
}

// Loads a classic <script> once (same URL requested twice → same promise).
// Use exact, pinned versions.
const scripts = new Map();
export function loadScript(src) {
    if (!scripts.has(src)) {
        scripts.set(src, new Promise((resolve, reject) => {
            const el = document.createElement('script');
            el.src = src;
            el.onload = resolve;
            el.onerror = () => reject(new Error(`Failed to load ${src}`));
            document.body.appendChild(el);
        }));
    }
    return scripts.get(src);
}

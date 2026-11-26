// Cache-busted dynamic imports: jsdelivr/browsers cache static `import` specifiers
// hard (branch-alias staleness even after purge). A fresh query param per load
// forces a real fetch every time, so pushes to main show up immediately.
// Modules therefore don't `import` each other — shared helpers are passed to each
// init function instead (see `helpers` below).
const v = Date.now();

// Site-wide modules: loaded and initialized on every page, in this order
const modules = [
    // Sensei legacy site code (was Webflow site footer custom code) — runs first
    { path: 'legacy-site', exportName: 'legacySiteInit' },
    { path: 'footer-date', exportName: 'footerDate' },
    { path: 'works', exportName: 'works' },
    { path: 'navbar-mobile', exportName: 'navbarMobile' }, // Relume navbar6 ≤991px (css/navbar-mobile.css)
    { path: 'navbar-desktop', exportName: 'navbarDesktop' }, // ≥992px: hide bar at the footer (css/navbar-desktop.css)

    // FWD white-label modules disabled while the legacy code is live:
    // { path: 'main', exportName: 'mainInit' },     // Lenis fights legacy jQuery/window scrollTo + ScrollTrigger pins; needs Lenis + Fancybox libs
    // { path: 'menu', exportName: 'navBarMenu' },   // Sensei uses legacy mega menu / mobile menu (legacy-site.js)
    // { path: 'swiper', exportName: 'swiperInit' }, // auto-inits every .swiper → double-init of legacy page sliders
    // { path: 'form', exportName: 'form' },         // needs jquery.validate; Sensei forms not built for it yet
    // { path: 'faqs', exportName: 'faqs' },         // legacy pages use their own accordions
];

// Page modules: picked by the Webflow page id on <html data-wf-page="…">.
// CMS items carry their template's id. Run after the site-wide modules
// (page code used to come after the site footer code).
const pages = {
    '6ae1d1264629dc4e90df3ab1': { path: 'pages/careers', exportName: 'careersInit' }, // /careers
    '6aec7413ae73f59f7e35fef4': { path: 'pages/how-it-works', exportName: 'howItWorksInit' }, // /how-it-works
    '6aff32ae018246d1af34fa21': { path: 'pages/fwd-teams', exportName: 'fwdTeamsInit' }, // /fwd-teams/* (CMS template)
    '6aeb1c30a345c0ff0c02c6f7': { path: 'pages/product', exportName: 'productInit' }, // /product
};

const pageModule = pages[document.documentElement.dataset.wfPage];
const toLoad = pageModule ? [...modules, pageModule] : modules;

let inits = [];
let helpers = {};
try {
    const [utils, ...loaded] = await Promise.all([
        import(`./utils/helpers.js?v=${v}`),
        ...toLoad.map(({ path }) => import(`./${path}.js?v=${v}`)),
    ]);
    helpers = { runBlocks: utils.runBlocks, loadScript: utils.loadScript };
    inits = loaded.map((mod, i) => ({
        name: toLoad[i].exportName,
        fn: mod[toLoad[i].exportName],
    }));
} catch (err) {
    console.error('Failed to load one or more scripts:', err);
}

window.tabletBreakpoint = 991;
window.mobileBreakpoint = 767;

function init() {
    document.fonts.ready.then(() => {
        // Isolate each module so one failure doesn't block the rest
        inits.forEach(({ name, fn }) => {
            if (typeof fn !== 'function') {
                console.warn(`[script-loader] ${name} is not exported`);
                return;
            }
            // Inits may be async (e.g. a page loading its libraries first)
            try {
                Promise.resolve(fn(helpers)).catch((err) => console.error(`[script-loader] ${name}() failed:`, err));
            } catch (err) {
                console.error(`[script-loader] ${name}() failed:`, err);
            }
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

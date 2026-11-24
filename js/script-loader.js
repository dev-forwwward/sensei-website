// Cache-busted dynamic imports: jsdelivr/browsers cache static `import` specifiers
// hard (branch-alias staleness even after purge). A fresh query param per load
// forces a real fetch every time, so pushes to main show up immediately
const v = Date.now();

// Add a script here to have it loaded and initialized automatically
const modules = [
    // Sensei legacy site code (was Webflow site footer custom code) — runs first
    { path: 'legacy-site', exportName: 'legacySiteInit' },
    { path: 'footer-date', exportName: 'footerDate' },
    { path: 'works', exportName: 'works' },

    // FWD white-label modules disabled while the legacy code is live:
    // { path: 'main', exportName: 'mainInit' },     // Lenis fights legacy jQuery/window scrollTo + ScrollTrigger pins; needs Lenis + Fancybox libs
    // { path: 'menu', exportName: 'navBarMenu' },   // Sensei uses legacy mega menu / mobile menu (legacy-site.js)
    // { path: 'swiper', exportName: 'swiperInit' }, // auto-inits every .swiper → double-init of legacy page sliders
    // { path: 'form', exportName: 'form' },         // needs jquery.validate; Sensei forms not built for it yet
    // { path: 'faqs', exportName: 'faqs' },         // legacy pages use their own accordions
];

let inits = [];
try {
    const loaded = await Promise.all(
        modules.map(({ path }) => import(`./${path}.js?v=${v}`))
    );
    inits = loaded.map((mod, i) => ({
        name: modules[i].exportName,
        fn: mod[modules[i].exportName],
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
            try {
                fn();
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

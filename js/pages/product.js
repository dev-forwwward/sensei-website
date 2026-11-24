/*
 * PRODUCT PAGE
 *
 * Page code that still lives in Webflow (legacy, Page settings > Custom code) is not
 * migrated yet — this module only adds new behaviour.
 *
 * CSS: css/pages/product.css. GSAP comes from the site footer.
 */

// PRODUCT: rotating words in the "Neptune runs on the Sensei Retail World Model…" headline
// Webflow holds the white box (.fwd_rotating-word-wrapper, width per breakpoint) with the
// first word inside. Every word rotates through the box, sliding up one row at a time
// (Figma: a column of rows clipped by the box). To change the words, add one
// .section_content7-text per word inside the wrapper in Webflow; if it only has the one,
// the list below is used.
const ROTATING_WORDS = [
    'shelf availability',
    'stock accuracy',
    'shrink',
    'replenishment',
    'planogram compliance',
    'checkout',
];

function rotatingWords() {
    const HOLD = 1.4;      // seconds each word stays
    const DURATION = 0.5;  // seconds per slide
    const EASE = 'power3.inOut';

    document.querySelectorAll('.fwd_rotating-word-wrapper').forEach((wrapper) => {
        if (wrapper.dataset.rotatingReady) return;
        const items = [...wrapper.children];
        if (!items.length) return;

        const words = items.length > 1
            ? items.map((item) => item.textContent.trim())
            : ROTATING_WORDS;
        if (words.length < 2) return;

        // The first item stays in place, invisible: it keeps the box's height and is what
        // screen readers read, so the sentence doesn't change under them. Extra Webflow
        // items are only the source of the word list.
        const sizer = items[0];
        const textClass = sizer.className; // Webflow's text class: rows get the same type
        items.slice(1).forEach((item) => item.remove());
        sizer.classList.add('rotating-word_sizer');

        // Track: one row per word, plus a copy of the first one so the loop can slide up
        // into it and jump back to the start without a visible cut
        const track = document.createElement('div');
        track.className = 'rotating-word_track';
        track.setAttribute('aria-hidden', 'true');
        [...words, words[0]].forEach((word) => {
            const row = document.createElement('div');
            row.className = `${textClass} rotating-word_row`;
            row.textContent = word;
            track.appendChild(row);
        });
        wrapper.appendChild(track);
        wrapper.dataset.rotatingReady = 'true';

        // Reduced motion: the first word, no rotation
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const tl = gsap.timeline({ repeat: -1, paused: true });
        words.forEach((_, i) => {
            tl.to(track, { yPercent: -100 * (i + 1), duration: DURATION, ease: EASE }, `+=${HOLD}`);
        });
        tl.set(track, { yPercent: 0 });

        // Only run while the headline is on screen
        new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) tl.play();
            else tl.pause();
        }).observe(wrapper);
    });
}

// runBlocks is passed in by script-loader.js (utils/helpers.js)
export function productInit({ runBlocks }) {
    runBlocks('product', {
        rotatingWords,
    });

    console.log("Loading productInit()");
}

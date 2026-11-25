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

// PRODUCT: "Your data, your rules" cards (Webflow slider, .testimonial51_slider)
// Webflow steps one card per arrow click until the LAST card is the first one shown,
// which left empty card slots on the right. Stop once the last card is fully in view
// instead (desktop: 3 of the 9 cards fit, so 6 steps; the last card ends flush with the
// container, under the arrows). Arrows get .is-disabled at each end (css/pages/product.css).
// Webflow keeps the index in its inline translateX on every slide; swipes can't be
// intercepted, so an overshoot from a swipe steps back.
function cardsSliderEnd() {
    document.querySelectorAll('.testimonial51_slider').forEach((slider) => {
        const slides = [...slider.querySelectorAll('.w-slide')];
        const prev = slider.querySelector('.w-slider-arrow-left');
        const next = slider.querySelector('.w-slider-arrow-right');
        if (slides.length < 2 || !prev || !next) return;

        // Slide width (translateX doesn't change it)
        const step = () => slides[0].getBoundingClientRect().width;
        const index = () => {
            const m = /translateX\((-?[\d.]+)px\)/.exec(slides[0].style.transform);
            return m ? Math.round(-parseFloat(m[1]) / step()) : 0;
        };
        // First index at which the last card is fully inside the slider
        const maxIndex = () => Math.max(0, Math.ceil((slides.length * step() - slider.clientWidth - 1) / step()));

        const update = () => {
            const i = index();
            const max = maxIndex();
            if (i > max) {
                prev.click();
                return;
            }
            prev.classList.toggle('is-disabled', i <= 0);
            next.classList.toggle('is-disabled', i >= max);
            prev.setAttribute('aria-disabled', i <= 0);
            next.setAttribute('aria-disabled', i >= max);
        };

        // Capture phase on the slider: runs before Webflow's own arrow handlers
        const block = (e) => {
            if (!next.contains(e.target) || index() < maxIndex()) return;
            if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
            e.preventDefault();
            e.stopPropagation();
        };
        slider.addEventListener('click', block, true);
        slider.addEventListener('keydown', block, true);

        new MutationObserver(update).observe(slides[0], { attributes: true, attributeFilter: ['style'] });
        window.addEventListener('resize', update);
        update();
    });
}

// runBlocks is passed in by script-loader.js (utils/helpers.js)
export function productInit({ runBlocks }) {
    runBlocks('product', {
        rotatingWords,
        cardsSliderEnd,
    });

    console.log("Loading productInit()");
}

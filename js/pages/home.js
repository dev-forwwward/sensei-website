/*
 * HOMEPAGE
 *
 * Page code that still lives in Webflow (legacy, Page settings > Custom code) is not
 * migrated yet — this module only adds new behaviour.
 *
 * CSS: css/pages/home.css. GSAP comes from the site footer.
 */

// Arrow from the cards' circle-arrow icon (Webflow embed), cropped to the arrow alone.
// Same 11.5 × 11 px as the arrow in the Figma hover state.
const ARROW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="11.5" height="11" viewBox="9.585 10.078 11.512 11.019" fill="none" aria-hidden="true">
  <path d="M15.5875 21.0969L21.0969 15.5875L15.5875 10.0781L14.7365 10.9292L18.7677 14.9604H9.58542V16.2146H18.7677L14.7365 20.2458L15.5875 21.0969Z" fill="#1D1D1D"/>
</svg>`;

// HOMEPAGE: "Built for your entire store" cards — yellow arrow circle follows the cursor
// Figma (Industries problems, hover on Autonomous Checkout): while the pointer is over a
// card, the card's outline arrow icon goes away and a 54px yellow circle with the arrow
// rides on the cursor. One follower for all five cards, fixed to the viewport and moved
// with clientX/Y (same approach as the white-label mouse follower in js/main.js).
// Mouse / trackpad only: touch screens keep the static icon.
function storeCardsHover() {
    const section = document.querySelector('.section_layout363');
    if (!section || section.dataset.storeHoverReady) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const cards = section.querySelectorAll('.layout363_card, .card-row38_card');
    if (!cards.length) return;

    const follower = document.createElement('div');
    follower.className = 'store-hover_follower';
    follower.setAttribute('aria-hidden', 'true');
    follower.innerHTML = ARROW_SVG;
    document.body.appendChild(follower);

    // Centred on the pointer, hidden (scale 0) until a card is hovered
    gsap.set(follower, { xPercent: -50, yPercent: -50, scale: 0 });
    const xTo = gsap.quickTo(follower, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(follower, 'y', { duration: 0.35, ease: 'power3.out' });

    cards.forEach((card) => {
        card.addEventListener('pointerenter', (e) => {
            // Snap to the pointer so it doesn't glide in from the last card it left
            xTo(e.clientX, e.clientX);
            yTo(e.clientY, e.clientY);
            gsap.to(follower, { scale: 1, duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
        });
        card.addEventListener('pointermove', (e) => {
            xTo(e.clientX);
            yTo(e.clientY);
        });
        card.addEventListener('pointerleave', () => {
            gsap.to(follower, { scale: 0, duration: 0.25, ease: 'power2.in', overwrite: 'auto' });
        });
    });

    // Turns on the hover CSS (hidden native cursor + icon fade) only once the follower exists
    section.classList.add('is-store-hover');
    section.dataset.storeHoverReady = 'true';
}

export function homeInit({ runBlocks }) {
    runBlocks('home', { storeCardsHover });
}

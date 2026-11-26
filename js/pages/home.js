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

// Card groups that get the cursor follower: section + its cards
const FOLLOWER_CARDS = [
    // "Built for your entire store"
    { section: '.section_layout363', cards: '.layout363_card, .card-row38_card' },
    // Case studies slider
    { section: '.section_gallery20', cards: '.header94_card' },
];

// HOMEPAGE: yellow arrow circle follows the cursor over linked cards
// Figma (Industries problems, hover on Autonomous Checkout): while the pointer is over a
// card, the card's outline arrow icon (if it has one) goes away and a 54px yellow circle
// with the arrow rides on the cursor. One follower for every card on the page, fixed to
// the viewport and moved with clientX/Y (same approach as the white-label mouse follower
// in js/main.js). Mouse / trackpad only: touch screens keep the static cards.
function cardsFollower() {
    if (document.querySelector('.card-follower')) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const groups = FOLLOWER_CARDS
        .map(({ section, cards }) => {
            const el = document.querySelector(section);
            return el && { section: el, cards: el.querySelectorAll(cards) };
        })
        .filter((group) => group && group.cards.length);
    if (!groups.length) return;

    const follower = document.createElement('div');
    follower.className = 'card-follower';
    follower.setAttribute('aria-hidden', 'true');
    follower.innerHTML = ARROW_SVG;
    document.body.appendChild(follower);

    // Centred on the pointer, hidden (scale 0) until a card is hovered
    gsap.set(follower, { xPercent: -50, yPercent: -50, scale: 0 });
    const xTo = gsap.quickTo(follower, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(follower, 'y', { duration: 0.35, ease: 'power3.out' });

    groups.forEach(({ section, cards }) => {
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
            card.classList.add('has-card-follower');
        });
        // Turns on the hover CSS (hidden native cursor + icon fade) only once the follower exists
        section.classList.add('is-card-follower');
    });
}

export function homeInit({ runBlocks }) {
    runBlocks('home', { cardsFollower });
}

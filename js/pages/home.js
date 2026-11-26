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

// HOMEPAGE: case studies slider, fed by the CMS (Clients collection)
// Webflow's Slider can't hold a Collection List, so the section has a plain wrapper
// [data-cases-slider] with the Collection List (.gallery20_mask), two arrows
// [data-cases-prev]/[data-cases-next] (.slider-arrow-2) and a nav [data-cases-nav]
// (.gallery20_slide-nav). Swiper turns the list into the slider; the nav gets Webflow's
// slider-dot classes so it looks like the old Webflow slider. Add, remove or reorder
// case studies in the CMS (list sorted by opening date, newest first).
const SWIPER_URL = 'https://cdn.jsdelivr.net/npm/swiper@14.4.0/swiper-bundle.min.js';

async function casesSlider(loadScript) {
    const root = document.querySelector('[data-cases-slider]');
    if (!root || root.dataset.casesReady) return;
    root.dataset.casesReady = 'true';

    const list = root.querySelector('.w-dyn-list');
    const track = list?.querySelector('.w-dyn-items');
    const slides = track ? [...track.children] : [];
    const prev = root.querySelector('[data-cases-prev]');
    const next = root.querySelector('[data-cases-next]');
    const nav = root.querySelector('[data-cases-nav]');

    // One case study (or none): nothing to slide
    if (slides.length < 2) {
        root.classList.add('is-static');
        return;
    }

    await loadScript(SWIPER_URL);

    list.classList.add('swiper');
    track.classList.add('swiper-wrapper');
    slides.forEach((slide) => slide.classList.add('swiper-slide'));
    nav?.classList.add('w-slider-nav', 'w-slider-nav-invert', 'w-round');

    new Swiper(list, {
        slidesPerView: 1,
        speed: 500, // same as the old Webflow slider
        navigation: { prevEl: prev, nextEl: next, disabledClass: 'is-disabled' },
        pagination: nav && {
            el: nav,
            clickable: true,
            bulletClass: 'w-slider-dot',
            bulletActiveClass: 'w-active',
            renderBullet: (index, className) => `<div class="${className}"></div>`,
        },
        a11y: { prevSlideMessage: 'Previous case study', nextSlideMessage: 'Next case study' },
    });
}

export function homeInit({ runBlocks, loadScript }) {
    runBlocks('home', {
        cardsFollower,
        casesSlider: () => casesSlider(loadScript),
    });
}

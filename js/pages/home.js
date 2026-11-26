/*
 * HOMEPAGE
 *
 * Page code that still lives in Webflow (legacy, Page settings > Custom code) is not
 * migrated yet, except the hero video animation (heroVideo below).
 *
 * CSS: css/pages/home.css. GSAP comes from the site footer.
 */

// HOMEPAGE: hero video shrinks into the intro section on scroll
// Replaces the "Hero animation" block of the Webflow page code
// (legacy/pages/home/footer.html), which worked out where the video ends from fixed
// numbers (425px, hero height × 0.5 + 35px, −200px on tablet) once on page load:
// the video missed the intro text, and after a resize it landed on top of the text.
//
// Now the end position is a real element: an empty slot JS adds to the intro section,
// placed and sized per breakpoint in css/pages/home.css (left of the text on wide
// screens, above it below 1280px). The scroll shrink lands the video exactly on the
// slot, and every ScrollTrigger refresh (resize, fonts, images) measures it again.
// The slot can have any shape (on phones it's a full-width portrait box): the video
// scales until it covers the slot, and a clip-path crops the overflow, like object-fit.
function heroVideo() {
    const hero = document.querySelector('.section_home-hero');
    const wrapper = hero?.querySelector('.video-hero-wrapper');
    const video = wrapper?.querySelector('.video-hero-wrapper--inner');
    const intro = document.querySelector('.section_home-intro');
    const container = intro?.querySelector('.container-xl');
    if (!video || !container) return;

    killLegacyHeroVideo(video);

    const slot = document.createElement('div');
    slot.className = 'home-intro-video-slot';
    slot.setAttribute('aria-hidden', 'true');
    container.prepend(slot);
    intro.classList.add('has-video-slot');

    // By default the slot keeps the video's proportions (--hero-video-ratio; the CSS can
    // set its own shape instead). The video fills the wrapper; the wrapper's size is read
    // because ScrollTrigger leaves the pinned video with a fixed px size from the last
    // refresh. Runs before ScrollTrigger measures anything (refreshInit).
    const fitSlot = () => {
        slot.style.setProperty('--hero-video-ratio', `${wrapper.offsetWidth} / ${wrapper.offsetHeight}`);
    };
    fitSlot();
    ScrollTrigger.addEventListener('refreshInit', fitSlot);

    // Video box (unscaled) vs slot. Scale = the smallest that covers the slot; the clip
    // insets (% of the unscaled box, centred) cut the scaled video down to the slot's size.
    // The x origin puts the visible left edge on the slot's left edge; y origin stays at
    // the centre, and the pin lasts exactly the scroll that brings the slot's top to the
    // visible top. Uses the wrapper (never pinned or scaled), so it's correct mid-pin too.
    const measure = () => {
        const from = wrapper.getBoundingClientRect();
        const to = slot.getBoundingClientRect();
        const { width: w, height: h } = from;
        const scale = Math.min(Math.max(to.width / w, to.height / h), 0.99);
        const shrink = 1 - scale;
        const insetX = (1 - to.width / (w * scale)) / 2;
        const insetY = (1 - to.height / (h * scale)) / 2;
        const originX = (to.left - from.left - insetX * w * scale) / shrink;
        return {
            scale,
            origin: `${originX}px ${h / 2}px`,
            clip: `inset(${insetY * 100}% ${insetX * 100}% ${insetY * 100}% ${insetX * 100}%)`,
            distance: Math.max(1, to.top - from.top - (h / 2) * shrink - insetY * h * scale),
        };
    };

    const title = hero.querySelector('.home-hero-wrapper h1');
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: wrapper,
            start: 'top top',
            end: () => `+=${measure().distance}`,
            scrub: true,
            pin: video,
            invalidateOnRefresh: true,
        },
    });
    tl.fromTo(
        video,
        { scale: 1, clipPath: 'inset(0% 0% 0% 0%)', transformOrigin: () => measure().origin },
        {
            scale: () => measure().scale,
            clipPath: () => measure().clip,
            transformOrigin: () => measure().origin,
            ease: 'power2.out',
        }
    );
    if (title) tl.to(title, { opacity: 0, ease: 'power2.out' }, '<');

    // Legacy code runs on jQuery ready, normally before this; if it was late, undo it now
    if (document.readyState !== 'complete') {
        window.addEventListener('load', () => {
            if (killLegacyHeroVideo(video, tl.scrollTrigger)) ScrollTrigger.refresh();
        }, { once: true });
    }
}

// Until the "Hero animation" block is deleted from the Webflow page code, both would
// animate the video: undo the legacy one (its ScrollTrigger pins the same element).
// Returns true if there was one.
function killLegacyHeroVideo(video, keep) {
    const legacy = ScrollTrigger.getAll().filter((trigger) => trigger.pin === video && trigger !== keep);
    legacy.forEach((trigger) => {
        const animation = trigger.animation;
        trigger.kill(true);
        animation?.revert();
    });
    if (legacy.length && !keep) {
        gsap.set(video, { clearProps: 'position,top,left,xPercent,yPercent,transformOrigin,clipPath' });
    }
    return legacy.length > 0;
}

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
        heroVideo,
        cardsFollower,
        casesSlider: () => casesSlider(loadScript),
    });
}

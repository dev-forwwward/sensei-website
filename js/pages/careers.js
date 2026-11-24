/*
 * CAREERS PAGE — ported from Webflow Page settings > Custom code
 * (verbatim snapshot: legacy/pages/careers/, taken 2026-11-24).
 *
 * Bodies kept as-is; each original <script> block is a function run in isolation.
 * Libraries stay in the page's Webflow custom code (webflow/pages/careers-*.html):
 * Swiper 14.4.0 (+ CSS) and the trail-image CSS. GSAP/ScrollTrigger come from the
 * site footer.
 *
 * Changes vs the original:
 * - [data-fade-in] (and [data-img-sticker] on mobile) are hidden by inline CSS in the
 *   page head, because this now runs after first paint;
 * - the trail-image library is run in its own function scope (trailImage below),
 *   which fixes its global `class Image` breaking Typekit's `new Image()`;
 * - dropped unused Draggable and the async GSAP 3.12.2 that replaced the site's GSAP.
 */


// CAREERS: Benefits accordions
function accordions() {
const createAccordions = (targets, closeOtherTargets, setFirstItemExapanded, callback) => {
  if (!targets.length) return;

  if (setFirstItemExapanded) {
    targets[0].setAttribute('aria-expanded', 'true');
  }

  targets.forEach((accordion) => {
    accordion.addEventListener('click', function () {
      if (closeOtherTargets) {
        targets.forEach((target) => {
          if (target !== this) {
            target.removeAttribute('aria-expanded');
          }
        });
      }

      this.setAttribute('aria-expanded', this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');

      if (callback) {
        callback(this);
      }
    });
  });
};

createAccordions(document.querySelectorAll('[data-accordion="benefits"]'), true, true);
}

// CAREERS: Benefits swiper
function benefitsSwiper() {
const swiperBenefits = new Swiper('.swiper.is-benefits', {
  slidesPerView: 'auto',
  spaceBetween: -1,
  navigation: {
    nextEl: '#benefits-next',
    prevEl: '#benefits-prev',
  },
});
}

// CAREERS: Custom cursors — desktop only
function cursors() {
const setCursors = () => {
  const worldContainer = document.querySelector('.careers-benefits_world');
  const WorldCursor = document.querySelector('.world-caption');

  const carrersContainer = document.querySelector('.swiper.is-careers-process');
  const carrersCursor = document.querySelector('.careers-process_cursor');

  if (!worldContainer || !WorldCursor) return;

  worldContainer?.addEventListener('mousemove', (event) => {
    const rect = worldContainer.getBoundingClientRect();
    const cursorRect = WorldCursor.getBoundingClientRect();

    gsap.to(WorldCursor, {
      duration: 1,
      ease: 'power3',
      x: event.x - rect.left + 16,
      y: event.y - rect.top - rect.height + cursorRect.height + 16,
      left: 0,
      bottom: 0,
    });
  });

  carrersContainer?.addEventListener('mousemove', (event) => {
    const rect = carrersContainer.getBoundingClientRect();
    const cursorRect = carrersCursor.getBoundingClientRect();

    gsap.to(carrersCursor, {
      duration: 1,
      ease: 'power3',
      x: event.x - rect.left - cursorRect.width / 2,
      y: event.y - rect.top - rect.height + cursorRect.height / 2,
      left: 0,
      bottom: 0,
    });
  });

  gsap.set(carrersCursor, {
    duration: 0.5,
    alpha: 0,
  });

  carrersContainer?.addEventListener('mouseenter', () => {
    gsap.to(carrersCursor, {
      duration: 0.4,
      alpha: 1,
    });
  });

  carrersContainer?.addEventListener('mouseleave', () => {
    gsap.to(carrersCursor, {
      duration: 0.4,
      alpha: 0,
    });
  });

  worldContainer?.addEventListener('mouseleave', () => {
    gsap.to(WorldCursor, {
      duration: 1,
      ease: 'power3',
      left: 'calc(50% - 18px)',
      bottom: -34,
      x: 0,
      y: 0,
    });
  });
};

if (window.innerWidth > 991) {
  setCursors();
}
}

// CAREERS: Careers process timeline + swiper
function processTimeline() {
const initProcessTimeline = () => {
  // Initialize Swiper
  const swiperProcess = new Swiper('.swiper.is-careers-process', {
    slidesPerView: 'auto',
    grabCursor: true,
    touchStartPreventDefault: false,
  });

  const careerProcessNextStep = document.querySelector('#career-process-next-step');
  careerProcessNextStep?.addEventListener('click', () => swiperProcess.slideNext());

  const processTimeline = document.querySelector('.process_timeline');

  if (!processTimeline) return;

  // Create timeline elements
  const createTimelineElements = () => {
    const dividersPerSlide = window.innerWidth > 991 ? 20 : 4;
    const totalSlides = swiperProcess.slides.length;

    const fragment = document.createDocumentFragment();

    for (let index = 0; index < totalSlides; index++) {
      if (index === 0) {
        const square = document.createElement('div');
        square.classList.add('process_timeline-square');
        square.addEventListener('click', () => swiperProcess.slideTo(index));
        fragment.appendChild(square);
      }

      if (index !== 0) {
        for (let i = 0; i < dividersPerSlide; i++) {
          const divider = document.createElement('div');
          divider.classList.add('process_timeline-divider');
          fragment.appendChild(divider);
        }
      }

      if (index !== 0 && index !== totalSlides - 1) {
        const step = document.createElement('div');
        step.classList.add('process_timeline-step');
        step.innerText = window.innerWidth > 991 ? `[ ${index} / ${totalSlides - 2} ]` : `[ ${index} ]`;
        step.addEventListener('click', () => swiperProcess.slideTo(index));
        fragment.appendChild(step);
      }

      if (index === totalSlides - 1) {
        const square = document.createElement('div');
        square.classList.add('process_timeline-square');
        square.addEventListener('click', () => swiperProcess.slideTo(index));
        fragment.appendChild(square);
      }
    }

    processTimeline.appendChild(fragment);
    return Array.from(processTimeline.children);
  };

  const timelineSteps = createTimelineElements();
  const activeStepSquare = document.querySelector('.process_timeline-square.is-current-step');

  if (!activeStepSquare) return;

  let isDragging = false;
  processTimeline.addEventListener('mousedown', () => {
    isDragging = true;
    processTimeline.style.cursor = 'grabbing';
  });

  processTimeline.addEventListener('mouseup', () => {
    isDragging = false;
    processTimeline.style.cursor = 'grab';
  });

  processTimeline.addEventListener('mousemove', (event) => {
    if (!isDragging) return;

    const progress = ((event.clientX - processTimeline.offsetLeft) * 100) / processTimeline.offsetWidth / 100;
    updateTimeline(progress, true);
  });

  // Handle progress updates
  const updateTimeline = (progress, isDragging) => {
    const currentStep = Math.round(progress * (timelineSteps.length - 1)) + (progress <= 0.5 ? 1 : 0);

    const currentStepItem = timelineSteps[currentStep];
    if (!currentStepItem) return;

    const offset = currentStep === 0 ? 0 : activeStepSquare.offsetWidth / 2 - currentStepItem.offsetWidth / 2;

    gsap.to(activeStepSquare, {
      duration: 0.4,
      x: currentStepItem.offsetLeft - offset,
    });

    // Reset all classes
    timelineSteps.forEach((step) => {
      step.classList.remove('is-active', 'is-set');
    });

    // Set active classes
    if (currentStepItem.classList.contains('process_timeline-divider')) {
      currentStepItem.classList.add('is-active');
      currentStepItem.previousElementSibling?.previousElementSibling?.classList.add('is-set');
    }

    if (isDragging) {
      swiperProcess.setProgress(progress, 0);
    }

    gsap.to('.careers-process_title', {
			scale: progress !== 0 ? (window.innerWidth > 991 ? 0.27 : 0.34) : 1,
      transformOrigin: 'left bottom',
    });
  };

  if (!isDragging) {
    swiperProcess.on('progress', (_, progress) => updateTimeline(progress));
  }
};

initProcessTimeline();
}

// CAREERS: Fade in on scroll — ScrollTrigger.batch
function fadeIn() {
const selector = window.innerWidth > 991 ? '[data-fade-in]' : '[data-fade-in], [data-img-sticker]';

gsap.set(selector, {
  opacity: 0,
});

ScrollTrigger?.batch(selector, {
  end: '100%',
  interval: 0.1,
  onEnter: (fadeInElements) => {
    gsap.to(fadeInElements, {
      duration: 0.4,
      ease: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)',
      opacity: 1,
      stagger: 0.1,
    });
  },
  once: true,
  start: 'top 90%',
});
}

// CAREERS: Trail image effect — Francesco Castronuovo, gsap-trail-image-effect 1.0.2
// The library declares `class Image` at the top level of a classic script, which
// replaces window.Image for every other script (Typekit's font beacon then throws).
// It has no license, so it isn't copied here: we fetch the pinned file from jsDelivr,
// check it's byte-identical to 1.0.2, and run it in a function scope so its classes
// stay local. `Webflow` is passed in so its Webflow.push(...) init still runs.
const TRAIL_URL = 'https://cdn.jsdelivr.net/gh/francesco-castronuovo/gsap-trail-image-effect@1.0.2/main.js';
const TRAIL_SHA256 = 'z6rgdWLSH7CR+z/6hx2i0NyLNzar1y5fSMyzQm8waAk=';

async function trailImage() {
    if (!document.querySelector('[fc-trail-image="component"]')) return;

    const code = await (await fetch(TRAIL_URL)).text();
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(code));
    const hash = btoa(String.fromCharCode(...new Uint8Array(digest)));
    if (hash !== TRAIL_SHA256) throw new Error('trail-image file changed on CDN, not running it');

    new Function('Webflow', code)(window.Webflow);
}

// runBlocks is passed in by script-loader.js (cache-busted import of utils/run-blocks.js)
export function careersInit({ runBlocks }) {
    // Old inline page code still in Webflow? Its top-level `const initProcessTimeline`
    // lives in the shared global scope, visible from here. Skip so nothing runs twice;
    // this lets main be pushed before or after the Webflow page code is swapped.
    if (typeof initProcessTimeline !== 'undefined') {
        console.info('[careers] old inline page code still in Webflow — skipping careersInit()');
        return;
    }

    runBlocks('careers', {
        accordions,
        benefitsSwiper,
        cursors,
        processTimeline,
        fadeIn,
        trailImage,
    });

    console.log("Loading careersInit()");
}

/*
 * HOW IT WORKS PAGE
 *
 * Page code that still lives in Webflow (legacy, Page settings > Custom code) is not
 * migrated yet — this module only adds new behaviour.
 *
 * Layout + CSS: css/pages/how-it-works.css. GSAP/ScrollTrigger come from the site footer.
 */

// HOW IT WORKS: "See" + "Understand" accordions open vertically on desktop
// Webflow's desktop interaction animated the panels' width (content squeezed while
// opening, and clicking inside an open panel collapsed everything). On desktop we
// take over the clicks — in the capture phase, so the Webflow interaction never sees
// them — and open/close panels by height, like the tablet/mobile interaction already
// does. Below 992px nothing changes: Webflow's own interaction keeps running.
function verticalAccordion() {
    const desktop = window.matchMedia('(min-width: 992px)');
    const DURATION = 0.6;
    const EASE = 'power2.inOut';

    document.querySelectorAll('.layout351_component').forEach((component) => {
        const items = [...component.querySelectorAll('.layout351_accordion')];
        if (!items.length) return;

        const contentOf = (item) => item.querySelector('.layout351_column-content');
        const headerOf = (item) => item.querySelector('.layout351_column');
        // Webflow marks the initially open panel with the .active combo class
        let openItem = items.find((item) => item.classList.contains('active')) || null;

        const setExpanded = () => items.forEach((item) =>
            headerOf(item)?.setAttribute('aria-expanded', item === openItem ? 'true' : 'false'));

        // Desktop start state: open panel auto height, others closed
        const syncDesktop = () => {
            if (!desktop.matches) return;
            items.forEach((item) => gsap.set(contentOf(item), { height: item === openItem ? 'auto' : 0 }));
            setExpanded();
        };

        const refreshAfter = (header) => {
            ScrollTrigger.refresh();
            // Keep the clicked header in view when a panel above it just closed
            const top = header.getBoundingClientRect().top;
            const navOffset = 120;
            if (top < navOffset) window.scrollBy({ top: top - navOffset, behavior: 'smooth' });
        };

        // One panel is always open, like the tablet/mobile interaction: clicking the
        // open panel's header does nothing
        const toggle = (item) => {
            if (item === openItem) return;
            const closing = openItem;
            openItem = item;

            if (closing) gsap.to(contentOf(closing), { height: 0, duration: DURATION, ease: EASE });
            gsap.to(contentOf(openItem), { height: 'auto', duration: DURATION, ease: EASE });

            setExpanded();
            gsap.delayedCall(DURATION + 0.05, () => refreshAfter(headerOf(item)));
        };

        component.addEventListener('click', (event) => {
            if (!desktop.matches) return;
            const item = event.target.closest('.layout351_accordion');
            if (!item || !component.contains(item)) return;

            // Keep Webflow's desktop (width) interaction out of it. Links inside the
            // panels still navigate: stopPropagation doesn't cancel the default action.
            event.stopPropagation();

            if (event.target.closest('.layout351_column')) toggle(item);
        }, true);

        desktop.addEventListener('change', syncDesktop);
        syncDesktop();
    });
}

// runBlocks is passed in by script-loader.js (utils/helpers.js)
export function howItWorksInit({ runBlocks }) {
    runBlocks('how-it-works', {
        verticalAccordion,
    });

    console.log("Loading howItWorksInit()");
}

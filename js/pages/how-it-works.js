/*
 * HOW IT WORKS PAGE
 *
 * Page code that still lives in Webflow (legacy, Page settings > Custom code) is not
 * migrated yet — this module only adds new behaviour.
 *
 * Layout + CSS: css/pages/how-it-works.css. GSAP comes from the site footer.
 */

// HOW IT WORKS: "See" + "Understand" accordions open sideways on desktop
// Desktop keeps Webflow's horizontal layout (panels side by side), tablet/mobile its
// vertical one. Webflow's desktop interaction was broken: the panel and its header
// both carry a click trigger, so one click opened the panel and closed it again, and
// the content reflowed into a narrow column while the width animated. On desktop we
// take over the clicks — in the capture phase, so the Webflow interaction never sees
// them — and animate the widths with GSAP, holding the content at its open width
// (clipped by the panel) until the panel settles. The open panel is marked with
// Webflow's .active combo class, which sets its width in CSS. Below 992px nothing
// changes: Webflow's own (vertical) interaction keeps running.
function horizontalAccordion() {
    const desktop = window.matchMedia('(min-width: 992px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const DURATION = 0.7;
    const EASE = 'power2.inOut';

    document.querySelectorAll('.layout351_component').forEach((component) => {
        const row = component.querySelector('.layout351_content');
        const items = [...component.querySelectorAll('.layout351_accordion')];
        if (!row || !items.length) return;

        const contentOf = (item) => item.querySelector('.layout351_column-content');
        const headerOf = (item) => item.querySelector('.layout351_column');
        let openItem = items.find((item) => item.classList.contains('active')) || items[0];
        let tween = null;

        const markOpen = (open) => items.forEach((item) => {
            const isOpen = item === open;
            item.classList.toggle('active', isOpen);
            contentOf(item)?.classList.toggle('active', isOpen);
            headerOf(item)?.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Desktop start state: drop any inline sizes a Webflow interaction left behind
        // (e.g. a click before this module loaded, or the tablet interaction before a
        // resize) so the .active class alone decides which panel is open
        const syncDesktop = () => {
            if (!desktop.matches) return;
            tween?.progress(1);
            gsap.set(items, { clearProps: 'width,height,willChange' });
            gsap.set(items.map(contentOf), { clearProps: 'height' });
            markOpen(openItem);
        };

        // One panel is always open: clicking the open panel's header does nothing
        const open = (item) => {
            if (item === openItem) return;
            tween?.progress(1);

            const closing = openItem;
            const openWidth = closing.getBoundingClientRect().width;
            const closedWidth = item.getBoundingClientRect().width;

            // Hold both panels' content at the open width while the widths change
            row.style.setProperty('--hiw-open-width', `${contentOf(closing).getBoundingClientRect().width}px`);
            row.classList.add('is-animating');
            contentOf(item).scrollTop = 0;

            // Inline widths take over from the .active class until the tween ends
            gsap.set(closing, { width: openWidth });
            gsap.set(item, { width: closedWidth });
            openItem = item;
            markOpen(item);

            const duration = reducedMotion.matches ? 0 : DURATION;
            tween = gsap.timeline({
                onComplete: () => {
                    gsap.set([closing, item], { clearProps: 'width' });
                    row.classList.remove('is-animating');
                    tween = null;
                },
            })
                .to(closing, { width: closedWidth, duration, ease: EASE }, 0)
                .to(item, { width: openWidth, duration, ease: EASE }, 0);
        };

        component.addEventListener('click', (event) => {
            if (!desktop.matches) return;
            const item = event.target.closest('.layout351_accordion');
            if (!item || !component.contains(item)) return;

            // Keep Webflow's desktop interaction out of it. Links inside the panels
            // still navigate: stopPropagation doesn't cancel the default action.
            event.stopPropagation();

            if (event.target.closest('.layout351_column')) open(item);
        }, true);

        desktop.addEventListener('change', syncDesktop);
        syncDesktop();
    });
}

// runBlocks is passed in by script-loader.js (utils/helpers.js)
export function howItWorksInit({ runBlocks }) {
    runBlocks('how-it-works', {
        horizontalAccordion,
    });

    console.log("Loading howItWorksInit()");
}

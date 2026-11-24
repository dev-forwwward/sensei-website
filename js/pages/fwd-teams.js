/*
 * FWD TEAMS TEMPLATE (/fwd-teams/*)
 *
 * CSS: css/pages/fwd-teams.css. GSAP/ScrollTrigger come from the site footer.
 */

// TEAMS: "The answers" — sticky image follows the text block being read (Relume layout411)
// Each text block (.layout411_content, 100vh tall) owns the image at the same position
// in the sticky column. When a block crosses the middle of the screen, the column steps
// to that image (the CSS animates it). Works for any number of CMS items.
function stickyImagesSync() {
    document.querySelectorAll('.layout411_component').forEach((component) => {
        const texts = [...component.querySelectorAll('.layout411_content')];
        const column = component.querySelector('.layout411_images-wrapper');
        const slots = column ? column.querySelectorAll('.layout411_image-wrapper') : [];
        if (!texts.length || !slots.length) return;

        const count = Math.min(texts.length, slots.length);
        column.style.setProperty('--layout411-count', slots.length);

        const show = (index) => column.style.setProperty('--layout411-step', index);
        show(0);

        texts.slice(0, count).forEach((text, index) => {
            ScrollTrigger.create({
                trigger: text,
                start: 'top center',
                end: 'bottom center',
                onToggle: (self) => { if (self.isActive) show(index); },
            });
        });
    });
}

// runBlocks is passed in by script-loader.js (utils/helpers.js)
export function fwdTeamsInit({ runBlocks }) {
    runBlocks('fwd-teams', {
        stickyImagesSync,
    });

    console.log("Loading fwdTeamsInit()");
}

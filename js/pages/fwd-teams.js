/*
 * FWD TEAMS TEMPLATE (/fwd-teams/*)
 *
 * CSS: css/pages/fwd-teams.css. GSAP/ScrollTrigger come from the site footer.
 */

// TEAMS: "The answers" — images move together with their text blocks (Relume layout411)
// While the image panel is pinned (section top at top of screen → section bottom at
// bottom of screen), the image column moves 1:1 with the scroll, so each image stays
// level with its text block. The CSS turns the progress into the column's offset.
function stickyImagesSync() {
    document.querySelectorAll('.layout411_component').forEach((component) => {
        const column = component.querySelector('.layout411_images-wrapper');
        const slots = column ? column.querySelectorAll('.layout411_image-wrapper') : [];
        if (!slots.length) return;

        column.style.setProperty('--layout411-count', slots.length);

        ScrollTrigger.create({
            trigger: component,
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: (self) => column.style.setProperty('--layout411-progress', self.progress.toFixed(5)),
            onRefresh: (self) => column.style.setProperty('--layout411-progress', self.progress.toFixed(5)),
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

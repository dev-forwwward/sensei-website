# Sensei Website

Custom JS/CSS for the **Sensei 2026** Webflow site (`sensei-staging-2026`), served via jsDelivr and loaded from Webflow's site custom code. Built on Forwwward's [White-label Defaults](https://github.com/dev-forwwward/White-label-defaults) setup. Nothing is built or bundled: the CDN serves this repo directly, **pinned to a commit hash** (see Deploying).

## Webflow custom code

The exact code to paste into Webflow (Site settings → Custom code) is kept in this repo:

- [`webflow/site-head.html`](webflow/site-head.html) — tracking tags (GTM, Hotjar, Leadfeeder), critical inline CSS, CSS loader
- [`webflow/site-footer.html`](webflow/site-footer.html) — GSAP / ScrollTrigger / ScrollToPlugin / SplitType, JS loader

**Page settings custom code stays empty** for migrated pages. Everything a page needs lives here:

- JS → `js/pages/<page>.js`, picked by the Webflow page id (see below); it loads its own libraries (pinned versions) with `loadScript` before running.
- CSS, including "hidden until JS reveals it" rules → `css/pages/<page>.css`, every selector scoped with `html[data-wf-page="<page id>"]`, imported in `css/styles.css`.
- Vendor CSS (Swiper, …) → `@import` at the top of `css/styles.css`.

`css/styles.css` is loaded render-blocking from the site head (`document.write`), so page CSS applies before first paint like the inline `<style>` it replaced. Local `@import`s carry a content hash (`?v=…`), stamped by [`scripts/version-css-imports.js`](scripts/version-css-imports.js) in CI, so browsers never keep stale page CSS.

## Deploying

Webflow loads the repo from jsDelivr **at an exact commit**, set once in `window.FWD_VERSION` at the top of the site head snippet. The head CSS loader and the footer JS loader both read it.

1. Push to `main`.
2. `git rev-parse origin/main` → paste the hash into the `FWD_VERSION` line in Webflow → Site settings → Custom code → Head code.
3. Publish.

Why not `@main`: jsDelivr caches branch URLs on its side and kept serving a mix of old and new files after pushes, even after purging. Commit URLs are immutable, so the site always gets exactly one consistent version, and rolling back = pasting an older hash.

Add `?dev=true` to any page URL to load `css/` and `js/` from a local server on `http://127.0.0.1:5500` (e.g. VS Code Live Server) instead of jsDelivr.

## Legacy code

The site's original custom code (from the previous agency) is kept in two forms:

- **Snapshot** — [`legacy/`](legacy/) holds a byte-for-byte copy of every site and page custom code block as of 2026-11-24, plus copies of the CodeSandbox-hosted scripts some pages load. It isn't loaded by the site; use it to look things up or roll back. See [`legacy/README.md`](legacy/README.md).
- **Served** — the site-level legacy JS and CSS now load from this repo: [`js/legacy-site.js`](js/legacy-site.js) and [`css/legacy-site.css`](css/legacy-site.css). Page-level code is moving page by page into [`js/pages/`](js/pages/) (done: Careers); the rest is **still in Webflow page settings**.

While the legacy code is live, these FWD white-label modules are switched off in [`js/script-loader.js`](js/script-loader.js) because they clash with it: `main` (Lenis), `menu`, `swiper`, `form`, `faqs`. `css/menu.css` and `css/faqs.css` are likewise not imported.

## How it loads

[`js/script-loader.js`](js/script-loader.js) is the single entry point embedded in Webflow. It:

- Cache-busts every module import with a `Date.now()` query param, so pushes to `main` show up immediately on jsDelivr without waiting on CDN/browser cache.
- Dynamically imports and initializes each enabled module (currently `legacy-site`, `footer-date`, `works`) once fonts are ready, on `DOMContentLoaded`. Each module runs in its own `try/catch`, so one failure doesn't stop the others.
- Exposes global breakpoints (`window.tabletBreakpoint = 991`, `window.mobileBreakpoint = 767`) for other modules to consume.

Add a new module to the `modules` array in `script-loader.js` to have it loaded and initialized automatically.

Page modules live in `js/pages/` and are listed in the `pages` map in `script-loader.js`, keyed by the Webflow page id that Webflow puts on `<html data-wf-page="…">` (CMS items carry their template's id). Find a page's id in the page source or via the Webflow API. Page modules run after the site-wide ones.

Every init function receives `{ runBlocks, loadScript }` from the loader ([`js/utils/helpers.js`](js/utils/helpers.js), imported cache-busted). Modules don't `import` each other, because jsDelivr/browser caching of static imports would serve stale code for up to 7 days.

## Features

<!-- AUTO-GENERATED:FEATURES:START -->

_Regenerated automatically from the current contents of `js/` and `css/` on every push to `main` — see [`scripts/generate-readme.js`](scripts/generate-readme.js) and [`.github/workflows/update-readme.yml`](.github/workflows/update-readme.yml). Do not hand-edit inside this block; edit the script instead._

## JavaScript modules

### [`js/faqs.js`](js/faqs.js) — `faqs()`

- Initialize

### [`js/footer-date.js`](js/footer-date.js) — `footerDate()`

- Set dynamic date in Footer Components

### [`js/form-multistep-calendly.js`](js/form-multistep-calendly.js)

_Entire file is commented out — not currently active or wired into `script-loader.js`._

### [`js/form.js`](js/form.js) — `form()`

- Form validation
- Disable native HTML5 validation
- Find the field wrapper using jQuery
- Find the existing label-error-wrapper
- Append error to the existing wrapper
- Fallback to default behavior
- Radio Button
- Remove selected class from all s_cfo_radio elements
- Add selected class to the parent .s_cfo_radio of the checked input

### [`js/legacy-site.js`](js/legacy-site.js) — `legacySiteInit()`

- LEGACY: Sensei symbol reveal — hidden by inline [sensei-simbol] CSS in Webflow head
- LEGACY: Footer logo click scrolls to top
- Ensure GSAP and ScrollToPlugin are loaded
- LEGACY: Copyright year auto-update
- Copyright Year Auto-Update
- LEGACY: Text headings h1 h2 glitch — SplitType + ScrollTrigger
- Split text into spans
- Link timelines to scroll position
- Letters fade in randomly
- Avoid flash of unstyled content

### [`js/main.js`](js/main.js) — `mainInit()`

- LENIS
- Sync Lenis scrolling with ScrollTrigger
- This ensures Lenis's smooth scroll animation updates on each GSAP tick
- Disable lag smoothing in GSAP to prevent any delay in scroll animations
- FANCYBOX INIT
- Toolbar wordmark reuses the navbar's Webflow class, so it follows the site's typography
- PRELOADER
- MOUSE FOLLOWER
- Snap to the pointer on entry so it doesn't glide in from its last position
- Copy link share

### [`js/menu.js`](js/menu.js) — `navBarMenu()`

- NAV MENU
- Hide initially with class
- CLOSE MENU
- Restore scroll
- OPEN MENU
- Lock scroll
- Remove display none
- MENU - ACCORDION
- Initialize
- Run scroll logic on load in case page is opened mid-scroll

### [`js/swiper.js`](js/swiper.js) — `swiperInit()`

- Init all Swipers
- for screens 500px wide and up
- for screens 768px wide and up

### [`js/works.js`](js/works.js) — `works()`

_No inline section comments found — see source for details._

### [`js/pages/careers.js`](js/pages/careers.js) — `careersInit()`

- CAREERS: Benefits accordions
- CAREERS: Benefits swiper
- CAREERS: Custom cursors — desktop only
- CAREERS: Careers process timeline + swiper
- Initialize Swiper
- Create timeline elements
- Handle progress updates
- Reset all classes
- Set active classes
- CAREERS: Fade in on scroll — ScrollTrigger.batch

### [`js/pages/fwd-teams.js`](js/pages/fwd-teams.js) — `fwdTeamsInit()`

- level with its text block. The CSS turns the progress into the column's offset.

### [`js/pages/how-it-works.js`](js/pages/how-it-works.js) — `howItWorksInit()`

- HOW IT WORKS: "See" + "Understand" accordions open vertically on desktop
- take over the clicks — in the capture phase, so the Webflow interaction never sees
- them — and open/close panels by height, like the tablet/mobile interaction already
- does. Below 992px nothing changes: Webflow's own interaction keeps running.
- Webflow marks the initially open panel with the .active combo class
- Desktop start state: open panel auto height, others closed
- Keep the clicked header in view when a panel above it just closed
- One panel is always open, like the tablet/mobile interaction: clicking the
- open panel's header does nothing
- panels still navigate: stopPropagation doesn't cancel the default action.

### [`js/utils/helpers.js`](js/utils/helpers.js) — `runBlocks()`, `loadScript()`

- Shared helpers, passed to every init function by script-loader.js
- is logged and doesn't stop the others — same as separate <script> tags behaved.
- Use exact, pinned versions.

## Stylesheets

### [`css/embed-classes.css`](css/embed-classes.css)

Imported by `css/styles.css`.

### [`css/faqs.css`](css/faqs.css)

_Not currently imported by `css/styles.css` — verify it is still in use._

### [`css/form-multistep-calendly.css`](css/form-multistep-calendly.css)

_Not currently imported by `css/styles.css` — verify it is still in use._

### [`css/legacy-site.css`](css/legacy-site.css)

Imported by `css/styles.css`.

### [`css/menu.css`](css/menu.css)

_Not currently imported by `css/styles.css` — verify it is still in use._

### [`css/styles.css`](css/styles.css)

Root stylesheet.

### [`css/pages/careers.css`](css/pages/careers.css)

Imported by `css/styles.css`.

### [`css/pages/fwd-teams.css`](css/pages/fwd-teams.css)

Imported by `css/styles.css`.

### [`css/pages/how-it-works.css`](css/pages/how-it-works.css)

Imported by `css/styles.css`.

<!-- AUTO-GENERATED:FEATURES:END -->

## Deployment

[`.github/workflows/purge-jsdelivr.yml`](.github/workflows/purge-jsdelivr.yml) runs on push to `main` (or manual dispatch): it diffs changed `.js`/`.css`/`.html` files and purges each from the jsDelivr CDN cache, so client sites pick up changes right away.

[`.github/workflows/update-readme.yml`](.github/workflows/update-readme.yml) runs on every push to `main` touching `js/**` or `css/**` (additions, edits, and deletions all count): it re-runs [`scripts/generate-readme.js`](scripts/generate-readme.js), which rescans those directories from scratch and rewrites the Features section above, then commits the result straight back to `main` if anything changed. No AI/API calls involved — it's a plain script, so there's no added cost beyond the CI minutes.

## Dependencies

Loaded by the host page, not bundled here: jQuery (Webflow's own), GSAP + ScrollTrigger + ScrollToPlugin and SplitType (from `webflow/site-footer.html`). The disabled white-label modules also need jQuery Validate, Lenis, Swiper, Fancybox and Calendly's embed script; their tags are commented out in the Webflow snippets.

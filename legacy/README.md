# Legacy custom code — Sensei 2026

Verbatim snapshot of every custom code block on the **Sensei 2026** Webflow site
(`sensei-staging-2026`, site id `6ae1d1264629dc4e90df3abe`), written years ago by the
previous agency. Taken **2026-11-24** through the Webflow API — byte-for-byte what was in
Webflow at that moment, no edits.

**Nothing in this folder is loaded by the website.** It's here for reference and rollback.

## What's live where (after the FWD loader goes in)

| Code | Lives in | Notes |
|---|---|---|
| Site head: GTM, Hotjar, Leadfeeder | Webflow site head ([`../webflow/site-head.html`](../webflow/site-head.html)) | Unchanged, must stay in Webflow |
| Site head: `[sensei-simbol]{opacity:0}` | Webflow site head (inline) | Hides the symbol before first paint |
| Site head: other CSS | [`../css/legacy-site.css`](../css/legacy-site.css) | Loaded through `css/styles.css` |
| Site footer: GSAP / ScrollTrigger / ScrollToPlugin / SplitType | Webflow site footer ([`../webflow/site-footer.html`](../webflow/site-footer.html)) | Page code depends on these globals |
| Site footer: inline JS (menus, testimonials, values, dropdowns…) | [`../js/legacy-site.js`](../js/legacy-site.js) | Loaded by `js/script-loader.js` |
| Site footer: values-tab `<style>` | [`../css/legacy-site.css`](../css/legacy-site.css) | |
| Page code: `/careers` | [`../js/pages/careers.js`](../js/pages/careers.js) + Webflow page settings ([`../webflow/pages/careers-*.html`](../webflow/pages/)) | Libraries + anti-flash CSS stay in Webflow |
| **Other page-level code (table below)** | **Still in Webflow page settings** | Not migrated yet |

## Snapshot contents

| Page | Webflow page id | Files | External dependencies |
|---|---|---|---|
| **Site settings** | `-` | [`head.html`](site/head.html) (3.0 KB) · [`footer.html`](site/footer.html) (22.6 KB) | cdn.finsweet.com/files/sweet-text/richtext-stylesystem-v1.0.min.js<br>cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js<br>cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js<br>cdnjs.cloudflare.com/ajax/libs/gsap/3.11.3/gsap.min.js<br>cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollToPlugin.min.js<br>unpkg.com/split-type |
| `/how-it-works` | `6aec7413ae73f59f7e35fef4` | [`head.html`](pages/how-it-works/head.html) (0.2 KB) · [`footer.html`](pages/how-it-works/footer.html) (15.4 KB) | cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js<br>cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js<br>cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js<br>unpkg.com/swiper/swiper-bundle.min.css<br>unpkg.com/swiper/swiper-bundle.min.js |
| `/product` | `6aeb1c30a345c0ff0c02c6f7` | [`head.html`](pages/product/head.html) (0.2 KB) · [`footer.html`](pages/product/footer.html) (15.4 KB) | cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js<br>cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js<br>cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js<br>unpkg.com/swiper/swiper-bundle.min.css<br>unpkg.com/swiper/swiper-bundle.min.js |
| `/partners` | `6ae1d1264629dc4e90df3ab3` | [`head.html`](pages/partners/head.html) (0.2 KB) · [`footer.html`](pages/partners/footer.html) (5.8 KB) | unpkg.com/swiper/swiper-bundle.min.css<br>unpkg.com/swiper/swiper-bundle.min.js |
| `/careers` | `6ae1d1264629dc4e90df3ab1` | [`head.html`](pages/careers/head.html) (0.6 KB) · [`footer.html`](pages/careers/footer.html) (7.9 KB) | cdn.jsdelivr.net/gh/francesco-castronuovo/gsap-trail-image-effect@1.0.2/main.js<br>cdn.jsdelivr.net/gh/francesco-castronuovo/gsap-trail-image-effect@1.0.2/style.css<br>cdn.jsdelivr.net/npm/gsap@3.12.5/dist/Draggable.min.js<br>cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js<br>unpkg.com/swiper/swiper-bundle.min.css<br>unpkg.com/swiper/swiper-bundle.min.js |
| `/company` | `6ae1d1264629dc4e90df3ab0` | [`head.html`](pages/company/head.html) (0.2 KB) · [`footer.html`](pages/company/footer.html) (12.4 KB) | cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js<br>cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js<br>unpkg.com/gsap@3/dist/ScrollTrigger.min.js<br>unpkg.com/swiper/swiper-bundle.min.css<br>unpkg.com/swiper/swiper-bundle.min.js<br>xq5gdz.csb.app/dojo-video.js |
| `/insights` | `6ae1d1264629dc4e90df3aae` | [`head.html`](pages/insights/head.html) (0.3 KB) · [`footer.html`](pages/insights/footer.html) (0.6 KB) | cdn.jsdelivr.net/npm/@finsweet/attributes-cmsfilter@1/cmsfilter.js<br>cdn.jsdelivr.net/npm/@finsweet/attributes-cmsload@1/cmsload.js |
| Insights Template (CMS) | `6ae1d1264629dc4e90df3aad` | [`head.html`](pages/detail_insights/head.html) (0.2 KB) · [`footer.html`](pages/detail_insights/footer.html) (1.1 KB) | cdn.jsdelivr.net/npm/@finsweet/attributes-socialshare@1/socialshare.js |
| `/funding` | `6ae1d1264629dc4e90df3aab` | [`head.html`](pages/funding/head.html) (0.9 KB) · [`footer.html`](pages/funding/footer.html) (1.0 KB) | cdn.finsweet.com/files/sweet-text/richtext-stylesystem-v1.0.min.js |
| `/404` | `6ae1d1264629dc4e90df3aa7` | [`head.html`](pages/404/head.html) (0.9 KB) · [`footer.html`](pages/404/footer.html) (0.3 KB) | — |
| `/book-a-demo` | `6ae1d1264629dc4e90df3aa4` | [`head.html`](pages/book-a-demo/head.html) (0.4 KB) · [`footer.html`](pages/book-a-demo/footer.html) (1.8 KB) | — |
| `/clients` | `6ae1d1264629dc4e90df3aa1` | [`footer.html`](pages/clients/footer.html) (3.7 KB) | — |
| `/company-old` | `6ae1d1264629dc4e90df3aa0` | [`head.html`](pages/company-old/head.html) (0.2 KB) · [`footer.html`](pages/company-old/footer.html) (11.2 KB) | cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js<br>cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js<br>unpkg.com/gsap@3/dist/ScrollTrigger.min.js<br>xq5gdz.csb.app/dojo-video.js |
| `/experiences` | `6ae1d1264629dc4e90df3a9f` | [`head.html`](pages/experiences/head.html) (0.1 KB) · [`footer.html`](pages/experiences/footer.html) (2.6 KB) | cdnjs.cloudflare.com/ajax/libs/gsap/3.11.0/ScrollToPlugin.min.js<br>xq5gdz.csb.app/retailers.js |
| Legal Template (CMS) | `6ae1d1264629dc4e90df3a98` | [`head.html`](pages/detail_legal/head.html) (0.9 KB) · [`footer.html`](pages/detail_legal/footer.html) (1.8 KB) | cdn.finsweet.com/files/sweet-text/richtext-stylesystem-v1.0.min.js |
| Solutions Template (CMS) | `6ae1d1264629dc4e90df3a95` | [`head.html`](pages/detail_solutions/head.html) (1.3 KB) · [`footer.html`](pages/detail_solutions/footer.html) (8.2 KB) | unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js<br>unpkg.com/swiper/swiper-bundle.min.css<br>unpkg.com/swiper/swiper-bundle.min.js |
| Industries Template (CMS) | `6ae1d1264629dc4e90df3a94` | [`footer.html`](pages/detail_industries/footer.html) (19.1 KB) | cdn.finsweet.com/files/sweet-text/richtext-stylesystem-v1.0.min.js<br>unpkg.com/swiper/swiper-bundle.min.css<br>unpkg.com/swiper/swiper-bundle.min.js<br>xq5gdz.csb.app/industries-title.js<br>xq5gdz.csb.app/industries.js |
| `/` (Home) | `6ae1d1254629dc4e90df3a93` | [`head.html`](pages/home/head.html) (0.2 KB) · [`footer.html`](pages/home/footer.html) (15.4 KB) | cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js<br>cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js<br>cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js<br>unpkg.com/swiper/swiper-bundle.min.css<br>unpkg.com/swiper/swiper-bundle.min.js |

`product` and `how-it-works` are identical copies; `home` shares their head and has an almost identical footer.

### `external/csb/`

Pages load four scripts straight from a CodeSandbox preview URL (`https://xq5gdz.csb.app/…`).
If that sandbox is ever deleted, those pages lose their animations, so copies were saved here
(downloaded 2026-11-24, all returned HTTP 200):

| File | Used by |
|---|---|
| [`dojo-video.js`](external/csb/dojo-video.js) | `/company`, `/company-old` |
| [`retailers.js`](external/csb/retailers.js) | `/experiences` |
| [`industries.js`](external/csb/industries.js) | Industries template |
| [`industries-title.js`](external/csb/industries-title.js) | Industries template |

## Known issues in the legacy code (not fixed yet)

- GSAP was loaded three times at site level (3.12.5 → 3.11.3 → 3.12.5); `webflow/site-footer.html` now loads it once. Several pages still load it again.
- Home, Product, How it works and Company load jQuery 3.7.1 again on top of Webflow's own jQuery.
- Pages load Swiper from `unpkg.com/swiper` with no version and Lottie from `lottie-player@latest`, so a new major release can break them without warning.
- The values-tab code kills every ScrollTrigger that isn't part of the active tab, including ones created by page code.
- The mobile-menu code adds its click listeners again on every window resize.

## Rolling back

To put a block back exactly as it was, copy the matching file into Webflow:

- **Site**: Site settings → Custom code → Head code / Footer code ← `site/head.html` / `site/footer.html`
- **Page**: Page settings → Custom code → Inside `<head>` / Before `</body>` ← `pages/<slug>/head.html` / `footer.html`

Then publish. To roll back the whole site to how it was before the FWD loader, paste both
`site/` files back over the snippets from `../webflow/`.

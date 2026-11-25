// Mobile / tablet navbar (Relume navbar6, collapsed ≤991px) — behaviour extras on top
// of Webflow's w-nav / w-dropdown. Look & feel is in css/navbar-mobile.css.
export function navbarMobile() {
    const nav = document.querySelector('.navbar6_component');
    const button = nav?.querySelector('.w-nav-button');
    const menu = nav?.querySelector('.w-nav-menu');
    if (!button || !menu) return;

    const html = document.documentElement;
    const isOpen = () => button.classList.contains('w--open');
    const close = () => { if (isOpen()) button.click(); };

    // Lock page scroll while the full-screen menu is open (the menu scrolls itself);
    // start every opening at the top of the list
    new MutationObserver(() => {
        const open = isOpen();
        html.classList.toggle('is-nav-open', open);
        html.style.overflow = open ? 'hidden' : '';
        document.body.style.overflow = open ? 'hidden' : '';
        if (open) menu.scrollTop = 0;
    }).observe(button, { attributes: true, attributeFilter: ['class'] });

    // Escape closes the menu and gives focus back to the burger
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape' || !isOpen()) return;
        close();
        button.focus();
    });

    // Same-page links (anchors) don't unload the page — close the menu for them
    menu.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        if (!link || !isOpen()) return;
        const url = new URL(link.href, location.href);
        if (url.pathname === location.pathname && url.hash) close();
    });

    // Opening a section closes the one above it (Webflow), which can push the new
    // section's title off the top — bring it back under the bar once things settle
    const BAR_SPACE = 88; // menu padding-top in navbar-mobile.css
    menu.querySelectorAll('.w-dropdown-toggle').forEach((toggle) => {
        toggle.addEventListener('click', () => {
            if (!isOpen()) return;
            setTimeout(() => {
                if (toggle.getAttribute('aria-expanded') !== 'true') return;
                const top = toggle.getBoundingClientRect().top;
                if (top < BAR_SPACE) menu.scrollBy({ top: top - BAR_SPACE, behavior: 'smooth' });
            }, 450);
        });
    });
}

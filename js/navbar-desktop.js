// Desktop navbar (≥992px) — hides the fixed bar once the page reaches the footer.
//
// The footer is a sticky "reveal" layer behind .main-wrapper (z-index 1). The bar
// (.nav-bar-wrapper, position: fixed) lives inside .main-wrapper, so it keeps painting
// over the footer after the page content has scrolled away. As soon as the bottom of
// .main-wrapper passes under the bar (= footer starts showing beneath it), the bar
// slides up; scrolling back above that point brings it back. Look & feel in
// css/navbar-desktop.css.
export function navbarDesktop() {
    const bar = document.querySelector('.nav-bar-wrapper');
    const main = bar?.closest('.main-wrapper');
    if (!bar || !main) return; // pages still on the legacy nav

    const html = document.documentElement;
    const desktop = window.matchMedia(`(min-width: ${(window.tabletBreakpoint ?? 991) + 1}px)`);
    let ticking = false;

    const update = () => {
        ticking = false;
        // offsetHeight ignores the hide transform, so the threshold stays put while hidden
        const atFooter = desktop.matches && main.getBoundingClientRect().bottom <= bar.offsetHeight;
        html.classList.toggle('is-nav-at-footer', atFooter);
    };

    const requestUpdate = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
    };

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    desktop.addEventListener('change', requestUpdate);
    update(); // page may open already scrolled to the footer
}

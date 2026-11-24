/*
 * LEGACY SITE CODE — ported from Webflow Site Settings > Custom Code > Footer
 * (original agency code, verbatim snapshot in legacy/site/footer.html, taken 2026-11-24).
 *
 * Bodies are kept as-is. Only changes vs the original:
 * - each <script> block is its own function, run inside try/catch so one failing
 *   block (most have no null-checks) doesn't stop the others — same as separate
 *   <script> tags behaved before;
 * - DOMContentLoaded / load wrappers run immediately, because script-loader.js
 *   calls this after DOMContentLoaded + document.fonts.ready;
 * - libraries (GSAP, ScrollTrigger, ScrollToPlugin, SplitType) and plugin
 *   registration stay as classic <script> tags in Webflow (pages rely on them);
 * - the values-tab <style> moved to css/legacy-site.css.
 *
 * Relies on globals: $ (Webflow jQuery), gsap, ScrollTrigger, SplitType.
 */

// LEGACY: Sensei symbol reveal — hidden by inline [sensei-simbol] CSS in Webflow head
function senseiSymbolReveal() {
  $("[sensei-simbol]").css("opacity", "1");
}

// LEGACY: Footer logo click scrolls to top
function footerScrollTop() {
  // Ensure GSAP and ScrollToPlugin are loaded
  $('.footer-img-wrapper').on('click', function () {
    $('html, body').animate({
      scrollTop: 0
    }, 1500, 'swing'); // 1500ms duration and 'swing' easing function for ease-in-out effect
  });
}

// LEGACY: Copyright year auto-update
function yearAutoUpdate() {
  // Copyright Year Auto-Update
  const currentYear = new Date().getFullYear();
  $(`[data="year"]`).html(currentYear);
}

// LEGACY: Text headings h1 h2 glitch — SplitType + ScrollTrigger
function textSplitGlitch() {
  ((event) => {
    // Split text into spans
    let typeSplit = new SplitType("[text-split]", {
      types: "words, chars",
      tagName: "span"
    });

    // Link timelines to scroll position
    function createScrollTrigger(triggerElement, timeline) {
      ScrollTrigger.create({
        trigger: triggerElement,
        start: "top bottom",
        onLeaveBack: () => {
          timeline.progress(0);
          timeline.pause();
        }
      });
      ScrollTrigger.create({
        trigger: triggerElement,
        start: "top 90%",
        onEnter: () => timeline.play()
      });
    }

    // Letters fade in randomly
    $("[letters-fade-in-random]").each(function () {
      let tl = gsap.timeline({ paused: true });
      tl.from($(this).find(".char"), { opacity: 0, duration: 0.05, ease: "power1.out", stagger: { amount: 0.4, from: "random" } });
      createScrollTrigger($(this), tl);
    });

    // Avoid flash of unstyled content
    gsap.set("[text-split]", { opacity: 1 });
  })();
}

// LEGACY: Mega menu desktop open/close
function megaMenuDesktop() {
  // Select the buttons and the navigation elements
  const openMenuBtn = document.getElementById('open-mega-menu-btn'); // The button in your main nav
  const closeMenuBtn = document.getElementById('close-mega-menu-btn'); // The button inside the mega menu
  const megaMenu = document.querySelector('.navigation-open-desktop'); // Mega menu container
  const mainNav = document.querySelector('.navigation-desktop'); // Main navigation container

  // Function to open the mega menu and hide the main nav
  openMenuBtn.addEventListener('click', function () {
    gsap.to(megaMenu, { display: 'flex', opacity: 1, duration: 0.2 });  // Show the mega menu with animation
    gsap.to(mainNav, { display: 'none', opacity: 0, duration: 0.2 });    // Hide the main navigation with animation
  });

  // Function to close the mega menu and show the main nav
  closeMenuBtn.addEventListener('click', function () {
    gsap.to(megaMenu, { display: 'none', opacity: 0, duration: 0.2 });   // Hide the mega menu with animation
    gsap.to(mainNav, { display: 'flex', opacity: 1, duration: 0.2 });   // Show the main navigation with animation
  });

  // Close When clicking outside
  $('.nav-close-trigger').on('click', function () {
    $("#close-mega-menu-btn").click();
  });
}

// LEGACY: Mega menu desktop submenus
function megaMenuSubmenus() {
  (function () {
    // Select the link blocks, mega menu, main nav, submenus, and close button
    const linkBlock1 = document.getElementById('main-link-industries');
    const linkBlock2 = document.getElementById('main-link-experience');
    const linkBlock3 = document.getElementById('main-link-company');

    const megaMenu = document.querySelector('.navigation-open-desktop');
    const mainNav = document.querySelector('.navigation-desktop');
    const closeMenuBtn = document.getElementById('close-mega-menu-btn');

    const industriesBtn = document.getElementById('industries-btn');
    const experienceBtn = document.getElementById('experience-btn');
    const companyBtn = document.getElementById('company-btn');

    const submenus = document.querySelectorAll('.expand-menu-block'); // All submenus
    let overrideDefaultSubmenu = false; // Flag to override default submenu behavior

    // Function to hide all submenus
    function hideAllSubmenus() {
      submenus.forEach(submenu => {
        gsap.to(submenu, { display: 'none', opacity: 0, duration: 0.2 });
      });
    }

    // Function to show a specific submenu
    function showSubmenu(selectedSubmenu) {
      hideAllSubmenus(); // Hide all submenus
      gsap.to(selectedSubmenu, { display: 'flex', opacity: 1, duration: 0.2 }); // Show the selected submenu
    }

    // Default submenu to show when interacting with mega menu directly
    function showDefaultSubmenu() {
      if (!overrideDefaultSubmenu) {
        showSubmenu(document.getElementById('industries-submenu')); // Show industries submenu by default
      }
    }

    // Event listeners for link blocks in the mega menu (trigger submenus directly)
    industriesBtn.addEventListener('click', function () {
      showSubmenu(document.getElementById('industries-submenu'));
    });

    experienceBtn.addEventListener('click', function () {
      showSubmenu(document.getElementById('experience-submenu'));
    });

    companyBtn.addEventListener('click', function () {
      showSubmenu(document.getElementById('company-submenu'));
    });

    // Function to open the mega menu and show the correct submenu from the main nav
    function openMegaMenuFromNav(submenu) {
      overrideDefaultSubmenu = true; // Set flag to override the default submenu
      hideAllSubmenus(); // Hide all submenus first
      gsap.to(megaMenu, { display: 'flex', opacity: 1, duration: 0.2 });  // Show the mega menu with animation
      gsap.to(mainNav, { display: 'none', opacity: 0, duration: 0.2 });    // Hide the main navigation with animation
      showSubmenu(submenu);  // Show the specific submenu from the main nav
    }

    // Click event for Link Block 1 (main nav) to open mega menu and show Submenu 1
    linkBlock1.addEventListener('click', function (e) {
      e.preventDefault();  // Prevent default link behavior
      openMegaMenuFromNav(document.getElementById('industries-submenu'));
    });

    // Click event for Link Block 2 (main nav) to open mega menu and show Submenu 2
    linkBlock2.addEventListener('click', function (e) {
      e.preventDefault();  // Prevent default link behavior
      openMegaMenuFromNav(document.getElementById('experience-submenu'));
    });

    // Click event for Link Block 2 (main nav) to open mega menu and show Submenu 2
    linkBlock3.addEventListener('click', function (e) {
      e.preventDefault();  // Prevent default link behavior
      openMegaMenuFromNav(document.getElementById('company-submenu'));
    });

    // Function to close the mega menu and reset the default behavior
    closeMenuBtn.addEventListener('click', function () {
      gsap.to(megaMenu, { display: 'none', opacity: 0, duration: 0.2 });  // Hide the mega menu with animation
      gsap.to(mainNav, { display: 'flex', opacity: 1, duration: 0.2 });   // Show the main navigation with animation
      overrideDefaultSubmenu = false;   // Reset flag to allow default submenu behavior
      showDefaultSubmenu();             // Reset to the default submenu if opened later
    });

    // Initially show the default submenu
    showDefaultSubmenu();
  })();
}

// LEGACY: Menu mobile
function menuMobile() {
  // Function to handle the menu based on device width
  function handleMenu() {
    // Check if the screen width is less than or equal to 1024px (tablet and mobile)
    if (window.innerWidth <= 1024) {
      const openMegaMenuBtn = document.getElementById('open-mega-menu-mobile-btn');
      const closeMegaMenuBtn = document.getElementById('close-mega-menu-mobile-btn');
      const mainNavigation = document.querySelector('.navigation-mobile');
      const megaMenu = document.querySelector('.navigation-open-mobile');

      // Ensure the elements exist before adding event listeners
      if (openMegaMenuBtn && closeMegaMenuBtn && mainNavigation && megaMenu) {
        // Function to open the mega menu
        openMegaMenuBtn.addEventListener('click', () => {
          mainNavigation.style.display = 'none'; // Hide the main navigation
          megaMenu.style.display = 'block'; // Show the mega menu
        });

        // Function to close the mega menu
        closeMegaMenuBtn.addEventListener('click', () => {
          megaMenu.style.display = 'none'; // Hide the mega menu
          mainNavigation.style.display = 'block'; // Show the main navigation (use 'flex' if that's your styling)
        });
      } else {
        console.error('One or more elements are missing. Please check your class names and IDs.');
      }
    }
  }

  // Run the function when the page loads
  handleMenu(); // was: DOMContentLoaded listener (already fired when loader runs)

  // Optionally, rerun the function if the screen size changes (e.g., when resizing)
  window.addEventListener('resize', handleMenu);
}

// LEGACY: Testimonials slider
function testimonials() {
  // Wrap 2 .story-item elements each in .stories-slide-item
  function groupElements() {
    const storyItems = document.querySelectorAll('.story-item');
    const containerSlider = document.querySelector('.stories-list');

    for (let i = 0; i < storyItems.length; i += 2) {
      const newDiv = document.createElement('div');
      newDiv.classList.add('stories-slide-item');

      newDiv.appendChild(storyItems[i]);
      if (i + 1 < storyItems.length) {
        newDiv.appendChild(storyItems[i + 1]);
      }

      containerSlider.appendChild(newDiv);
    }
  }

  groupElements();

  // CMS ITEM Hover SCALE Animation
  const storyItems = document.querySelectorAll('.story-item');

  storyItems.forEach(item => {
    const btnAnimation = gsap.timeline({
      paused: true,
    })
      .to(item, { width: '100%', ease: 'power2.inOut', duration: 0.5 })

    item.addEventListener('mouseenter', () => {
      btnAnimation.play();
    });

    item.addEventListener('mouseleave', () => {
      btnAnimation.reverse();
    });
  });


  // MAKING the first .story-item small
  const sliders = document.querySelectorAll('.stories-slide-item');

  sliders.forEach(slider => {
    const storyItems = slider.querySelectorAll('.story-item');

    if (storyItems.length === 2) {
      const firstStoryItem = storyItems[0];
      const secondStoryItem = storyItems[1];

      secondStoryItem.style.flexBasis = '80%';

      firstStoryItem.addEventListener('mouseenter', function () {
        secondStoryItem.style.flexBasis = '40%';
      });

      firstStoryItem.addEventListener('mouseleave', function () {
        secondStoryItem.style.flexBasis = '80%';
      });
    }
  });


  // SLIDER by GSAP
  const slides = document.querySelectorAll('.stories-slide-item');
  const storiesList = document.querySelector('.stories-list');
  const leftArrow = document.querySelector('.arrow.left');
  const rightArrow = document.querySelector('.arrow.right');
  let currentIndex = 0;

  function moveSlider(index) {
    gsap.to(storiesList, { xPercent: -100 * index, duration: 0.5 });
    updateArrows();
  }

function updateArrows() {
  const disabledStyles = {
    color: '#C4C0AD',
    borderColor: '#C4C0AD',
    cursor: 'not-allowed',
    pointerEvents: 'none'
  };

  const defaultStyles = {
    color: '',
    borderColor: '',
    cursor: '',
    pointerEvents: 'pointer'
  };

  // Apply styles based on current index
  const leftStyles = currentIndex === 0 ? disabledStyles : defaultStyles;
  const rightStyles = currentIndex === slides.length - 1 ? disabledStyles : defaultStyles;

  // Apply styles to arrows
  Object.assign(leftArrow.style, leftStyles);
  Object.assign(rightArrow.style, rightStyles);
}

  leftArrow?.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      moveSlider(currentIndex);
    }
  });

  rightArrow?.addEventListener('click', () => {
    if (currentIndex < slides.length - 1) {
      currentIndex++;
      moveSlider(currentIndex);
    }
  });

  // Initial call to set the correct arrow visibility
  updateArrows();
}

// LEGACY: Values timeline tabs
function values() {
  gsap.registerPlugin(ScrollTrigger);

  // Function to initialize animations for a specific tab
  function initAnimation(animationId) {
    const section = document.querySelector(`.section-general-values-${animationId}`);
    if (!section) return;

    const timeline = section.querySelector('.timeline');
    const progress = section.querySelector('.timeline-progress');
    const marker = section.querySelector('.timeline-marker');
    const blocks = section.querySelectorAll(`[id^="block-${animationId}"]`);
    const totalBlocks = blocks.length;
    const opacityLevel = 0.2;

    // Set the section height to provide enough scrolling space
    section.style.height = `${totalBlocks * 100}vh`;

    // Function to create ScrollTrigger
    function createScrollTrigger(trigger, start, end, onUpdate) {
      return ScrollTrigger.create({
        trigger: trigger,
        start: start,
        end: end,
        scrub: 0.5,
        markers: false,
        onUpdate: onUpdate
      });
    }

    // Progress bar and marker animation synced with the scroll
    createScrollTrigger(section, 'top top', 'bottom bottom', (self) => {
      const progressValue = self.progress;
      const timelineHeight = timeline.offsetHeight;

      // Ensure that the progress bar starts from zero and grows with scroll progress
      const progressHeight = progressValue * timelineHeight;
      gsap.to(progress, { height: progressHeight, duration: 0.1 });

      // Marker moves along with the progress bar
      const markerPosition = progressHeight - (marker.offsetHeight / 2);
      gsap.to(marker, { y: markerPosition, duration: 0.1 });
    });

    // Initially set the progress bar height and marker position to zero
    gsap.set(progress, { height: 0 });  // Start the progress bar from zero height
    gsap.set(marker, { y: 0 });  // Start the marker at the top

    // Always show the first block and image by default
    const firstBlock = blocks[0];
    const firstBlockIdParts = firstBlock.id.split('-');
    const firstImage = section.querySelector(`#image-${firstBlockIdParts[1]}-${firstBlockIdParts[2]}`);
    const firstHeading = firstBlock.querySelector('h5');

    gsap.set(firstBlock, { opacity: 1 });
    gsap.set(firstHeading, { color: '#000000' });
    gsap.set(firstImage, { opacity: 1 });

    // Text block and image animations for the remaining blocks
    blocks.forEach((block, index) => {
      if (index === 0) return; // Skip the first block

      const blockIdParts = block.id.split('-');
      const correspondingImage = section.querySelector(`#image-${blockIdParts[1]}-${blockIdParts[2]}`);
      const heading = block.querySelector('h5');

      // Set the initial state for the other blocks
      gsap.set(block, { opacity: opacityLevel });
      gsap.set(heading, { color: '#999999' });
      gsap.set(correspondingImage, { opacity: 0 });

      // Trigger the animation when scrolling to each block
      createScrollTrigger(section,
        () => `${index * (100 / totalBlocks)}% center`,
        () => `${(index + 1) * (100 / totalBlocks)}% center`,
        (self) => {
          const progress = self.progress;

          // Animate block and image visibility based on scroll position
          if (progress > 0.5) {
            gsap.to(block, { opacity: 1, duration: 0.3 });
            gsap.to(heading, { color: '#000000', duration: 0.3 });
            gsap.to(correspondingImage, { opacity: 1, duration: 0.3 });
          } else {
            gsap.to(block, { opacity: opacityLevel, duration: 0.3 });
            gsap.to(heading, { color: '#999999', duration: 0.3 });
            gsap.to(correspondingImage, { opacity: 0, duration: 0.3 });
          }
        });
    });
  }

  // Function to handle tab switching and visibility
  document.querySelectorAll('.values-btn-tab').forEach((tabLink) => {
    tabLink.addEventListener('click', (e) => {
      e.preventDefault();

      const targetTab = tabLink.getAttribute('data-tab');

      // Remove active class from all tabs and tab content
      document.querySelectorAll('.values-btn-tab').forEach((tab) => tab.classList.remove('is-active'));
      document.querySelectorAll('.section-general-values-1.tab-pane, .section-general-values-2.tab-pane').forEach((pane) => {
        pane.classList.remove('active');
        pane.style.display = 'none';
      });

      // Add active class to the clicked tab and corresponding content
      tabLink.classList.add('is-active');
      const activePane = document.querySelector(`.section-general-values-${targetTab}.tab-pane`);
      activePane.classList.add('active');
      activePane.style.display = 'block';

      // Initialize the animation for the newly active tab
      initAnimation(targetTab);

      // Kill ScrollTriggers for inactive tabs to prevent overlapping animations
      ScrollTrigger.getAll().forEach((trigger) => {
        if (!trigger.vars.trigger.classList.contains(`section-general-values-${targetTab}`)) {
          trigger.kill();
        }
      });

      // Scroll to the top of the newly activated tab
      window.scrollTo(0, activePane.offsetTop);
    });
  });

  // Initialize the animation for the first tab by default
  initAnimation(1);
}

// LEGACY: Dropdowns open by default
function dropdownsOpenByDefault() {
  (function () {
    // List of dropdown IDs to be open by default
    var defaultDropdowns = ['#dropdown-experience-1', '#dropdown-experience-2', '#dropdown-home-1', '#dropdown-home-2', '#dropdown-supermarkets-1', '#dropdown-supermarkets-2', '#dropdown-health-1', '#dropdown-health-2', '#dropdown-education-1', '#dropdown-education-2', '#dropdown-mobility-1', '#dropdown-mobility-2', '#dropdown-hospitality-1', '#dropdown-hospitality-2', '#dropdown-leisure-1', '#dropdown-leisure-2', '#dropdown-workplaces-1', '#dropdown-workplaces-2']; // Add more IDs as needed
    var dropdowns = document.querySelectorAll('.w-dropdown');

    // Function to open a specific dropdown
    function openDropdown(dropdown) {
      var dropdownToggle = dropdown.querySelector('.w-dropdown-toggle');
      var dropdownList = dropdown.querySelector('.w-dropdown-list');

      // Simulate a click to open the dropdown
      if (dropdownToggle) {
        setTimeout(function () {
          dropdownToggle.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }, 200);
      }

      // Ensure the content is displayed
      if (dropdownList) {
        setTimeout(function () {
          dropdownList.style.display = 'block';
        }, 300);
      }

      // Allow reopening the dropdown after closing
      dropdownToggle.addEventListener('click', function () {
        if (!dropdown.classList.contains('w--open')) {
          dropdown.classList.add('w--open');
          dropdownList.style.display = 'block';
        }
      });
    }

    // Open all default dropdowns by their IDs
    defaultDropdowns.forEach(function (dropdownId) {
      var dropdown = document.querySelector(dropdownId);
      if (dropdown) {
        openDropdown(dropdown);
      }
    });

    // Close the default dropdowns when another dropdown is opened
    dropdowns.forEach(function (dropdown) {
      dropdown.addEventListener('click', function (e) {
        defaultDropdowns.forEach(function (dropdownId) {
          var defaultDropdown = document.querySelector(dropdownId);
          if (defaultDropdown && dropdown !== defaultDropdown) {
            defaultDropdown.classList.remove('w--open');
            var dropdownList = defaultDropdown.querySelector('.w-dropdown-list');
            if (dropdownList) {
              dropdownList.style.display = 'none';
            }
          }
        });
      });
    });
  })();
}

// LEGACY: Footer height check + nav pointer-events near footer
function footerAndNav() {
  function checkFooterHeight() {
    const footer = document.querySelector('.footer-mobile');
    if (!footer) return;

    const footerHeight = footer.offsetHeight;
    const viewportHeight = window.innerHeight;

    if (footerHeight > viewportHeight) {
      if (getComputedStyle(footer).position === 'sticky') {
        footer.style.position = 'static';
      }
    }
  }

  // Run on load and resize
  checkFooterHeight(); // was: load listener (may already have fired when loader runs)
  window.addEventListener('resize', checkFooterHeight);
  
  // Remove pointer-events to nav when reching the footer
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;

    const scrollPercent = (scrollTop + winHeight) / docHeight;

    const targetElement = document.querySelector('.navigation-desktop');

   	if (scrollPercent > 0.95) {
      targetElement.classList.add('no-pointer-events');
    } else {
      targetElement.classList.remove('no-pointer-events');
    }

  });
}

const blocks = {
    senseiSymbolReveal,
    footerScrollTop,
    yearAutoUpdate,
    textSplitGlitch,
    megaMenuDesktop,
    megaMenuSubmenus,
    menuMobile,
    testimonials,
    values,
    dropdownsOpenByDefault,
    footerAndNav,
};

// runBlocks is passed in by script-loader.js (cache-busted import of utils/helpers.js)
export function legacySiteInit({ runBlocks }) {
    runBlocks('legacy-site', blocks);

    console.log("Loading legacySiteInit()");
}

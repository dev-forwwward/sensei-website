$(document).ready(function () {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".cutting-base_wrapper",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    },
  });

  // Each animation section takes up 25% of the timeline
  tl.fromTo(
    "[cutting-0]",
    { y: "40vh", opacity: 0.3 },
    { y: "0vh", opacity: 1, ease: "power1.inOut", duration: 1 }
  )
    .fromTo(
      "[cutting-1]",
      { y: "80vh", opacity: 0.3 },
      { y: "0vh", opacity: 1, ease: "power1.inOut", duration: 1 }
    )
    .fromTo(
      "[cutting-2]",
      { y: "120vh", opacity: 0.3 },
      { y: "0vh", opacity: 1, ease: "power1.inOut", duration: 1 }
    )
    .fromTo(
      "[cutting-3]",
      { y: "140vh", opacity: 0.3 },
      { y: "0vh", opacity: 1, ease: "power1.inOut", duration: 1 }
    );
});

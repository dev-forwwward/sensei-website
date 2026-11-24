document.addEventListener("DOMContentLoaded", function () {
  $(".retailers-1").on("click", function () {
    //console.log("222222");
    gsap.to(window, {
      scrollTo: {
        y: "[value-scroll-1]",
        offsetY: 0,
      },
      duration: 1,
      ease: "power1.inOut",
    });
  });

  $(".retailers-2").on("click", function () {
    //console.log("222222");
    gsap.to(window, {
      y: "[value-scroll-2]",
      offsetY: 0,
      scrollTo: {},
      duration: 1,
      ease: "power1.inOut",
    });
  });

  $(".retailers-3").on("click", function () {
    //console.log("33333333");
    gsap.to(window, {
      scrollTo: {
        y: "[value-scroll-3]",
        offsetY: 0,
      },
      duration: 1,
      ease: "power1.inOut",
    });
  });

  $(".retailers-4").on("click", function () {
    //console.log("444444");
    const targetElement = $(".tab-content");
    const targetOffset =
      targetElement.offset().top +
      targetElement.outerHeight() -
      window.innerHeight +
      10;

    gsap.to(window, {
      scrollTo: {
        y: targetOffset,
      },
      duration: 1,
      ease: "power1.inOut",
    });
  });
});

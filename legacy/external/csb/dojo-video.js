$(document).ready(function () {
  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(ScrollToPlugin);

  //Title
  gsap.fromTo(
    ".dojo-title-1",
    { x: "50%" },
    {
      x: "100%",
      scrollTrigger: {
        trigger: ".company-dojo-title_wrapper",
        start: "top 80%",
        end: "top 8%",
        scrub: true,
      },
      ease: "power1.inOut",
    }
  );

  gsap.fromTo(
    ".dojo-title-text-1_wrapper",
    { x: "-50%" },
    {
      x: "-100%",
      scrollTrigger: {
        trigger: ".company-dojo-title_wrapper",
        start: "top 80%",
        end: "top 8%",
        scrub: true,
      },
      ease: "power1.inOut",
    }
  );

  // Title the dojo
  gsap.fromTo(
    ".dojo-title-2",
    { x: "50%" },
    {
      x: "0%",
      scrollTrigger: {
        trigger: ".company-dojo-title_wrapper",
        start: "top 80%",
        end: "top 8%",
        scrub: true,
      },
      ease: "power1.inOut",
    }
  );

  gsap.fromTo(
    ".dojo-title-text-2_wrapper",
    { x: "-50%" },
    {
      x: "0%",
      scrollTrigger: {
        trigger: ".company-dojo-title_wrapper",
        start: "top 80%",
        end: "top 8%",
        scrub: true,
      },
      ease: "power1.inOut",
    }
  );

  //Video

  gsap.fromTo(
    ".dojo-video",
    { scale: 0 },
    {
      scale: 1,
      scrollTrigger: {
        trigger: ".dojo-video_sticky",
        start: "top 95%",
        end: "top top",
        scrub: true,
      },
      ease: "power1.inOut",
    }
  );

  gsap.fromTo(
    ".dojo-video-info_wrapper",
    { opacity: 0 },
    {
      opacity: 1,
      scrollTrigger: {
        trigger: ".dojo-video_sticky",
        start: "top top",
        end: "top top-=10%",
        scrub: true,
      },
      ease: "power1.inOut",
    }
  );

  $(".dojo-video-2").css("opacity", "0");
  $(".dojo-video-3").css("opacity", "0");
  $(".dojo-video-4").css("opacity", "0");

  gsap.fromTo(
    ".dojo-video-list",
    { x: "50%" },
    {
      x: "-50%",
      scrollTrigger: {
        trigger: ".dojo-video_sticky",
        start: "top top-=10%",
        end: "bottom bottom-=10%",
        scrub: true,

        onUpdate: (self) => {
          //console.log("self.progress " + self.progress);

          if (self.progress >= 0.35 && self.progress < 0.5) {
            $(".dojo-video-mini").removeClass("is-active");
            $("[dojo-mini-2]").addClass("is-active");

            $(".dojo-info_card").removeClass("is-active");
            $("[dojo-card-2]").addClass("is-active");

            $(".dojo-video-2").css("opacity", "1");
            $(".dojo-video-3").css("opacity", "0");
            $(".dojo-video-4").css("opacity", "0");
          } else if (self.progress >= 0.5 && self.progress < 0.65) {
            $(".dojo-video-mini").removeClass("is-active");
            $("[dojo-mini-3]").addClass("is-active");

            $(".dojo-info_card").removeClass("is-active");
            $("[dojo-card-3]").addClass("is-active");

            $(".dojo-video-3").css("opacity", "1");
            $(".dojo-video-2").css("opacity", "0");

            $(".dojo-video-4").css("opacity", "0");
          } else if (self.progress >= 0.65) {
            $(".dojo-video-mini").removeClass("is-active");
            $("[dojo-mini-4]").addClass("is-active");

            $(".dojo-info_card").removeClass("is-active");
            $("[dojo-card-4]").addClass("is-active");

            $(".dojo-video-4").css("opacity", "1");
            $(".dojo-video-2").css("opacity", "0");
            $(".dojo-video-3").css("opacity", "0");
          } else {
            // Reset classes if progress is below 12.5%
            $(".dojo-video-mini").removeClass("is-active");
            $("[dojo-mini-1]").addClass("is-active");

            $(".dojo-info_card").removeClass("is-active");
            $("[dojo-card-1]").addClass("is-active");

            $(".dojo-video-2").css("opacity", "0");
            $(".dojo-video-3").css("opacity", "0");
            $(".dojo-video-4").css("opacity", "0");
          }
        },
      },
      ease: "power1.inOut",
    }
  );

  //CLick

  $("[dojo-mini-1]").on("click", function () {
    gsap.to(window, {
      scrollTo: {
        y: "[dojo-anchor-1]",
        offsetY: 0,
      },
      duration: 1,
      ease: "power1.inOut",
    });
  });

  $("[dojo-mini-2]").on("click", function () {
    gsap.to(window, {
      scrollTo: {
        y: "[dojo-anchor-2]",
        offsetY: 0,
      },
      duration: 1,
      ease: "power1.inOut",
    });
  });

  $("[dojo-mini-3]").on("click", function () {
    gsap.to(window, {
      scrollTo: {
        y: "[dojo-anchor-3]",
        offsetY: 0,
      },
      duration: 1,
      ease: "power1.inOut",
    });
  });

  $("[dojo-mini-4]").on("click", function () {
    gsap.to(window, {
      scrollTo: {
        y: "[dojo-anchor-4]",
        offsetY: 0,
      },
      duration: 1,
      ease: "power1.inOut",
    });
  });
});

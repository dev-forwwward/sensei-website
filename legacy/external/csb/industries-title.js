$(document).ready(function () {
  const sentences = [
    "lines",
    "cash",
    "theft",
    "stock-outs",
    "waste",
    "mistakes",
    "mistrust",
    "limits",
    "scanning",
  ];
  let currentSentence = 0;
  let currentIndex = 0;
  let isDeleting = false;
  const typeSpeed = 100; // Speed at which letters are typed
  const deleteSpeed = 50; // Speed at which letters are deleted
  const delay = 1300; // Delay between sentences

  const heroTitle = document.querySelector("[hero-title]");
  if (heroTitle) {
    heroTitle.innerHTML = heroTitle.innerHTML.replace(
      /scanning/,
      "<span change-text>scanning</span>"
    );
  }

  function type() {
    const element = $("[change-text]");

    if (element.length === 0) {
      return;
    }

    const sentence = sentences[currentSentence];
    let displayText = sentence.substring(0, currentIndex);

    element.html(displayText);

    if (!isDeleting && currentIndex < sentence.length) {
      currentIndex++;
      setTimeout(type, typeSpeed);
    } else if (isDeleting && currentIndex > 0) {
      currentIndex--;
      setTimeout(type, deleteSpeed);
    } else if (!isDeleting && currentIndex === sentence.length) {
      isDeleting = true;
      setTimeout(type, delay);
    } else if (isDeleting && currentIndex === 0) {
      isDeleting = false;
      currentSentence = (currentSentence + 1) % sentences.length;
      setTimeout(type, typeSpeed);
    }
  }

  setTimeout(function () {
    type();
  }, 600);
});

class DomUtils {
  scrollBottom(selector) {
    document.querySelector(selector).scrollTo(0, document.querySelector(selector).scrollHeight);
  }

  isScrollEnd(selector) {
    const scrollPosition =
      document.querySelector(selector).scrollTop +
      document.querySelector(selector).offsetHeight;
    return scrollPosition === document.querySelector(selector).scrollHeight;
  }
}

export default new DomUtils();
export default class DomUtils {
    
  static scrollBottom(selector) {
    document.querySelector(selector).scrollTo(0, document.querySelector(selector).scrollHeight);
  }

  static isScrollEnd(selector) {
    const scrollPosition =
      document.querySelector(selector).scrollTop +
      document.querySelector(selector).offsetHeight;
    return scrollPosition === document.querySelector(selector).scrollHeight;
  }
}
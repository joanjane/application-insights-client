export class DomUtils {
  scrollBottom(selector) {
    document.querySelector(selector).scrollTo(0, document.querySelector(selector).scrollHeight);
  }

  isScrollEnd(selector) {
    const scrollPosition =
      document.querySelector(selector).scrollTop +
      document.querySelector(selector).offsetHeight;
    return scrollPosition === document.querySelector(selector).scrollHeight;
  }

  listenViewHeightChanges() {
    function calcViewHeight() {
      const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      document.body.style.height = `${viewHeight}px`;
    }

    calcViewHeight();
    window.addEventListener('onorientationchange', calcViewHeight, true);
    window.addEventListener('resize', calcViewHeight, true);
  }
}
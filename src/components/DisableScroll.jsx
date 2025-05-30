// scrollControl
let scrollTop = 0;
let scrollLeft = 0;

export function DisableScroll() {
  scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

  window.onscroll = function () {
    window.scrollTo(scrollLeft, scrollTop);
  };
}

export function enableScroll() {
  window.onscroll = null;
}

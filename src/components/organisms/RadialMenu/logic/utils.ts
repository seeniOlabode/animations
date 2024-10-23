export const selectAllFrom = (
  selector: string,
  el: HTMLElement
): HTMLElement[] => {
  return Array.from(el.querySelectorAll(selector));
};

export const selectFrom = (selector: string, el: HTMLElement): HTMLElement =>
  el.querySelector(selector);

export const isTouchDevice = (): boolean =>
  matchMedia("(hover: none), (pointer: coarse)").matches;

// Determines if the browser is safari
export const isSafariBrowser = (): boolean => "safari" in window;

export const selectAllFrom = (
  selector: string,
  el: HTMLElement
): HTMLElement[] => {
  return Array.from(el.querySelectorAll(selector));
};

export const selectFrom = (selector: string, el: HTMLElement): HTMLElement =>
  el.querySelector(selector);

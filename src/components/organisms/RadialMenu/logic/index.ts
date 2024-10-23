import { menuItems } from "../RadialMenu";
import { selectAllFrom, selectFrom } from "./utils";

type Coordinates = {
  x: number;
  y: number;
};

export default class RadialMenuLogic {
  private optionHandler: (option: any) => any;
  private el: HTMLElement;
  private boundingRect: DOMRect;
  private anchor: Coordinates;
  private menuItemList: HTMLElement;
  private menuItems: HTMLElement[];
  private outerRing: HTMLElement;
  private lastActiveItem: number;
  private lastRotation: number;
  private mousemoveThreshold: number;

  constructor(el: HTMLElement, optionHandler) {
    this.el = el;
    this.optionHandler = optionHandler;
    this.menuItemList = selectFrom(".radial-menu", this.el);
    this.menuItems = selectAllFrom(".radial-menu-item", this.el);
    this.outerRing = selectFrom(".radial-menu-outer-ring", this.el);
    this.boundingRect = el.getBoundingClientRect();
    this.el.style.display = "none";
    this.mousemoveThreshold = 10;

    // Bind locale functions to instance;
    for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
      if (typeof (this as any)[key] === "function") {
        (this as any)[key] = (this as any)[key].bind(this);
      }
    }

    this._add(window, "mousedown", this._handleMouseDown);
    this._add(window, "touchstart", this._handleMouseDown);
  }

  _handleMouseDown(evt) {
    const { x, y, target } = simplifyEvent(evt);
    const { width, height } = this.boundingRect;

    this.anchor = { x, y };

    const halfWidth = width / 2;
    const halfHeight = height / 2;

    const transX = x - halfWidth;
    const transY = y - halfHeight;

    // element styles
    this.el.style.transform = `translate(${transX}px, ${transY}px) scale(var(--scale))`;
    this.el.style.display = null;
    document.documentElement.style.cursor = "move";
    document.documentElement.style.userSelect = "none";

    this._remove(window, "mousedown", this._handleMouseDown);
    this._remove(window, "touchstart", this._handleMouseDown);

    this._add(window, "mouseup", this._handleMouseUp);
    this._add(window, "touchend", this._handleMouseUp);

    this._add(window, "mousemove", this._handleThresholdMouseMove);
    this._add(window, "touchmove", this._handleThresholdMouseMove);
  }

  _handleMouseUp(evt) {
    if (typeof this.lastActiveItem === "number") {
      this.optionHandler(menuItems[this.lastActiveItem]);
    }
    this.el.classList.add("exit");
    setTimeout(() => {
      this.el.style.display = "none";
      this.el.classList.remove("exit");
    }, 150);
    this.el.dataset.isActive = "false";
    this.outerRing.classList.remove("should-transition");
    this.menuItemList.dataset.activeItem = "";
    this.menuItems.forEach((item) => {
      item.dataset.itemActive = String(false);
    });
    document.documentElement.style.cursor = null;
    document.documentElement.style.userSelect = null;

    this.lastActiveItem = null;
    this._remove(window, "mouseup", this._handleMouseUp);
    this._remove(window, "touchend", this._handleMouseUp);

    this._remove(window, "mousemove", this._handleThresholdMouseMove);
    this._remove(window, "touchmove", this._handleThresholdMouseMove);

    this._remove(window, "mousemove", this._handleMouseMove);
    this._remove(window, "touchmove", this._handleMouseMove);

    this._add(window, "mousedown", this._handleMouseDown);
    this._add(window, "touchstart", this._handleMouseDown);
  }

  _handleThresholdMouseMove(evt) {
    const { x: x1, y: y1 } = this.anchor;
    const { x: x2, y: y2 } = simplifyEvent(evt);

    const { abs } = Math;

    if (
      abs(x2 - x1) >= this.mousemoveThreshold ||
      abs(y2 - y1) >= this.mousemoveThreshold
    ) {
      this._add(window, "mousemove", this._handleMouseMove);
      this._add(window, "touchmove", this._handleMouseMove);

      this._remove(window, "mousemove", this._handleThresholdMouseMove);
      this._remove(window, "touchmove", this._handleThresholdMouseMove);
    }
  }

  _handleMouseMove(evt) {
    const { x: x1, y: y1 } = this.anchor;
    const { x: x2, y: y2 } = simplifyEvent(evt);
    const angle = this.getMouseDirection(x1, y1, x2, y2);

    const targetIndex = this.getTargetItemIndex(angle);

    const ringRotation = (targetIndex - 1.5) * 60;
    const normalizedRotation =
      ringRotation < 0 ? 360 + ringRotation : ringRotation;
    this.highlightItem(targetIndex, normalizedRotation);
  }

  getTargetItemIndex(mouseDirection, numItems = 6) {
    const { floor } = Math;
    const targetIndex = floor(mouseDirection / 60 + 2) % numItems;
    return targetIndex;
  }

  getMouseDirection(x1, y1, x2, y2) {
    let deltaX = x2 - x1;
    let deltaY = y2 - y1;

    // Calculate the angle in radians
    let radians = Math.atan2(deltaY, deltaX);

    // Convert radians to degrees
    let degrees = radians * (180 / Math.PI);

    // Adjust degrees to make 0° at the top (north)
    degrees = (degrees + 90) % 360;

    // Ensure the angle is between 0 and 360 degrees
    if (degrees < 0) {
      degrees += 360;
    }

    return degrees;
  }

  highlightItem(index: number, normalizedRotation) {
    if (this.lastActiveItem === index) return;
    if (typeof index === "number") {
      this.menuItems.forEach((item, i) => {
        item.dataset.itemActive = String(i === index);
      });
      this.el.dataset.isActive = "true";
      this.menuItemList.dataset.activeItem = menuItems[index].name;
      this.el.style.setProperty("--active-degree", `${normalizedRotation}deg`);
      typeof this.lastActiveItem === "number" &&
        this.outerRing.classList.add("should-transition");
      this.lastActiveItem = index;
    } else {
      this.el.dataset.isActive = "false";
    }
  }

  _remove(element: any, event: string, handler: any) {
    element.removeEventListener(event, handler);
  }

  _add(element: any, event: string, handler: any) {
    element.addEventListener(event, handler);
  }

  isWithinRange(num, min, max) {
    return num >= min && num <= max;
  }
}

// utils
export const simplifyEvent = (
  evt: any
): {
  target: HTMLElement;
  x: number;
  y: number;
} => {
  const { clientX, clientY, target } = evt.touches?.[0] ?? evt;
  return { x: clientX, y: clientY, target };
};

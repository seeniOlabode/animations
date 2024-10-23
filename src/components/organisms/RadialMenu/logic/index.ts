import { menuItems } from "../RadialMenu";
import {
  selectAllFrom,
  selectFrom,
  isTouchDevice,
  isSafariBrowser,
} from "./utils";

type Coordinates = {
  x: number;
  y: number;
};

export default class RadialMenuLogic {
  private optionHandler: (option: any) => any;
  private el: HTMLElement;
  private boundingRect: DOMRect;
  private anchor: Coordinates;
  private container: HTMLElement;
  private menuItemList: HTMLElement;
  private menuItems: HTMLElement[];
  private outerRing: HTMLElement;
  private lastActiveItem: number;
  private mousemoveThreshold: number;
  private itemIndexesMap: any;
  private defaultItemIndexesMap: any;
  private addBase: boolean;
  private dropBase: boolean;

  constructor(
    el: HTMLElement,
    optionHandler,
    container: HTMLElement = document.documentElement
  ) {
    this.el = el;
    this.optionHandler = optionHandler;
    this.menuItemList = selectFrom(".radial-menu", this.el);
    this.menuItems = selectAllFrom(".radial-menu-item", this.el);
    this.outerRing = selectFrom(".radial-menu-outer-ring", this.el);
    this.boundingRect = el.getBoundingClientRect();
    this.el.style.display = "none";
    this.mousemoveThreshold = 10;
    this.container = container;

    // Bind locale functions to instance;
    for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
      if (typeof (this as any)[key] === "function") {
        (this as any)[key] = (this as any)[key].bind(this);
      }
    }

    this.setIndexMap();
    this.itemIndexesMap = { ...this.defaultItemIndexesMap };
    this._add(this.container, "mousedown", this._handleMouseDown);
    this._add(this.container, "touchstart", this._handleMouseDown);
  }

  setIndexMap() {
    // prepare indexes map
    this.defaultItemIndexesMap = {};
    menuItems.forEach((item, i) => {
      this.defaultItemIndexesMap[i] = i;
    });
  }

  _handleMouseDown(evt: MouseEvent) {
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

    this._remove(this.container, "mousedown", this._handleMouseDown);
    this._remove(this.container, "touchstart", this._handleMouseDown);

    this._add(window, "mouseup", this._handleMouseUp);
    this._add(window, "touchend", this._handleMouseUp);

    this._add(window, "mousemove", this._handleThresholdMouseMove);
    this._add(window, "touchmove", this._handleThresholdMouseMove);
  }

  _handleMouseUp(evt: MouseEvent | TouchEvent) {
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
    this.itemIndexesMap = { ...this.defaultItemIndexesMap };
    this.dropBase = false;
    this.addBase = false;
    this._remove(window, "mouseup", this._handleMouseUp);
    this._remove(window, "touchend", this._handleMouseUp);

    this._remove(window, "mousemove", this._handleThresholdMouseMove);
    this._remove(window, "touchmove", this._handleThresholdMouseMove);

    this._remove(window, "mousemove", this._handleMouseMove);
    this._remove(window, "touchmove", this._handleMouseMove);

    this._add(this.container, "mousedown", this._handleMouseDown);
    this._add(this.container, "touchstart", this._handleMouseDown);
  }

  _handleThresholdMouseMove(evt: MouseEvent | TouchEvent) {
    if (isTouchDevice() || isSafariBrowser()) {
      evt.preventDefault();
    }
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

  _handleMouseMove(evt: MouseEvent | TouchEvent) {
    if (isTouchDevice() || isSafariBrowser()) {
      evt.preventDefault();
    }
    const { x: x1, y: y1 } = this.anchor;
    const { x: x2, y: y2 } = simplifyEvent(evt);
    const angle = this.getMouseDirection(x1, y1, x2, y2);

    const targetIndex = this.getTargetItemIndex(angle);

    this.highlightItem(targetIndex);
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

  highlightItem(index: number) {
    if (this.lastActiveItem === index) return;

    if (typeof index === "number") {
      this.menuItems.forEach((item, i) => {
        item.dataset.itemActive = String(i === index);
      });
      this.el.dataset.isActive = "true";
      this.menuItemList.dataset.activeItem = menuItems[index].name;
      typeof this.lastActiveItem === "number" &&
        this.outerRing.classList.add("should-transition");
      this.highlightRing(index);
      this.lastActiveItem = index;
    } else {
      this.el.dataset.isActive = "false";
    }
  }

  highlightRing(targetIndex) {
    // the following piece of haram code ensures that the radial menu can go in an endless cycle
    if (this.dropBase) {
      this.dropBase = false;
      if (targetIndex === 4 || targetIndex === 5) {
        this.itemIndexesMap[0] = this.itemIndexesMap[0] - menuItems.length;
        this.itemIndexesMap[1] = this.itemIndexesMap[1] - menuItems.length;
        this.itemIndexesMap[2] = this.itemIndexesMap[2] - menuItems.length;
        this.itemIndexesMap[3] = this.itemIndexesMap[3] - menuItems.length;
      } else {
        this.itemIndexesMap[4] = this.itemIndexesMap[4] + menuItems.length;
        this.itemIndexesMap[5] = this.itemIndexesMap[5] + menuItems.length;
      }
    } else if (this.addBase) {
      this.addBase = false;
      if (targetIndex === 0 || targetIndex === 1) {
        this.itemIndexesMap[2] = this.itemIndexesMap[2] + menuItems.length;
        this.itemIndexesMap[3] = this.itemIndexesMap[3] + menuItems.length;
        this.itemIndexesMap[4] = this.itemIndexesMap[4] + menuItems.length;
        this.itemIndexesMap[5] = this.itemIndexesMap[5] + menuItems.length;
      } else {
        this.itemIndexesMap[0] = this.itemIndexesMap[0] - menuItems.length;
        this.itemIndexesMap[1] = this.itemIndexesMap[1] - menuItems.length;
      }
    }

    if (targetIndex === 0 || targetIndex === 1) {
      this.dropBase = true;
      this.itemIndexesMap[4] = this.itemIndexesMap[4] - menuItems.length;
      this.itemIndexesMap[5] = this.itemIndexesMap[5] - menuItems.length;
    } else if (targetIndex === 5 || targetIndex === 4) {
      this.addBase = true;
      this.itemIndexesMap[0] = this.itemIndexesMap[0] + menuItems.length;
      this.itemIndexesMap[1] = this.itemIndexesMap[1] + menuItems.length;
    }

    targetIndex = this.itemIndexesMap[targetIndex];
    const rotation = (targetIndex - 1.5) * 60;
    this.el.style.setProperty("--active-degree", `${rotation}deg`);
  }

  _remove(element: any, event: string, handler: any) {
    element.removeEventListener(event, handler);
  }

  _add(element: any, event: string, handler: any) {
    element.addEventListener(event, handler, { passive: false });
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

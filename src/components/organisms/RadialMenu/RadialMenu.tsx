import { useEffect, useLayoutEffect, useRef } from "react";
import "./RadialMenu.scss";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  TrashIcon,
  ReloadIcon,
  MagicWandIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";

import RadialMenuLogic from "./logic";

import { toast } from "sonner";

type MenuItem = {
  name: string;
  icon: any;
};

export const menuItems: MenuItem[] = [
  {
    name: "Back",
    icon: <ArrowLeftIcon />,
  },
  {
    name: "Trash",
    icon: <TrashIcon />,
  },
  {
    name: "Search",
    icon: <MagnifyingGlassIcon />,
  },
  {
    name: "Forward",
    icon: <ArrowRightIcon />,
  },
  {
    name: "Magic",
    icon: <MagicWandIcon />,
  },
  {
    name: "Reload",
    icon: <ReloadIcon />,
  },
];

export default function RadialMenu() {
  const radialMenuContainer = useRef(null);

  function handleOptionSelect(option) {
    toast.message(`${option.name} selected`, {
      description: "This is a demo, the option has no effects",
    });
  }

  useLayoutEffect(() => {
    if (radialMenuContainer.current) {
      const RadialMenu = new RadialMenuLogic(
        radialMenuContainer.current,
        handleOptionSelect
      );
    }
  });

  return (
    <div
      className="radial-menu-container"
      ref={radialMenuContainer}
      data-is-active="false"
    >
      <div className="radial-menu-outer-ring"></div>
      <ul className="radial-menu" data-active-item="forward">
        {menuItems.map(({ name, icon }, i) => (
          <li className="radial-menu-item" data-item-active="false">
            <span className="slice">{icon}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

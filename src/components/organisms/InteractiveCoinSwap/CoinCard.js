import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  DotFilledIcon,
  InfoCircledIcon,
  DragHandleDots2Icon,
} from "@radix-ui/react-icons";
import { ReactComponent as Swap } from "@/assets/icons/swap.svg";
import "./CoinCard.css";

import { ReactComponent as Bitcoin } from "@/assets/crypto-logos/bitcoin.svg";
import { motion, useDragControls } from "framer-motion";

const MotionCard = motion.create(Card);

const coinIcons = {
  btc: <Bitcoin className="h-4 w-4" />,
};

function SwapLink() {
  return (
    <div className="rounded-full h-14 w-14 flex items-center justify-center bg-slate-100 border-slate-100 border cursor-pointer">
      <span className="rounded-full border border-slate-200 h-10 w-10 flex items-center justify-center bg-white">
        <Swap className="rotate-90" />
      </span>
    </div>
  );
}

export function CoinCard({ name, source }) {
  const [value, setValue] = useState(0);
  const dragControls = useDragControls();

  function startDrag(event) {
    dragControls.start(event, { snapToCursor: true });
  }

  function handleValueChange(e) {
    setValue(e.target.value);
  }
  return (
    <div className="relative">
      <MotionCard
        drag
        className="w-80 border-slate-200 shadow-none rounded-2xl"
        dragElastic={0.2}
        dragSnapToOrigin
        dragControls={dragControls}
        dragListener={false}
      >
        <CardHeader className="p-1">
          <span
            className="h-10 w-10 absolute flex pl-2 pt-2 cursor-grab active:cursor-grabbing"
            onDrag={startDrag}
          >
            <DragHandleDots2Icon color="#94a3b8" />
          </span>
          <span className="flex items-center gap-1 border p-1 pr-2 rounded-full border-slate-200 w-fit ml-auto">
            {coinIcons[name.toLowerCase()]}
            <span className="font-bold text-xs geist-500">{name}</span>
          </span>
        </CardHeader>

        <CardContent className="p-1 shadow-none">
          <Label
            htmlFor="value"
            className="pl-3 text-xs geist-400 text-slate-400 mb-1 block"
          >
            Swap from
          </Label>
          <Input
            className="border-none shadow-none focus-within:border-none focus:border-none focus-visible:border-none focus-visible:ring-0 text-3xl font-700 geist-500 text-slate-950/90 text-slate-950"
            type="number"
            value={value}
            onChange={handleValueChange}
            id="value"
            placeholder="Enter an amount"
          />
        </CardContent>

        {source ? (
          <CardFooter className="rounded-b-2xl border-t border-t-slate-200 flex items-center p-2">
            <span className="text-xs text-slate-400 geist-500 flex gap-1 items-center">
              <span>79.7053 {name} available</span>
            </span>

            <span className="flex items-center gap-[2px] border p-[2px] px-2 rounded-full border-slate-200 w-fit ml-auto">
              <span className="font-bold text-xs geist-400 uppercase">MAX</span>
            </span>
          </CardFooter>
        ) : (
          <CardFooter className="bg-slate-100 rounded-b-2xl border-t border-t-slate-200 flex items-center p-2">
            <span className="text-xs text-slate-400 geist-500 flex gap-1 items-center">
              <span>Estimated Fee: $3.78</span>
              <InfoCircledIcon />
            </span>

            <span className="flex items-center gap-[2px] border p-1 pr-2 rounded-full border-slate-200 w-fit ml-auto">
              <DotFilledIcon color="#5BBA6F" />
              <span className="font-bold text-xs geist-400 uppercase">
                Fast
              </span>
            </span>
          </CardFooter>
        )}
      </MotionCard>

      {source ? (
        <div className="absolute left-0 right-0 flex justify-center z-10 translate-y-[-40%]">
          <SwapLink />
        </div>
      ) : null}
    </div>
  );
}

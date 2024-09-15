import React from "react";
import "./InteractiveCoinSwap.css";

import { CoinCard } from "./CoinCard";

const coins = [
  { name: "BTC", source: true },
  { name: "BTC", source: false },
];

export default function InteractiveCoinSwap() {
  return (
    <div className="h-screen w-screen flex items-center justify-center flex-col gap-2 bg-slate-100">
      {coins.map((coin, i) => {
        return (
          <CoinCard name={coin.name} key={coin.name + i} source={coin.source} />
        );
      })}
    </div>
  );
}

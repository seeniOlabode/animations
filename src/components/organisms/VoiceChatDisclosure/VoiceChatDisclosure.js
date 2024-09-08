import React from "react";

import "./VoiceChatDisclosure.css";

import { Button } from "../../ui/button";
import { Cross1Icon, ChevronDownIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { motion, AnimatePresence } from "framer-motion";

import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useState, useEffect } from "react";

const MotionCard = motion.create(Card);
const MotionCardHeader = motion.create(CardHeader);
const MotionCardContent = motion.create(CardContent);
const MotionCardFooter = motion.create(CardFooter);
const MotionAvatar = motion.create(Avatar);
const MotionButton = motion.create(Button);
const MotionAvatarImage = motion.create(AvatarImage);
const MotionAvatarFallback = motion.create(AvatarFallback);
const MotionCross1Icon = motion.create(Cross1Icon);

const ChatMembers = [
  { image: "https://github.com/shadcn.png", fallback: "OG", name: "Oguz" },
  {
    image: "https://github.com/seeniolabode.png",
    fallback: "SO",
    name: "Seeni",
  },
  { image: "https://github.com/michael.png", fallback: "MC", name: "Michael" },
  { image: "https://github.com/john.png", fallback: "JN", name: "John" },
  { image: "https://github.com/bad.png", fallback: "DM", name: "Dom" },
  { image: "https://github.com/chris.png", fallback: "CH", name: "Chris" },
  { image: "https://github.com/Khaleel.png", fallback: "CN", name: "Khaleel" },
];

const SoundVisualizer = React.forwardRef(
  ({ sizeMatters, childSizeMatters, colorTheme = "dark", className }, ref) => {
    return (
      <motion.span
        ref={ref}
        layout
        className={
          "aspect-square rounded-full flex items-center justify-between z-10 absolute " +
          `${
            colorTheme === "dark" ? "bg-black" : "bg-white border shadow-sm"
          } ` +
          `${
            sizeMatters || "w-[35px] h-[35px] px-[8px] -top-[10px] -left-[10px]"
          } ` +
          className
        }
      >
        {[1, 2, 3, 4].map((num, i) => {
          return (
            <motion.span
              key={i + "visualizer"}
              layout
              className={
                "visualizer-stick rounded-full" +
                " " +
                `${
                  colorTheme === "dark"
                    ? "bg-white"
                    : "bg-[rgba(90,95,101)] opacity-70"
                } ` +
                `${childSizeMatters || "w-[2.5px] h-[15px]"}`
              }
              style={{ "--index": i }}
            ></motion.span>
          );
        })}
      </motion.span>
    );
  }
);

const MotionSoundVisualizer = motion.create(SoundVisualizer);

export default function VoiceChatDisclosure() {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setExpanded(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function toggleExpanded() {
    setExpanded((oldValue) => !oldValue);
  }

  function joinChat() {
    toggleExpanded();
    toast.message("You joined the chat", {
      description: "This is a demo component, you were not added to any chat",
    });
  }

  return (
    <AnimatePresence mode="wait">
      {expanded ? (
        <MotionCard
          style={{ borderRadius: 12 }}
          className="w-[250px] min-w-[250px] p-0"
          layoutId="disclosure-wrapper"
          initial={{ filter: "blur(2px)", borderRadius: 40 }}
          animate={{ filter: "blur(0px)", borderRadius: 12 }}
          key="expanded"
        >
          <AnimatePresence mode="sync">
            <MotionCardHeader
              layout
              className="border-b h-10 py-0 flex items-center justify-center overflow-hidden rounded-[var(--radius)] rounded-b-none bg-[rgb(245,245,249)] overflow relative p-[3]"
              key="card-header"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.25 } }}
              exit={{
                opacity: 1,
                transition: { type: "tween", duration: 0 },
              }}
            >
              <CardTitle className="text-base font-medium text-[rgb(126,124,134)] opacity-60">
                Voice Chat
              </CardTitle>

              <MotionButton
                variant="outline"
                size="icon"
                className="absolute right-[5px] rounded-full bg-[rgb(239,237,247)] h-[30px] w-[30px] !m-0"
                onClick={toggleExpanded}
              >
                <MotionCross1Icon
                  layout
                  color="rgb(166,166,175)"
                  overlineThickness={10}
                />
              </MotionButton>
            </MotionCardHeader>
          </AnimatePresence>

          <MotionCardContent layout className="p-2 pt-3">
            <div className="grid grid-cols-4 gap-3 gap-y-8 place-items-center">
              {ChatMembers.map((member, i) => {
                return (
                  <MotionAvatar
                    layoutId={`layout-${member.fallback}`}
                    className="p-[2px] border rounded-full w-[40px] h-[40px] shadow-sm overflow-visible origin-center relative"
                    initial={
                      i > 3 ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }
                    }
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: 0.15 },
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {[0, 5].includes(i) ? (
                        <MotionSoundVisualizer
                          key="visualizer"
                          colorTheme="light"
                          layout
                          sizeMatters="w-[20px] h-[20px] -top-[8px] -right-[8px] p-[4px] origin-bottom-left"
                          childSizeMatters="w-[1.5px] h-[8px]"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1, transition: { delay: 0.25 } }}
                          style={{ "--small-height": "3px" }}
                        />
                      ) : null}
                    </AnimatePresence>
                    <AvatarImage
                      src={member.image}
                      className="rounded-full h-full w-full object-cover"
                    />
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        transition: { delay: 0.3 },
                      }}
                      key={member.fallback + "name"}
                      className="absolute -bottom-5 mt-6 text-xs left-0 right-0 text-center text-[rgb(118,118,122)]"
                    >
                      {member.name}
                    </motion.span>
                  </MotionAvatar>
                );
              })}
            </div>
          </MotionCardContent>
          <MotionCardFooter layout className="flex flex-col mt-2 p-2 py-3 pt-4">
            <MotionButton
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { delay: 0.25 } }}
              transition={{ type: "spring", bounce: 0 }}
              className="w-full"
              onClick={joinChat}
            >
              Join Now
            </MotionButton>
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 0.4, transition: { delay: 0.3 } }}
              className="text-xs mt-2 text-[var(--muted)] opacity-40"
              transition={{ type: "spring", bounce: 0 }}
            >
              Mic will be muted initially.
            </motion.p>
          </MotionCardFooter>
        </MotionCard>
      ) : (
        <motion.div
          className="flex border py-4 px-2 shadow items-center h-[60px] cursor-pointer w-[250px] min-w-[250px] relative"
          onClick={toggleExpanded}
          layoutId="disclosure-wrapper"
          style={{ borderRadius: 40 }}
          initial={{ borderRadius: 12 }}
          animate={{ borderRadius: 40 }}
          key="closed-btn"
        >
          <MotionSoundVisualizer
            key="visualizer"
            layout
            initial={{ x: 30, opacity: 0, scale: 0, y: 20 }}
            animate={{
              x: 0,
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { delay: 0.1 },
            }}
          />
          {ChatMembers.slice(0, 4).map((member, i) => {
            return (
              <MotionAvatar
                layoutId={`layout-${member.fallback}`}
                className={
                  "p-[1px] border rounded-full w-[40px] h-[40px] shadow-sm overflow-visible bg-white relative" +
                  `order-[${i}] avatar-el`
                }
                style={{ "--index": i }}
              >
                <MotionAvatarImage
                  layout
                  src={member.image}
                  className="rounded-full"
                />
              </MotionAvatar>
            );
          })}
          <MotionButton
            variant="ghost"
            className="flex gap-1 pr-1 pointer-events-none ml-auto"
            layout
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 0.15 } }}
          >
            <span className="text-sm font-normal text-[rgb(151,149,159)] ">
              +3
            </span>
            <ChevronDownIcon color="rgb(151,149,159)" />
          </MotionButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

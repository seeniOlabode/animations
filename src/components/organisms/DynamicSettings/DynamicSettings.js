import "./DynamicSettings.css";

import { useEffect, useRef, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Cross1Icon,
  SquareIcon,
  ViewHorizontalIcon,
  MagicWandIcon,
  BoxIcon,
  AspectRatioIcon,
} from "@radix-ui/react-icons";
import { Button } from "../../ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { motion, AnimatePresence } from "framer-motion";

import { toast } from "sonner";

const MotionButton = motion.create(Button);
const MotionCross1Icon = motion.create(Cross1Icon);
const MotionTabsList = motion.create(TabsList);
const MotionTabsTrigger = motion.create(TabsTrigger);
const MotionTabs = motion.create(Tabs);
const MotionTextarea = motion.create(Textarea);
const MotionRadioGroup = motion.create(RadioGroup);

const tabs = ["Dimensions", "Aspect Ratio", "Prompt"];
const ratios = [
  { text: "1:1", icon: <SquareIcon /> },
  { text: "16:9", icon: <ViewHorizontalIcon /> },
  { text: "21:9", icon: <AspectRatioIcon /> },
  { text: "3:4", icon: <BoxIcon /> },
  { text: "4:3", icon: <BoxIcon /> },
  { text: "Custom", icon: <MagicWandIcon /> },
];

export default function DynamicSettings() {
  const [dimensions, setDimensions] = useState([
    { title: "Vertical", value: 50 },
    { title: "Horizontal", value: 50 },
    { title: "Upscale", value: 50 },
  ]);
  const [prompt, setPrompt] = useState("");

  const [tabsExpanded, setTabsExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const elementRef = useRef(null);

  // const settingsRef = useRef(null);
  // useOnClickOutside(settingsRef, () => toggleTabsExpanded());

  useEffect(() => {
    let once = false;
    if (tabsExpanded) {
      const observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const rect = entry.target.getBoundingClientRect();
          if (once) {
            setHeight(rect.height);
          } else {
            once = true;
          }
        }
      });

      if (elementRef.current) {
        observer.observe(elementRef.current);
      }

      return () => observer.disconnect();
    } else {
      setHeight(0);
    }
  }, [tabsExpanded]);

  function toggleTabsExpanded() {
    setTabsExpanded((oldValue) => !oldValue);
  }

  function setSingleDimension(index, value) {
    setDimensions((oldDimensions) => {
      const newArray = Array.from(oldDimensions);
      newArray[index].value = value;
      return newArray;
    });
  }

  function applyStyles() {
    toggleTabsExpanded();
    toast.message("Styles have been applied", {
      description: "This is a demo component, no styles were actually applied",
    });
  }

  function handlePromptChanges(value) {
    setPrompt(value);
  }

  return (
    <AnimatePresence mode="popLayout">
      {tabsExpanded ? (
        <motion.div
          layoutId="dynamic-wrapper"
          className="bg-white border rounded-lg shadow-muted overflow-hidden"
          style={{ borderRadius: "var(--radius)" }}
          key={"dynamic-wrapper" + tabsExpanded}
          initial={{ filter: "blur(10px)" }}
          animate={{ filter: "blur(0px)" }}
          // ref={settingsRef}
        >
          <MotionTabs
            defaultValue="dimensions"
            className="w-[350px] rounded-lg p-1 pb-1"
          >
            <MotionTabsList
              layout
              className="bg-transparent p-0 w-full h-[32px]"
            >
              <AnimatePresence>
                {tabs.map((tab, i) => {
                  return (
                    <MotionTabsTrigger
                      value={tab.toLowerCase()}
                      className="h-[32px] relative tab-trigger rounded-md !shadow-none text-sm"
                      key={tab + tabsExpanded}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{
                        x: 0,
                        opacity: 1,
                        transition: { delay: i * 0.04 },
                      }}
                      exit={{ x: 20, opacity: 0 }}
                    >
                      {tab}
                      <motion.span
                        layoutId="trigger-highlight"
                        className="top-0 left-0 right-0 bottom-0 absolute bg-slate-900 bg-opacity-[0.04] hidden rounded-md"
                      ></motion.span>
                    </MotionTabsTrigger>
                  );
                })}
              </AnimatePresence>

              <Button
                size="outline"
                variant="ghost"
                className="ml-auto w-[40px] h-[40px] close-button"
                onClick={toggleTabsExpanded}
              >
                <MotionCross1Icon
                  layoutId="toggle-icon"
                  color="#020617"
                  initial={{ rotate: 45 }}
                  animate={{ rotate: 0 }}
                  className="rotate-0"
                />
              </Button>
            </MotionTabsList>
            <AnimatePresence>
              <motion.div
                animate={{
                  height: height && tabsExpanded ? height : null,
                }}
                className="px-2"
              >
                <div ref={elementRef}>
                  <TabsContent value="dimensions" className="p-2">
                    <ul className="flex flex-col gap-3">
                      {dimensions.map((setting, index) => {
                        return (
                          <motion.li
                            initial={{ opacity: 0, y: 20 }}
                            animate={{
                              opacity: 0.85,
                              y: 0,
                              transition: { delay: 0.15 + 0.1 * index },
                            }}
                            exit={{
                              opacity: 0,
                              y: 20,
                              transition: { delay: 0.1 + 0.07 * index },
                            }}
                            className="flex w-full items-center justify-between opacity-85 hover:opacity-100 focus-within:opacity-100 dimension-item"
                            key={setting.title}
                          >
                            <label className="text-muted-foreground font-normal text-sm">
                              {setting.title}
                            </label>
                            <div className="flex w-full gap-2 justify-end">
                              <span className="bg-slate-900 bg-opacity-[0.1] h-[28px] w-[46px] flex items-center justify-center text-sm rounded-sm opacity-70">
                                {setting.value}
                              </span>
                              <Slider
                                className="w-[100px]"
                                defaultValue={[setting.value]}
                                max={100}
                                step={1}
                                onValueChange={(value) => {
                                  setSingleDimension(index, value);
                                }}
                              />
                            </div>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </TabsContent>
                  <TabsContent value="aspect ratio" className="mb-3">
                    <MotionRadioGroup
                      defaultValue="1:1"
                      className="flex flex-wrap"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.1 } }}
                    >
                      {ratios.map((ratio, i) => {
                        return (
                          <div
                            className="flex w-full justify-start h-[32px] basis-1/4"
                            key={ratio.text}
                          >
                            <RadioGroupItem
                              id={ratio.text}
                              value={ratio.text}
                              className="w-0 h-0 absolute invisible custom-radio-item"
                            />
                            <Label
                              htmlFor={ratio.text}
                              className="flex gap-1 items-center h-full text-xs text-muted-foreground hover:bg-primary/10 w-full px-[12px] rounded-[4px] cursor-pointer"
                            >
                              {ratio.icon}
                              {ratio.text}
                            </Label>
                          </div>
                        );
                      })}
                    </MotionRadioGroup>
                  </TabsContent>
                  <TabsContent value="prompt">
                    <MotionTextarea
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.1 } }}
                      className="resize-none min-h-[100px] text-base sm:text-sm"
                      placeholder="Add a new prompt"
                      value={prompt}
                      onInput={(e) => handlePromptChanges(e.target.value)}
                    />
                  </TabsContent>
                </div>
              </motion.div>
            </AnimatePresence>

            <motion.div
              layout
              className="tabs-footer px-2 pb-2 flex justify-between mt-2 items-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { delay: 0.4 } }}
              key="tabs-footer"
            >
              <div className="flex gap-1 items-center ml-2">
                <span className="h-[6px] w-[6px] rounded-full bg-slate-950"></span>
                <span className="text-xs text-muted-foreground font-normal">
                  Changes
                </span>
              </div>
              <MotionButton
                className="bg-slate-950 font-xs font-normal"
                onClick={applyStyles}
              >
                Apply Changes
              </MotionButton>
            </motion.div>
          </MotionTabs>
        </motion.div>
      ) : (
        <motion.div
          layoutId="dynamic-wrapper"
          style={{ borderRadius: 14 }}
          className="h-[52px] border overflow-hidden add-style"
          key={"addStyle" + tabsExpanded}
          initial={{ filter: "blur(10px)" }}
          animate={{ filter: "blur(0px)" }}
        >
          <MotionButton
            onClick={toggleTabsExpanded}
            className="h-full w-full glex gap-3 hover:bg-transparent"
            variant={"ghost"}
            layout
          >
            Add Style
            <MotionCross1Icon
              layoutId="toggle-icon"
              color="#020617"
              initial={{ rotate: 0 }}
              animate={{ rotate: 45 }}
            />
          </MotionButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

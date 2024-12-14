"use client";

import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import { EraserIcon, PenLine } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Slider } from "../ui/slider";


interface IconContainerProps {
    color: string;
    setColor: (color: string) => void;
    clear: () => void;
    penSize: number;
    setPenSize: (penSize: number) => void;
}

export function FloatingDockDemo(
    {color="#FFFFFF", setColor, clear, penSize, setPenSize}: IconContainerProps
) {
  const links = [
    {
      title: "Clear",
      icon: (
        <EraserIcon onClick={clear} className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      func: clear,
    },
    {
      title: "Color",
      icon: (
        <Popover>
            <PopoverTrigger asChild>
                <div className="h-full w-full text-neutral-500 dark:text-neutral-300 rounded-full" style={{background: color}}/>
            </PopoverTrigger>
            <PopoverContent asChild>
                <HexColorPicker color={color} onChange={setColor} />
            </PopoverContent>
        </Popover>
      ),
    },
    {
      title: "Pen Size",
      icon: (
        <Popover>
            <PopoverTrigger asChild>
                <PenLine className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            </PopoverTrigger>
            <PopoverContent asChild>
                <Slider defaultValue={[penSize]} min={1} max={10} step={1} onValueChange={(val) => setPenSize(val[0]) } />
            </PopoverContent>
        </Popover>
      ),
      href: "#",
    },
  ];
  return (
    <div className="flex items-center justify-center absolute bottom-1 left-1/2 -translate-x-1/2">
      <FloatingDock
        items={links}
      />
    </div>
  );
}

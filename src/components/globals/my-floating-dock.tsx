"use client";

import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconBrandGithub,
  IconColorPicker,
  IconColorSwatch,
  IconTextColor,
} from "@tabler/icons-react";
import Image from "next/image";
import { EraserIcon, PenLine } from "lucide-react";
import { HexColorInput, HexColorPicker, RgbaColorPicker } from "react-colorful";


interface IconContainerProps {
    color: string;
    setColor: (color: string) => void;
    clear: () => void
}

export function FloatingDockDemo(
    {color="#FFFFFF", setColor, clear}: IconContainerProps
) {
    console.log(color);
  const links = [
    {
      title: "Clear",
      icon: (
        <EraserIcon onClick={clear} className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
    },
    {
      title: "Color",
      icon: (
        <div className={`h-full w-full text-neutral-500 dark:text-neutral-300 rounded-full`} style={{background: color}}>
         
        </div>
      ),
      href: "#",
    },
    {
      title: "Pen Size",
      icon: (
        <PenLine className="h-full w-full text-neutral-500 dark:text-neutral-300" />
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

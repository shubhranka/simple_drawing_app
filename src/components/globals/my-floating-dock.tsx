"use client";

import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import { EraserIcon, PenLine } from "lucide-react";


interface IconContainerProps {
    color: string;
    setColor: (color: string) => void;
    clear: () => void
}

export function FloatingDockDemo(
    {color="#FFFFFF", setColor, clear}: IconContainerProps
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
        <div className={`h-full w-full text-neutral-500 dark:text-neutral-300 rounded-full`} style={{background: color}}>
         
        </div>
      ),
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

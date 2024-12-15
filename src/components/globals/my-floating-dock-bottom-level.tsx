"use client";

import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import Image from "next/image";


interface IconContainerProps {
    level: "easy" | "medium" | "hard";
    setLevel: (level: "easy" | "medium" | "hard") => void;

}

export function FloatingDockBottomLevel(
    {
      level="medium",
      setLevel
    }: IconContainerProps
) {
  const links = [
    {
      title: "Easy",
      icon: (
        <Image src="/png/easy.png" alt="Easy" width={100} height={100} className="brightness-1 invert" onClick={() => setLevel("easy")}  />
      ),
      background: level === "easy" ? "bg-slate-700" : "bg-neutral-800",
    },
    {
      title: "Medium",
      icon: (
        <Image src="/png/medium.png" alt="Medium" width={100} height={100} className="brightness-1 invert" onClick={() => setLevel("medium")}  />
      ),
      background: level === "medium" ? "bg-slate-700" : "bg-neutral-800",
    },
    {
      title: "Hard",
      icon: (
        <Image src="/png/hard.png" alt="Hard" width={100} height={100} className="brightness-1 invert" onClick={() => setLevel("hard")}  />
      ),
      background: level === "hard" ? "bg-slate-700" : "bg-neutral-800",
    },
  ];
  return (
    <div className="flex items-center justify-center">
      <FloatingDock
        items={links}
      />
    </div>
  );
}

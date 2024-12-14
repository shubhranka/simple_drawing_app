"use client";
import React from "react";
import { SparklesCore } from "../ui/sparkles";

interface SparklesProps {
    text: string;
    width?: number;
    height?: number;
}

export function SparklesPreview(
  { text }: SparklesProps
) {
  return (
    <div className="bg-black flex flex-col items-center justify-center overflow-hidden rounded-md absolute top-5 left-5">
      <h1 className="md:text-xl text-2xl lg:text-3xl font-bold text-center text-white relative z-20">
        {text}
      </h1>
      <div className="w-[5rem] h-10 relative">
        {/* Gradients */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-10 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-10" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-10 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-10" />

        {/* Core component */}
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />

        {/* Radial Gradient to prevent sharp edges */}
        <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div>
    </div>
  );
}

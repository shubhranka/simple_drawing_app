import Canvas from "./_components/canvas";
import {SparklesPreview} from "@/components/globals/sparkles-preview";

export default function Home() {
  return (
    <main className="relative">
      <SparklesPreview text="Draw it" />
      <Canvas  />
    </main>
  )
}

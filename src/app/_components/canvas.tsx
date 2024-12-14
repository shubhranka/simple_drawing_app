"use client";

import { FloatingDockDemo } from "@/components/globals/my-floating-dock";
import React, { useState } from "react";

export default function Canvas() {

    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPoint, setLastPoint] = useState<number[]>([0,0]);
    // const [points, setPoints] = useState<number[][]>([]);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [color, setColor] = useState("#FFFFFF");
    const [penSize, setPenSize] = useState(3);

    const clearCanvas = () => {
        if(!ctx) return;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // setPoints([]);
    }


    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        context.fillStyle = "black";
        context.fillRect(0, 0, canvas.width, canvas.height);
        setCtx(context);
    }, []);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        if ((e as React.TouchEvent).touches) {
            setLastPoint([(e as React.TouchEvent).touches[0].clientX, (e as React.TouchEvent).touches[0].clientY]);
        }else{
            setLastPoint([(e as React.MouseEvent).nativeEvent.offsetX, (e as React.MouseEvent).nativeEvent.offsetY]);       
        }
        if(!ctx) return;
        // ctx.fillStyle = "white";
        ctx.strokeStyle = color;
        ctx.lineWidth = penSize;
    }

    const stopDrawing = () => {
        setIsDrawing(false);
    }

    const draw = (e: React.MouseEvent | React.TouchEvent) => {

        // console.log(e.touches[0].clientX, e.touches[0].clientY);

        let currentPoint = [0,0];
        if (!isDrawing) return;

        if ((e as React.TouchEvent).touches) {

            currentPoint = [(e as React.TouchEvent).touches[0].clientX, (e as React.TouchEvent).touches[0].clientY];
        }else{
            currentPoint = [(e as React.MouseEvent).nativeEvent.offsetX, (e as React.MouseEvent).nativeEvent.offsetY];
        }

        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(lastPoint[0], lastPoint[1]);
            ctx.lineTo(currentPoint[0], currentPoint[1]);
            ctx.stroke();
            setLastPoint(currentPoint);
            // setPoints([...points, currentPoint]);
        }
    }

    const throttle = (callback: (e: React.MouseEvent | React.TouchEvent) => void, delay: number) => {
        let shouldWait = false;
        // let timeout: NodeJS.Timeout | null = null;

        return (e: React.MouseEvent | React.TouchEvent) => {
          if (shouldWait) return;

          shouldWait = true;
          setTimeout(() => {
            callback(e);
            shouldWait = false;
          }, delay);
        };
      };    

    const throttledDraw = throttle(draw, 100);

    


    return <>
    <canvas ref={canvasRef} className="w-full h-full" onTouchStart={startDrawing} onTouchMove={throttledDraw} onTouchEnd={stopDrawing} onMouseDown={startDrawing} onMouseUp={stopDrawing} onMouseMove={draw} />
    <FloatingDockDemo clear={clearCanvas} setColor={setColor} color={color} setPenSize={setPenSize} penSize={penSize}/>
    </>
}
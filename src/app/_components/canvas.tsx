"use client";

import { FloatingDockDemo } from "@/components/globals/my-floating-dock";
import React, { useState } from "react";

export default function Canvas() {

    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPoint, setLastPoint] = useState<number[]>([0,0]);
    const [points, setPoints] = useState<number[][]>([]);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    const clearCanvas = () => {
        if(!ctx) return;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        setPoints([]);
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


    const startDrawing = (e: React.MouseEvent) => {
        setIsDrawing(true);
        setLastPoint([e.nativeEvent.offsetX, e.nativeEvent.offsetY]);       
        if(!ctx) return;
        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";
    }

    const stopDrawing = () => {
        setIsDrawing(false);
    }

    const draw = (e: React.MouseEvent) => {
        if (!isDrawing) return;

        const currentPoint = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];

        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(lastPoint[0], lastPoint[1]);
            ctx.lineTo(currentPoint[0], currentPoint[1]);
            ctx.stroke();
            setLastPoint(currentPoint);
            setPoints([...points, currentPoint]);
        }

    }


    return <>
    <canvas ref={canvasRef} className="w-full h-full" onMouseDown={startDrawing} onMouseUp={stopDrawing} onMouseMove={draw} />
    <FloatingDockDemo clear={clearCanvas} />
    </>
}
"use client";

import { FloatingDockDemo } from "@/components/globals/my-floating-dock";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardContent, CardDescription, CardTitle, CardHeader } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader2, SplitIcon } from "lucide-react";
import React, { useState } from "react";

class Confetti {
    x: number;
    y: number;
    color: string;
    speed: number;
    angle: number;
    rotationSpeed: number;
    rotation: number;
    size: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.color = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'][Math.floor(Math.random() * 6)];
        this.speed = Math.random() * 5 + 2;
        this.angle = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
        this.rotation = Math.random() * Math.PI * 2;
        this.size = Math.random() * 10 + 5;
    }

    update() {
        this.y += Math.sin(this.angle) * this.speed;
        this.x += Math.cos(this.angle) * this.speed;
        this.rotation += this.rotationSpeed;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

export default function Canvas() {

    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPoint, setLastPoint] = useState<number[]>([0, 0]);
    // const [points, setPoints] = useState<number[][]>([]);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [color, setColor] = useState("#FFFFFF");
    const [penSize, setPenSize] = useState(3);

    const [thing, setThing] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    const [alreadyGivenThings, setAlreadyGivenThings] = useState<string[]>([]);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [checkLoading, setCheckLoading] = useState<boolean>(false);
    let animationFrameId: number | null = null;
    let confetti: Confetti[] = [];
    let drawingData: ImageData | undefined = undefined;

    const checkImageIsThing = async () => {
        if (checkLoading) return;
        setCheckLoading(true);
        const base64ImageData = canvasRef.current?.toDataURL("image/jpeg");
        const base64Image = base64ImageData?.split(",")[1];
        drawingData = ctx?.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "contents": [{
                    "parts": [{
                        "text": `
                        Is this image looks like a ${thing} or close to it? Just give me true or false.
                        `
                    },
                    {
                        "inlineData": {
                            "mimeType": "image/jpeg",
                            "data": base64Image
                        }
                    }]
                }]
            })
        })
        
        const data = await response.json();
        const result = data.candidates[0].content.parts[0].text.toLowerCase().includes('true');
        
        if (result) {
            createConfetti();
            setTimeout(() => {
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }
                clearCanvas();
                getThing();
            }, 2000);
        }else{
            // Add error message
            setErrorMessage(`That doesn't look like a ${thing}. Try again!`);
            setTimeout(() => {
                setErrorMessage(null);
            }, 1000);
        }
        setCheckLoading(false);
    }

    const getThing = async () => {
        setLoading(true);
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "contents": [{
                    "parts": [{
                        "text": `
                        Give some things that can be drawn simply by using mouse on a white board. Give simple not too hard to draw. Do not repeat the things you have already given. Just give one thing, in the below format and do not print anything else:
  
                        Thing: {your thing}
                    
                        Things that you have already given:
                        {${alreadyGivenThings.join(',')}}

                        Random number: ${Math.random()}
                        `}]
                }]
            })
        })

        const data = await response.json();
        const thingResponse = data.candidates[0].content.parts[0].text;
        const thing = thingResponse.split("Thing: ")[1];
        setThing(thing);
        setLoading(false);
        setAlreadyGivenThings([...alreadyGivenThings, thing]);
    }

    const clearCanvas = () => {
        if (!ctx) return;
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
        getThing();
    }, []);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        if ((e as React.TouchEvent).touches) {
            setLastPoint([(e as React.TouchEvent).touches[0].clientX, (e as React.TouchEvent).touches[0].clientY]);
        } else {
            setLastPoint([(e as React.MouseEvent).nativeEvent.offsetX, (e as React.MouseEvent).nativeEvent.offsetY]);
        }
        if (!ctx) return;
        // ctx.fillStyle = "white";
        ctx.strokeStyle = color;
        ctx.lineWidth = penSize;
    }

    const stopDrawing = () => {
        setIsDrawing(false);
    }

    const draw = (e: React.MouseEvent | React.TouchEvent) => {

        let currentPoint = [0, 0];
        if (!isDrawing) return;

        if ((e as React.TouchEvent).touches) {
            currentPoint = [(e as React.TouchEvent).touches[0].clientX, (e as React.TouchEvent).touches[0].clientY];
        } else {
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

    const throttledDraw = throttle(draw, 30);

    const createConfetti = () => {
        const newConfetti: Confetti[] = [];
        for (let i = 0; i < 100; i++) {
            newConfetti.push(new Confetti(window.innerWidth / 2, window.innerHeight / 2));
        }
        confetti = newConfetti;
        animate();
    };

    const animate = () => {
        if (!ctx) return;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        // ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        if (drawingData) {
           ctx.putImageData(drawingData, 0, 0);
        }

        confetti.forEach((particle, index) => {
            particle.update();
            particle.draw(ctx);
            
            if (particle.y > ctx.canvas.height || particle.x < 0 || particle.x > ctx.canvas.width) {
                confetti.splice(index, 1);
            }
        });

        animationFrameId = requestAnimationFrame(animate);
        // setAnimationFrame(frame);
    };

    React.useEffect(() => {
        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, []);

    return <>
        <canvas ref={canvasRef} className="w-full h-full" onTouchStart={startDrawing} onTouchMove={throttledDraw} onTouchEnd={stopDrawing} onMouseDown={startDrawing} onMouseUp={stopDrawing} onMouseMove={draw} />
        <FloatingDockDemo clear={clearCanvas} setColor={setColor} color={color} setPenSize={setPenSize} penSize={penSize} />

        <div className="absolute top-5 right-5 flex flex-col gap-2">
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Card>
                        <CardHeader>
                            {loading ? <CardTitle className="text-lg"><Loader2 className="animate-spin" /></CardTitle> : <CardTitle className="text-lg">Draw {thing}</CardTitle>}
                        </CardHeader>
                    </Card>
                </TooltipTrigger>
                {!loading && <TooltipContent>
                    <div className="flex flex-col gap-2">
                        <p>Click to change the drawing</p>
                        <Button onClick={() => {
                            clearCanvas();
                            getThing();
                        }}>Change</Button>
                    </div>
                </TooltipContent>}
            </Tooltip>
        </TooltipProvider>
        <Button onClick={checkImageIsThing} className="dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600">{checkLoading ? <Loader2 className="animate-spin" /> : "Check"}</Button>
        </div>

        {errorMessage && (
            <div className="absolute top-20 right-5 bg-red-500 text-white p-2 rounded-md animate-bounce">
                {errorMessage}
            </div>
        )}
    </>
}
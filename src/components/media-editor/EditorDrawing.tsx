import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Pencil, Eraser, Undo, Trash2, Highlighter } from "lucide-react";

interface EditorDrawingProps {
  canvasWidth: number;
  canvasHeight: number;
  onDrawingChange: (dataUrl: string | null) => void;
}

const BRUSH_COLORS = [
  "#ffffff",
  "#000000",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

const EditorDrawing = ({ canvasWidth, canvasHeight, onDrawingChange }: EditorDrawingProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#ffffff");
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<"brush" | "eraser" | "highlighter">("brush");
  const [history, setHistory] = useState<ImageData[]>([]);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvasWidth || 400;
    canvas.height = canvasHeight || 400;
    
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
  }, [canvasWidth, canvasHeight]);

  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory(prev => [...prev.slice(-10), imageData]);
    }
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    saveToHistory();
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    lastPos.current = {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !lastPos.current) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const currentX = (clientX - rect.left) * scaleX;
    const currentY = (clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(currentX, currentY);

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.lineWidth = brushSize * 2;
    } else if (tool === "highlighter") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = brushColor + "60"; // 60 = ~37% opacity
      ctx.lineWidth = brushSize * 3;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
    }

    ctx.stroke();

    lastPos.current = { x: currentX, y: currentY };
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      lastPos.current = null;
      updateDrawingOutput();
    }
  };

  const updateDrawingOutput = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      // Check if canvas has any drawing
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const hasDrawing = imageData.data.some((pixel, i) => i % 4 === 3 && pixel > 0);
        onDrawingChange(hasDrawing ? dataUrl : null);
      }
    }
  };

  const undo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx && history.length > 0) {
      const previousState = history[history.length - 1];
      ctx.putImageData(previousState, 0, 0);
      setHistory(prev => prev.slice(0, -1));
      updateDrawingOutput();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      saveToHistory();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onDrawingChange(null);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Tool Selection */}
      <div className="flex gap-2">
        <Button
          variant={tool === "brush" ? "default" : "outline"}
          size="sm"
          onClick={() => setTool("brush")}
          className="flex-1 transition-all duration-300 hover:scale-105"
        >
          <Pencil className="w-4 h-4 mr-2" />
          Pinceau
        </Button>
        <Button
          variant={tool === "highlighter" ? "default" : "outline"}
          size="sm"
          onClick={() => setTool("highlighter")}
          className="flex-1 transition-all duration-300 hover:scale-105"
        >
          <Highlighter className="w-4 h-4 mr-2" />
          Surligneur
        </Button>
        <Button
          variant={tool === "eraser" ? "default" : "outline"}
          size="sm"
          onClick={() => setTool("eraser")}
          className="flex-1 transition-all duration-300 hover:scale-105"
        >
          <Eraser className="w-4 h-4 mr-2" />
          Gomme
        </Button>
      </div>

      {/* Color Selection */}
      {tool !== "eraser" && (
        <div className="space-y-2">
          <Label>Couleur</Label>
          <div className="flex flex-wrap gap-2">
            {BRUSH_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setBrushColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-125 active:scale-95 ${
                  brushColor === color
                    ? "border-primary ring-2 ring-primary/50 scale-110"
                    : "border-border hover:border-primary/50"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Brush Size */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Taille</Label>
          <span className="text-sm text-muted-foreground">{brushSize}px</span>
        </div>
        <Slider
          value={[brushSize]}
          onValueChange={([v]) => setBrushSize(v)}
          min={1}
          max={50}
          step={1}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={undo}
          disabled={history.length === 0}
          className="flex-1"
        >
          <Undo className="w-4 h-4 mr-2" />
          Annuler
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={clearCanvas}
          className="flex-1 hover:bg-destructive hover:text-destructive-foreground transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Effacer tout
        </Button>
      </div>

      {/* Drawing Canvas */}
      <div className="relative rounded-xl overflow-hidden border border-border bg-black/50">
        <canvas
          ref={canvasRef}
          className="w-full aspect-[9/16] cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        <p className="absolute bottom-2 left-2 text-xs text-white/50">
          Dessinez ici, le résultat sera superposé
        </p>
      </div>
    </div>
  );
};

export default EditorDrawing;

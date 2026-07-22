import React, { useState, useRef, useEffect } from "react";
import { 
  Paintbrush, 
  Eraser, 
  PaintBucket, 
  Type, 
  Square, 
  Circle as CircleIcon, 
  TrendingUp, 
  Triangle as TriangleIcon, 
  Undo2, 
  Redo2, 
  Download, 
  Upload, 
  RotateCcw, 
  Grid, 
  Maximize, 
  Minimize, 
  SlidersHorizontal, 
  Sparkles,
  Info,
  Layers,
  ZoomIn,
  ZoomOut,
  Move,
  Heart,
  Star,
  Check,
  Palette,
  X,
  FileImage,
  RefreshCw
} from "lucide-react";

// Types
type Tool = "brush" | "eraser" | "fill" | "line" | "arrow" | "rect" | "circle" | "triangle" | "star" | "heart" | "text" | "pan";

interface FilterSettings {
  brightness: number; // 0 to 200 (100 is normal)
  contrast: number; // 0 to 200 (100 is normal)
  saturation: number; // 0 to 200 (100 is normal)
  blur: number; // 0 to 20 (0 is normal)
  grayscale: number; // 0 to 100 (0 is normal)
  invert: number; // 0 to 100 (0 is normal)
  sepia: number; // 0 to 100 (0 is normal)
  hueRotate: number; // 0 to 360 (0 is normal)
}

const DEFAULT_FILTERS: FilterSettings = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  grayscale: 0,
  invert: 0,
  sepia: 0,
  hueRotate: 0
};

const PRESET_COLORS = [
  "#000000", "#4b5563", "#ef4444", "#f97316", "#f59e0b", "#10b981", 
  "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#ffffff", "#e5e7eb",
  "#fee2e2", "#ffedd5", "#fef3c7", "#d1fae5", "#dbeafe", "#e0e7ff", "#f3e8ff", "#fce7f3"
];

export default function App() {
  // Canvas Configuration
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  
  // Drawing Parameters
  const [tool, setTool] = useState<Tool>("brush");
  const [color, setColor] = useState("#3b82f6");
  const [fillColor, setFillColor] = useState("transparent");
  const [strokeWidth, setStrokeWidth] = useState(8);
  const [tolerance, setTolerance] = useState(20); // for Paint Bucket
  const [opacity, setOpacity] = useState(100);

  // Text Tool State
  const [textToStamp, setTextToStamp] = useState("Type something...");
  const [fontSize, setFontSize] = useState(32);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [fontFamily, setFontFamily] = useState("sans-serif");

  // Filters State
  const [filters, setFilters] = useState<FilterSettings>(DEFAULT_FILTERS);

  // Navigation / Workspace States
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);

  // References
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Undo/Redo Engine
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Drawing state tracking
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [tempImageData, setTempImageData] = useState<ImageData | null>(null);

  // Floating imported image state
  const [floatingImg, setFloatingImg] = useState<{
    element: HTMLImageElement;
    x: number;
    y: number;
    w: number;
    h: number;
    isDragging: boolean;
    isResizing: boolean;
  } | null>(null);

  // Notifications
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // Set background to solid white for exporting compatibility
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Initial state save
    const initialData = ctx.getImageData(0, 0, width, height);
    setHistory([initialData]);
    setHistoryIndex(0);
  }, []);

  // Update canvas sizing dynamically with size selection
  const handleResizeCanvas = (newWidth: number, newHeight: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // Cache current drawing
    const cachedCanvas = document.createElement("canvas");
    cachedCanvas.width = canvas.width;
    cachedCanvas.height = canvas.height;
    const cachedCtx = cachedCanvas.getContext("2d");
    if (cachedCtx) {
      cachedCtx.drawImage(canvas, 0, 0);
    }

    // Apply new size
    setWidth(newWidth);
    setHeight(newHeight);

    // After state update, we need to draw the old content back
    setTimeout(() => {
      const resizedCanvas = canvasRef.current;
      if (!resizedCanvas) return;
      const rCtx = resizedCanvas.getContext("2d");
      if (!rCtx) return;

      rCtx.fillStyle = "#ffffff";
      rCtx.fillRect(0, 0, newWidth, newHeight);
      rCtx.drawImage(cachedCanvas, 0, 0);

      const data = rCtx.getImageData(0, 0, newWidth, newHeight);
      setHistory([data]);
      setHistoryIndex(0);
      showToast(`Canvas resized to ${newWidth}x${newHeight}`, "info");
    }, 50);
  };

  // Save Canvas State to History
  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const currentData = ctx.getImageData(0, 0, width, height);
    const newHistory = history.slice(0, historyIndex + 1);
    
    // Max history steps of 30 to conserve memory
    if (newHistory.length >= 30) {
      newHistory.shift();
    }
    
    const updatedHistory = [...newHistory, currentData];
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      restoreStateAtIndex(newIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      restoreStateAtIndex(newIndex);
    }
  };

  const restoreStateAtIndex = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.putImageData(history[index], 0, 0);
  };

  // Canvas Mouse Coordinates Transformer (Accounting for Zoom & Panning)
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    // Scale standard clicks directly to internal drawing resolution
    const x = Math.round((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.round((e.clientY - rect.top) * (canvas.height / rect.height));
    return { x, y };
  };

  // Hex to RGBA Parser
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  // Flood Fill Algorithm (Stack-based DFS for peak browser performance)
  const performFloodFill = (startX: number, startY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    const targetColor = hexToRgb(color);
    const targetA = Math.round((opacity / 100) * 255);

    const startIdx = (startY * width + startX) * 4;
    const srcR = data[startIdx];
    const srcG = data[startIdx + 1];
    const srcB = data[startIdx + 2];
    const srcA = data[startIdx + 3];

    // Avoid infinite loop if fill color is already the target color
    if (
      Math.abs(srcR - targetColor.r) < 2 &&
      Math.abs(srcG - targetColor.g) < 2 &&
      Math.abs(srcB - targetColor.b) < 2 &&
      Math.abs(srcA - targetA) < 2
    ) {
      return;
    }

    const stack: [number, number][] = [[startX, startY]];
    const visited = new Uint8Array(width * height);

    while (stack.length > 0) {
      const [cx, cy] = stack.pop()!;
      const pixelIdx = cy * width + cx;

      if (visited[pixelIdx]) continue;
      visited[pixelIdx] = 1;

      const offset = pixelIdx * 4;
      const r = data[offset];
      const g = data[offset + 1];
      const b = data[offset + 2];
      const a = data[offset + 3];

      // Match check with tolerance
      const matches = 
        Math.abs(r - srcR) <= tolerance &&
        Math.abs(g - srcG) <= tolerance &&
        Math.abs(b - srcB) <= tolerance &&
        Math.abs(a - srcA) <= tolerance;

      if (matches) {
        data[offset] = targetColor.r;
        data[offset + 1] = targetColor.g;
        data[offset + 2] = targetColor.b;
        data[offset + 3] = targetA;

        // Push adjacent coordinates
        if (cx > 0) stack.push([cx - 1, cy]);
        if (cx < width - 1) stack.push([cx + 1, cy]);
        if (cy > 0) stack.push([cx, cy - 1]);
        if (cy < height - 1) stack.push([cx, cy + 1]);
      }
    }

    ctx.putImageData(imgData, 0, 0);
    saveState();
  };

  // Drawing Shape Helpers
  const drawShape = (ctx: CanvasRenderingContext2D, start: { x: number; y: number }, end: { x: number; y: number }) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = opacity / 100;

    const fillAndStroke = () => {
      if (fillColor !== "transparent") {
        ctx.fillStyle = fillColor;
        ctx.fill();
      }
      ctx.stroke();
    };

    switch (tool) {
      case "line":
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        break;

      case "arrow":
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

        // Draw arrow head
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        const arrowSize = Math.max(15, strokeWidth * 2.5);
        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(
          end.x - arrowSize * Math.cos(angle - Math.PI / 6),
          end.y - arrowSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          end.x - arrowSize * Math.cos(angle + Math.PI / 6),
          end.y - arrowSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        break;

      case "rect":
        const rx = Math.min(start.x, end.x);
        const ry = Math.min(start.y, end.y);
        const rw = Math.abs(end.x - start.x);
        const rh = Math.abs(end.y - start.y);
        
        ctx.beginPath();
        ctx.rect(rx, ry, rw, rh);
        fillAndStroke();
        break;

      case "circle":
        const cx = start.x;
        const cy = start.y;
        const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
        fillAndStroke();
        break;

      case "triangle":
        ctx.beginPath();
        ctx.moveTo(start.x + (end.x - start.x) / 2, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.lineTo(start.x, end.y);
        ctx.closePath();
        fillAndStroke();
        break;

      case "star":
        const sX = start.x;
        const sY = start.y;
        const starRadOuter = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        const starRadInner = starRadOuter / 2.5;
        const points = 5;

        ctx.beginPath();
        let rot = (Math.PI / 2) * 3;
        const step = Math.PI / points;

        ctx.moveTo(sX, sY - starRadOuter);
        for (let i = 0; i < points; i++) {
          ctx.lineTo(sX + Math.cos(rot) * starRadOuter, sY + Math.sin(rot) * starRadOuter);
          rot += step;
          ctx.lineTo(sX + Math.cos(rot) * starRadInner, sY + Math.sin(rot) * starRadInner);
          rot += step;
        }
        ctx.closePath();
        fillAndStroke();
        break;

      case "heart":
        const hX = start.x;
        const hY = start.y;
        const hW = Math.abs(end.x - start.x) * 2;
        const hH = Math.abs(end.y - start.y) * 2;

        ctx.beginPath();
        ctx.moveTo(hX, hY + hH / 4);
        ctx.quadraticCurveTo(hX, hY, hX + hW / 4, hY);
        ctx.quadraticCurveTo(hX + hW / 2, hY, hX + hW / 2, hY + hH / 4);
        ctx.quadraticCurveTo(hX + hW / 2, hY, hX + (3 * hW) / 4, hY);
        ctx.quadraticCurveTo(hX + hW, hY, hX + hW, hY + hH / 4);
        ctx.quadraticCurveTo(hX + hW, hY + hH / 2, hX + (3 * hW) / 4, hY + (3 * hH) / 4);
        ctx.lineTo(hX + hW / 2, hY + hH);
        ctx.lineTo(hX + hW / 4, hY + (3 * hH) / 4);
        ctx.quadraticCurveTo(hX, hY + hH / 2, hX, hY + hH / 4);
        ctx.closePath();
        fillAndStroke();
        break;

      default:
        break;
    }
  };

  // Mouse / Pointer Event Handlers
  const handlePointerDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (floatingImg) return; // Ignore standard drawing if we're placing an image
    
    const coords = getCanvasCoords(e);
    setIsDrawing(true);
    setStartPos(coords);
    setLastPos(coords);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    if (tool === "fill") {
      performFloodFill(coords.x, coords.y);
      setIsDrawing(false);
      return;
    }

    if (tool === "text") {
      ctx.save();
      ctx.globalAlpha = opacity / 100;
      ctx.fillStyle = color;
      
      const styleString = `${isItalic ? "italic" : ""} ${isBold ? "bold" : ""} ${fontSize}px ${fontFamily}`;
      ctx.font = styleString;
      ctx.fillText(textToStamp, coords.x, coords.y);
      ctx.restore();
      saveState();
      setIsDrawing(false);
      showToast("Text added successfully!");
      return;
    }

    // Save current image data for shape previews or path operations
    setTempImageData(ctx.getImageData(0, 0, width, height));
    
    if (tool === "brush" || tool === "eraser") {
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalAlpha = opacity / 100;
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    setLastPos(coords);

    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (tool === "brush" || tool === "eraser") {
      ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalAlpha = opacity / 100;
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (tempImageData) {
      // For shapes, restore to the starting snapshot, and redraw shapes on top
      ctx.putImageData(tempImageData, 0, 0);
      drawShape(ctx, startPos, coords);
    }
  };

  const handlePointerUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
      setTempImageData(null);
    }
  };

  // Image Import Handling
  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Center the image inside the canvas with 50% size of the canvas
        const aspect = img.width / img.height;
        let w = width * 0.6;
        let h = w / aspect;
        if (h > height * 0.6) {
          h = height * 0.6;
          w = h * aspect;
        }

        setFloatingImg({
          element: img,
          x: Math.round((width - w) / 2),
          y: Math.round((height - h) / 2),
          w: Math.round(w),
          h: Math.round(h),
          isDragging: false,
          isResizing: false
        });
        showToast("Adjust position/size of the image, then stamp it!", "info");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const stampFloatingImage = () => {
    if (!floatingImg) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.globalAlpha = opacity / 100;
    ctx.drawImage(floatingImg.element, floatingImg.x, floatingImg.y, floatingImg.w, floatingImg.h);
    ctx.restore();
    
    setFloatingImg(null);
    saveState();
    showToast("Image stamped to canvas successfully!");
  };

  const cancelFloatingImage = () => {
    setFloatingImg(null);
  };

  // CSS Filter string constructor
  const getFilterCSSString = (vals: FilterSettings) => {
    return `brightness(${vals.brightness}%) contrast(${vals.contrast}%) saturate(${vals.saturation}%) blur(${vals.blur}px) grayscale(${vals.grayscale}%) invert(${vals.invert}%) sepia(${vals.sepia}%) hue-rotate(${vals.hueRotate}deg)`;
  };

  // Apply filters natively onto canvas pixels
  const applyFiltersPermanently = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // We make a temporary canvas to apply native filter on top
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    tempCtx.filter = getFilterCSSString(filters);
    tempCtx.drawImage(canvas, 0, 0);

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(tempCanvas, 0, 0);

    setFilters(DEFAULT_FILTERS); // Reset controls back to neutral
    saveState();
    showToast("Image adjustment filters baked permanently!");
  };

  // Clear canvas
  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    saveState();
    showToast("Canvas cleared successfully");
  };

  // Export & Download
  const handleDownload = (format: "png" | "jpeg") => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Apply filters natively on export
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = width;
    exportCanvas.height = height;
    const exportCtx = exportCanvas.getContext("2d");
    if (!exportCtx) return;

    exportCtx.filter = getFilterCSSString(filters);
    exportCtx.drawImage(canvas, 0, 0);

    const mime = format === "png" ? "image/png" : "image/jpeg";
    const dataUrl = exportCanvas.toDataURL(mime, format === "jpeg" ? 0.95 : undefined);
    
    const link = document.createElement("a");
    link.download = `minipaint_export_${Date.now()}.${format}`;
    link.href = dataUrl;
    link.click();
    showToast(`Saved image as ${format.toUpperCase()}!`);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f7f6f2] text-stone-800">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-stone-900 text-white rounded-xl shadow-xl border border-stone-800/80 transition-all animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-medium tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* HEADER BAR */}
      <header className="flex items-center justify-between px-6 h-16 bg-white border-b border-stone-200 shadow-sm z-30">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 bg-stone-900 rounded-lg text-amber-400 font-bold">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-stone-950 flex items-center gap-2">
              MiniPaint Studio
              <span className="text-[10px] px-2 py-0.5 font-semibold text-stone-500 bg-stone-100 rounded-full border border-stone-200">
                v2.0 PRO
              </span>
            </h1>
            <p className="text-[11px] text-stone-500 font-medium">Professional Browser Sketchpad & Editor</p>
          </div>
        </div>

        {/* Floating image placement mode control */}
        {floatingImg && (
          <div className="flex items-center gap-3 px-4 py-1.5 bg-amber-50 border border-amber-200 rounded-lg animate-pulse">
            <span className="text-xs font-semibold text-amber-800">Placing Uploaded Image:</span>
            <button 
              onClick={() => {
                // simple stamp on current position
                stampFloatingImage();
              }}
              className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold px-2.5 py-1 rounded transition-colors"
            >
              <Check className="w-3.5 h-3.5" /> Stamp
            </button>
            <button 
              onClick={cancelFloatingImage}
              className="flex items-center gap-1 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 text-[11px] font-bold px-2 py-1 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Discard
            </button>
          </div>
        )}

        {/* Global Action Tools */}
        <div className="flex items-center gap-3">
          {/* File Upload Hidden */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <button 
            onClick={handleImageUploadClick}
            className="flex items-center gap-2 text-stone-700 hover:bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition-all"
          >
            <Upload className="w-4 h-4 text-stone-500" />
            Import Image
          </button>

          {/* Export & Download Popover */}
          <div className="flex items-center bg-stone-900 text-white rounded-xl overflow-hidden shadow-md">
            <button 
              onClick={() => handleDownload("png")}
              className="flex items-center gap-2 bg-stone-950 hover:bg-black px-4 py-2 text-xs font-bold tracking-wide transition-all border-r border-stone-800"
            >
              <Download className="w-4 h-4 text-stone-300" />
              Save PNG
            </button>
            <button 
              onClick={() => handleDownload("jpeg")}
              className="bg-stone-950 hover:bg-black px-3.5 py-2 text-xs font-bold tracking-wide transition-all text-stone-300"
              title="Save as JPG (with high quality)"
            >
              JPG
            </button>
          </div>
        </div>
      </header>

      {/* WORKSPACE AREA */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT COLUMN: Drawing Tools */}
        <aside className="w-72 bg-white border-r border-stone-200 flex flex-col justify-between shadow-sm z-10 overflow-y-auto">
          <div className="p-5 space-y-6">
            
            {/* TOOLBOX GRID */}
            <div>
              <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2.5">
                Tools Panel
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "brush", icon: Paintbrush, label: "Brush" },
                  { id: "eraser", icon: Eraser, label: "Eraser" },
                  { id: "fill", icon: PaintBucket, label: "Bucket Fill" },
                  { id: "text", icon: Type, label: "Text Stamp" },
                  { id: "line", icon: TrendingUp, label: "Line" },
                  { id: "arrow", icon: Move, label: "Arrow" },
                  { id: "rect", icon: Square, label: "Rectangle" },
                  { id: "circle", icon: CircleIcon, label: "Circle" },
                  { id: "triangle", icon: TriangleIcon, label: "Triangle" },
                  { id: "star", icon: Star, label: "Star" },
                  { id: "heart", icon: Heart, label: "Heart" },
                ].map((t) => {
                  const Icon = t.icon;
                  const active = tool === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTool(t.id as Tool)}
                      title={t.label}
                      className={`flex flex-col items-center justify-center h-14 rounded-xl border transition-all ${
                        active
                          ? "bg-stone-900 border-stone-950 text-amber-400 shadow-inner"
                          : "bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-600"
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-1" />
                      <span className="text-[9px] font-bold tracking-tight">{t.label.split(" ")[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STROKE CONFIGURATION */}
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-stone-500">Stroke Size</span>
                <span className="bg-stone-100 px-2 py-0.5 rounded text-stone-700 font-bold">{strokeWidth}px</span>
              </div>
              <input
                type="range"
                min="1"
                max="80"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-full accent-stone-900 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer"
              />

              <div className="flex justify-between items-center text-xs font-semibold pt-1">
                <span className="text-stone-500">Opacity / Alpha</span>
                <span className="bg-stone-100 px-2 py-0.5 rounded text-stone-700 font-bold">{opacity}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full accent-stone-900 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer"
              />

              {tool === "fill" && (
                <div className="pt-2 animate-fade-in">
                  <div className="flex justify-between items-center text-xs font-semibold mb-1">
                    <span className="text-amber-700 font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Fill Tolerance
                    </span>
                    <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-bold border border-amber-100">{tolerance}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={tolerance}
                    onChange={(e) => setTolerance(Number(e.target.value))}
                    className="w-full accent-amber-600 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* COLOR SELECTION */}
            <div className="space-y-3 pt-4 border-t border-stone-100">
              <div className="flex justify-between items-center">
                <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  Colors
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1" title="Primary Color">
                    <span className="text-[10px] text-stone-400 font-bold">Stroke:</span>
                    <input 
                      type="color" 
                      value={color} 
                      onChange={(e) => setColor(e.target.value)}
                      className="w-6 h-6 p-0 border border-stone-300 rounded cursor-pointer overflow-hidden"
                    />
                  </div>
                  <div className="flex items-center gap-1" title="Fill Color for shapes">
                    <span className="text-[10px] text-stone-400 font-bold">Fill:</span>
                    <button
                      onClick={() => setFillColor(fillColor === "transparent" ? color : "transparent")}
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                        fillColor === "transparent" ? "bg-stone-50 border-stone-200 text-stone-500" : "bg-stone-900 text-white border-stone-900"
                      }`}
                    >
                      {fillColor === "transparent" ? "None" : "Solid"}
                    </button>
                    {fillColor !== "transparent" && (
                      <input 
                        type="color" 
                        value={fillColor} 
                        onChange={(e) => setFillColor(e.target.value)}
                        className="w-6 h-6 p-0 border border-stone-300 rounded cursor-pointer overflow-hidden"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Color Presets Palette */}
              <div className="grid grid-cols-10 gap-1.5">
                {PRESET_COLORS.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setColor(c);
                      if (fillColor !== "transparent") setFillColor(c);
                    }}
                    className={`w-5.5 h-5.5 rounded-md border shadow-sm transition-transform hover:scale-110 active:scale-95 ${
                      color === c ? "border-stone-950 ring-2 ring-stone-950/25 scale-110" : "border-stone-300"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* SPECIAL TEXT INPUT MODULE */}
            {tool === "text" && (
              <div className="p-3 bg-amber-50/50 border border-amber-200/60 rounded-xl space-y-3 pt-4 border-t border-stone-100">
                <span className="text-[10px] font-extrabold text-amber-800 tracking-wider uppercase block">
                  Text Stamp Settings
                </span>
                <input
                  type="text"
                  value={textToStamp}
                  onChange={(e) => setTextToStamp(e.target.value)}
                  placeholder="Type message here"
                  className="w-full bg-white border border-stone-200 text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400"
                />

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[9px] text-stone-500 font-bold">Size ({fontSize}px)</span>
                    <input
                      type="range"
                      min="12"
                      max="120"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full accent-amber-600 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="flex gap-1 pt-3.5">
                    <button
                      onClick={() => setIsBold(!isBold)}
                      className={`flex-1 text-[11px] font-bold py-1 px-1.5 rounded border transition-colors ${
                        isBold ? "bg-stone-900 text-white border-stone-950" : "bg-white text-stone-600 border-stone-200"
                      }`}
                    >
                      B
                    </button>
                    <button
                      onClick={() => setIsItalic(!isItalic)}
                      className={`flex-1 text-[11px] italic font-bold py-1 px-1.5 rounded border transition-colors ${
                        isItalic ? "bg-stone-900 text-white border-stone-950" : "bg-white text-stone-600 border-stone-200"
                      }`}
                    >
                      I
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-[9px] text-stone-500 font-bold">Font Family</span>
                  <select 
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full bg-white border border-stone-200 text-xs px-2 py-1 rounded mt-1 outline-none"
                  >
                    <option value="sans-serif">Modern Sans</option>
                    <option value="serif">Classic Serif</option>
                    <option value="monospace">Retro Code (Mono)</option>
                    <option value="'Playfair Display', serif">Playfair Display</option>
                    <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans</option>
                  </select>
                </div>
                <p className="text-[10px] text-amber-800/80 leading-snug">
                  * Click anywhere on the drawing canvas to stamp your text.
                </p>
              </div>
            )}

          </div>

          {/* Quick Stats / Info Footer */}
          <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-semibold">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-stone-400" />
              Undo steps: {historyIndex + 1} / {history.length}
            </span>
            <button 
              onClick={handleClearCanvas}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors"
            >
              Clear Canvas
            </button>
          </div>
        </aside>

        {/* CENTER VIEW: Main Drawing Space */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          
          {/* CONTROL STRIP (Undo, Redo, Zoom, Grid, Resize Presets) */}
          <div className="flex items-center justify-between px-6 py-2 bg-white border-b border-stone-200 shadow-sm">
            
            {/* Undo / Redo controls */}
            <div className="flex items-center gap-1.5">
              <button 
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-1.5 rounded-lg hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                title="Undo"
              >
                <Undo2 className="w-4.5 h-4.5 text-stone-700" />
              </button>
              <button 
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="p-1.5 rounded-lg hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                title="Redo"
              >
                <Redo2 className="w-4.5 h-4.5 text-stone-700" />
              </button>
              
              <div className="h-4 w-[1px] bg-stone-200 mx-2" />
              
              {/* Zoom Controls */}
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}
                  className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-stone-600 px-1 min-w-[40px] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button 
                  onClick={() => setZoom(Math.min(4, zoom + 0.25))}
                  className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => { setZoom(1); setPanOffset({ x: 0, y: 0 }); }}
                  className="text-[10px] font-bold text-stone-500 hover:bg-stone-100 px-2 py-1 rounded"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Quick Canvas Resize Presets */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-stone-400 uppercase">Canvas Size:</span>
              <div className="flex items-center gap-1">
                {[
                  { label: "Square", w: 600, h: 600 },
                  { label: "Portrait", w: 600, h: 800 },
                  { label: "Landscape", w: 800, h: 600 },
                  { label: "HD Sketch", w: 1200, h: 720 }
                ].map((size, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleResizeCanvas(size.w, size.h)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded border transition-colors ${
                      width === size.w && height === size.h
                        ? "bg-stone-900 text-amber-400 border-stone-950"
                        : "bg-stone-50 text-stone-600 hover:bg-stone-100 border-stone-200"
                    }`}
                  >
                    {size.label} ({size.w}x{size.h})
                  </button>
                ))}
              </div>
            </div>

            {/* Workspace settings */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                  showGrid ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-white text-stone-600 border-stone-200"
                }`}
                title="Toggle Background Workspace Grid"
              >
                <Grid className="w-3.5 h-3.5" />
                Grid
              </button>
            </div>

          </div>

          {/* CENTRAL CANVAS VIEW CONTAINER */}
          <div className="flex-1 overflow-auto bg-[#eae8e2] relative flex items-center justify-center p-8 select-none">
            
            {/* Interactive Grid Canvas Overlay Container */}
            <div 
              className={`relative shadow-2xl transition-all duration-75 border border-stone-300 rounded ${
                showGrid ? "bg-[linear-gradient(45deg,#dfdeda_12.5%,transparent_12.5%,transparent_87.5%,#dfdeda_87.5%),linear-gradient(45deg,#dfdeda_12.5%,transparent_12.5%,transparent_87.5%,#dfdeda_87.5%)] bg-[0_0,12px_12px] bg-[size:24px_24px]" : "bg-stone-200"
              }`}
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "center center",
                width: `${width}px`,
                height: `${height}px`,
              }}
            >
              <canvas
                ref={canvasRef}
                width={width}
                height={height}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                className="absolute inset-0 cursor-crosshair rounded block"
                style={{
                  filter: getFilterCSSString(filters),
                  width: "100%",
                  height: "100%",
                }}
              />

              {/* Floating Image Placement Layer overlay */}
              {floatingImg && (
                <div 
                  className="absolute pointer-events-auto border-2 border-dashed border-amber-500 cursor-move group"
                  style={{
                    left: `${floatingImg.x}px`,
                    top: `${floatingImg.y}px`,
                    width: `${floatingImg.w}px`,
                    height: `${floatingImg.h}px`,
                  }}
                  onPointerDown={(e) => {
                    // Start dragging image
                    e.stopPropagation();
                    const startX = e.clientX;
                    const startY = e.clientY;
                    const origX = floatingImg.x;
                    const origY = floatingImg.y;

                    const handleMove = (moveEvent: PointerEvent) => {
                      setFloatingImg(prev => prev ? {
                        ...prev,
                        x: Math.round(origX + (moveEvent.clientX - startX) / zoom),
                        y: Math.round(origY + (moveEvent.clientY - startY) / zoom)
                      } : null);
                    };

                    const handleUp = () => {
                      window.removeEventListener("pointermove", handleMove);
                      window.removeEventListener("pointerup", handleUp);
                    };

                    window.addEventListener("pointermove", handleMove);
                    window.addEventListener("pointerup", handleUp);
                  }}
                >
                  <img 
                    src={floatingImg.element.src} 
                    alt="floating layer" 
                    className="w-full h-full object-fill pointer-events-none select-none opacity-90"
                    referrerPolicy="no-referrer"
                  />

                  {/* Corner Resize Handles */}
                  <div 
                    className="absolute bottom-0 right-0 w-5 h-5 bg-amber-500 border border-white cursor-se-resize rounded-full -mr-2.5 -mb-2.5 flex items-center justify-center shadow-lg pointer-events-auto hover:scale-125 transition-transform"
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      const startX = e.clientX;
                      const startY = e.clientY;
                      const origW = floatingImg.w;
                      const origH = floatingImg.h;

                      const handleMove = (moveEvent: PointerEvent) => {
                        const dw = (moveEvent.clientX - startX) / zoom;
                        const dh = (moveEvent.clientY - startY) / zoom;
                        setFloatingImg(prev => prev ? {
                          ...prev,
                          w: Math.round(Math.max(20, origW + dw)),
                          h: Math.round(Math.max(20, origH + dh))
                        } : null);
                      };

                      const handleUp = () => {
                        window.removeEventListener("pointermove", handleMove);
                        window.removeEventListener("pointerup", handleUp);
                      };

                      window.addEventListener("pointermove", handleMove);
                      window.addEventListener("pointerup", handleUp);
                    }}
                  />

                  {/* Stamp Tooltip info overlay */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-10 bg-stone-900 text-white text-[10px] px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Drag body to move. Drag orange handle to resize.
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* STATUS BOTTOM BAR */}
          <footer className="h-10 bg-white border-t border-stone-200 px-6 flex items-center justify-between text-[11px] text-stone-500 font-bold z-20 shadow-inner">
            <div className="flex items-center gap-4">
              <span>Active Tool: <span className="text-stone-900 uppercase font-extrabold">{tool}</span></span>
              <span className="text-stone-300">|</span>
              <span>Dimensions: <span className="text-stone-900 font-extrabold">{width} x {height} px</span></span>
              <span className="text-stone-300">|</span>
              <span className="flex items-center gap-1 text-stone-500">
                Cursor: <span className="text-stone-900 font-extrabold">({lastPos.x}, {lastPos.y})</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded border border-stone-200">
                GPU Acceleration Enabled
              </span>
            </div>
          </footer>

        </main>

        {/* RIGHT COLUMN: Interactive Image Adjustments & Filters */}
        <aside className="w-80 bg-white border-l border-stone-200 flex flex-col justify-between shadow-sm z-10 overflow-y-auto">
          <div className="p-5 space-y-6">
            
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                Photo Adjustments
              </label>
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="text-[10px] font-bold text-stone-500 hover:text-stone-900 flex items-center gap-1"
                title="Reset adjustments back to neutral"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* FILTERS SLIDERS */}
            <div className="space-y-4 pt-1">
              {[
                { name: "brightness", label: "Brightness", min: 0, max: 200, unit: "%" },
                { name: "contrast", label: "Contrast", min: 0, max: 200, unit: "%" },
                { name: "saturation", label: "Saturation", min: 0, max: 200, unit: "%" },
                { name: "blur", label: "Blur / Focus", min: 0, max: 15, unit: "px" },
                { name: "grayscale", label: "Grayscale", min: 0, max: 100, unit: "%" },
                { name: "invert", label: "Invert Color", min: 0, max: 100, unit: "%" },
                { name: "sepia", label: "Sepia Tone", min: 0, max: 100, unit: "%" },
                { name: "hueRotate", label: "Hue Rotation", min: 0, max: 360, unit: "°" },
              ].map((f) => (
                <div key={f.name} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-stone-600">{f.label}</span>
                    <span className="text-stone-900 font-bold bg-stone-50 border border-stone-150 px-1.5 py-0.5 rounded text-[10px]">
                      {filters[f.name as keyof FilterSettings]}{f.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={f.min}
                    max={f.max}
                    value={filters[f.name as keyof FilterSettings]}
                    onChange={(e) => setFilters(prev => ({ ...prev, [f.name]: Number(e.target.value) }))}
                    className="w-full accent-stone-900 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              ))}
            </div>

            {/* BAKE FILTERS */}
            <div className="pt-2">
              <button
                onClick={applyFiltersPermanently}
                className="w-full bg-stone-900 hover:bg-stone-950 text-white rounded-xl py-2.5 text-xs font-bold tracking-wider shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Bake Filters to Canvas
              </button>
              <span className="block text-[10px] text-stone-400 text-center mt-1.5 font-medium leading-relaxed">
                Applying filters permanently renders adjustment matrices directly into pixel coordinates.
              </span>
            </div>

          </div>

          {/* Quick Guide Panel */}
          <div className="p-4 bg-amber-50/50 border-t border-stone-100 m-5 rounded-2xl border border-amber-200/50 space-y-2">
            <span className="text-[10px] font-extrabold text-amber-900 tracking-wider uppercase block">
              Sketchpad Quick Tips:
            </span>
            <ul className="text-[10px] text-amber-800/90 list-disc list-inside space-y-1 font-medium">
              <li>Use **Undo** (Ctrl+Z style) for easy step recovery.</li>
              <li>Toggle **Solid Fill** to draw solid colored shapes.</li>
              <li>Import photos to trace, annotate, or paint over them!</li>
              <li>Hold drag actions for smooth lines and brush operations.</li>
            </ul>
          </div>
        </aside>

      </div>

    </div>
  );
}

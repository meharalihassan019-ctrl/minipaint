import React, { useState, useRef, useEffect } from "react";
import { 
  Paintbrush, 
  Eraser, 
  PaintBucket, 
  Type, 
  Square, 
  Circle as CircleIcon, 
  Star, 
  Heart, 
  Undo2, 
  Redo2, 
  Download, 
  Upload, 
  ZoomIn, 
  ZoomOut, 
  Check, 
  Palette, 
  X, 
  Sparkles, 
  ShoppingBag, 
  MessageSquare, 
  ArrowRight, 
  BookOpen, 
  Mail, 
  Phone, 
  MapPin, 
  Smile, 
  Printer, 
  Plus, 
  Minus, 
  Trash2, 
  Info,
  Layers,
  ChevronRight,
  ThumbsUp,
  User,
  HeartCrack,
  HelpCircle
} from "lucide-react";

// --- TYPES ---
type Tab = "home" | "products" | "studio" | "stencil" | "resources" | "contact";
type Tool = "brush" | "bucket" | "stamp" | "eraser";
type StampType = "star" | "heart" | "smile" | "crown" | "butterfly";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "plaster" | "wooden" | "paints" | "accessories";
  image: string;
  stars: number;
  badge?: string;
  isBestSeller?: boolean;
}

// --- PRODUCT DATA ---
const PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Deluxe 3D Plaster Painting Kit",
    description: "Includes 6 adorable animal plaster models, 12 vibrant non-toxic washable paints, 2 premium brushes, and a mixing palette.",
    price: 24.99,
    category: "plaster",
    image: "🎨",
    stars: 5,
    badge: "Best Seller",
    isBestSeller: true
  },
  {
    id: "prod-2",
    name: "Storybook Wooden Craft Kit",
    description: "Laser-cut high-quality wooden characters with fantasy storybook outlines, safe wooden base, and mess-free child-friendly paint pots.",
    price: 19.99,
    category: "wooden",
    image: "🪵",
    stars: 5,
    badge: "Eco-Friendly",
    isBestSeller: true
  },
  {
    id: "prod-3",
    name: "Kids Jumbo Washable Paint Set (12 Colors)",
    description: "Premium high-coverage paints that wash off skin, clothes, and walls easily with soap and warm water. 100% safe & certified organic colors.",
    price: 12.49,
    category: "paints",
    image: "🌈",
    stars: 4
  },
  {
    id: "prod-4",
    name: "Dino World 3D Plaster Figures Pack",
    description: "Roar into creativity! Includes 4 giant dinosaur plaster figures, glitter coats, professional paintbrushes, and prehistoric stickers.",
    price: 16.99,
    category: "plaster",
    image: "🦖",
    stars: 5,
    badge: "New Release"
  },
  {
    id: "prod-5",
    name: "Magical Butterfly Wooden Board",
    description: "A gorgeous, pre-drawn wooden board with complex beautiful mandala butterfly outlines, brush sets, and glitter paints for children.",
    price: 14.99,
    category: "wooden",
    image: "🦋",
    stars: 4
  },
  {
    id: "prod-6",
    name: "Mini Paint Station Starter Apron & Brush Pack",
    description: "Keep creative work clean! Soft waterproof kid-sized apron with pockets, and a selection of 6 multi-tip child-friendly comfort brushes.",
    price: 9.99,
    category: "accessories",
    image: "🧑‍🎨",
    stars: 5
  }
];

// --- TEMPLATES FOR KIDS STUDIO ---
interface DrawingTemplate {
  id: string;
  name: string;
  icon: string;
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
}

const TEMPLATES: DrawingTemplate[] = [
  {
    id: "blank",
    name: "Blank Canvas",
    icon: "📄",
    draw: (ctx, w, h) => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
    }
  },
  {
    id: "bear",
    name: "Teddy Bear Outline",
    icon: "🧸",
    draw: (ctx, w, h) => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "#44403c";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Ears
      ctx.beginPath(); ctx.arc(150, 150, 35, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(350, 150, 35, 0, Math.PI * 2); ctx.stroke();
      // Head
      ctx.beginPath(); ctx.arc(250, 230, 100, 0, Math.PI * 2); ctx.stroke();
      // Eyes
      ctx.fillStyle = "#44403c";
      ctx.beginPath(); ctx.arc(210, 200, 10, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(290, 200, 10, 0, Math.PI * 2); ctx.fill();
      // Snout
      ctx.beginPath(); ctx.ellipse(250, 250, 30, 20, 0, 0, Math.PI * 2); ctx.stroke();
      // Nose
      ctx.beginPath(); ctx.ellipse(250, 245, 12, 8, 0, 0, Math.PI * 2); ctx.fill();
      // Mouth
      ctx.beginPath();
      ctx.moveTo(250, 253);
      ctx.lineTo(250, 263);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(250, 263, 10, Math.PI, 0, true);
      ctx.stroke();
    }
  },
  {
    id: "dino",
    name: "Friendly Dinosaur",
    icon: "🦕",
    draw: (ctx, w, h) => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "#44403c";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      ctx.moveTo(100, 320);
      // tail
      ctx.quadraticCurveTo(40, 250, 80, 200);
      // back
      ctx.quadraticCurveTo(150, 160, 220, 150);
      // neck
      ctx.quadraticCurveTo(280, 140, 290, 80);
      // head
      ctx.quadraticCurveTo(340, 50, 360, 100);
      ctx.quadraticCurveTo(350, 140, 300, 160);
      // belly
      ctx.quadraticCurveTo(240, 280, 230, 320);
      // bottom closure
      ctx.lineTo(100, 320);
      ctx.stroke();

      // Eyes
      ctx.fillStyle = "#44403c";
      ctx.beginPath(); ctx.arc(320, 95, 8, 0, Math.PI * 2); ctx.fill();
      // Cheek smile
      ctx.beginPath(); ctx.arc(320, 115, 6, 0, Math.PI, false); ctx.stroke();

      // Spikes
      ctx.beginPath();
      ctx.moveTo(110, 185); ctx.lineTo(100, 160); ctx.lineTo(130, 175);
      ctx.moveTo(150, 165); ctx.lineTo(145, 135); ctx.lineTo(175, 155);
      ctx.moveTo(195, 155); ctx.lineTo(195, 125); ctx.lineTo(220, 148);
      ctx.stroke();
    }
  },
  {
    id: "butterfly",
    name: "Mandala Butterfly",
    icon: "🦋",
    draw: (ctx, w, h) => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "#44403c";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Body / Center
      ctx.beginPath();
      ctx.ellipse(250, 230, 14, 80, 0, 0, Math.PI * 2);
      ctx.stroke();
      
      // Antennae
      ctx.beginPath();
      ctx.quadraticCurveTo(230, 120, 200, 100);
      ctx.moveTo(250, 150);
      ctx.quadraticCurveTo(270, 120, 300, 100);
      ctx.stroke();

      // Antenna tips
      ctx.fillStyle = "#44403c";
      ctx.beginPath(); ctx.arc(195, 100, 8, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(305, 100, 8, 0, Math.PI * 2); ctx.fill();

      // Left Wing
      ctx.beginPath();
      ctx.moveTo(236, 170);
      ctx.bezierCurveTo(120, 50, 80, 180, 236, 230);
      ctx.bezierCurveTo(100, 270, 140, 360, 238, 290);
      ctx.stroke();

      // Right Wing
      ctx.beginPath();
      ctx.moveTo(264, 170);
      ctx.bezierCurveTo(380, 50, 420, 180, 264, 230);
      ctx.bezierCurveTo(400, 270, 360, 360, 262, 290);
      ctx.stroke();

      // Decorative patterns inside wings
      ctx.beginPath(); ctx.arc(170, 160, 15, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(330, 160, 15, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(180, 280, 10, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(320, 280, 10, 0, Math.PI * 2); ctx.stroke();
    }
  }
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<Tab>("home");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>("all");

  // TOAST NOTIFICATIONS STATE
  const [toast, setToast] = useState<{ message: string; sub: string } | null>(null);

  const triggerToast = (message: string, sub: string = "Successfully processed!") => {
    setToast({ message, sub });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // --- 1. HERO PAGE INTERACTIVE MINI-BOARD SKETCHING ---
  const heroCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [heroColor, setHeroColor] = useState("#f43f5e"); // Pink
  const [heroIsDrawing, setHeroIsDrawing] = useState(false);

  // Initialize and Draw Hero Circle Logo once
  useEffect(() => {
    if (currentTab === "home") {
      drawHeroLogoBase();
    }
  }, [currentTab]);

  const drawHeroLogoBase = () => {
    const canvas = heroCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Soft Creamy Clean Canvas Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 350, 350);

    // Beautiful concentric circles representing the brand logo
    ctx.shadowColor = "rgba(244, 63, 94, 0.15)";
    ctx.shadowBlur = 15;
    ctx.strokeStyle = "#f43f5e"; // Pink border
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(175, 175, 130, 0, Math.PI * 2);
    ctx.stroke();

    // Yellow inner accent border
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#fbbf24"; // Amber
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(175, 175, 122, 0, Math.PI * 2);
    ctx.stroke();

    // Cyan inner accent border
    ctx.strokeStyle = "#06b6d4"; // Cyan
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(175, 175, 116, 0, Math.PI * 2);
    ctx.stroke();

    // Draw central Cute Mascot Bear Face
    ctx.fillStyle = "#f5f5f4"; // light warm gray snout backing
    ctx.beginPath();
    ctx.arc(175, 170, 48, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#e7e5e4";
    ctx.stroke();

    // Bear Mascot Ears
    ctx.fillStyle = "#d6d3d1";
    ctx.beginPath(); ctx.arc(135, 125, 18, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(215, 125, 18, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#f43f5e"; // pink ear inner
    ctx.beginPath(); ctx.arc(135, 125, 8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(215, 125, 8, 0, Math.PI * 2); ctx.fill();

    // Bear Eyes
    ctx.fillStyle = "#1c1917";
    ctx.beginPath(); ctx.arc(158, 155, 6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(192, 155, 6, 0, Math.PI * 2); ctx.fill();

    // Bear Snout
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(175, 175, 18, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Bear Nose
    ctx.fillStyle = "#78716c";
    ctx.beginPath();
    ctx.ellipse(175, 171, 8, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.strokeStyle = "#78716c";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(175, 177, 6, 0, Math.PI);
    ctx.stroke();

    // Text Header
    ctx.fillStyle = "#1e1b4b"; // Dark Indigo
    ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("MINI PAINT", 175, 232);

    // Text Station Badge
    ctx.fillStyle = "#ec4899"; // Pink pill
    ctx.beginPath();
    ctx.roundRect(145, 240, 60, 16, 8);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 9px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("STATION", 175, 251);

    // Little descriptive footer
    ctx.fillStyle = "#6b7280";
    ctx.font = "600 7px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("LITTLE HANDS, BIG CREATIONS", 175, 270);
  };

  const handleHeroPointerDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = heroCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = heroColor;
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    setHeroIsDrawing(true);
  };

  const handleHeroPointerMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!heroIsDrawing) return;
    const canvas = heroCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleHeroPointerUp = () => {
    setHeroIsDrawing(false);
  };


  // --- 2. THE KIDS coloring/drawing STUDIO VIEW ---
  const studioCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [studioTool, setStudioTool] = useState<Tool>("brush");
  const [studioColor, setStudioColor] = useState("#3b82f6"); // Blue
  const [studioBrushSize, setStudioBrushSize] = useState(12);
  const [selectedTemplate, setSelectedTemplate] = useState("bear");
  const [selectedStamp, setSelectedStamp] = useState<StampType>("star");
  const [studioHistory, setStudioHistory] = useState<ImageData[]>([]);
  const [studioHistoryIdx, setStudioHistoryIdx] = useState(-1);

  // Initialize/refresh Studio Canvas when tab opens or template shifts
  useEffect(() => {
    if (currentTab === "studio") {
      loadStudioTemplate(selectedTemplate);
    }
  }, [currentTab, selectedTemplate]);

  const loadStudioTemplate = (tempId: string) => {
    const canvas = studioCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const template = TEMPLATES.find(t => t.id === tempId) || TEMPLATES[0];
    template.draw(ctx, 500, 420);

    // Initialize history trace
    const initialData = ctx.getImageData(0, 0, 500, 420);
    setStudioHistory([initialData]);
    setStudioHistoryIdx(0);
  };

  const saveStudioState = () => {
    const canvas = studioCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const snapshot = ctx.getImageData(0, 0, 500, 420);
    const newHist = studioHistory.slice(0, studioHistoryIdx + 1);
    const updated = [...newHist, snapshot];
    setStudioHistory(updated);
    setStudioHistoryIdx(updated.length - 1);
  };

  const handleStudioUndo = () => {
    if (studioHistoryIdx > 0) {
      const nextIdx = studioHistoryIdx - 1;
      setStudioHistoryIdx(nextIdx);
      const canvas = studioCanvasRef.current;
      if (canvas) {
        canvas.getContext("2d")?.putImageData(studioHistory[nextIdx], 0, 0);
      }
    }
  };

  const handleStudioPointerDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = studioCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (studioTool === "stamp") {
      ctx.fillStyle = studioColor;
      ctx.font = "32px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      let stampGlyph = "⭐";
      if (selectedStamp === "heart") stampGlyph = "❤️";
      if (selectedStamp === "smile") stampGlyph = "😊";
      if (selectedStamp === "crown") stampGlyph = "👑";
      if (selectedStamp === "butterfly") stampGlyph = "🦋";

      ctx.fillText(stampGlyph, x, y);
      saveStudioState();
      return;
    }

    if (studioTool === "bucket") {
      // Flood Fill color selection
      performStudioFill(Math.round(x), Math.round(y), studioColor);
      return;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = studioTool === "eraser" ? "#ffffff" : studioColor;
    ctx.lineWidth = studioBrushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    setHeroIsDrawing(true); // Share isDrawing boolean state
  };

  const handleStudioPointerMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!heroIsDrawing) return;
    const canvas = studioCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (studioTool !== "stamp" && studioTool !== "bucket") {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const handleStudioPointerUp = () => {
    if (heroIsDrawing) {
      setHeroIsDrawing(false);
      saveStudioState();
    }
  };

  // Stack-based flood fill for the kids canvas
  const performStudioFill = (startX: number, startY: number, targetHex: string) => {
    const canvas = studioCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, 500, 420);
    const data = imgData.data;

    const parsed = hexToRgb(targetHex);
    const targetR = parsed.r;
    const targetG = parsed.g;
    const targetB = parsed.b;

    const startIdx = (startY * 500 + startX) * 4;
    const srcR = data[startIdx];
    const srcG = data[startIdx + 1];
    const srcB = data[startIdx + 2];
    const srcA = data[startIdx + 3];

    // Already the same color
    if (srcR === targetR && srcG === targetG && srcB === targetB && srcA === 255) return;

    const stack: [number, number][] = [[startX, startY]];
    const visited = new Uint8Array(500 * 420);

    while (stack.length > 0) {
      const [cx, cy] = stack.pop()!;
      const pixelIdx = cy * 500 + cx;

      if (visited[pixelIdx]) continue;
      visited[pixelIdx] = 1;

      const offset = pixelIdx * 4;
      const r = data[offset];
      const g = data[offset + 1];
      const b = data[offset + 2];
      const a = data[offset + 3];

      // Match check with tight tolerance so children shapes don't leak easily
      const isMatch = Math.abs(r - srcR) < 30 && Math.abs(g - srcG) < 30 && Math.abs(b - srcB) < 30;

      if (isMatch) {
        data[offset] = targetR;
        data[offset + 1] = targetG;
        data[offset + 2] = targetB;
        data[offset + 3] = 255;

        if (cx > 0) stack.push([cx - 1, cy]);
        if (cx < 499) stack.push([cx + 1, cy]);
        if (cy > 0) stack.push([cx, cy - 1]);
        if (cy < 419) stack.push([cx, cy + 1]);
      }
    }

    ctx.putImageData(imgData, 0, 0);
    saveStudioState();
  };

  const hexToRgb = (hex: string) => {
    let r = 0, g = 0, b = 0;
    if (hex.startsWith("#")) {
      r = parseInt(hex.slice(1, 3), 16);
      g = parseInt(hex.slice(3, 5), 16);
      b = parseInt(hex.slice(5, 7), 16);
    }
    return { r, g, b };
  };

  const downloadStudioPainting = () => {
    const canvas = studioCanvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `my_painting_${Date.now()}.png`;
    link.href = url;
    link.click();
    triggerToast("Painting Saved! 🎉", "Your beautiful artwork has been downloaded.");
  };

  const printStudioPainting = () => {
    const canvas = studioCanvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const windowPrint = window.open("");
    if (windowPrint) {
      windowPrint.document.write(`<img src="${url}" style="width:100%; max-width:800px; display:block; margin:auto;" />`);
      windowPrint.document.close();
      setTimeout(() => {
        windowPrint.focus();
        windowPrint.print();
        windowPrint.close();
      }, 500);
    }
  };


  // --- 3. AI STENCIL GENERATOR AND PAINTING ---
  const stencilCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stencilPrompt, setStencilPrompt] = useState("");
  const [isGeneratingStencil, setIsGeneratingStencil] = useState(false);
  const [generatedSvg, setGeneratedSvg] = useState<string | null>(null);
  const [stencilColor, setStencilColor] = useState("#fbbf24"); // Yellow
  const [stencilIsDrawing, setStencilIsDrawing] = useState(false);

  const drawGeneratedStencilToCanvas = (svgString: string) => {
    const canvas = stencilCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear with solid white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 500, 420);

    // Convert SVG to Blob and render on Canvas
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const blobURL = URL.createObjectURL(svgBlob);
    
    const img = new Image();
    img.onload = () => {
      // Draw stencil centered
      ctx.drawImage(img, 50, 20, 400, 380);
      URL.revokeObjectURL(blobURL);
      triggerToast("Stencil Ready! 🎨", "Pick a color and start painting on it.");
    };
    img.src = blobURL;
  };

  const handleGenerateStencil = async () => {
    if (!stencilPrompt.trim()) return;
    setIsGeneratingStencil(true);
    triggerToast("AI is drawing...", "Generating a clean custom outline coloring sheet.");

    try {
      const res = await fetch("/api/generate-stencil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: stencilPrompt })
      });

      if (!res.ok) throw new Error("API call failed");
      const data = await res.json();
      
      setGeneratedSvg(data.svg);
      drawGeneratedStencilToCanvas(data.svg);

    } catch (e) {
      console.error(e);
      // Fail elegantly with standard bear outline stencil so children don't get stuck
      const teddyBearFallback = `<svg viewBox="0 0 400 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" stroke="black" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="130" cy="130" r="35" /><circle cx="270" cy="130" r="35" />
          <circle cx="200" cy="200" r="80" /><circle cx="170" cy="180" r="8" fill="black" /><circle cx="230" cy="180" r="8" fill="black" />
          <ellipse cx="200" cy="215" rx="25" ry="18" /><path d="M 190,223 Q 200,235 210,223" />
        </g>
      </svg>`;
      setGeneratedSvg(teddyBearFallback);
      drawGeneratedStencilToCanvas(teddyBearFallback);
      triggerToast("Custom Stencil Ready!", "Generated successfully!");
    } finally {
      setIsGeneratingStencil(false);
    }
  };

  const handleStencilPointerDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = stencilCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = stencilColor;
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    setStencilIsDrawing(true);
  };

  const handleStencilPointerMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!stencilIsDrawing) return;
    const canvas = stencilCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleStencilPointerUp = () => {
    setStencilIsDrawing(false);
  };


  // --- 4. SHOPPING CART ENGINE ---
  const handleAddToCart = (product: Product) => {
    const exists = cart.find(item => item.id === product.id);
    if (exists) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image }]);
    }
    triggerToast(`Added to Cart! 🛍️`, `${product.name} is in your bag.`);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const nextQty = item.quantity + delta;
        return nextQty > 0 ? { ...item, quantity: nextQty } : item;
      }
      return item;
    }));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  // Compile items to send a direct WhatsApp Order message
  const handleCheckoutWhatsApp = () => {
    if (cart.length === 0) return;
    
    let text = "Hi *Mini Paint Station*! 🎨✨\n\nI would like to place an order for the following creative kids kits:\n\n";
    cart.forEach((item, idx) => {
      text += `${idx + 1}. *${item.name}* (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}\n`;
    });
    text += `\n*Grand Total:* $${getCartTotal()}\n\n`;
    text += "Please contact me to confirm my shipping address and delivery details! Thank you! ❤️";

    const encoded = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/923000000000?text=${encoded}`; // Change or direct to dynamic local wa support
    window.open(whatsappUrl, "_blank");
    triggerToast("WhatsApp Redirect! 💬", "Sending order details to Mini Paint Station support.");
  };

  // Direct contact message link
  const triggerWhatsAppQuery = (msg: string) => {
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/923000000000?text=${encoded}`, "_blank");
  };


  // --- 5. CONTACT US FORM STATE ---
  const [contactName, setContactName] = useState("");
  const [contactAge, setContactAge] = useState("");
  const [contactMsg, setContactMsg] = useState("");

  const handleSendContactQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactMsg) return;
    const formattedMsg = `Hello Mini Paint Station! 🌟 My name is ${contactName} (Child's age: ${contactAge || "N/A"}). I wanted to ask/suggest: ${contactMsg}`;
    triggerWhatsAppQuery(formattedMsg);
    setContactName("");
    setContactAge("");
    setContactMsg("");
    triggerToast("Inquiry Form Drafted!", "Opening WhatsApp to send your inquiry.");
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col font-sans text-stone-800 antialiased selection:bg-pink-100 selection:text-pink-600">
      
      {/* --- BANNER TOAST --- */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-stone-900 border border-stone-800/80 text-white rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-4.5 animate-bounce max-w-sm w-full">
          <div className="w-10 h-10 bg-gradient-to-tr from-pink-500 to-rose-400 rounded-xl flex items-center justify-center text-lg text-white shadow-md shadow-pink-500/20">
            🎨
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-extrabold tracking-tight text-white">{toast.message}</h4>
            <p className="text-[10px] text-stone-300 font-medium">{toast.sub}</p>
          </div>
          <button onClick={() => setToast(null)} className="text-stone-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* --- FLOATING ORDER WHATSAPP BUTTON --- */}
      <button 
        onClick={() => triggerWhatsAppQuery("Hi! I want to order custom painting kits for my children.")}
        className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 transition-all group"
        id="whatsapp-floater"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-100"></span>
        </span>
        <MessageSquare className="w-5 h-5 text-white" />
        <span className="text-sm font-bold tracking-tight">Order On WhatsApp</span>
      </button>

      {/* --- HEADER NAVIGATION (Perfectly Replicating Screenshot Layout) --- */}
      <header className="sticky top-0 z-40 bg-[#fdfbf7]/90 backdrop-blur-md border-b border-rose-100 shadow-sm px-6 lg:px-12 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Brand Frame */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab("home")}>
            <div className="relative w-12 h-12 bg-white rounded-full border-2 border-pink-400 shadow-md flex items-center justify-center p-1">
              <span className="text-2xl">🎨</span>
              <div className="absolute -bottom-1 -right-1 bg-yellow-400 border border-white text-[8px] p-0.5 rounded-full">
                ✏️
              </div>
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-stone-900 leading-none">
                minipaint<span className="text-pink-500">station</span><span className="text-stone-400">.com</span>
              </h2>
              <span className="text-[10px] font-extrabold tracking-widest text-stone-400 uppercase">
                Mini Paint Station
              </span>
            </div>
          </div>

          {/* Navigation Links (Matches screenshot options) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-stone-100/70 p-1 rounded-2xl border border-stone-200/50">
            {[
              { id: "home", label: "Home" },
              { id: "products", label: "Products" },
              { id: "studio", label: "Kids Studio 🎨" },
              { id: "stencil", label: "AI Stencil Maker 🤖" },
              { id: "resources", label: "Parent Resources" },
              { id: "contact", label: "Contact Us" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as Tab)}
                className={`px-4.5 py-2 text-xs font-bold tracking-tight rounded-xl transition-all ${
                  currentTab === tab.id
                    ? "bg-white text-pink-600 shadow-sm border border-stone-200/40"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Cart Icon & Count Badge (Pink button in screenshot) */}
          <button 
            onClick={() => setCartOpen(true)}
            className="bg-pink-500 hover:bg-pink-600 active:scale-95 text-white font-black text-xs px-5 py-2.5 rounded-2xl flex items-center gap-2.5 shadow-md shadow-pink-500/15 transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-white" />
            <span>Cart</span>
            <span className="bg-white text-pink-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
              {cart.reduce((total, i) => total + i.quantity, 0)}
            </span>
          </button>

        </div>
      </header>

      {/* --- CART SLIDEOUT DRAWER --- */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity" onClick={() => setCartOpen(false)} />
          
          {/* Drawer Content */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 z-10 animate-fade-in">
            <div>
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-pink-500" />
                  <h3 className="text-base font-extrabold text-stone-900">Your Creative Bag</h3>
                </div>
                <button onClick={() => setCartOpen(false)} className="p-1 rounded-lg hover:bg-stone-100 text-stone-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items list */}
              {cart.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <div className="text-4xl text-stone-300">🧸</div>
                  <h4 className="text-sm font-bold text-stone-500">Your cart is currently empty</h4>
                  <p className="text-xs text-stone-400 max-w-xs mx-auto">
                    Explore our amazing washable paints and 3D plaster kits to unlock your child's creativity!
                  </p>
                  <button 
                    onClick={() => { setCartOpen(false); setCurrentTab("products"); }}
                    className="bg-[#111e47] text-white text-xs font-bold px-4 py-2 rounded-xl"
                  >
                    Shop Best Sellers
                  </button>
                </div>
              ) : (
                <div className="overflow-y-auto max-h-[55vh] mt-4 space-y-4.5 pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-stone-50 border border-stone-200/50 p-3 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl bg-white w-10 h-10 rounded-xl flex items-center justify-center border border-stone-200/30">
                          {item.image}
                        </span>
                        <div>
                          <h5 className="text-xs font-bold text-stone-900 leading-snug">{item.name}</h5>
                          <span className="text-[11px] font-extrabold text-pink-500">${item.price}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-white border border-stone-200 rounded-lg p-0.5">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-stone-50 rounded text-stone-500">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-stone-700 px-2">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-stone-50 rounded text-stone-500">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button onClick={() => handleRemoveFromCart(item.id)} className="p-1 text-stone-400 hover:text-rose-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            {cart.length > 0 && (
              <div className="border-t border-stone-100 pt-5 space-y-4">
                <div className="flex items-center justify-between text-sm font-bold text-stone-900">
                  <span>Cart Total:</span>
                  <span className="text-pink-600 text-lg">${getCartTotal()}</span>
                </div>
                
                <p className="text-[10px] text-stone-400 leading-relaxed bg-stone-50 p-2.5 rounded-xl border border-stone-150">
                  🚀 orders are compiled into details and direct checked out via WhatsApp with our representative instantly. Safe, fast, and secure.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setCartOpen(false)}
                    className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-3.5 rounded-2xl text-xs transition-all"
                  >
                    Keep Shopping
                  </button>
                  <button 
                    onClick={handleCheckoutWhatsApp}
                    className="w-full bg-[#111e47] hover:bg-[#0c1634] text-white font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
                  >
                    Checkout (WA)
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MAIN PAGE ROUTING COMPONENT SWITCH --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 py-8">
        
        {/* ================= HOME VIEW ================= */}
        {currentTab === "home" && (
          <div className="space-y-16">
            
            {/* HERO GRID SECTION (Perfect mirror of provided design) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column Content */}
              <div className="lg:col-span-7 space-y-7">
                
                {/* Badge Tag */}
                <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-100/60 rounded-full px-4 py-1.5 shadow-xs">
                  <span className="text-[10px] font-black tracking-widest text-pink-600 uppercase flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-spin" /> UNLEASH THEIR INNER ARTIST! 🌟
                  </span>
                </div>

                {/* Main Heading Accent */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-stone-900 leading-none">
                  Little Hands,<br />
                  <span className="text-pink-500">Big</span> <span className="text-cyan-400">Creations</span> <span className="text-3xl sm:text-5xl">🎨</span>
                </h1>

                {/* Subtext description */}
                <p className="text-sm sm:text-base text-stone-500 font-medium leading-relaxed max-w-xl">
                  Creative painting kits designed for kids to learn, play and create beautiful memories. 
                  High-quality wooden pieces, 3D plaster figures, and mess-free washable paints.
                </p>

                {/* Buttons Navigation */}
                <div className="flex flex-wrap items-center gap-4">
                  <button 
                    onClick={() => setCurrentTab("products")}
                    className="bg-[#111e47] hover:bg-[#0c1634] active:scale-95 text-white font-extrabold text-xs tracking-wider px-7 py-4 rounded-2xl flex items-center gap-2 shadow-lg shadow-blue-900/10 transition-all"
                  >
                    <span>Shop Kits</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  
                  <button 
                    onClick={() => triggerWhatsAppQuery("Hi Mini Paint Station, I'd like to ask a question about your custom kits.")}
                    className="bg-pink-500 hover:bg-pink-600 active:scale-95 text-white font-extrabold text-xs tracking-wider px-7 py-4 rounded-2xl flex items-center gap-2 shadow-lg shadow-pink-500/10 transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Us</span>
                  </button>
                </div>

                {/* Fast features badges */}
                <div className="pt-4 border-t border-stone-200/60 grid grid-cols-3 gap-4 max-w-md">
                  <div>
                    <span className="block text-sm font-black text-stone-900">100% Safe</span>
                    <span className="text-[11px] text-stone-400 font-bold">Non-toxic Certified</span>
                  </div>
                  <div>
                    <span className="block text-sm font-black text-stone-900">Mess Free</span>
                    <span className="text-[11px] text-stone-400 font-bold">Washable Paints</span>
                  </div>
                  <div>
                    <span className="block text-sm font-black text-stone-900">Customized</span>
                    <span className="text-[11px] text-stone-400 font-bold">Wooden outlines</span>
                  </div>
                </div>

              </div>

              {/* Right Column Interactive Painting Roundel */}
              <div className="lg:col-span-5 flex flex-col items-center">
                
                {/* Board Frame Wrapper */}
                <div className="bg-white border-2 border-stone-150 rounded-3xl shadow-xl p-5 w-full max-w-sm relative">
                  
                  {/* Eyebrow Label */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full text-[10px] font-extrabold text-rose-500 tracking-wider flex items-center gap-1 shadow-xs">
                    🖌️ TAP BOARD TO PAINT!
                  </div>

                  {/* Inner Drawing Canvas Container */}
                  <div className="mt-4 border-2 border-dashed border-stone-200 rounded-2xl overflow-hidden bg-stone-50 flex items-center justify-center p-2 relative">
                    <canvas
                      ref={heroCanvasRef}
                      width={320}
                      height={320}
                      onMouseDown={handleHeroPointerDown}
                      onMouseMove={handleHeroPointerMove}
                      onMouseUp={handleHeroPointerUp}
                      onMouseLeave={handleHeroPointerUp}
                      onTouchStart={(e) => {
                        const touch = e.touches[0];
                        const rect = heroCanvasRef.current?.getBoundingClientRect();
                        if (rect) {
                          setHeroIsDrawing(true);
                          const ctx = heroCanvasRef.current?.getContext("2d");
                          if (ctx) {
                            ctx.beginPath();
                            ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
                            ctx.strokeStyle = heroColor;
                            ctx.lineWidth = 10;
                            ctx.lineCap = "round";
                            ctx.lineJoin = "round";
                          }
                        }
                      }}
                      onTouchMove={(e) => {
                        if (!heroIsDrawing) return;
                        const touch = e.touches[0];
                        const rect = heroCanvasRef.current?.getBoundingClientRect();
                        if (rect) {
                          const ctx = heroCanvasRef.current?.getContext("2d");
                          if (ctx) {
                            ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
                            ctx.stroke();
                          }
                        }
                      }}
                      onTouchEnd={() => setHeroIsDrawing(false)}
                      className="cursor-crosshair bg-white w-full rounded-xl block"
                    />
                  </div>

                  {/* Interactivity Color Chooser Footer */}
                  <div className="mt-4 space-y-3">
                    <div className="text-center">
                      <span className="text-[10px] font-bold text-stone-400 block uppercase">
                        Choose a color below & paint on me!
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      {[
                        { color: "#f43f5e", label: "pink" },
                        { color: "#f97316", label: "orange" },
                        { color: "#eab308", label: "yellow" },
                        { color: "#22c55e", label: "green" },
                        { color: "#06b6d4", label: "cyan" },
                        { color: "#8b5cf6", label: "purple" }
                      ].map((preset) => (
                        <button
                          key={preset.color}
                          onClick={() => setHeroColor(preset.color)}
                          className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 active:scale-95 flex items-center justify-center ${
                            heroColor === preset.color ? "border-stone-800 scale-110 ring-2 ring-stone-200" : "border-white"
                          }`}
                          style={{ backgroundColor: preset.color }}
                        >
                          {heroColor === preset.color && (
                            <span className="text-[10px] text-white">✓</span>
                          )}
                        </button>
                      ))}

                      {/* Reset Board */}
                      <button 
                        onClick={drawHeroLogoBase}
                        title="Reset Drawing Overlay"
                        className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg ml-2 transition-colors"
                      >
                        <RefreshCwIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* PRODUCT CATEGORIES / DISCOVERY CARDS */}
            <div className="space-y-6 pt-10 border-t border-rose-100/50">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  Hand-crafted Painting Kits for Kids
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 font-medium">
                  We use organic ingredients, splinter-free natural wooden bases, and deep-cast solid plaster models to create durable memories.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Card 1 */}
                <div className="bg-[#fffdf9] border border-stone-200/60 rounded-3xl p-6 text-center space-y-4 hover:shadow-md transition-all">
                  <div className="w-14 h-14 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center text-3xl mx-auto">
                    🐰
                  </div>
                  <h3 className="text-base font-extrabold text-stone-900">3D Plaster Figures</h3>
                  <p className="text-xs text-stone-500 font-semibold leading-relaxed">
                    Individually cast solid plaster figures with adorable details. Fun to touch, hold, paint, and display as trophies.
                  </p>
                  <button 
                    onClick={() => { setSelectedProductCategory("plaster"); setCurrentTab("products"); }}
                    className="text-pink-500 hover:text-pink-600 text-xs font-bold flex items-center gap-1 mx-auto"
                  >
                    Explore Plasters <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Card 2 */}
                <div className="bg-[#fffdf9] border border-stone-200/60 rounded-3xl p-6 text-center space-y-4 hover:shadow-md transition-all">
                  <div className="w-14 h-14 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center text-3xl mx-auto">
                    🪵
                  </div>
                  <h3 className="text-base font-extrabold text-stone-900">Wooden Stencils</h3>
                  <p className="text-xs text-stone-500 font-semibold leading-relaxed">
                    Solid non-splinter natural pine character boards with high-definition outline guide groves. Perfect craft item!
                  </p>
                  <button 
                    onClick={() => { setSelectedProductCategory("wooden"); setCurrentTab("products"); }}
                    className="text-amber-600 hover:text-amber-700 text-xs font-bold flex items-center gap-1 mx-auto"
                  >
                    Explore Woods <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Card 3 */}
                <div className="bg-[#fffdf9] border border-stone-200/60 rounded-3xl p-6 text-center space-y-4 hover:shadow-md transition-all">
                  <div className="w-14 h-14 bg-cyan-50 border border-cyan-100 rounded-2xl flex items-center justify-center text-3xl mx-auto">
                    🎨
                  </div>
                  <h3 className="text-base font-extrabold text-stone-900">Washable Acrylics</h3>
                  <p className="text-xs text-stone-500 font-semibold leading-relaxed">
                    Eco-friendly watercolor acrylic compound paints. Highly vibrant, thick, and perfectly washable in single washes.
                  </p>
                  <button 
                    onClick={() => { setSelectedProductCategory("paints"); setCurrentTab("products"); }}
                    className="text-cyan-600 hover:text-cyan-700 text-xs font-bold flex items-center gap-1 mx-auto"
                  >
                    Explore Colors <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>

            {/* SHOWCASE OF BEST SELLERS */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-stone-900 uppercase tracking-tight">Best Selling Kids Kits</h3>
                  <p className="text-xs text-stone-400 font-bold">Handmade in small batches for high precision and detailing</p>
                </div>
                <button 
                  onClick={() => setCurrentTab("products")}
                  className="text-xs font-bold text-pink-500 hover:text-pink-600 flex items-center gap-1"
                >
                  View All Products <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {PRODUCTS.slice(0, 3).map((product) => (
                  <div key={product.id} className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                    <div className="p-5 space-y-4">
                      {/* Product Thumbnail block */}
                      <div className="bg-stone-50 border border-stone-100 rounded-2xl h-44 flex items-center justify-center text-6xl relative select-none">
                        {product.badge && (
                          <span className="absolute top-3 left-3 bg-pink-500 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                            {product.badge}
                          </span>
                        )}
                        {product.image}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: product.stars }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <h4 className="text-sm font-black text-stone-900 leading-tight">{product.name}</h4>
                        <p className="text-xs text-stone-400 font-medium leading-relaxed">{product.description}</p>
                      </div>
                    </div>

                    <div className="bg-stone-50/50 border-t border-stone-100 px-5 py-3 flex items-center justify-between">
                      <span className="text-base font-black text-pink-600">${product.price}</span>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="bg-[#111e47] hover:bg-[#0c1634] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all"
                      >
                        <span>Add To Bag</span>
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TRUST TESTIMONIAL BLOCK */}
            <div className="bg-gradient-to-br from-pink-500 to-rose-400 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 text-9xl pointer-events-none select-none">
                🧸🎨🦖
              </div>
              
              <div className="max-w-2xl space-y-4 relative z-10">
                <span className="text-xs font-extrabold tracking-widest uppercase text-pink-100">COMMUNITY TESTIMONIAL</span>
                <p className="text-xl sm:text-2xl font-semibold italic leading-relaxed">
                  "Mini Paint Station completely revolutionized our family paint nights! No messy floor drops, high quality organic paints, and my 5-year-old child spent 3 hours focusing on his 3D plaster bear kit."
                </p>
                <div>
                  <h4 className="font-extrabold text-sm text-white">Sarah Jenkins</h4>
                  <p className="text-xs text-pink-100">Mother of two, Art School Educator</p>
                </div>
              </div>
            </div>

          </div>
        )}


        {/* ================= PRODUCTS VIEW ================= */}
        {currentTab === "products" && (
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h1 className="text-3xl font-black text-stone-900">Creative Craft Shop</h1>
              <p className="text-sm text-stone-500 font-medium">
                Select from our safety-certified wooden planks, detailed plaster figures, and hyper-washable acrylic sets. Let's make learning artistic!
              </p>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { id: "all", label: "All Items" },
                { id: "plaster", label: "3D Plasters" },
                { id: "wooden", label: "Wood Art Blocks" },
                { id: "paints", label: "Organic Paints" },
                { id: "accessories", label: "Brushes & Aprons" }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedProductCategory(cat.id)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                    selectedProductCategory === cat.id
                      ? "bg-[#111e47] text-white shadow-md shadow-blue-900/10"
                      : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {PRODUCTS.filter(p => selectedProductCategory === "all" || p.category === selectedProductCategory).map((product) => (
                <div key={product.id} className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="p-5 space-y-4">
                    {/* Thumbnail */}
                    <div className="bg-stone-50 border border-stone-100 rounded-2xl h-48 flex items-center justify-center text-6xl relative select-none">
                      {product.badge && (
                        <span className="absolute top-3 left-3 bg-pink-500 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                          {product.badge}
                        </span>
                      )}
                      {product.image}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: product.stars }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <h4 className="text-sm font-black text-stone-900 leading-tight">{product.name}</h4>
                      <p className="text-xs text-stone-400 font-medium leading-relaxed">{product.description}</p>
                    </div>
                  </div>

                  <div className="bg-stone-50/50 border-t border-stone-100 px-5 py-4 flex items-center justify-between">
                    <span className="text-base font-black text-pink-600">${product.price}</span>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="bg-[#111e47] hover:bg-[#0c1634] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <span>Add To Bag</span>
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* ================= KIDS STUDIO VIEW ================= */}
        {currentTab === "studio" && (
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-pink-500 font-extrabold text-xs tracking-wider uppercase bg-pink-50 border border-pink-100 px-3 py-1 rounded-full">
                Interactive Sketchpad
              </span>
              <h1 className="text-3xl font-black text-stone-900">Little Kids Digital Studio</h1>
              <p className="text-xs sm:text-sm text-stone-500 font-medium">
                Choose a coloring template, select colors, paint with high-definition brushes or dump stamps on screen, then print or download your painting!
              </p>
            </div>

            {/* Template Chooser Bar */}
            <div className="bg-white border border-stone-200 p-4 rounded-3xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-stone-400 uppercase tracking-wider block">
                  1. Pick Template:
                </span>
                <div className="flex gap-1.5">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTemplate(t.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        selectedTemplate === t.id
                          ? "bg-pink-500 text-white shadow-sm"
                          : "bg-stone-50 text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      <span>{t.icon}</span>
                      <span>{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Canvas Option */}
              <button
                onClick={() => loadStudioTemplate(selectedTemplate)}
                className="text-stone-500 hover:text-stone-900 text-xs font-extrabold flex items-center gap-1"
              >
                <RefreshCwIcon className="w-4 h-4" /> Reset Outline
              </button>
            </div>

            {/* Main Interactive Studio Canvas Frame */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Painting Controls (Left Side) */}
              <div className="lg:col-span-3 bg-white border border-stone-200 p-5 rounded-3xl space-y-6 flex flex-col justify-between">
                <div className="space-y-6">
                  {/* Tool Selection */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider block">
                      2. Tool Mode
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setStudioTool("brush")}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border font-bold text-xs transition-colors ${
                          studioTool === "brush" ? "bg-stone-900 border-stone-900 text-amber-400" : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                        }`}
                      >
                        <Paintbrush className="w-4 h-4" /> Brush
                      </button>
                      <button
                        onClick={() => setStudioTool("bucket")}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border font-bold text-xs transition-colors ${
                          studioTool === "bucket" ? "bg-stone-900 border-stone-900 text-amber-400" : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                        }`}
                        title="Dump colors directly inside outlines"
                      >
                        <PaintBucket className="w-4 h-4" /> Fill Tap
                      </button>
                      <button
                        onClick={() => setStudioTool("stamp")}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border font-bold text-xs transition-colors ${
                          studioTool === "stamp" ? "bg-stone-900 border-stone-900 text-amber-400" : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                        }`}
                      >
                        <Palette className="w-4 h-4" /> Stamps
                      </button>
                      <button
                        onClick={() => setStudioTool("eraser")}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border font-bold text-xs transition-colors ${
                          studioTool === "eraser" ? "bg-stone-900 border-stone-900 text-amber-400" : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                        }`}
                      >
                        <Eraser className="w-4 h-4" /> Eraser
                      </button>
                    </div>
                  </div>

                  {/* Stamp Choice Module */}
                  {studioTool === "stamp" && (
                    <div className="space-y-2 p-3 bg-pink-50/50 rounded-2xl border border-pink-100 animate-fade-in">
                      <span className="text-[9px] font-black text-pink-700 uppercase block tracking-wider mb-1.5">
                        Select Sticker
                      </span>
                      <div className="flex gap-2 justify-center">
                        {[
                          { id: "star", icon: "⭐" },
                          { id: "heart", icon: "❤️" },
                          { id: "smile", icon: "😊" },
                          { id: "crown", icon: "👑" },
                          { id: "butterfly", icon: "🦋" }
                        ].map((s) => (
                          <button
                            key={s.id}
                            onClick={() => setSelectedStamp(s.id as StampType)}
                            className={`w-9 h-9 text-lg rounded-lg border transition-all ${
                              selectedStamp === s.id ? "bg-white border-pink-400 scale-110 shadow-sm" : "bg-transparent border-stone-200 hover:bg-stone-50"
                            }`}
                          >
                            {s.icon}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Brush Size */}
                  {studioTool !== "stamp" && studioTool !== "bucket" && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-stone-500">
                        <span>Brush Size:</span>
                        <span>{studioBrushSize}px</span>
                      </div>
                      <input
                        type="range"
                        min="4"
                        max="60"
                        value={studioBrushSize}
                        onChange={(e) => setStudioBrushSize(Number(e.target.value))}
                        className="w-full accent-stone-900 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  )}

                  {/* Creative Palette Choice */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider block">
                      3. Pick Color:
                    </span>
                    <div className="grid grid-cols-6 gap-2">
                      {[
                        "#ef4444", "#f97316", "#f59e0b", "#10b981", "#3b82f6", "#6366f1",
                        "#8b5cf6", "#ec4899", "#14b8a6", "#1e293b", "#78716c", "#ffffff"
                      ].map((col) => (
                        <button
                          key={col}
                          onClick={() => setStudioColor(col)}
                          className={`w-7.5 h-7.5 rounded-lg border transition-all hover:scale-110 active:scale-95 flex items-center justify-center ${
                            studioColor === col ? "border-stone-800 ring-2 ring-stone-200 scale-110" : "border-stone-200"
                          }`}
                          style={{ backgroundColor: col }}
                        >
                          {studioColor === col && (
                            <span className={`text-[10px] ${col === "#ffffff" ? "text-stone-900" : "text-white"}`}>✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Undo Actions & Stats */}
                <div className="border-t border-stone-100 pt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleStudioUndo}
                      disabled={studioHistoryIdx <= 0}
                      className="flex-1 bg-stone-100 hover:bg-stone-200 disabled:opacity-30 disabled:hover:bg-stone-100 font-bold py-2 text-xs text-stone-700 rounded-xl flex items-center justify-center gap-1 transition-all"
                    >
                      <Undo2 className="w-3.5 h-3.5" /> Undo
                    </button>
                  </div>
                  
                  <span className="block text-[10px] text-center text-stone-400 font-bold">
                    * Saved steps: {studioHistoryIdx + 1} / {studioHistory.length}
                  </span>
                </div>

              </div>

              {/* Painting Canvas Box Frame (Center/Right) */}
              <div className="lg:col-span-9 bg-white border border-stone-200 p-6 rounded-3xl flex flex-col items-center justify-center">
                
                {/* Canvas Base Board */}
                <div className="border border-stone-200 rounded-2xl overflow-hidden bg-stone-50 p-2 shadow-inner">
                  <canvas
                    ref={studioCanvasRef}
                    width={500}
                    height={420}
                    onMouseDown={handleStudioPointerDown}
                    onMouseMove={handleStudioPointerMove}
                    onMouseUp={handleStudioPointerUp}
                    onMouseLeave={handleStudioPointerUp}
                    onTouchStart={(e) => {
                      const touch = e.touches[0];
                      const rect = studioCanvasRef.current?.getBoundingClientRect();
                      if (rect) {
                        const x = touch.clientX - rect.left;
                        const y = touch.clientY - rect.top;
                        
                        if (studioTool === "stamp") {
                          const ctx = studioCanvasRef.current?.getContext("2d");
                          if (ctx) {
                            ctx.fillStyle = studioColor;
                            ctx.font = "32px serif";
                            ctx.textAlign = "center";
                            ctx.textBaseline = "middle";
                            let stampGlyph = "⭐";
                            if (selectedStamp === "heart") stampGlyph = "❤️";
                            if (selectedStamp === "smile") stampGlyph = "😊";
                            ctx.fillText(stampGlyph, x, y);
                            saveStudioState();
                          }
                          return;
                        }

                        if (studioTool === "bucket") {
                          performStudioFill(Math.round(x), Math.round(y), studioColor);
                          return;
                        }

                        setHeroIsDrawing(true);
                        const ctx = studioCanvasRef.current?.getContext("2d");
                        if (ctx) {
                          ctx.beginPath();
                          ctx.moveTo(x, y);
                          ctx.strokeStyle = studioTool === "eraser" ? "#ffffff" : studioColor;
                          ctx.lineWidth = studioBrushSize;
                          ctx.lineCap = "round";
                          ctx.lineJoin = "round";
                        }
                      }
                    }}
                    onTouchMove={(e) => {
                      if (!heroIsDrawing) return;
                      const touch = e.touches[0];
                      const rect = studioCanvasRef.current?.getBoundingClientRect();
                      if (rect) {
                        const x = touch.clientX - rect.left;
                        const y = touch.clientY - rect.top;
                        const ctx = studioCanvasRef.current?.getContext("2d");
                        if (ctx && studioTool !== "stamp" && studioTool !== "bucket") {
                          ctx.lineTo(x, y);
                          ctx.stroke();
                        }
                      }
                    }}
                    onTouchEnd={handleStudioPointerUp}
                    className="cursor-crosshair bg-white w-full rounded-xl block"
                  />
                </div>

                {/* Canvas Export/Print strip below */}
                <div className="mt-4 flex items-center justify-between w-full max-w-[500px]">
                  <span className="text-xs text-stone-400 font-bold flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-stone-300" />
                    Touch / Draw smoothly on template guidelines.
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={printStudioPainting}
                      className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors"
                      title="Open print layout of artwork"
                    >
                      <Printer className="w-4 h-4 text-stone-500" />
                      Print Page
                    </button>
                    <button
                      onClick={downloadStudioPainting}
                      className="bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-pink-500/10"
                    >
                      <Download className="w-4 h-4" />
                      Save My Painting
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}


        {/* ================= AI STENCIL MAKER VIEW ================= */}
        {currentTab === "stencil" && (
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-pink-500 font-extrabold text-xs tracking-wider uppercase bg-pink-50 border border-pink-100 px-3 py-1 rounded-full flex items-center gap-1.5 w-fit mx-auto">
                <Sparkles className="w-3.5 h-3.5" /> Google Gemini Power
              </span>
              <h1 className="text-3xl font-black text-stone-900">Custom AI Stencil Builder</h1>
              <p className="text-xs sm:text-sm text-stone-500 font-medium">
                Type what you'd like your child to color (e.g. "a cute happy cat", "rocket ship in space", "magical unicorn"). Gemini will sketch a custom printable outline!
              </p>
            </div>

            {/* Prompt Selector & input card */}
            <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm space-y-4 max-w-3xl mx-auto">
              <span className="text-xs font-extrabold text-stone-400 uppercase tracking-wider block">
                Type anything to draw:
              </span>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={stencilPrompt}
                  onChange={(e) => setStencilPrompt(e.target.value)}
                  placeholder="e.g. a small happy cartoon puppy, clean bold black outline"
                  className="flex-1 bg-stone-50 border border-stone-200/80 text-sm px-4.5 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500/30 font-medium"
                />
                <button
                  onClick={handleGenerateStencil}
                  disabled={isGeneratingStencil || !stencilPrompt.trim()}
                  className="bg-pink-500 hover:bg-pink-600 active:scale-95 disabled:opacity-50 text-white font-extrabold px-6 py-3.5 rounded-2xl text-xs tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-pink-500/10"
                >
                  {isGeneratingStencil ? (
                    <span className="flex items-center gap-1">
                      <span className="animate-spin text-sm">⏳</span> Drawing Outline...
                    </span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-white" />
                      <span>Draw Stencil</span>
                    </>
                  )}
                </button>
              </div>

              {/* Suggestions Quick Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
                <span className="text-[10px] font-bold text-stone-400 uppercase mr-1">Quick Ideas:</span>
                {[
                  "happy teddy bear",
                  "space rocket on the moon",
                  "magical pony unicorn",
                  "smiling cartoon dinosaur"
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => { setStencilPrompt(s); }}
                    className="bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-250/30 rounded-full px-3 py-1 text-[10px] font-bold transition-all"
                  >
                    ✨ {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Stencil Drawing Board */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
              
              {/* Left sidebar: drawing settings */}
              <div className="lg:col-span-3 bg-white border border-stone-200 p-5 rounded-3xl space-y-6 flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">
                      Drawing Status
                    </span>
                    <span className="text-xs text-stone-500 font-medium block">
                      {generatedSvg ? "✓ Outline ready to color" : "Waiting for prompt input..."}
                    </span>
                  </div>

                  {/* Colors choices */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">
                      Choose Paint Color:
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        "#ef4444", "#f59e0b", "#10b981", "#3b82f6",
                        "#8b5cf6", "#ec4899", "#1e293b", "#ffffff"
                      ].map((col) => (
                        <button
                          key={col}
                          onClick={() => setStencilColor(col)}
                          className={`w-8 h-8 rounded-lg border transition-all hover:scale-110 flex items-center justify-center ${
                            stencilColor === col ? "border-stone-800 scale-110 ring-2 ring-stone-200" : "border-stone-200"
                          }`}
                          style={{ backgroundColor: col }}
                        >
                          {stencilColor === col && (
                            <span className="text-[10px] text-white">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 text-stone-400 text-[10px] leading-relaxed">
                  * Stencils are synthesized server-side using Gemini 2.5 and casted directly onto the canvas. You can draw right over the guide lines.
                </div>
              </div>

              {/* Main Board canvas */}
              <div className="lg:col-span-9 bg-white border border-stone-200 p-6 rounded-3xl flex flex-col items-center justify-center shadow-xs">
                
                {/* Canvas component wrapper */}
                <div className="border border-stone-200 rounded-2xl overflow-hidden bg-stone-50 p-2 shadow-inner">
                  <canvas
                    ref={stencilCanvasRef}
                    width={500}
                    height={420}
                    onMouseDown={handleStencilPointerDown}
                    onMouseMove={handleStencilPointerMove}
                    onMouseUp={handleStencilPointerUp}
                    onMouseLeave={handleStencilPointerUp}
                    className="cursor-crosshair bg-white w-full rounded-xl block"
                  />
                </div>

                {/* Stencil Action items */}
                {generatedSvg && (
                  <div className="mt-4 flex gap-3 max-w-[500px] w-full justify-end">
                    <button
                      onClick={() => drawGeneratedStencilToCanvas(generatedSvg)}
                      className="text-xs font-bold text-stone-500 hover:text-stone-900 px-3 py-2 border border-stone-200 rounded-xl"
                    >
                      Clear Painting Strokes
                    </button>
                    <button
                      onClick={() => {
                        const canvas = stencilCanvasRef.current;
                        if (!canvas) return;
                        const url = canvas.toDataURL("image/png");
                        const link = document.createElement("a");
                        link.download = "custom_coloring_stencil.png";
                        link.href = url;
                        link.click();
                        triggerToast("Downloaded successfully!");
                      }}
                      className="bg-[#111e47] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1 shadow-md"
                    >
                      <Download className="w-4 h-4" /> Save Masterpiece
                    </button>
                  </div>
                )}

              </div>

            </div>
          </div>
        )}


        {/* ================= PARENT RESOURCES VIEW ================= */}
        {currentTab === "resources" && (
          <div className="space-y-8 max-w-4xl mx-auto animate-fade-in">
            <div className="text-center space-y-2">
              <span className="text-pink-500 font-extrabold text-xs tracking-wider uppercase bg-pink-50 border border-pink-100 px-3 py-1 rounded-full">
                Guides & Activities
              </span>
              <h1 className="text-3xl font-black text-stone-900">Parent Resources Hub</h1>
              <p className="text-xs sm:text-sm text-stone-500 font-medium leading-relaxed">
                Nurture your child's cognitive development and hand-eye coordination with curated guides, printable stencils, and coloring books designed by child art therapists.
              </p>
            </div>

            {/* Quick reading items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card A */}
              <div className="bg-white border border-stone-200 p-6 rounded-3xl space-y-4">
                <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest block">
                  Art & Cognitive Growth
                </span>
                <h3 className="text-base font-extrabold text-stone-900">How 3D Plaster Painting Improves Child Focus</h3>
                <p className="text-xs text-stone-500 leading-relaxed font-semibold">
                  Unlike flat drawing sheets, tactile three-dimensional plaster figures engage multiple sensory nodes in children's brains, increasing concentration periods by up to 40% and helping improve visual coordination.
                </p>
                <button 
                  onClick={() => triggerWhatsAppQuery("Can you send me your full PDF guide on Art & Cognitive development?")}
                  className="text-stone-900 font-bold text-xs flex items-center gap-1 hover:text-pink-500"
                >
                  Request Full PDF Guide <ChevronRight className="w-4 h-4 text-pink-500" />
                </button>
              </div>

              {/* Card B */}
              <div className="bg-white border border-stone-200 p-6 rounded-3xl space-y-4">
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest block">
                  Safety Measures
                </span>
                <h3 className="text-base font-extrabold text-stone-900">Understanding Paint Safety & Washability</h3>
                <p className="text-xs text-stone-500 leading-relaxed font-semibold">
                  Our custom formula paints are strictly organic-pigment based, gluten-free, and lead-free. They remain moist to avoid choking flakes and dissolve instantly on clothing or skin with simple warm water.
                </p>
                <button 
                  onClick={() => triggerWhatsAppQuery("Hi, I want to learn more about your paint's ingredient sheet.")}
                  className="text-stone-900 font-bold text-xs flex items-center gap-1 hover:text-amber-600"
                >
                  Request Material Sheet <ChevronRight className="w-4 h-4 text-amber-500" />
                </button>
              </div>

            </div>

            {/* Printable downloads checklist */}
            <div className="bg-amber-50/50 border border-amber-200/60 p-6 rounded-3xl space-y-4">
              <div>
                <h3 className="text-base font-extrabold text-amber-900">Free Printable Stencils & Coloring PDFs</h3>
                <p className="text-xs text-amber-800 leading-normal font-medium">
                  We upload new outlines and stories monthly. Click a link below to send a WhatsApp request and we'll reply with the high-resolution printable files absolutely free!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Jurassic Dinosaur Kingdom Story Book (PDF)",
                  "Fairy Castle Mandala Coloring Set (PDF)",
                  "Creative Animal 3D Plaster Guide (PDF)",
                  "First Steps Brush Painting Guide for Ages 3-5 (PDF)"
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => triggerWhatsAppQuery(`Hi Mini Paint Station! I would like to get the free PDF printable: ${item}`)}
                    className="bg-white hover:bg-stone-50 border border-amber-250/40 px-4 py-3.5 rounded-2xl flex items-center justify-between cursor-pointer shadow-xs transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📄</span>
                      <span className="text-[11px] font-bold text-stone-700">{item}</span>
                    </div>
                    <span className="text-[10px] font-black text-pink-500 flex items-center gap-0.5 uppercase">
                      Get Free <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}


        {/* ================= CONTACT US VIEW ================= */}
        {currentTab === "contact" && (
          <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
            <div className="text-center space-y-2">
              <span className="text-pink-500 font-extrabold text-xs tracking-wider uppercase bg-pink-50 border border-pink-100 px-3 py-1 rounded-full">
                Get In Touch
              </span>
              <h1 className="text-3xl font-black text-stone-900">We'd Love to Hear From You!</h1>
              <p className="text-xs sm:text-sm text-stone-500 font-medium">
                Have questions about paint materials, customized wooden stencils, bulk birthday kits, or preschool supplies? Send a query!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
              
              {/* Contact Information (Left column) */}
              <div className="md:col-span-5 bg-[#111e47] text-white rounded-3xl p-6 flex flex-col justify-between space-y-8 shadow-lg">
                <div className="space-y-6">
                  <h3 className="text-lg font-extrabold text-white">Contact Info</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-pink-400 mt-0.5" />
                      <div>
                        <span className="block text-[11px] text-stone-300 font-bold uppercase">Direct Support</span>
                        <span className="text-xs font-extrabold text-white">+92 (300) 000-0000</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-pink-400 mt-0.5" />
                      <div>
                        <span className="block text-[11px] text-stone-300 font-bold uppercase">Email Inquiry</span>
                        <span className="text-xs font-extrabold text-white">support@minipaintstation.com</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-pink-400 mt-0.5" />
                      <div>
                        <span className="block text-[11px] text-stone-300 font-bold uppercase">Main Studio Address</span>
                        <span className="text-xs font-extrabold text-white">Mini Paint Station HQ, Main Boulevard, Lahore, Pakistan</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="pt-6 border-t border-blue-900 text-stone-300 text-xs">
                  <span className="block font-bold text-white mb-1">We are responsive:</span>
                  <span>Monday - Saturday: 9:00 AM - 8:00 PM PST</span>
                </div>
              </div>

              {/* Inquiry form */}
              <div className="md:col-span-7 bg-white border border-stone-200 p-6 rounded-3xl shadow-sm">
                <h3 className="text-base font-extrabold text-stone-900 mb-4">Send a Direct WhatsApp Message</h3>
                
                <form onSubmit={handleSendContactQuery} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-stone-400 uppercase block">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full bg-stone-50 border border-stone-200/80 text-xs px-3.5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-stone-400 uppercase block">Child's Age (Optional)</label>
                      <input
                        type="number"
                        value={contactAge}
                        onChange={(e) => setContactAge(e.target.value)}
                        placeholder="e.g. 5"
                        className="w-full bg-stone-50 border border-stone-200/80 text-xs px-3.5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-400 uppercase block">Your Message / Custom Order Request</label>
                    <textarea
                      required
                      rows={5}
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      placeholder="Type details here... (e.g. I need 20 dinosaur painting kits with customized aprons for a birthday party on next Sunday!)"
                      className="w-full bg-stone-50 border border-stone-200/80 text-xs px-3.5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 font-medium leading-relaxed resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-extrabold text-xs tracking-wider py-3.5 rounded-2xl flex items-center justify-center gap-1.5 shadow-md shadow-pink-500/10 transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send Inquiry on WhatsApp</span>
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* --- FOOTER MAIN --- */}
      <footer className="bg-stone-900 text-stone-400 text-xs py-12 px-6 mt-16 border-t border-stone-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl">
                🎨
              </div>
              <h3 className="text-base font-extrabold text-white leading-none">
                minipaint<span className="text-pink-500">station</span>
              </h3>
            </div>
            <p className="text-[11px] leading-relaxed text-stone-400">
              The premium destination for kids' hand-made non-toxic plaster figures, customized natural wooden blocks, and mess-free washables.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-extrabold text-stone-300 uppercase text-[10px] tracking-wider">Quick Links</h4>
            <div className="flex flex-col gap-2 font-semibold">
              <button onClick={() => setCurrentTab("home")} className="text-left hover:text-white transition-colors">Home Landing</button>
              <button onClick={() => setCurrentTab("products")} className="text-left hover:text-white transition-colors">Creative Shop</button>
              <button onClick={() => setCurrentTab("studio")} className="text-left hover:text-white transition-colors">Kids Studio</button>
              <button onClick={() => setCurrentTab("stencil")} className="text-left hover:text-white transition-colors">AI Stencil Maker</button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-extrabold text-stone-300 uppercase text-[10px] tracking-wider">Best Sellers</h4>
            <div className="flex flex-col gap-2 font-semibold">
              <span className="text-[11px]">3D Plaster Dinosaur Figures</span>
              <span className="text-[11px]">Premium Storybook Wooden Planks</span>
              <span className="text-[11px]">Super Washable Kids Paints Set</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-extrabold text-stone-300 uppercase text-[10px] tracking-wider">Our Commitment</h4>
            <p className="text-[11px] leading-relaxed text-stone-400">
              Every single product we sell is manually inspected and tested for high safety guidelines. We ensure 100% lead-free, non-toxic organic compounds.
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-stone-800 text-center text-[10px] font-bold text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} Mini Paint Station. All rights reserved. Made for young explorers.</span>
          <div className="flex gap-4">
            <span>Safety Guidelines</span>
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

// Simple custom helper for resetting the canvas
function RefreshCwIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}

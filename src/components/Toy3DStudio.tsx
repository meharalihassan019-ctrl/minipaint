import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, RotateCw, Palette, Eye, ZoomIn, ZoomOut, Play, Pause, ShoppingBag, CheckCircle, RefreshCcw, Layers } from "lucide-react";

interface Toy3DStudioProps {
  onOrderKit?: (toyName: string, colorsUsed: string[]) => void;
  triggerToast?: (title: string, msg: string) => void;
}

// Preset paint palette
const PALETTE_COLORS = [
  { name: "Bubblegum Pink", hex: "#ff4b91" },
  { name: "Sunshine Yellow", hex: "#facc15" },
  { name: "Sky Blue", hex: "#38bdf8" },
  { name: "Mint Green", hex: "#4ade80" },
  { name: "Royal Purple", hex: "#a855f7" },
  { name: "Coral Red", hex: "#f43f5e" },
  { name: "Electric Orange", hex: "#fb923c" },
  { name: "Ceramic White", hex: "#f8fafc" },
  { name: "Midnight Black", hex: "#1e293b" },
  { name: "Metallic Gold", hex: "#eab308" }
];

export const Toy3DStudio: React.FC<Toy3DStudioProps> = ({ onOrderKit, triggerToast }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  
  // Active state
  const [selectedToy, setSelectedToy] = useState<"bear" | "rocket" | "donut" | "star">("bear");
  const [activeColor, setActiveColor] = useState<string>("#ff4b91");
  const [selectedPart, setSelectedPart] = useState<string>("main");
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [lightPreset, setLightPreset] = useState<"studio" | "warm" | "cyber">("studio");
  
  // Custom part colors for current model
  const [partColors, setPartColors] = useState<{ [key: string]: string }>({
    main: "#f8fafc", // default unpainted ceramic white
    accent: "#f8fafc",
    base: "#f8fafc",
    details: "#f8fafc"
  });

  // Three.js refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const lightsGroupRef = useRef<THREE.Group | null>(null);

  // Drag rotation tracking
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Initialize Three Scene
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 500;
    const height = mountRef.current.clientHeight || 420;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0f172a); // dark slate

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2, 7);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(renderer.domElement);

    // 4. Studio Environment Floor & Grid
    const floorGeo = new THREE.PlaneGeometry(12, 12);
    const floorMat = new THREE.MeshStandardMaterial({ 
      color: 0x1e293b, 
      roughness: 0.8, 
      metalness: 0.2 
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.8;
    floor.receiveShadow = true;
    scene.add(floor);

    const grid = new THREE.GridHelper(12, 12, 0xec4899, 0x334155);
    grid.position.y = -1.79;
    scene.add(grid);

    // 5. Lighting
    const lightsGroup = new THREE.Group();
    lightsGroupRef.current = lightsGroup;
    scene.add(lightsGroup);
    setupLights(lightsGroup, lightPreset);

    // 6. Model Group
    const modelGroup = new THREE.Group();
    modelGroupRef.current = modelGroup;
    scene.add(modelGroup);

    build3DModel(selectedToy, modelGroup, partColors);

    // 7. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (modelGroupRef.current && autoRotate && !isDraggingRef.current) {
        modelGroupRef.current.rotation.y += 0.008;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Resize listener
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Update Model on toy selection or part color changes
  useEffect(() => {
    if (modelGroupRef.current) {
      build3DModel(selectedToy, modelGroupRef.current, partColors);
    }
  }, [selectedToy, partColors]);

  // Update Lights when preset changes
  useEffect(() => {
    if (lightsGroupRef.current) {
      setupLights(lightsGroupRef.current, lightPreset);
    }
  }, [lightPreset]);

  // Setup Lighting Configurations
  const setupLights = (group: THREE.Group, preset: "studio" | "warm" | "cyber") => {
    // Clear old lights
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    group.add(ambient);

    if (preset === "studio") {
      const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
      mainLight.position.set(5, 8, 5);
      mainLight.castShadow = true;
      group.add(mainLight);

      const fillLight = new THREE.DirectionalLight(0xf472b6, 0.5); // pink fill
      fillLight.position.set(-5, 3, -2);
      group.add(fillLight);
    } else if (preset === "warm") {
      const sunLight = new THREE.DirectionalLight(0xfde047, 1.4); // warm yellow
      sunLight.position.set(6, 6, 4);
      sunLight.castShadow = true;
      group.add(sunLight);

      const rimLight = new THREE.DirectionalLight(0xf97316, 0.8);
      rimLight.position.set(-4, 2, -4);
      group.add(rimLight);
    } else if (preset === "cyber") {
      const neon1 = new THREE.PointLight(0x06b6d4, 2, 10);
      neon1.position.set(3, 3, 3);
      group.add(neon1);

      const neon2 = new THREE.PointLight(0xec4899, 2, 10);
      neon2.position.set(-3, 2, -2);
      group.add(neon2);
    }
  };

  // Build Procedural 3D Ceramic Models with Ceramic Plaster Shading
  const build3DModel = (
    toyType: "bear" | "rocket" | "donut" | "star", 
    group: THREE.Group,
    colors: { [key: string]: string }
  ) => {
    // Clear previous children
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
    }

    const createMaterial = (hexColor: string, isAcc: boolean = false) => {
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(hexColor),
        roughness: isAcc ? 0.3 : 0.6, // ceramic plaster gloss balance
        metalness: hexColor === "#eab308" ? 0.8 : 0.05,
      });
    };

    const mainMat = createMaterial(colors.main || "#f8fafc");
    const accentMat = createMaterial(colors.accent || "#f8fafc", true);
    const baseMat = createMaterial(colors.base || "#f8fafc");
    const detailMat = createMaterial(colors.details || "#1e293b");

    if (toyType === "bear") {
      // TEDDY BEAR FIGURINE
      // Head
      const head = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), mainMat);
      head.position.y = 0.5;
      head.castShadow = true;
      group.add(head);

      // Snout
      const snout = new THREE.Mesh(new THREE.SphereGeometry(0.35, 24, 24), accentMat);
      snout.position.set(0, 0.35, 0.8);
      snout.scale.set(1, 0.8, 0.7);
      group.add(snout);

      // Nose
      const nose = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), detailMat);
      nose.position.set(0, 0.42, 1.02);
      group.add(nose);

      // Eyes
      const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), detailMat);
      leftEye.position.set(-0.3, 0.6, 0.88);
      const rightEye = leftEye.clone();
      rightEye.position.x = 0.3;
      group.add(leftEye, rightEye);

      // Ears
      const leftEar = new THREE.Mesh(new THREE.SphereGeometry(0.35, 24, 24), accentMat);
      leftEar.position.set(-0.85, 1.2, 0);
      const rightEar = leftEar.clone();
      rightEar.position.x = 0.85;
      group.add(leftEar, rightEar);

      // Body
      const body = new THREE.Mesh(new THREE.SphereGeometry(1.1, 32, 32), mainMat);
      body.position.y = -1.1;
      body.scale.set(1, 1.1, 0.95);
      body.castShadow = true;
      group.add(body);

      // Belly Patch
      const belly = new THREE.Mesh(new THREE.SphereGeometry(0.65, 24, 24), accentMat);
      belly.position.set(0, -1.0, 0.65);
      belly.scale.set(1, 1.1, 0.5);
      group.add(belly);

      // Bowtie
      const bowtieCenter = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), baseMat);
      bowtieCenter.position.set(0, -0.2, 0.9);
      const bowtieLeft = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.4, 16), baseMat);
      bowtieLeft.position.set(-0.25, -0.2, 0.88);
      bowtieLeft.rotation.z = Math.PI / 2;
      const bowtieRight = bowtieLeft.clone();
      bowtieRight.position.x = 0.25;
      bowtieRight.rotation.z = -Math.PI / 2;
      group.add(bowtieCenter, bowtieLeft, bowtieRight);

    } else if (toyType === "rocket") {
      // ROCKET SHIP FIGURINE
      // Main Rocket Body
      const bodyGeo = new THREE.CylinderGeometry(0.6, 0.9, 2.8, 32);
      const body = new THREE.Mesh(bodyGeo, mainMat);
      body.position.y = 0.1;
      body.castShadow = true;
      group.add(body);

      // Nose Cone
      const coneGeo = new THREE.ConeGeometry(0.62, 1.2, 32);
      const cone = new THREE.Mesh(coneGeo, accentMat);
      cone.position.y = 2.1;
      cone.castShadow = true;
      group.add(cone);

      // Porthole Window Ring
      const ringGeo = new THREE.TorusGeometry(0.35, 0.08, 16, 32);
      const ring = new THREE.Mesh(ringGeo, baseMat);
      ring.position.set(0, 0.6, 0.7);
      group.add(ring);

      // Window Glass
      const glassGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 24);
      const glass = new THREE.Mesh(glassGeo, detailMat);
      glass.rotation.x = Math.PI / 2;
      glass.position.set(0, 0.6, 0.68);
      group.add(glass);

      // Fins (3 directional)
      for (let i = 0; i < 3; i++) {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.1, 0.7), accentMat);
        const angle = (i * Math.PI * 2) / 3;
        fin.position.x = Math.sin(angle) * 0.9;
        fin.position.z = Math.cos(angle) * 0.9;
        fin.position.y = -0.8;
        fin.rotation.y = -angle;
        fin.castShadow = true;
        group.add(fin);
      }

      // Flame nozzle
      const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.3, 0.5, 24), detailMat);
      nozzle.position.y = -1.45;
      group.add(nozzle);

    } else if (toyType === "donut") {
      // SWEET DONUT FIGURINE
      // Donut Base
      const donutGeo = new THREE.TorusGeometry(1.2, 0.65, 30, 48);
      const donut = new THREE.Mesh(donutGeo, mainMat);
      donut.rotation.x = Math.PI / 3;
      donut.castShadow = true;
      group.add(donut);

      // Glaze Icing Top
      const icingGeo = new THREE.TorusGeometry(1.22, 0.45, 24, 48);
      const icing = new THREE.Mesh(icingGeo, accentMat);
      icing.rotation.x = Math.PI / 3;
      icing.position.z = 0.22;
      group.add(icing);

      // Decorative Sprinkles
      const sprinkleGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.25, 12);
      for (let i = 0; i < 16; i++) {
        const sprinkle = new THREE.Mesh(sprinkleGeo, i % 2 === 0 ? baseMat : detailMat);
        const angle = (i * Math.PI * 2) / 16;
        const rad = 1.1 + Math.sin(i * 3) * 0.25;
        sprinkle.position.x = Math.cos(angle) * rad;
        sprinkle.position.y = Math.sin(angle) * rad * 0.5;
        sprinkle.position.z = 0.5;
        sprinkle.rotation.z = Math.random() * Math.PI;
        group.add(sprinkle);
      }

    } else if (toyType === "star") {
      // SHINING 3D STAR FIGURINE
      const starShape = new THREE.Shape();
      const points = 5;
      const outerRad = 1.6;
      const innerRad = 0.7;

      for (let i = 0; i < points * 2; i++) {
        const rad = i % 2 === 0 ? outerRad : innerRad;
        const a = (i * Math.PI) / points - Math.PI / 2;
        const x = Math.cos(a) * rad;
        const y = Math.sin(a) * rad;
        if (i === 0) starShape.moveTo(x, y);
        else starShape.lineTo(x, y);
      }
      starShape.closePath();

      const extrudeSettings = {
        depth: 0.5,
        bevelEnabled: true,
        bevelSegments: 4,
        steps: 1,
        bevelSize: 0.15,
        bevelThickness: 0.2
      };

      const starGeo = new THREE.ExtrudeGeometry(starShape, extrudeSettings);
      starGeo.center();

      const star = new THREE.Mesh(starGeo, mainMat);
      star.castShadow = true;
      group.add(star);

      // Center Gem / Badge
      const gemGeo = new THREE.DodecahedronGeometry(0.45);
      const gem = new THREE.Mesh(gemGeo, accentMat);
      gem.position.z = 0.35;
      group.add(gem);

      // Base Stand
      const standGeo = new THREE.CylinderGeometry(0.9, 1.1, 0.4, 32);
      const stand = new THREE.Mesh(standGeo, baseMat);
      stand.position.y = -1.6;
      group.add(stand);
    }
  };

  // Mouse / Touch handlers for 3D rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !modelGroupRef.current) return;

    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    modelGroupRef.current.rotation.y += deltaX * 0.01;
    modelGroupRef.current.rotation.x += deltaY * 0.01;

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Paint active part
  const applyPaintToPart = (colorHex: string) => {
    setActiveColor(colorHex);
    setPartColors((prev) => ({
      ...prev,
      [selectedPart]: colorHex
    }));

    if (triggerToast) {
      triggerToast("Painted 3D Part! 🎨", `Applied ${colorHex} to ${selectedPart} section.`);
    }
  };

  // Reset Model Colors
  const resetColors = () => {
    setPartColors({
      main: "#f8fafc",
      accent: "#f8fafc",
      base: "#f8fafc",
      details: "#f8fafc"
    });
    if (triggerToast) {
      triggerToast("Reset 3D Toy", "Clean unpainted white ceramic restored.");
    }
  };

  // Order custom kit
  const handleOrder = () => {
    const used = Array.from(new Set(Object.values(partColors))).filter(c => c !== "#f8fafc");
    if (onOrderKit) {
      onOrderKit(selectedToy.toUpperCase(), used.length > 0 ? used : [activeColor]);
    }
  };

  return (
    <div className="bg-stone-900 text-white rounded-3xl p-4 sm:p-8 shadow-2xl border border-stone-800 space-y-6">
      
      {/* Title & Badge Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-pink-500/10 text-pink-400 border border-pink-500/30 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive 3D Ceramic Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            3D Toy Figurine Painter & Viewer 🎨
          </h2>
          <p className="text-xs text-stone-400 font-medium mt-1">
            Drag to rotate 360° in 3D WebGL. Choose paints to preview your custom ceramic figure before ordering!
          </p>
        </div>

        {/* Model Selector Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-stone-950 p-1.5 rounded-2xl border border-stone-800">
          {(["bear", "rocket", "donut", "star"] as const).map((toy) => (
            <button
              key={toy}
              onClick={() => setSelectedToy(toy)}
              className={`px-3 py-2 rounded-xl text-xs font-black transition-all capitalize ${
                selectedToy === toy
                  ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md"
                  : "text-stone-400 hover:text-white hover:bg-stone-800"
              }`}
            >
              {toy === "bear" && "🧸 Bear"}
              {toy === "rocket" && "🚀 Rocket"}
              {toy === "donut" && "🍩 Donut"}
              {toy === "star" && "⭐ Star"}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: 3D Viewport + Paint Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* 3D WebGL Canvas Viewport */}
        <div className="lg:col-span-7 bg-slate-950 rounded-3xl border border-stone-800 relative overflow-hidden flex flex-col justify-between min-h-[380px] sm:min-h-[440px]">
          
          {/* Top Canvas Controls Bar */}
          <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-auto">
            <div className="bg-stone-900/80 backdrop-blur-md border border-stone-700/60 px-3 py-1.5 rounded-xl text-[11px] font-bold text-stone-300 flex items-center gap-2">
              <RotateCw className="w-3.5 h-3.5 text-pink-400 animate-spin" />
              <span>Drag to Rotate in 3D</span>
            </div>

            <div className="flex items-center gap-1.5 bg-stone-900/80 backdrop-blur-md border border-stone-700/60 p-1 rounded-xl">
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                  autoRotate ? "bg-pink-600 text-white" : "text-stone-400 hover:text-white"
                }`}
                title="Toggle Auto Spin"
              >
                {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={resetColors}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-all"
                title="Reset Paint to White"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* WebGL Canvas Mount Container */}
          <div
            ref={mountRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-full h-full cursor-grab active:cursor-grabbing flex-1"
          />

          {/* Bottom Lighting Presets Bar */}
          <div className="p-3 bg-stone-900/90 border-t border-stone-800 flex items-center justify-between text-[11px] font-bold">
            <span className="text-stone-400 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              Lighting Preset:
            </span>
            <div className="flex gap-1.5">
              {(["studio", "warm", "cyber"] as const).map((preset) => (
                <button
                  key={preset}
                  onClick={() => setLightPreset(preset)}
                  className={`px-2.5 py-1 rounded-lg transition-all capitalize text-[10px] ${
                    lightPreset === preset
                      ? "bg-stone-700 text-white font-extrabold"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Paint & Styling Controls */}
        <div className="lg:col-span-5 bg-stone-950 p-5 rounded-3xl border border-stone-800 flex flex-col justify-between space-y-5">
          
          <div className="space-y-4">
            {/* Step 1: Select Toy Part */}
            <div>
              <label className="text-[11px] font-black uppercase text-pink-400 tracking-wider flex items-center gap-1.5 mb-2">
                <Layers className="w-3.5 h-3.5" />
                <span>1. Select Figurine Section to Paint:</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "main", label: "Main Body" },
                  { id: "accent", label: "Ears / Cone / Glaze" },
                  { id: "base", label: "Bow / Ring / Base" },
                  { id: "details", label: "Eyes / Nozzle / Eyes" }
                ].map((part) => (
                  <button
                    key={part.id}
                    onClick={() => setSelectedPart(part.id)}
                    className={`p-2.5 rounded-xl text-xs font-extrabold text-left border transition-all flex items-center justify-between ${
                      selectedPart === part.id
                        ? "bg-pink-600/20 border-pink-500 text-white"
                        : "bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700"
                    }`}
                  >
                    <span>{part.label}</span>
                    <span 
                      className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-xs" 
                      style={{ backgroundColor: partColors[part.id] || "#f8fafc" }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Choose Paint Color */}
            <div>
              <label className="text-[11px] font-black uppercase text-pink-400 tracking-wider flex items-center gap-1.5 mb-2">
                <Palette className="w-3.5 h-3.5" />
                <span>2. Pick Non-Toxic Paint Color:</span>
              </label>
              <div className="grid grid-cols-5 gap-2">
                {PALETTE_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => applyPaintToPart(c.hex)}
                    className={`group relative h-10 rounded-xl border transition-all flex items-center justify-center ${
                      activeColor === c.hex 
                        ? "border-white ring-2 ring-pink-500 scale-105" 
                        : "border-stone-800 hover:scale-100"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {activeColor === c.hex && (
                      <CheckCircle className={`w-4 h-4 ${c.hex === "#f8fafc" || c.hex === "#facc15" ? "text-stone-900" : "text-white"}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Included Paint Kit Accessories */}
            <div className="bg-stone-900/90 p-3.5 rounded-2xl border border-stone-800/80 text-xs text-stone-300 space-y-1">
              <span className="font-extrabold text-pink-400 block">📦 Standard Kit Includes:</span>
              <p className="text-[11px] leading-relaxed text-stone-400">
                1x Hand-Molded Plaster {selectedToy.toUpperCase()} Figurine, 6x Washable Paint Colors, 1x Detail Painting Brush, 1x Color Mixing Palette, and Safe Cushion Packaging!
              </p>
            </div>
          </div>

          {/* Order Call to Action */}
          <button
            onClick={handleOrder}
            className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-pink-600/20 text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Order This 3D Customized Kit on WhatsApp (Rs. 399)</span>
          </button>

        </div>

      </div>

    </div>
  );
};

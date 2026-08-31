import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  Sparkles, 
  Gamepad2, 
  Trophy, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Heart, 
  Star, 
  Flame, 
  Palette, 
  Layers, 
  Award, 
  CheckCircle2, 
  Brush, 
  Smile, 
  ShoppingBag,
  Zap,
  PartyPopper,
  Compass
} from "lucide-react";
import { Toy3DStudio } from "./Toy3DStudio";

// Web Audio synthesizer for cute kid-friendly game sounds
class SoundFX {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  constructor() {
    // Lazy initialize on first interaction
  }

  private getContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  setMuted(mute: boolean) {
    this.muted = mute;
  }

  isMuted() {
    return this.muted;
  }

  // Pop sound for balloons
  playPop(pitchMultiplier = 1) {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      const freq = 400 * pitchMultiplier;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {}
  }

  // Catch sound for falling paints
  playCatch() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(680, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  }

  // Card Flip
  playFlip() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(250, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {}
  }

  // Match Success Fanfare
  playMatchSuccess() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0.25, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.25);
      });
    } catch (e) {}
  }

  // Game Victory Celebration
  playWin() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const notes = [440, 554, 659, 880, 1108];
      const now = ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.3, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.35);
      });
    } catch (e) {}
  }
}

const sounds = new SoundFX();

interface KidsGameZoneProps {
  onOrderKit?: (toyName: string, colors: string[]) => void;
  triggerToast?: (title: string, msg?: string) => void;
  onNavigateToShop?: () => void;
}

// -------------------------------------------------------------
// GAME 1: BALLOON COLOR POP & SPLASH (Continuous Floating Physics)
// -------------------------------------------------------------
interface Balloon {
  id: number;
  x: number; // % from left (5% to 90%)
  y: number; // px from top
  speed: number;
  color: string;
  size: number;
  emoji: string;
  points: number;
  isSpecial?: boolean;
}

const BALLOON_COLORS = [
  { hex: "#ff4b91", name: "Bubblegum Pink", emoji: "🎈", points: 10 },
  { hex: "#38bdf8", name: "Sky Blue", emoji: "🎈", points: 10 },
  { hex: "#facc15", name: "Sunshine Yellow", emoji: "🎈", points: 10 },
  { hex: "#4ade80", name: "Mint Green", emoji: "🎈", points: 10 },
  { hex: "#a855f7", name: "Magic Purple", emoji: "🎈", points: 15 },
  { hex: "#fb923c", name: "Orange Candy", emoji: "🎈", points: 10 },
  { hex: "#f43f5e", name: "Rainbow Heart", emoji: "💖", points: 25, isSpecial: true },
  { hex: "#eab308", name: "Golden Star", emoji: "⭐", points: 50, isSpecial: true },
];

const BalloonPopGame: React.FC = () => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(localStorage.getItem("balloon_high_score") || "0");
    } catch (e) {
      return 0;
    }
  });
  const [combo, setCombo] = useState(0);
  const [poppedCount, setPoppedCount] = useState(0);
  const [targetColor, setTargetColor] = useState<string>("#ff4b91");
  const [popEffects, setPopEffects] = useState<{ id: number; x: number; y: number; text: string; color: string }[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [level, setLevel] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef(1);
  const animFrameRef = useRef<number | null>(null);

  // Pick target color periodically
  useEffect(() => {
    const pickTarget = () => {
      const randomCol = BALLOON_COLORS[Math.floor(Math.random() * (BALLOON_COLORS.length - 2))];
      setTargetColor(randomCol.hex);
    };
    pickTarget();
    const interval = setInterval(pickTarget, 10000);
    return () => clearInterval(interval);
  }, []);

  // Spawn balloons continuously
  useEffect(() => {
    if (!isPlaying) return;

    const spawnInterval = setInterval(() => {
      setBalloons(prev => {
        if (prev.length >= 14) return prev; // Limit max on screen
        const colObj = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
        const newBalloon: Balloon = {
          id: nextIdRef.current++,
          x: Math.floor(Math.random() * 82) + 8, // 8% to 90%
          y: 460, // start from bottom
          speed: 1.2 + Math.random() * 1.8 + (level * 0.2),
          color: colObj.hex,
          size: colObj.isSpecial ? 54 : 46 + Math.floor(Math.random() * 18),
          emoji: colObj.emoji,
          points: colObj.points,
          isSpecial: colObj.isSpecial
        };
        return [...prev, newBalloon];
      });
    }, 750);

    return () => clearInterval(spawnInterval);
  }, [isPlaying, level]);

  // Main animation loop
  useEffect(() => {
    if (!isPlaying) return;

    let lastTime = performance.now();
    const updateLoop = (now: number) => {
      const delta = (now - lastTime) / 16.6; // normalized to 60fps
      lastTime = now;

      setBalloons(prev => 
        prev
          .map(b => ({ ...b, y: b.y - b.speed * delta }))
          .filter(b => b.y > -80) // remove once exited top
      );

      animFrameRef.current = requestAnimationFrame(updateLoop);
    };

    animFrameRef.current = requestAnimationFrame(updateLoop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  // Pop balloon click/touch handler
  const handlePop = (balloon: Balloon, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    
    // Check if matching target color or special bonus
    const isTarget = balloon.color === targetColor;
    const bonus = isTarget ? 2 : 1;
    const addedPoints = balloon.points * bonus * (1 + Math.floor(combo / 5) * 0.5);

    sounds.playPop(isTarget || balloon.isSpecial ? 1.4 : 1.0);

    setScore(prev => {
      const newScore = Math.round(prev + addedPoints);
      if (newScore > highScore) {
        setHighScore(newScore);
        try { localStorage.setItem("balloon_high_score", String(newScore)); } catch(e){}
      }
      return newScore;
    });

    setCombo(prev => prev + 1);
    setPoppedCount(prev => {
      const nextCount = prev + 1;
      if (nextCount % 20 === 0) {
        setLevel(lvl => lvl + 1);
        sounds.playWin();
      }
      return nextCount;
    });

    // Create pop sparkle effect
    const effectId = Date.now() + Math.random();
    setPopEffects(prev => [
      ...prev,
      {
        id: effectId,
        x: balloon.x,
        y: balloon.y,
        text: isTarget ? `+${Math.round(addedPoints)} MATCH! 🔥` : `+${Math.round(addedPoints)} ⭐`,
        color: balloon.color
      }
    ]);

    setTimeout(() => {
      setPopEffects(prev => prev.filter(p => p.id !== effectId));
    }, 900);

    // Remove popped balloon
    setBalloons(prev => prev.filter(b => b.id !== balloon.id));
  };

  const handleReset = () => {
    setBalloons([]);
    setScore(0);
    setCombo(0);
    setPoppedCount(0);
    setLevel(1);
  };

  const targetColorObj = BALLOON_COLORS.find(c => c.hex === targetColor) || BALLOON_COLORS[0];

  return (
    <div className="bg-gradient-to-b from-sky-400 via-sky-300 to-indigo-200 rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-white relative overflow-hidden select-none">
      
      {/* Cloud & Sun background decorations */}
      <div className="absolute top-4 left-6 text-4xl opacity-80 animate-bounce pointer-events-none">☀️</div>
      <div className="absolute top-12 right-12 text-5xl opacity-40 pointer-events-none">☁️</div>
      <div className="absolute top-36 left-1/4 text-4xl opacity-30 pointer-events-none">☁️</div>

      {/* Top HUD Display */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-sm border border-white/80">
        
        {/* Score & Combo */}
        <div className="flex items-center gap-3">
          <div className="bg-pink-500 text-white px-3.5 py-1.5 rounded-xl font-black text-sm sm:text-base flex items-center gap-1.5 shadow-xs">
            <Trophy className="w-4 h-4 text-yellow-300" />
            <span>Score: {score}</span>
          </div>

          <div className="bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-1">
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
            <span>Combo x{combo}</span>
          </div>

          <div className="hidden sm:flex bg-purple-100 text-purple-900 px-3 py-1.5 rounded-xl font-bold text-xs">
            Level {level}
          </div>
        </div>

        {/* Target Mission Indicator */}
        <div className="flex items-center gap-2 bg-stone-900 text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold shadow-sm">
          <span className="text-stone-300">Target:</span>
          <span 
            className="w-4 h-4 rounded-full border border-white shadow-xs" 
            style={{ backgroundColor: targetColor }} 
          />
          <span className="text-yellow-300 font-black">{targetColorObj.name} (2X Bonus!)</span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-stone-100 hover:bg-stone-200 text-stone-800 p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-green-600" />}
          </button>
          <button
            onClick={handleReset}
            className="bg-rose-100 hover:bg-rose-200 text-rose-700 p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
            title="Restart Balloon Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Balloon Play Canvas */}
      <div 
        ref={containerRef}
        className="relative w-full h-[440px] sm:h-[480px] mt-4 overflow-hidden rounded-2xl cursor-pointer"
        onClick={() => setCombo(0)} // reset combo on miss
      >
        {/* Floating Balloons */}
        {balloons.map(b => (
          <div
            key={b.id}
            onClick={(e) => handlePop(b, e)}
            onTouchStart={(e) => handlePop(b, e)}
            style={{
              left: `${b.x}%`,
              top: `${b.y}px`,
              width: `${b.size}px`,
              height: `${b.size * 1.25}px`,
              backgroundColor: b.color,
              boxShadow: `0 8px 20px ${b.color}77, inset 4px 6px 12px rgba(255,255,255,0.6)`
            }}
            className={`absolute rounded-[50%_50%_50%_50%_/_40%_40%_60%_60%] flex flex-col items-center justify-center cursor-pointer transition-transform active:scale-90 hover:scale-105 select-none ${
              b.isSpecial ? "animate-pulse ring-4 ring-yellow-300" : ""
            }`}
          >
            {/* Balloon knot & string */}
            <span className="text-xl drop-shadow-sm">{b.emoji}</span>
            <div className="absolute -bottom-1 w-2.5 h-2 bg-stone-700/60 rounded-xs" />
            <div className="absolute -bottom-6 w-0.5 h-6 bg-white/70" />
          </div>
        ))}

        {/* Pop sparkles and numbers */}
        {popEffects.map(p => (
          <div
            key={p.id}
            style={{ left: `${p.x}%`, top: `${p.y}px` }}
            className="absolute font-black text-sm sm:text-base pointer-events-none animate-ping text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
          >
            {p.text}
          </div>
        ))}

        {/* Empty state hint */}
        {balloons.length === 0 && isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center text-white font-extrabold text-sm opacity-75 animate-pulse">
            🎈 Balloons are launching! Tap them as fast as you can!
          </div>
        )}
      </div>

      {/* Bottom stats footer */}
      <div className="mt-3 flex flex-wrap items-center justify-between text-xs font-bold text-sky-900 px-2">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          Total Popped: <strong className="text-pink-600">{poppedCount} Balloons</strong>
        </span>
        <span>
          🏆 Best Record: <strong>{highScore} pts</strong>
        </span>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// GAME 2: CERAMIC TOY MEMORY MATCH (Brain & Focus Memory Game)
// -------------------------------------------------------------
interface MemoryCard {
  id: number;
  pairId: string;
  name: string;
  icon: string;
  color: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MEMORY_PAIRS = [
  { pairId: "bear", name: "Plaster Bear 🧸", icon: "🧸", color: "#f43f5e" },
  { pairId: "brush", name: "Paint Brush 🖌️", icon: "🖌️", color: "#3b82f6" },
  { pairId: "palette", name: "Paint Palette 🎨", icon: "🎨", color: "#eab308" },
  { pairId: "dino", name: "Ceramic Dino 🦕", icon: "🦕", color: "#10b981" },
  { pairId: "star", name: "Shiny Star ⭐", icon: "⭐", color: "#f59e0b" },
  { pairId: "heart", name: "Clay Heart 💖", icon: "💖", color: "#ec4899" },
  { pairId: "rocket", name: "Toy Rocket 🚀", icon: "🚀", color: "#8b5cf6" },
  { pairId: "donut", name: "Sweet Donut 🍩", icon: "🍩", color: "#f97316" }
];

const MemoryMatchGame: React.FC = () => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [isWon, setIsWon] = useState(false);
  const [bestMoves, setBestMoves] = useState<{ [key: string]: number }>({
    easy: 10,
    medium: 18,
    hard: 24
  });

  const setupDeck = useCallback((diff: "easy" | "medium" | "hard") => {
    let pairCount = 4; // Easy 8 cards (2x4)
    if (diff === "medium") pairCount = 6; // Medium 12 cards (3x4)
    if (diff === "hard") pairCount = 8; // Hard 16 cards (4x4)

    const selectedPairs = MEMORY_PAIRS.slice(0, pairCount);
    const deck: MemoryCard[] = [];

    selectedPairs.forEach((item, index) => {
      // 2 cards for each pair
      deck.push({
        id: index * 2,
        pairId: item.pairId,
        name: item.name,
        icon: item.icon,
        color: item.color,
        isFlipped: false,
        isMatched: false
      });
      deck.push({
        id: index * 2 + 1,
        pairId: item.pairId,
        name: item.name,
        icon: item.icon,
        color: item.color,
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setIsWon(false);
  }, []);

  useEffect(() => {
    setupDeck(difficulty);
  }, [difficulty, setupDeck]);

  const handleCardClick = (index: number) => {
    const card = cards[index];
    if (card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

    sounds.playFlip();

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      if (firstCard.pairId === secondCard.pairId) {
        // Matched!
        sounds.playMatchSuccess();
        setTimeout(() => {
          setCards(prev => {
            const updated = [...prev];
            updated[firstIdx].isMatched = true;
            updated[secondIdx].isMatched = true;
            return updated;
          });
          setFlippedCards([]);
          setMatches(m => {
            const nextMatch = m + 1;
            const targetMatches = cards.length / 2;
            if (nextMatch === targetMatches) {
              setIsWon(true);
              sounds.playWin();
            }
            return nextMatch;
          });
        }, 400);
      } else {
        // Not matched, flip back after brief pause
        setTimeout(() => {
          setCards(prev => {
            const updated = [...prev];
            updated[firstIdx].isFlipped = false;
            updated[secondIdx].isFlipped = false;
            return updated;
          });
          setFlippedCards([]);
        }, 900);
      }
    }
  };

  return (
    <div className="bg-[#fffdfa] rounded-3xl p-5 sm:p-7 border-2 border-amber-200/80 shadow-lg space-y-6">
      
      {/* Top Header & Level selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
        <div>
          <span className="text-[10px] font-black tracking-widest text-amber-600 uppercase bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            🧠 Brain Booster Game
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
            Ceramic Toy Memory Match
          </h3>
        </div>

        {/* Difficulty Buttons */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-2xl">
          {[
            { id: "easy", label: "Easy (8)", icon: "🌱" },
            { id: "medium", label: "Medium (12)", icon: "⭐" },
            { id: "hard", label: "Hard (16)", icon: "🔥" }
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => setDifficulty(d.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                difficulty === d.id
                  ? "bg-white text-amber-700 shadow-xs border border-stone-200"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              {d.icon} {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Game Stats Bar */}
      <div className="flex items-center justify-between bg-amber-50/70 border border-amber-100 rounded-2xl p-3 sm:p-4 text-xs sm:text-sm font-bold text-stone-700">
        <div className="flex items-center gap-2">
          <span>🎯 Moves: <strong>{moves}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span>✨ Matched: <strong className="text-pink-600">{matches} / {cards.length / 2}</strong></span>
        </div>
        <button
          onClick={() => setupDeck(difficulty)}
          className="bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1 shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
          Reset Cards
        </button>
      </div>

      {/* Winner Congratulations Overlay Banner */}
      {isWon && (
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white rounded-2xl p-6 text-center shadow-lg space-y-3 animate-bounce">
          <div className="text-4xl">🎉 🏆 🌟</div>
          <h4 className="text-xl sm:text-2xl font-black">Super Memory Champion!</h4>
          <p className="text-xs sm:text-sm font-semibold max-w-md mx-auto">
            You solved the entire puzzle in just <strong>{moves} moves</strong>! Your brain is creative, sharp, and focused.
          </p>
          <button
            onClick={() => setupDeck(difficulty)}
            className="bg-white text-stone-900 font-black text-xs px-6 py-2.5 rounded-xl shadow-md hover:bg-stone-100 active:scale-95 transition-all"
          >
            Play Another Round 🔄
          </button>
        </div>
      )}

      {/* Grid of Memory Cards */}
      <div className={`grid gap-3 sm:gap-4 ${
        difficulty === "easy" 
          ? "grid-cols-4" 
          : difficulty === "medium" 
          ? "grid-cols-3 sm:grid-cols-4" 
          : "grid-cols-4"
      }`}>
        {cards.map((card, idx) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(idx)}
            className={`h-24 sm:h-32 rounded-2xl border-2 cursor-pointer flex flex-col items-center justify-center p-2 text-center transition-all duration-300 select-none ${
              card.isMatched
                ? "bg-emerald-50 border-emerald-300 scale-95 opacity-85 shadow-inner"
                : card.isFlipped
                ? "bg-white border-pink-400 shadow-md rotate-0 scale-100"
                : "bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-400 text-white shadow-sm hover:scale-105 active:scale-95"
            }`}
          >
            {card.isFlipped || card.isMatched ? (
              <div className="flex flex-col items-center justify-center animate-fade-in">
                <span className="text-3xl sm:text-4xl mb-1">{card.icon}</span>
                <span className="text-[10px] sm:text-xs font-bold text-stone-700 truncate max-w-[80px]">
                  {card.name}
                </span>
                {card.isMatched && (
                  <span className="text-[9px] font-black text-emerald-600 mt-0.5">✓ MATCH</span>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <span className="text-2xl sm:text-3xl opacity-80">🎨</span>
                <span className="text-[9px] sm:text-[10px] font-black tracking-widest text-indigo-100 uppercase mt-1">
                  TAP ME
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

// -------------------------------------------------------------
// GAME 3: PAINT BUCKET CATCHER (Reaction & Fast Colors Game)
// -------------------------------------------------------------
interface FallingDrop {
  id: number;
  x: number; // percentage (5% to 90%)
  y: number; // px from top
  speed: number;
  color: string;
  name: string;
  emoji: string;
  points: number;
  isStar?: boolean;
}

const PaintBucketCatcherGame: React.FC = () => {
  const [bucketX, setBucketX] = useState(50); // percentage
  const [bucketColor, setBucketColor] = useState("#ff4b91");
  const [drops, setDrops] = useState<FallingDrop[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    try { return Number(localStorage.getItem("catcher_high_score") || "0"); } catch(e) { return 0; }
  });

  const nextDropId = useRef(1);
  const boardRef = useRef<HTMLDivElement>(null);
  const animFrame = useRef<number | null>(null);

  // Restart game
  const startGame = () => {
    setDrops([]);
    setScore(0);
    setLives(3);
    setStreak(0);
    setGameOver(false);
    setIsPlaying(true);
    setBucketX(50);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return;
      if (e.key === "ArrowLeft") {
        setBucketX(x => Math.max(8, x - 7));
      } else if (e.key === "ArrowRight") {
        setBucketX(x => Math.min(92, x + 7));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, gameOver]);

  // Touch / Mouse pointer tracker
  const handlePointerMove = (clientX: number) => {
    if (!isPlaying || gameOver || !boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const relativeX = ((clientX - rect.left) / rect.width) * 100;
    setBucketX(Math.max(6, Math.min(94, relativeX)));
  };

  // Spawn falling drops
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const interval = setInterval(() => {
      setDrops(prev => {
        if (prev.length >= 8) return prev;
        const colors = [
          { hex: "#ff4b91", name: "Pink Paint", emoji: "💧", pts: 10 },
          { hex: "#38bdf8", name: "Blue Paint", emoji: "💧", pts: 10 },
          { hex: "#facc15", name: "Yellow Paint", emoji: "💧", pts: 10 },
          { hex: "#4ade80", name: "Green Paint", emoji: "💧", pts: 10 },
          { hex: "#a855f7", name: "Purple Paint", emoji: "💧", pts: 15 },
          { hex: "#eab308", name: "Golden Star", emoji: "⭐", pts: 30, isStar: true },
          { hex: "#f43f5e", name: "Mini Bear Figurine", emoji: "🧸", pts: 25 }
        ];
        const chosen = colors[Math.floor(Math.random() * colors.length)];
        const newDrop: FallingDrop = {
          id: nextDropId.current++,
          x: Math.floor(Math.random() * 84) + 8,
          y: 0,
          speed: 2.2 + Math.random() * 1.8,
          color: chosen.hex,
          name: chosen.name,
          emoji: chosen.emoji,
          points: chosen.pts,
          isStar: chosen.isStar
        };
        return [...prev, newDrop];
      });
    }, 900);

    return () => clearInterval(interval);
  }, [isPlaying, gameOver]);

  // Main animation frame for falling
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const updatePhysics = () => {
      setDrops(prev => {
        const remaining: FallingDrop[] = [];
        const catcherY = 360; // catch zone line
        const catcherWidth = 16; // % width of bucket tolerance

        for (const drop of prev) {
          const nextY = drop.y + drop.speed;

          // Check if caught in bucket
          if (nextY >= catcherY - 20 && nextY <= catcherY + 25) {
            const distance = Math.abs(drop.x - bucketX);
            if (distance <= catcherWidth) {
              // Caught!
              sounds.playCatch();
              setScore(s => {
                const nextScore = s + drop.points;
                if (nextScore > highScore) {
                  setHighScore(nextScore);
                  try { localStorage.setItem("catcher_high_score", String(nextScore)); } catch(e){}
                }
                return nextScore;
              });
              setStreak(st => st + 1);
              setBucketColor(drop.color);
              continue; // remove drop
            }
          }

          // Check if fell past floor without catch
          if (nextY > 400) {
            if (!drop.isStar) {
              setLives(l => {
                const nextLives = l - 1;
                if (nextLives <= 0) {
                  setGameOver(true);
                  setIsPlaying(false);
                  sounds.playWin();
                }
                return nextLives;
              });
              setStreak(0);
            }
            continue; // dropped
          }

          remaining.push({ ...drop, y: nextY });
        }
        return remaining;
      });

      animFrame.current = requestAnimationFrame(updatePhysics);
    };

    animFrame.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, [isPlaying, gameOver, bucketX, highScore]);

  return (
    <div className="bg-gradient-to-b from-purple-900 via-indigo-950 to-slate-900 rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-purple-300 text-white relative overflow-hidden select-none">
      
      {/* HUD Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/20">
        
        {/* Score & High Score */}
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400 text-stone-900 font-black px-3.5 py-1.5 rounded-xl text-sm flex items-center gap-1 shadow-sm">
            <Trophy className="w-4 h-4 text-stone-900" />
            <span>Score: {score}</span>
          </div>

          <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-xl text-xs font-bold">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Streak: x{streak}</span>
          </div>
        </div>

        {/* Lives Counter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-purple-200">Lives:</span>
          <div className="flex gap-1">
            {[1, 2, 3].map(heartIdx => (
              <Heart 
                key={heartIdx} 
                className={`w-5 h-5 ${heartIdx <= lives ? "text-rose-500 fill-rose-500 animate-pulse" : "text-stone-600"}`} 
              />
            ))}
          </div>
        </div>

        {/* Control Button */}
        <div>
          {!isPlaying && !gameOver ? (
            <button
              onClick={startGame}
              className="bg-green-500 hover:bg-green-600 active:scale-95 text-white font-black text-xs px-5 py-2 rounded-xl flex items-center gap-1.5 shadow-md transition-all"
            >
              <Play className="w-4 h-4 fill-white" /> Start Playing
            </button>
          ) : (
            <button
              onClick={startGame}
              className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restart
            </button>
          )}
        </div>
      </div>

      {/* Main Game Stage */}
      <div
        ref={boardRef}
        onMouseMove={(e) => handlePointerMove(e.clientX)}
        onTouchMove={(e) => {
          if (e.touches[0]) handlePointerMove(e.touches[0].clientX);
        }}
        className="relative w-full h-[390px] sm:h-[420px] mt-4 rounded-2xl bg-gradient-to-b from-indigo-950/80 to-purple-950/90 border border-purple-500/30 overflow-hidden cursor-crosshair"
      >
        {/* Falling Drops */}
        {drops.map(drop => (
          <div
            key={drop.id}
            style={{
              left: `${drop.x}%`,
              top: `${drop.y}px`,
              backgroundColor: drop.color,
              boxShadow: `0 0 15px ${drop.color}`
            }}
            className="absolute w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md -translate-x-1/2 select-none"
          >
            <span>{drop.emoji}</span>
          </div>
        ))}

        {/* Bucket at Bottom */}
        <div
          style={{
            left: `${bucketX}%`,
            top: "355px",
            borderColor: bucketColor,
            boxShadow: `0 0 25px ${bucketColor}88`
          }}
          className="absolute w-20 sm:w-24 h-12 -translate-x-1/2 rounded-b-2xl border-4 bg-white/90 text-stone-900 flex flex-col items-center justify-center font-black text-xs transition-all select-none"
        >
          <span className="text-base">🧺</span>
          <span className="text-[9px] font-black uppercase text-stone-700">Paint Bucket</span>
        </div>

        {/* Initial overlay prompt */}
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center text-3xl animate-bounce">
              🧺
            </div>
            <h4 className="text-2xl font-black">Color Paint Catcher</h4>
            <p className="text-xs sm:text-sm text-purple-200 max-w-sm">
              Slide your mouse or finger left/right to move the paint bucket and catch the falling paint drops! Don't let them spill!
            </p>
            <button
              onClick={startGame}
              className="bg-yellow-400 hover:bg-yellow-500 text-stone-950 font-black text-sm px-8 py-3.5 rounded-2xl shadow-xl transition-transform active:scale-95"
            >
              🎮 Tap Here to Play!
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameOver && (
          <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="text-5xl animate-pulse">🎨 👏</div>
            <h4 className="text-2xl sm:text-3xl font-black text-yellow-300">Fantastic Effort!</h4>
            <p className="text-sm text-stone-300">
              You scored <strong className="text-pink-400 text-lg font-black">{score} Points</strong>!
            </p>
            <button
              onClick={startGame}
              className="bg-pink-500 hover:bg-pink-600 text-white font-black text-xs px-7 py-3 rounded-2xl shadow-lg active:scale-95 transition-all"
            >
              Play Again 🔄
            </button>
          </div>
        )}
      </div>

      {/* Guide Strip */}
      <div className="mt-3 flex items-center justify-between text-xs text-purple-200 font-bold px-1">
        <span>💡 Hint: Use Arrow Keys or drag with your finger!</span>
        <span>🏆 Record: {highScore} pts</span>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// GAME 4: SPIN & SCULPT CLAY WHEEL (Interactive Pottery Maker)
// -------------------------------------------------------------
const ClayPotterySculptor: React.FC = () => {
  const [clayRadius, setClayRadius] = useState<number[]>([40, 55, 75, 90, 85, 70, 50, 40]);
  const [selectedClayColor, setSelectedClayColor] = useState("#d97706");
  const [patternType, setPatternType] = useState<"smooth" | "stripes" | "dots" | "spiral">("stripes");
  const [isSpinning, setIsSpinning] = useState(true);
  const [isBaked, setIsBaked] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);

  // Render rotating clay pot on 2D canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const drawPottery = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Pottery spinning wheel base
      ctx.save();
      ctx.translate(centerX, centerY + 140);
      ctx.scale(1, 0.35);
      ctx.beginPath();
      ctx.arc(0, 0, 150, 0, Math.PI * 2);
      ctx.fillStyle = "#334155";
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = "#475569";
      ctx.stroke();

      // Wheel concentric rings
      ctx.beginPath();
      ctx.arc(0, 0, 110, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Pot geometry segments
      const segmentHeight = 24;
      const startY = centerY + 110;

      if (isSpinning) {
        rotationRef.current += 0.05;
      }

      // Draw clay pot body from bottom to top
      for (let i = clayRadius.length - 1; i >= 0; i--) {
        const rad = clayRadius[i];
        const curY = startY - (clayRadius.length - 1 - i) * segmentHeight;

        ctx.save();
        ctx.translate(centerX, curY);
        ctx.scale(1, 0.4);

        ctx.beginPath();
        ctx.arc(0, 0, rad, 0, Math.PI * 2);
        ctx.fillStyle = selectedClayColor;
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = isBaked ? "#78350f" : "#92400e";
        ctx.stroke();

        // Pattern textures
        if (patternType === "stripes") {
          ctx.beginPath();
          ctx.arc(0, 0, rad * 0.85, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255,255,255,0.4)";
          ctx.stroke();
        } else if (patternType === "dots") {
          const dotCount = 8;
          for (let d = 0; d < dotCount; d++) {
            const angle = (d / dotCount) * Math.PI * 2 + rotationRef.current;
            const dx = Math.cos(angle) * (rad * 0.7);
            const dy = Math.sin(angle) * (rad * 0.7);
            ctx.beginPath();
            ctx.arc(dx, dy, 4, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255,255,255,0.7)";
            ctx.fill();
          }
        }

        ctx.restore();
      }

      // Shading highlights for clay 3D look
      ctx.save();
      const grad = ctx.createLinearGradient(centerX - 100, 0, centerX + 100, 0);
      grad.addColorStop(0, "rgba(0,0,0,0.25)");
      grad.addColorStop(0.5, "rgba(255,255,255,0.2)");
      grad.addColorStop(1, "rgba(0,0,0,0.3)");
      ctx.fillStyle = grad;
      ctx.fillRect(centerX - 100, startY - (clayRadius.length * segmentHeight), 200, clayRadius.length * segmentHeight);
      ctx.restore();

      animId = requestAnimationFrame(drawPottery);
    };

    animId = requestAnimationFrame(drawPottery);
    return () => cancelAnimationFrame(animId);
  }, [clayRadius, selectedClayColor, patternType, isSpinning, isBaked]);

  const shapeSegment = (idx: number, delta: number) => {
    sounds.playCatch();
    setClayRadius(prev => {
      const updated = [...prev];
      updated[idx] = Math.max(25, Math.min(120, updated[idx] + delta));
      return updated;
    });
    setIsBaked(false);
  };

  const handleBakeMasterpiece = () => {
    sounds.playWin();
    setIsBaked(true);
  };

  const handleResetPot = () => {
    setClayRadius([40, 55, 75, 90, 85, 70, 50, 40]);
    setIsBaked(false);
  };

  return (
    <div className="bg-[#fffdf9] rounded-3xl p-5 sm:p-7 border-2 border-stone-200 shadow-lg space-y-6">
      
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
        <div>
          <span className="text-[10px] font-black tracking-widest text-amber-600 uppercase bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            🏺 Sculpt & Spin Studio
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
            Ceramic Clay Wheel Sculptor
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSpinning(!isSpinning)}
            className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all"
          >
            {isSpinning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-green-600" />}
            <span>{isSpinning ? "Pause Wheel" : "Spin Wheel"}</span>
          </button>
          <button
            onClick={handleResetPot}
            className="bg-stone-100 hover:bg-stone-200 text-stone-600 p-2 rounded-xl text-xs font-bold"
            title="Reset Shape"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Side: Sculpting Controls */}
        <div className="lg:col-span-4 bg-stone-50 border border-stone-200 p-4 sm:p-5 rounded-2xl space-y-5">
          
          {/* Glaze Color Chooser */}
          <div className="space-y-2">
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">
              1. Choose Clay Glaze:
            </span>
            <div className="grid grid-cols-4 gap-2">
              {[
                { hex: "#d97706", name: "Terracotta" },
                { hex: "#0284c7", name: "Ocean Blue" },
                { hex: "#e11d48", name: "Rose Glaze" },
                { hex: "#059669", name: "Emerald Clay" },
                { hex: "#7c3aed", name: "Purple Dream" },
                { hex: "#f59e0b", name: "Sunny Gold" },
                { hex: "#475569", name: "Graphite" },
                { hex: "#f8fafc", name: "Ceramic White" }
              ].map(c => (
                <button
                  key={c.hex}
                  onClick={() => setSelectedClayColor(c.hex)}
                  className={`w-full h-8 rounded-lg border-2 transition-transform hover:scale-105 active:scale-95 ${
                    selectedClayColor === c.hex ? "border-stone-900 ring-2 ring-stone-200 scale-105" : "border-stone-300"
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Pattern selection */}
          <div className="space-y-2">
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">
              2. Carve Pattern:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: "smooth", label: "Smooth" },
                { id: "stripes", label: "Stripes" },
                { id: "dots", label: "Polka Dots" }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setPatternType(p.id as any)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
                    patternType === p.id ? "bg-stone-900 text-white" : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Shape Width Sculpting Sliders / Buttons */}
          <div className="space-y-2">
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">
              3. Pinch & Expand Clay Sections:
            </span>
            <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
              {clayRadius.map((rad, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white border border-stone-200 px-3 py-1 rounded-xl text-xs font-bold">
                  <span className="text-stone-500">Layer #{idx + 1}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => shapeSegment(idx, -8)}
                      className="w-6 h-6 rounded-md bg-stone-100 hover:bg-stone-200 font-black text-stone-700 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-[11px] font-extrabold">{rad}</span>
                    <button
                      onClick={() => shapeSegment(idx, 8)}
                      className="w-6 h-6 rounded-md bg-stone-100 hover:bg-stone-200 font-black text-stone-700 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bake Button */}
          <button
            onClick={handleBakeMasterpiece}
            className="w-full bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-black text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-amber-600/20 transition-all"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>🔥 Bake Ceramic In Kiln!</span>
          </button>
        </div>

        {/* Right Side: Rotating Wheel Canvas Frame */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center bg-stone-100 border border-stone-200 rounded-3xl p-4 sm:p-6 relative">
          
          {isBaked && (
            <div className="absolute top-4 right-4 bg-emerald-500 text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-md animate-bounce flex items-center gap-1.5 z-10">
              <CheckCircle2 className="w-4 h-4" />
              <span>Baked & Solid Ceramic! 🏆</span>
            </div>
          )}

          <canvas
            ref={canvasRef}
            width={380}
            height={360}
            className="max-w-full rounded-2xl"
          />

          <span className="text-[11px] font-bold text-stone-400 mt-2 text-center">
            Pinch layers on the left panel to shape a vase, bowl, or ceramic cup!
          </span>
        </div>

      </div>

    </div>
  );
};

// -------------------------------------------------------------
// MAIN KIDS GAME ZONE CONTAINER WITH TABS FOR ALL GAMES
// -------------------------------------------------------------
export const KidsGameZone: React.FC<KidsGameZoneProps> = ({ 
  onOrderKit, 
  triggerToast, 
  onNavigateToShop 
}) => {
  const [activeGame, setActiveGame] = useState<"balloon" | "memory" | "catcher" | "clay" | "3d">("balloon");
  const [isMuted, setIsMuted] = useState(false);

  const toggleSound = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    sounds.setMuted(nextMute);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-pink-100 border border-pink-200 px-4 py-1.5 rounded-full shadow-xs">
          <Gamepad2 className="w-4 h-4 text-pink-600 animate-pulse" />
          <span className="text-[11px] font-black tracking-wider text-pink-700 uppercase">
            100% Free • Safe & Wholesome • Screen Time That Builds Creativity! 🌟
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-stone-900">
          🎮 Kids Interactive Game Zone 🎨
        </h1>

        <p className="text-xs sm:text-sm text-stone-500 font-medium max-w-xl mx-auto leading-relaxed">
          Keep your little ones creatively engaged and away from mindless social media reels! 
          Play wholesome color-popping, memory matching, paint catching, and 3D ceramic sculpting games.
        </p>

        {/* Sound Toggle */}
        <div className="flex items-center justify-center pt-1">
          <button
            onClick={toggleSound}
            className="inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold px-3.5 py-1.5 rounded-full transition-all border border-stone-200"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                <span>Game Sounds: Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-pink-500" />
                <span>Game Sounds: ON 🔊</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Game Tabs Navigation Bar */}
      <div className="bg-white border border-stone-200 p-2 sm:p-3 rounded-3xl shadow-sm flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
        {[
          { id: "balloon", label: "🎈 Balloon Color Pop", desc: "Reaction & Colors" },
          { id: "catcher", label: "🧺 Paint Drop Catcher", desc: "Speed & Combos" },
          { id: "memory", label: "🧠 Toy Memory Match", desc: "Focus & Brain" },
          { id: "clay", label: "🏺 Spin & Sculpt Clay", desc: "Pottery & Craft" },
          { id: "3d", label: "🧸 3D Toy Studio", desc: "Ceramic 3D Painter" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveGame(tab.id as any)}
            className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-extrabold flex flex-col items-center sm:items-start gap-0.5 transition-all cursor-pointer ${
              activeGame === tab.id
                ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/20 scale-102"
                : "bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200/60"
            }`}
          >
            <span className="text-xs sm:text-sm font-black">{tab.label}</span>
            <span className={`text-[10px] font-bold ${activeGame === tab.id ? "text-pink-100" : "text-stone-400"}`}>
              {tab.desc}
            </span>
          </button>
        ))}
      </div>

      {/* Active Game Display */}
      <div className="max-w-4xl mx-auto">
        {activeGame === "balloon" && <BalloonPopGame />}
        {activeGame === "catcher" && <PaintBucketCatcherGame />}
        {activeGame === "memory" && <MemoryMatchGame />}
        {activeGame === "clay" && <ClayPotterySculptor />}
        {activeGame === "3d" && (
          <div className="bg-stone-900 rounded-3xl p-2 sm:p-4 shadow-xl border-2 border-stone-700">
            <Toy3DStudio 
              triggerToast={triggerToast}
              onOrderKit={onOrderKit}
            />
          </div>
        )}
      </div>

      {/* Order DIY Real Physical Kit Promotional Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-pink-500 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white max-w-4xl mx-auto shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-black">
            <PartyPopper className="w-4 h-4 text-yellow-300" />
            <span>Bring Screen Play Into Real Life!</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black">
            Love the online games? Get the Real Painting Kit delivered! 📦
          </h3>
          <p className="text-xs sm:text-sm text-pink-100 max-w-md">
            Order complete sets of plaster figurines, safe paints, brushes & palettes with Cash on Delivery across Pakistan.
          </p>
        </div>

        <button
          onClick={onNavigateToShop}
          className="bg-white text-stone-900 hover:bg-stone-100 active:scale-95 font-black text-xs tracking-wider px-6 py-4 rounded-2xl flex items-center gap-2 shadow-xl shrink-0 transition-all cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 text-pink-600" />
          <span>Shop Real Kits (Rs. 199+)</span>
        </button>
      </div>

    </div>
  );
};

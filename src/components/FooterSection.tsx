import React, { useState } from "react";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  MessageSquare, 
  Heart, 
  ChevronRight, 
  Lock, 
  Award, 
  CheckCircle2 
} from "lucide-react";

interface FooterSectionProps {
  onNavigateTab: (tab: string) => void;
  onOpenAdmin: () => void;
  triggerWhatsAppQuery: (msg: string) => void;
  storePhone: string;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  onNavigateTab,
  onOpenAdmin,
  triggerWhatsAppQuery,
  storePhone,
}) => {
  const [secretClicks, setSecretClicks] = useState(0);

  const handleSecretClick = () => {
    const next = secretClicks + 1;
    setSecretClicks(next);
    if (next >= 3) {
      onOpenAdmin();
      setSecretClicks(0);
    }
  };

  return (
    <footer className="bg-stone-950 text-stone-300 text-xs mt-20 border-t border-stone-800/80 relative overflow-hidden">
      
      {/* Decorative Gradient Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner: Nationwide Sahiwal Delivery & Advance Payment Terms */}
      <div className="bg-gradient-to-r from-stone-900 via-pink-950/40 to-stone-900 border-b border-stone-800/80 py-4 px-6 text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-bold text-stone-200">
          <div className="flex items-center gap-2">
            <span className="bg-pink-500 text-white p-1 rounded-full text-xs">🎨</span>
            <span>
              <strong className="text-pink-400 font-extrabold">Mini Paint Station Sahiwal</strong> — Hand-molded non-toxic plaster toys & kid art kits!
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-stone-300">
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-pink-400" /> Standard Delivery Rs. 200
            </span>
            <span className="text-stone-700">|</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 50% Advance & 50% CoD
            </span>
          </div>
        </div>
      </div>

      {/* Trust & Guarantee Highlights Grid */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-8 border-b border-stone-800/60">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-stone-900/60 border border-stone-800/80 p-4 rounded-2xl flex items-center gap-3">
            <div className="p-2.5 bg-pink-500/10 text-pink-400 rounded-xl shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-extrabold text-white text-xs">100% Child Safe</h5>
              <p className="text-[10px] text-stone-400 font-medium">Non-toxic, lead-free plaster & paints</p>
            </div>
          </div>

          <div className="bg-stone-900/60 border border-stone-800/80 p-4 rounded-2xl flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-extrabold text-white text-xs">Cushion Packaged</h5>
              <p className="text-[10px] text-stone-400 font-medium">Zero-breakage delivery guarantee</p>
            </div>
          </div>

          <div className="bg-stone-900/60 border border-stone-800/80 p-4 rounded-2xl flex items-center gap-3">
            <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded-xl shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-extrabold text-white text-xs">Fast Shipping</h5>
              <p className="text-[10px] text-stone-400 font-medium">Sahiwal & all Pakistan cities</p>
            </div>
          </div>

          <div className="bg-stone-900/60 border border-stone-800/80 p-4 rounded-2xl flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-extrabold text-white text-xs">WhatsApp Support</h5>
              <p className="text-[10px] text-stone-400 font-medium">Instant order response on {storePhone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content Columns */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Col 1: Brand Info & Tagline (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-tr from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-pink-500/20">
              🎨
            </div>
            <div>
              <h3 className="text-lg font-black text-white tracking-tight leading-none">
                mini paint <span className="text-pink-500">station</span>
              </h3>
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                Sahiwal Studio & Store
              </span>
            </div>
          </div>

          <p className="text-[11px] leading-relaxed text-stone-400 font-medium">
            Pakistan's favorite creative workshop for kids! We manufacture smooth plaster figurines, storybook wooden planks, and mess-free washable paints to ignite children's artistic imagination.
          </p>

          <div className="pt-2">
            <button
              onClick={() => triggerWhatsAppQuery("Hi Mini Paint Station! I would like to place a custom order or ask a question.")}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Col 2: Quick Links & Creative Categories (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <h4 className="font-black text-white uppercase text-[11px] tracking-wider text-pink-400 border-b border-stone-800 pb-2">
            Explore Shop & Studio
          </h4>
          <ul className="space-y-2 text-stone-400 font-semibold text-xs">
            <li>
              <button onClick={() => onNavigateTab("home")} className="hover:text-pink-400 flex items-center gap-1.5 transition-all">
                <ChevronRight className="w-3.5 h-3.5 text-pink-500" />
                <span>Home & 3D Interactive Studio</span>
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateTab("products")} className="hover:text-pink-400 flex items-center gap-1.5 transition-all">
                <ChevronRight className="w-3.5 h-3.5 text-pink-500" />
                <span>Creative Toy Shop (All Products)</span>
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateTab("studio")} className="hover:text-pink-400 flex items-center gap-1.5 transition-all">
                <ChevronRight className="w-3.5 h-3.5 text-pink-500" />
                <span>Kids Virtual Painting Canvas</span>
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateTab("stencil")} className="hover:text-pink-400 flex items-center gap-1.5 transition-all">
                <ChevronRight className="w-3.5 h-3.5 text-pink-500" />
                <span>AI Custom Stencil Generator</span>
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateTab("contact")} className="hover:text-pink-400 flex items-center gap-1.5 transition-all">
                <ChevronRight className="w-3.5 h-3.5 text-pink-500" />
                <span>Contact & Sahiwal Location</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Sahiwal Address & Studio Support (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <h4 className="font-black text-white uppercase text-[11px] tracking-wider text-pink-400 border-b border-stone-800 pb-2">
            Studio & Location Info
          </h4>
          
          <div className="space-y-3 text-xs text-stone-300 font-medium">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-white">Main Studio Address:</span>
                <span className="text-[11px] text-stone-400">Mini Paint Station, Sahiwal City, Punjab, Pakistan</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-white">WhatsApp / Phone:</span>
                <span className="text-[11px] text-stone-300 font-mono font-bold">{storePhone}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-white">Working Hours:</span>
                <span className="text-[11px] text-stone-400">Mon - Sat: 9:00 AM - 10:00 PM PST</span>
              </div>
            </div>
          </div>
        </div>

        {/* Col 4: Embedded Sahiwal Location Map (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <h4 className="font-black text-white uppercase text-[11px] tracking-wider text-pink-400 border-b border-stone-800 pb-2">
            Sahiwal Location Map 📍
          </h4>
          
          <div className="rounded-2xl overflow-hidden border border-stone-800 h-36 relative bg-stone-900 shadow-inner">
            <iframe 
              title="Mini Paint Station Sahiwal Location Map"
              src="https://maps.google.com/maps?q=Sahiwal,%20Punjab,%20Pakistan&t=&z=13&ie=UTF8&iwloc=&output=embed" 
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>

          <a 
            href="https://maps.google.com/?q=Sahiwal+Punjab+Pakistan" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-pink-400 hover:text-pink-300 underline pt-1"
          >
            <span>Open Full Google Map Directions</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>

      {/* Bottom Legal & Payment Bar */}
      <div className="bg-stone-900/80 border-t border-stone-800/80 px-6 py-6 text-stone-400 text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Copyright & Secret Admin Trigger */}
          <div className="flex items-center gap-2">
            <span 
              onClick={handleSecretClick} 
              className="hover:text-stone-200 cursor-pointer select-none font-semibold"
            >
              © {new Date().getFullYear()} Mini Paint Station Sahiwal. Crafted with love for kids & creators.
            </span>
          </div>

          {/* Payment Badges */}
          <div className="flex items-center gap-3 font-bold text-[10px] uppercase tracking-wider text-stone-400">
            <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 px-2.5 py-1 rounded-lg">
              💚 EasyPaisa
            </span>
            <span className="bg-rose-950/80 text-rose-400 border border-rose-800/50 px-2.5 py-1 rounded-lg">
              🔴 JazzCash
            </span>
            <span className="bg-amber-950/80 text-amber-400 border border-amber-800/50 px-2.5 py-1 rounded-lg">
              💵 Cash on Delivery
            </span>
          </div>

          {/* Admin Login Portal Link */}
          <button
            onClick={onOpenAdmin}
            className="text-[10px] font-bold text-stone-500 hover:text-pink-400 flex items-center gap-1 transition-all"
          >
            <Lock className="w-3 h-3 text-stone-500" />
            <span>Admin Portal</span>
          </button>

        </div>
      </div>

    </footer>
  );
};

import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, CheckCircle2, Share, PlusSquare, Monitor, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallBannerProps {
  variant?: 'banner' | 'header-button' | 'card';
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ variant = 'banner' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showDesktopGuide, setShowDesktopGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user dismissed recently
    const isDismissed = sessionStorage.getItem('mps_pwa_banner_dismissed');
    if (isDismissed) {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('mps_pwa_banner_dismissed', 'true');
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setDismissed(true);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      setShowDesktopGuide(true);
    }
  };

  // If already installed, don't show prompt
  if (isInstalled) {
    return null;
  }

  // Header Button Variant (Compact, fits in nav bar)
  if (variant === 'header-button') {
    return (
      <>
        <button
          onClick={handleInstallClick}
          id="pwa-header-install-btn"
          className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Install Mini Paint Station App (Free)"
        >
          <Smartphone className="w-3.5 h-3.5 animate-bounce" />
          <span className="hidden sm:inline">Install App</span>
          <span className="sm:hidden">App</span>
          <span className="bg-white/20 text-[10px] font-bold px-1.5 py-0.2 rounded-full">Free</span>
        </button>

        {/* iOS Safari Guide Modal */}
        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/70 backdrop-blur-xs p-4 animate-fade-in">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-stone-200 text-stone-900 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 font-bold">
                    📲
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#111e47]">iPhone / iPad Install</h3>
                    <p className="text-[11px] text-stone-500">100% Free, No App Store needed</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200/60 text-xs font-medium">
                <div className="flex items-start gap-3">
                  <span className="bg-pink-500 text-white font-black w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                  <p>
                    Safari براؤزر میں نیچے <strong>Share</strong> بٹن <Share className="w-3.5 h-3.5 inline text-blue-600" /> دبائیں۔
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-pink-500 text-white font-black w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                  <p>
                    تھوڑا نیچے سکرول کر کے <strong>"Add to Home Screen"</strong> <PlusSquare className="w-3.5 h-3.5 inline text-stone-700" /> منتخب کریں۔
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-pink-500 text-white font-black w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                  <p>
                    اوپر دائیں کونے میں <strong>"Add"</strong> پر کلک کریں۔ ایپ آپ کی ہوم اسکرین پر آ جائے گی!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full bg-[#111e47] text-white font-black py-2.5 rounded-xl text-xs hover:bg-[#0c1634] transition-all cursor-pointer"
              >
                سمجھ آ گئی (Got It)
              </button>
            </div>
          </div>
        )}

        {/* Desktop / Laptop Guide Modal */}
        {showDesktopGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/70 backdrop-blur-xs p-4 animate-fade-in">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-stone-200 text-stone-900 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#111e47]">Laptop / Desktop App</h3>
                    <p className="text-[11px] text-stone-500">Works on Chrome, Edge & Brave</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDesktopGuide(false)}
                  className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 bg-stone-50 p-4 rounded-2xl border border-stone-200/60 text-xs font-medium">
                <p>
                  کروم یا ایج براؤزر کے ایڈریس بار (URL Bar) کے بالکل دائیں طرف <strong>Install Icon</strong> <Download className="w-3.5 h-3.5 inline text-pink-500" /> پر کلک کریں، یا براؤزر کے تین ڈاٹس <strong>(⋮)</strong> کھول کر <strong>"Install Mini Paint Station"</strong> دبا دیں۔
                </p>
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-[11px]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>لیپ ٹاپ کے ڈیسک ٹاپ پر ایپ شارٹ کٹ بن جائے گا!</span>
                </div>
              </div>

              <button
                onClick={() => setShowDesktopGuide(false)}
                className="w-full bg-[#111e47] text-white font-black py-2.5 rounded-xl text-xs hover:bg-[#0c1634] transition-all cursor-pointer"
              >
                بند کریں (Close)
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Dismissible floating bottom banner (Great for Mobile, Tablet, and Desktop users)
  if (dismissed) {
    return null;
  }

  return (
    <aside aria-label="Mobile and Tablet App Installation Banner" className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-40 animate-scale-up">
      <div className="bg-gradient-to-r from-[#111e47] to-[#1e295d] text-white p-4 rounded-3xl shadow-2xl border border-pink-500/30 flex items-center justify-between gap-3.5 backdrop-blur-sm">
        
        {/* App Icon */}
        <div className="w-12 h-12 rounded-2xl bg-white/10 p-1 flex items-center justify-center border border-white/20 shrink-0 overflow-hidden shadow-inner">
          <img src="/icon.svg" alt="Mini Paint Station Icon" className="w-full h-full object-contain" />
        </div>

        {/* Copy */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs font-black text-white tracking-wide truncate">
              Mini Paint Station App
            </h4>
            <span className="bg-pink-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
              Free
            </span>
          </div>
          <p className="text-[11px] text-stone-300 font-medium line-clamp-1">
            موبائل یا لیپ ٹاپ پر ایک کلک میں انسٹال کریں!
          </p>
          <div className="flex items-center gap-2 text-[10px] text-emerald-300 font-semibold mt-0.5">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Fast Loading • Full Screen • Offline Safe</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstallClick}
            id="pwa-banner-install-btn"
            className="bg-pink-500 hover:bg-pink-600 active:scale-95 text-white text-xs font-extrabold px-3.5 py-2.5 rounded-2xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
          
          <button
            onClick={handleDismiss}
            aria-label="Dismiss app install banner"
            className="p-1.5 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* iOS Safari Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/70 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-stone-200 text-stone-900 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 font-bold">
                  📲
                </div>
                <div>
                  <h3 className="text-base font-black text-[#111e47]">iPhone / iPad Install</h3>
                  <p className="text-[11px] text-stone-500">100% Free, No App Store needed</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200/60 text-xs font-medium">
              <div className="flex items-start gap-3">
                <span className="bg-pink-500 text-white font-black w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                <p>
                  Safari براؤزر میں نیچے <strong>Share</strong> بٹن <Share className="w-3.5 h-3.5 inline text-blue-600" /> دبائیں۔
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-pink-500 text-white font-black w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                <p>
                  تھوڑا نیچے سکرول کر کے <strong>"Add to Home Screen"</strong> <PlusSquare className="w-3.5 h-3.5 inline text-stone-700" /> منتخب کریں۔
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-pink-500 text-white font-black w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                <p>
                  اوپر دائیں کونے میں <strong>"Add"</strong> پر کلک کریں۔ ایپ آپ کی ہوم اسکرین پر آ جائے گی!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full bg-[#111e47] text-white font-black py-2.5 rounded-xl text-xs hover:bg-[#0c1634] transition-all cursor-pointer"
            >
              سمجھ آ گئی (Got It)
            </button>
          </div>
        </div>
      )}

      {/* Desktop / Laptop Guide Modal */}
      {showDesktopGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/70 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-stone-200 text-stone-900 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#111e47]">Laptop / Desktop App</h3>
                  <p className="text-[11px] text-stone-500">Works on Chrome, Edge & Brave</p>
                </div>
              </div>
              <button
                onClick={() => setShowDesktopGuide(false)}
                className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 bg-stone-50 p-4 rounded-2xl border border-stone-200/60 text-xs font-medium">
              <p>
                کروم یا ایج براؤزر کے ایڈریس بار (URL Bar) کے بالکل دائیں طرف <strong>Install Icon</strong> <Download className="w-3.5 h-3.5 inline text-pink-500" /> پر کلک کریں، یا براؤزر کے تین ڈاٹس <strong>(⋮)</strong> کھول کر <strong>"Install Mini Paint Station"</strong> دبا دیں۔
              </p>
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-[11px]">
                <CheckCircle2 className="w-4 h-4" />
                <span>لیپ ٹاپ کے ڈیسک ٹاپ پر ایپ شارٹ کٹ بن جائے گا!</span>
              </div>
            </div>

            <button
              onClick={() => setShowDesktopGuide(false)}
              className="w-full bg-[#111e47] text-white font-black py-2.5 rounded-xl text-xs hover:bg-[#0c1634] transition-all cursor-pointer"
            >
              بند کریں (Close)
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

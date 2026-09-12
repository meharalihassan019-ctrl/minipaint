import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Smartphone, 
  X, 
  CheckCircle2, 
  Share, 
  PlusSquare, 
  Monitor, 
  Sparkles, 
  ExternalLink,
  RefreshCw,
  HelpCircle,
  FileCode2,
  Check,
  MessageCircle
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallBannerProps {
  variant?: 'banner' | 'header-button' | 'mobile-top-bar' | 'mobile-nav-pill' | 'mobile-fab' | 'card';
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ variant = 'banner' }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, isMobile, isInAppBrowser, install } = usePWAInstall();
  const [showDownloadHub, setShowDownloadHub] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [downloadedFileType, setDownloadedFileType] = useState<'apk' | 'desktop'>('apk');
  const [downloadSuccessToast, setDownloadSuccessToast] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    // Only dismiss the floating bottom banner if user dismissed in this session
    const isDismissed = sessionStorage.getItem('mps_pwa_bottom_banner_dismissed');
    if (isDismissed) {
      setBannerDismissed(true);
    }
  }, []);

  const handleDismissBanner = () => {
    setBannerDismissed(true);
    sessionStorage.setItem('mps_pwa_bottom_banner_dismissed', 'true');
  };

  const triggerFileDownload = (url: string, filename: string) => {
    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        try {
          document.body.removeChild(a);
        } catch (e) {}
      }, 500);
    } catch (err) {
      window.location.href = url;
    }
  };

  const handleInstallClick = async (specificType?: 'apk' | 'desktop') => {
    // Determine file to download
    const targetType = specificType || (isAndroid || isMobile ? 'apk' : 'desktop');
    setDownloadedFileType(targetType);

    // 1. IMMEDIATE DIRECT DOWNLOAD ON CLICK
    if (targetType === 'apk') {
      triggerFileDownload('/api/download/apk', 'MiniPaintStation.apk');
    } else {
      triggerFileDownload('/api/download/desktop', 'MiniPaintStation-Desktop-App.zip');
    }

    // Show temporary confirmation toast
    setDownloadSuccessToast(true);
    setTimeout(() => setDownloadSuccessToast(false), 5000);

    // 2. Also trigger native browser prompt if available
    if (isInstallable) {
      try {
        await install();
      } catch (e) {
        console.log('PWA prompt skipped', e);
      }
    }

    // 3. Open iOS guide if on iPhone/iPad, otherwise show Download Hub
    if (isIOS) {
      setShowIOSGuide(true);
    } else {
      setShowDownloadHub(true);
    }
  };

  // If already running in standalone PWA mode, don't show install buttons
  if (isInstalled) {
    return null;
  }

  // --- MODAL GUIDES & DOWNLOAD HUB ---
  const renderModals = () => (
    <>
      {/* DIRECT DOWNLOAD TOAST NOTIFICATION */}
      {downloadSuccessToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <div className="text-xs font-bold">
            <p className="text-white">ڈاؤنلوڈ شروع ہو گئی ہے! (Download Started)</p>
            <p className="text-emerald-200 text-[11px]">
              {downloadedFileType === 'apk' ? 'MiniPaintStation.apk فائل محفوظ ہو رہی ہے' : 'MiniPaintStation-Desktop-App.zip فائل محفوظ ہو رہی ہے'}
            </p>
          </div>
        </div>
      )}

      {/* 1. COMPREHENSIVE DIRECT DOWNLOAD HUB MODAL */}
      {showDownloadHub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/80 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-stone-200 text-stone-900 space-y-4 max-h-[92vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-md">
                  <Download className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#111e47]">ایپ ڈاؤنلوڈ سینٹر</h3>
                  <p className="text-[11px] text-emerald-600 font-extrabold flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>ڈاؤنلوڈ شروع ہو گئی ہے! 100% مفت</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDownloadHub(false)}
                className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors cursor-pointer"
                title="بند کریں (Close)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* In-app browser warning if opened inside WhatsApp / Facebook */}
            {isInAppBrowser && (
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-amber-900 text-xs flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-extrabold block">واٹس ایپ / فیس بک میں ہیں؟</strong>
                  <span>اوپر دائیں <strong>(⋮)</strong> دبا کر <strong>"Open in Chrome"</strong> دبائیں تا کہ ڈائریکٹ ڈاؤنلوڈ اور انسٹال ہو سکے۔</span>
                </div>
              </div>
            )}

            {/* Action 1: Android APK Download Button */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 border-2 border-pink-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📱</span>
                  <div>
                    <h4 className="text-xs font-black text-stone-900">اینڈرائیڈ موبائل ایپ (Android APK)</h4>
                    <p className="text-[11px] text-stone-600">ہر قسم کے اینڈرائیڈ فون کیلئے تیار فائل</p>
                  </div>
                </div>
                <span className="bg-pink-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  Free APK
                </span>
              </div>
              <button
                onClick={() => {
                  triggerFileDownload('/api/download/apk', 'MiniPaintStation.apk');
                  setDownloadedFileType('apk');
                  setDownloadSuccessToast(true);
                  setTimeout(() => setDownloadSuccessToast(false), 5000);
                }}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black py-2.5 rounded-xl text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>MiniPaintStation.apk ڈائریکٹ ڈاؤنلوڈ کریں</span>
              </button>
              <p className="text-[10px] text-stone-500 text-center">
                ڈاؤنلوڈ کے بعد فائل پر کلک کریں اور <strong>"Install"</strong> دبا دیں۔
              </p>
            </div>

            {/* Action 2: Windows PC / Laptop Desktop App Download Button */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💻</span>
                  <div>
                    <h4 className="text-xs font-black text-stone-900">لیپ ٹاپ اور کمپیوٹر ایپ (PC / Windows)</h4>
                    <p className="text-[11px] text-stone-600">ڈیسک ٹاپ شارٹ کٹ اور ونڈوز لاؤنچر پیکج</p>
                  </div>
                </div>
                <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  PC .ZIP
                </span>
              </div>
              <button
                onClick={() => {
                  triggerFileDownload('/api/download/desktop', 'MiniPaintStation-Desktop-App.zip');
                  setDownloadedFileType('desktop');
                  setDownloadSuccessToast(true);
                  setTimeout(() => setDownloadSuccessToast(false), 5000);
                }}
                className="w-full bg-[#111e47] hover:bg-[#1a2b66] text-white font-black py-2.5 rounded-xl text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Monitor className="w-4 h-4 text-blue-300" />
                <span>Windows Desktop App (.zip) ڈاؤنلوڈ کریں</span>
              </button>
              <p className="text-[10px] text-stone-500 text-center">
                زپ فائل ان زپ کریں اور <strong>"Launch Mini Paint Station"</strong> پر ڈبل کلک کریں۔
              </p>
            </div>

            {/* Action 3: Native Web App Install (Chrome/Edge) */}
            {isInstallable && (
              <button
                onClick={async () => {
                  const success = await install();
                  if (success) setShowDownloadHub(false);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-2xl text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>براؤزر میں 1 کلک میں انسٹال کریں (Install PWA)</span>
              </button>
            )}

            {/* WhatsApp Assistance */}
            <div className="border-t border-stone-100 pt-3 flex items-center justify-between text-xs">
              <a
                href="https://wa.me/923106541965?text=Hello%20Mini%20Paint%20Station%2C%20mujhe%20app%20download%20karne%20mein%20help%20chahiye"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>کوئی مسئلہ؟ واٹس ایپ پر مدد لیں (0310-6541965)</span>
              </a>
              <button
                onClick={() => setShowDownloadHub(false)}
                className="text-stone-500 hover:text-stone-800 font-bold text-xs cursor-pointer"
              >
                بند کریں (Close)
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 2. iOS Safari Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/75 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-stone-200 text-stone-900 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600 font-bold shadow-inner">
                  📲
                </div>
                <div>
                  <h3 className="text-base font-black text-[#111e47]">iPhone / iPad پر انسٹال</h3>
                  <p className="text-[11px] text-emerald-600 font-bold">100% مفت — No App Store Needed</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200/70 text-xs font-medium text-stone-800">
              <div className="flex items-start gap-3">
                <span className="bg-pink-500 text-white font-black w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-sm">1</span>
                <p>
                  Safari براؤزر میں نیچے <strong>Share</strong> بٹن <Share className="w-3.5 h-3.5 inline text-blue-600" /> دبائیں۔
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-pink-500 text-white font-black w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-sm">2</span>
                <p>
                  تھوڑا نیچے سکرول کر کے <strong>"Add to Home Screen"</strong> <PlusSquare className="w-3.5 h-3.5 inline text-stone-700" /> منتخب کریں۔
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-pink-500 text-white font-black w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-sm">3</span>
                <p>
                  اوپر دائیں کونے میں <strong>"Add"</strong> پر کلک کریں۔ ایپ آپ کی ہوم اسکرین پر آ جائے گی!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full bg-[#111e47] text-white font-black py-2.5 rounded-2xl text-xs hover:bg-[#0c1634] transition-all cursor-pointer"
            >
              سمجھ آ گئی (Got It)
            </button>
          </div>
        </div>
      )}
    </>
  );

  // --- VARIANT 1: MOBILE TOP PROMINENT BAR ---
  if (variant === 'mobile-top-bar') {
    return (
      <>
        <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-pink-500 text-white px-3 py-1.5 flex items-center justify-between text-xs font-bold border-b border-pink-700/40 shadow-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-300"></span>
            </span>
            <span className="text-[11px] truncate font-extrabold">
              📲 موبائل میں ایپ ڈاؤنلوڈ کریں
            </span>
            <span className="hidden sm:inline-block bg-white/20 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              مفت (Free)
            </span>
          </div>

          <button
            onClick={() => handleInstallClick()}
            id="pwa-mobile-top-bar-btn"
            className="bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-stone-900 text-[11px] font-black px-3 py-1 rounded-full shadow-xs flex items-center gap-1 shrink-0 cursor-pointer transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ڈاؤنلوڈ</span>
          </button>
        </div>
        {renderModals()}
      </>
    );
  }

  // --- VARIANT 2: MOBILE NAV PILL (Inside category horizontal scroll) ---
  if (variant === 'mobile-nav-pill') {
    return (
      <>
        <button
          onClick={() => handleInstallClick()}
          id="pwa-nav-pill-btn"
          className="px-3.5 py-1.5 text-xs font-black whitespace-nowrap rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md flex items-center gap-1.5 shrink-0 border border-pink-300/40 animate-pulse active:scale-95 cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5 text-yellow-300" />
          <span>📲 ڈاؤنلوڈ ایپ</span>
          <span className="bg-yellow-300 text-stone-900 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
            Free
          </span>
        </button>
        {renderModals()}
      </>
    );
  }

  // --- VARIANT 3: MOBILE FLOATING BUTTON (Bottom left, beside WhatsApp) ---
  if (variant === 'mobile-fab') {
    return (
      <>
        <button
          onClick={() => handleInstallClick()}
          id="pwa-mobile-fab-btn"
          className="md:hidden fixed bottom-6 left-4 z-40 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 active:scale-95 text-white font-black text-xs px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 border-2 border-white/60 transition-all cursor-pointer"
          title="Download Mobile App"
        >
          <Download className="w-4 h-4 animate-bounce" />
          <span>ڈاؤنلوڈ ایپ</span>
          <span className="bg-yellow-400 text-stone-900 text-[9px] font-black px-1.5 py-0.5 rounded-full">
            مفت
          </span>
        </button>
        {renderModals()}
      </>
    );
  }

  // --- VARIANT 4: HEADER BUTTON (Compact, in Desktop & Mobile Header) ---
  if (variant === 'header-button') {
    return (
      <>
        <button
          onClick={() => handleInstallClick()}
          id="pwa-header-install-btn"
          className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-black px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Install Mini Paint Station App (Free)"
        >
          <Download className="w-3.5 h-3.5 animate-bounce" />
          <span className="text-[11px] sm:text-xs">ڈاؤنلوڈ ایپ</span>
          <span className="bg-white/20 text-[10px] font-bold px-1.5 py-0.2 rounded-full hidden xs:inline-block">Free</span>
        </button>
        {renderModals()}
      </>
    );
  }

  // --- VARIANT 5: CARD (For Homepage Showcase) ---
  if (variant === 'card') {
    return (
      <>
        <div className="bg-gradient-to-r from-[#111e47] via-[#1a2b66] to-[#111e47] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-pink-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 p-2 flex items-center justify-center border border-white/20 shrink-0 shadow-inner">
              <img src="/icon.svg" alt="Mini Paint Station" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-pink-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  100% Free App
                </span>
                <span className="text-yellow-300 text-xs font-bold">Android & PC</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                موبائل اور کمپیوٹر میں Mini Paint Station ایپ ڈاؤنلوڈ کریں
              </h3>
              <p className="text-xs text-stone-300 max-w-lg mt-0.5 font-medium">
                ڈائریکٹ 1 کلک میں اینڈرائیڈ APK اور ونڈوز ڈیسک ٹاپ ایپ ڈاؤنلوڈ کریں۔ تیز رفتار، بچوں کے فل اسکرین گیمز اور آف لائن سپورٹ!
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => handleInstallClick('apk')}
              id="pwa-card-install-apk-btn"
              className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 active:scale-95 text-white font-black text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer shrink-0"
            >
              <Download className="w-5 h-5 animate-bounce" />
              <span>Android APK ڈاؤنلوڈ کریں</span>
            </button>
            <button
              onClick={() => handleInstallClick('desktop')}
              id="pwa-card-install-pc-btn"
              className="w-full sm:w-auto bg-white/15 hover:bg-white/25 active:scale-95 text-white font-bold text-sm px-5 py-3.5 rounded-2xl border border-white/30 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
            >
              <Monitor className="w-5 h-5 text-blue-300" />
              <span>Windows App</span>
            </button>
          </div>
        </div>
        {renderModals()}
      </>
    );
  }

  // --- VARIANT 6: FLOATING BOTTOM BANNER ---
  if (bannerDismissed) {
    return renderModals();
  }

  return (
    <>
      <aside 
        aria-label="Mobile and Tablet App Installation Banner" 
        className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-40 animate-scale-up"
      >
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
              موبائل یا لیپ ٹاپ پر ایک کلک میں ڈاؤنلوڈ کریں!
            </p>
            <div className="flex items-center gap-2 text-[10px] text-emerald-300 font-semibold mt-0.5">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Fast Loading • Direct Download • 100% Free</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleInstallClick()}
              id="pwa-banner-install-btn"
              className="bg-pink-500 hover:bg-pink-600 active:scale-95 text-white text-xs font-extrabold px-3.5 py-2.5 rounded-2xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ڈاؤنلوڈ</span>
            </button>
            
            <button
              onClick={handleDismissBanner}
              aria-label="Dismiss app install banner"
              className="p-1.5 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </aside>

      {renderModals()}
    </>
  );
};


import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  if (showReconnected) {
    return (
      <div 
        role="status" 
        aria-live="polite"
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-emerald-600 text-white text-xs font-black px-4 py-2 rounded-full shadow-lg animate-fade-in"
      >
        <Wifi className="w-3.5 h-3.5" />
        <span>انٹرنیٹ بحال ہو گیا (Back Online)</span>
      </div>
    );
  }

  return (
    <div 
      role="status" 
      aria-live="polite"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-amber-600 text-white text-xs font-black px-4 py-2 rounded-full shadow-lg animate-bounce"
    >
      <WifiOff className="w-3.5 h-3.5" />
      <span>آف لائن موڈ — کیشڈ ڈیٹا فعال ہے (Offline Mode)</span>
    </div>
  );
};

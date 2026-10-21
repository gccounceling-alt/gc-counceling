import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { Language } from '../types';

interface OfflineIndicatorProps {
  language: Language;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ language }) => {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-black shadow-lg border border-amber-600 animate-bounce">
      <WifiOff className="w-4 h-4" />
      <span>
        {language === 'bn' 
          ? 'অফলাইন মোড – ক্যাশ করা তথ্য ব্যবহৃত হচ্ছে' 
          : 'Offline Mode — Operating from cached service worker shell'}
      </span>
    </div>
  );
};

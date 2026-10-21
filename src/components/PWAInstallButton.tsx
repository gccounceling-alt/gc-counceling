import React, { useState } from 'react';
import { Download, Share2, X, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Language } from '../types';

interface PWAInstallButtonProps {
  language: Language;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ language }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return (
      <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-amber-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        {language === 'bn' ? 'অ্যাপ সক্রিয়' : 'App Active'}
      </div>
    );
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold shadow-sm transition-colors cursor-pointer"
        title="Install Progressive Web App"
      >
        <Download className="w-3.5 h-3.5" />
        <span>{language === 'bn' ? 'অ্যাপ ইন্সটল' : 'Install App'}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium transition-colors cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-400" />
          <span>{language === 'bn' ? 'আইওএস-এ ইনস্টল' : 'Install on iOS'}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-xl bg-zinc-900 border border-zinc-800 p-5 shadow-2xl text-left">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">
                    {language === 'bn' ? 'আইফোন / আইপ্যাডে ইনস্টলেশন' : 'Install on iPhone / iPad'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-zinc-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs text-zinc-300 leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-[10px]">1</span>
                  <p>
                    {language === 'bn' 
                      ? 'সাফারি ব্রাউজারের নিচের শেয়ার বাটনে (Share icon) ট্যাপ করুন।' 
                      : 'Tap the Share icon in the bottom toolbar of Safari.'}
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-[10px]">2</span>
                  <p>
                    {language === 'bn' 
                      ? 'মেনু স্ক্রোল করে "Add to Home Screen" অপশনটি সিলেক্ট করুন।' 
                      : 'Scroll down and select "Add to Home Screen".'}
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-[10px]">3</span>
                  <p>
                    {language === 'bn' 
                      ? 'উপরে "Add" বাটনে ট্যাপ করলে আপনার হোম স্ক্রিনে জিসিসি আইকন যোগ হবে।' 
                      : 'Tap "Add" in top-right to place GCC on your home screen.'}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-zinc-800 flex justify-end">
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="px-4 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors"
                >
                  {language === 'bn' ? 'ঠিক আছে' : 'Got it'}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Default browser instructions button if beforeinstallprompt not yet triggered
  return (
    <button
      onClick={() => alert(language === 'bn' ? 'ক্রোম বা এজ ব্রাউজারের অ্যাড্রেস বারের Install আইকনে অথবা ব্রাউজার মেনুর "Install app / Add to home screen"-এ ক্লিক করে অ্যাপটি ইনস্টল করতে পারেন।' : 'To install GCC as a PWA, click the Install icon in your browser address bar or select "Install app / Add to Home screen" in browser menu.')}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs transition-colors cursor-pointer"
      title="How to install"
    >
      <Download className="w-3 h-3 text-amber-400" />
      <span className="text-[11px]">{language === 'bn' ? 'অ্যাপ' : 'PWA'}</span>
    </button>
  );
};

import React from 'react';
import { Globe, Shield, HelpCircle, FileCheck, Search, Zap } from 'lucide-react';
import { BrandLogoSlot } from './BrandLogoSlot';
import { PWAInstallButton } from './PWAInstallButton';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  activeView: 'landing' | 'register' | 'verify' | 'admin' | 'help';
  onNavigate: (view: 'landing' | 'register' | 'verify' | 'admin' | 'help') => void;
  lowDataMode: boolean;
  onToggleLowData: () => void;
  customLogoUrl?: string;
  hasActiveDraft?: boolean;
  onResumeDraft?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  activeView,
  onNavigate,
  lowDataMode,
  onToggleLowData,
  customLogoUrl,
  hasActiveDraft,
  onResumeDraft,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo & Tagline */}
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg p-1 -ml-1 cursor-pointer"
          >
            <BrandLogoSlot customLogoUrl={customLogoUrl} size="md" />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => onNavigate('landing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeView === 'landing'
                  ? 'bg-zinc-800 text-amber-400'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              {t.nav.home}
            </button>

            <button
              onClick={() => onNavigate('register')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeView === 'register'
                  ? 'bg-amber-500 text-black shadow-sm'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              {t.nav.register}
            </button>

            <button
              onClick={() => onNavigate('verify')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeView === 'verify'
                  ? 'bg-zinc-800 text-amber-400'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>{t.nav.verify}</span>
            </button>

            <button
              onClick={() => onNavigate('help')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeView === 'help'
                  ? 'bg-zinc-800 text-amber-400'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t.nav.help}</span>
            </button>

            <button
              onClick={() => onNavigate('admin')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeView === 'admin'
                  ? 'bg-zinc-800 text-amber-400'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{t.nav.admin}</span>
            </button>
          </nav>

          {/* Action Tools: Resume Draft, Low Data, Language Toggle, PWA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {hasActiveDraft && onResumeDraft && (
              <button
                onClick={onResumeDraft}
                className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-medium hover:bg-amber-500/20 transition-colors cursor-pointer"
                title="Resume your saved application"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>{t.brand.resumeDraft}</span>
              </button>
            )}

            {/* Low Bandwidth Toggle */}
            <button
              onClick={onToggleLowData}
              className={`p-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                lowDataMode
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
              title={language === 'bn' ? 'কম ব্যান্ডউইথ মোড অন/অফ' : 'Toggle low-bandwidth mode'}
            >
              <Zap className="w-3.5 h-3.5" />
            </button>

            {/* Language Switcher Button */}
            <button
              onClick={() => onLanguageChange(language === 'en' ? 'bn' : 'en')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-amber-400 transition-colors cursor-pointer"
              title="Toggle Bangla / English"
            >
              <Globe className="w-3.5 h-3.5 text-zinc-400" />
              <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
            </button>

            {/* In-app PWA install button */}
            <PWAInstallButton language={language} />
          </div>
        </div>
      </div>

      {/* Mobile Quick Navigation Bar */}
      <div className="flex md:hidden border-t border-zinc-800/80 bg-zinc-950 px-2 py-1 justify-around text-[11px] font-semibold">
        <button
          onClick={() => onNavigate('landing')}
          className={`py-1.5 px-2 rounded ${activeView === 'landing' ? 'text-amber-400' : 'text-zinc-400'}`}
        >
          {t.nav.home}
        </button>
        <button
          onClick={() => onNavigate('register')}
          className={`py-1.5 px-2.5 rounded ${activeView === 'register' ? 'bg-amber-500 text-black' : 'text-zinc-300'}`}
        >
          {t.nav.register}
        </button>
        <button
          onClick={() => onNavigate('verify')}
          className={`py-1.5 px-2 rounded ${activeView === 'verify' ? 'text-amber-400' : 'text-zinc-400'}`}
        >
          {t.nav.verify}
        </button>
        <button
          onClick={() => onNavigate('help')}
          className={`py-1.5 px-2 rounded ${activeView === 'help' ? 'text-amber-400' : 'text-zinc-400'}`}
        >
          {t.nav.help}
        </button>
        <button
          onClick={() => onNavigate('admin')}
          className={`py-1.5 px-2 rounded ${activeView === 'admin' ? 'text-amber-400' : 'text-zinc-500'}`}
        >
          {t.nav.admin}
        </button>
      </div>
    </header>
  );
};

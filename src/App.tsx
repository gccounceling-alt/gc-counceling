import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { OfflineIndicator } from './components/OfflineIndicator';
import { LandingView } from './features/landing/LandingView';
import { RegistrationWizard } from './features/registration/RegistrationWizard';
import { VerificationView } from './features/verification/VerificationView';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { HelpView } from './features/help/HelpView';
import { Language, CareerPathType, RegistrationRecord } from './types';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('gcc_lang') as Language) || 'bn';
  });

  const [activeView, setActiveView] = useState<'landing' | 'register' | 'verify' | 'admin' | 'help'>('landing');
  const [lowDataMode, setLowDataMode] = useState<boolean>(false);
  const [customLogoUrl, setCustomLogoUrl] = useState<string>('');
  const [hasDraft, setHasDraft] = useState<boolean>(false);

  // Check saved draft on mount
  useEffect(() => {
    const token = localStorage.getItem('gcc_draft_token');
    if (token) {
      setHasDraft(true);
    }

    // Fetch public portal config
    fetch('/api/config')
      .then(res => res.json())
      .then(cfg => {
        if (cfg && cfg.brandLogoUrl) {
          setCustomLogoUrl(cfg.brandLogoUrl);
        }
      })
      .catch(() => {
        // Safe fallback
      });
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('gcc_lang', lang);
  };

  const handleSelectPathFromLanding = (path: CareerPathType) => {
    setActiveView('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResumeDraft = (token?: string) => {
    const t = token || localStorage.getItem('gcc_draft_token');
    if (t) {
      setActiveView('register');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#0A0A0E] text-slate-100 ${lowDataMode ? 'low-data-mode' : ''}`}>
      {/* Top Navigation */}
      <Navbar
        language={language}
        onLanguageChange={handleLanguageChange}
        activeView={activeView}
        onNavigate={view => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        lowDataMode={lowDataMode}
        onToggleLowData={() => setLowDataMode(prev => !prev)}
        customLogoUrl={customLogoUrl}
        hasActiveDraft={hasDraft}
        onResumeDraft={() => handleResumeDraft()}
      />

      {/* Main View Body */}
      <main className="flex-1 w-full">
        {activeView === 'landing' && (
          <LandingView
            language={language}
            onSelectPath={handleSelectPathFromLanding}
            onStartRegistration={() => {
              setActiveView('register');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateVerify={() => {
              setActiveView('verify');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onResumeDraft={token => handleResumeDraft(token)}
          />
        )}

        {activeView === 'register' && (
          <RegistrationWizard
            language={language}
            onLanguageChange={handleLanguageChange}
            onRegistrationComplete={() => {
              setHasDraft(false);
              localStorage.removeItem('gcc_draft_token');
            }}
          />
        )}

        {activeView === 'verify' && (
          <VerificationView
            language={language}
            onStartRegistration={() => {
              setActiveView('register');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeView === 'admin' && (
          <AdminDashboard language={language} />
        )}

        {activeView === 'help' && (
          <HelpView language={language} />
        )}
      </main>

      {/* Connectivity Status Banner */}
      <OfflineIndicator language={language} />

      {/* Footer */}
      <Footer
        language={language}
        onNavigate={view => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        customLogoUrl={customLogoUrl}
      />
    </div>
  );
}

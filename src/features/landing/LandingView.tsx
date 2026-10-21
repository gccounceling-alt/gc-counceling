import React, { useState } from 'react';
import { 
  Briefcase, 
  Plane, 
  Compass, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  Search, 
  FileText, 
  Users, 
  Globe2 
} from 'lucide-react';
import { Language, CareerPathType } from '../../types';
import { translations } from '../../i18n/translations';

interface LandingViewProps {
  language: Language;
  onSelectPath: (path: CareerPathType) => void;
  onStartRegistration: () => void;
  onNavigateVerify: () => void;
  onResumeDraft: (token: string) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  language,
  onSelectPath,
  onStartRegistration,
  onNavigateVerify,
  onResumeDraft,
}) => {
  const t = translations[language];
  const isBn = language === 'bn';

  const [quickResumeCode, setQuickResumeCode] = useState('');

  const handleResumeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickResumeCode.trim()) {
      onResumeDraft(quickResumeCode.trim());
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-14 animate-fadeIn">
      {/* ========================================== */}
      {/* HERO SECTION */}
      {/* ========================================== */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Top Kicker */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wide">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t.hero.kicker}</span>
          </div>

          {/* Main Title & Tagline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            {t.hero.title}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-zinc-300 leading-relaxed max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={onStartRegistration}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm shadow-xl shadow-amber-500/10 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>{t.hero.ctaPrimary}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onNavigateVerify}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>{t.hero.ctaVerify}</span>
            </button>
          </div>

          {/* Resume Draft Quick Input */}
          <div className="pt-4 max-w-md mx-auto">
            <form onSubmit={handleResumeSubmit} className="flex gap-2">
              <input
                type="text"
                value={quickResumeCode}
                onChange={e => setQuickResumeCode(e.target.value)}
                placeholder={isBn ? 'ড্রাফট কোড দিন (যেমনঃ DRAFT-XXXX)' : 'Enter Resume Code (e.g. DRAFT-XXXX)'}
                className="flex-1 px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 font-mono focus:border-amber-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-amber-400 transition cursor-pointer whitespace-nowrap"
              >
                {t.brand.resumeDraft}
              </button>
            </form>
          </div>
        </div>

        {/* Real Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 sm:mt-16 max-w-4xl mx-auto">
          {t.hero.stats.map((s, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 text-center shadow-md space-y-1"
            >
              <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                {s.value}
              </div>
              <div className="text-[11px] sm:text-xs text-zinc-400 font-medium">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================== */}
      {/* 4 DEDICATED CAREER PATHWAYS */}
      {/* ========================================== */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-2 mb-10 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            {isBn ? 'আপনার সম্ভাবনার দিগন্ত' : 'Structured Opportunities'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t.paths.title}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            {t.paths.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Bangladesh */}
          <div
            onClick={() => onSelectPath('bangladesh')}
            className="group relative p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/50 transition-all cursor-pointer flex flex-col justify-between hover:shadow-xl hover:-translate-y-1"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition">
                  <Briefcase className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  {t.paths.bangladesh.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition">
                {t.paths.bangladesh.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {t.paths.bangladesh.subtitle}
              </p>
            </div>
            <div className="pt-6 flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>{isBn ? 'আবেদন শুরু করুন' : 'Explore Path'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Overseas */}
          <div
            onClick={() => onSelectPath('overseas')}
            className="group relative p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/50 transition-all cursor-pointer flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 ring-1 ring-amber-500/20"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition">
                  <Plane className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                  {t.paths.overseas.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition">
                {t.paths.overseas.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {t.paths.overseas.subtitle}
              </p>
            </div>
            <div className="pt-6 flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>{isBn ? 'আবেদন শুরু করুন' : 'Explore Path'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Entrepreneurship */}
          <div
            onClick={() => onSelectPath('entrepreneurship')}
            className="group relative p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/50 transition-all cursor-pointer flex flex-col justify-between hover:shadow-xl hover:-translate-y-1"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition">
                  <Compass className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  {t.paths.entrepreneurship.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition">
                {t.paths.entrepreneurship.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {t.paths.entrepreneurship.subtitle}
              </p>
            </div>
            <div className="pt-6 flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>{isBn ? 'আবেদন শুরু করুন' : 'Explore Path'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Upskilling */}
          <div
            onClick={() => onSelectPath('upskilling')}
            className="group relative p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/50 transition-all cursor-pointer flex flex-col justify-between hover:shadow-xl hover:-translate-y-1"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  {t.paths.upskilling.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition">
                {t.paths.upskilling.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {t.paths.upskilling.subtitle}
              </p>
            </div>
            <div className="pt-6 flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>{isBn ? 'আবেদন শুরু করুন' : 'Explore Path'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 4-STEP COUNSELLING ROADMAP */}
      {/* ========================================== */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {isBn ? 'কীভাবে জিসিসি কাজ করে' : 'How GCC Pathway Works'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {isBn ? 'স্বচ্ছ ও নিরাপদ ৪টি ধাপ' : 'Your Transparent 4-Step Journey'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-zinc-300">
            <div className="space-y-2 p-4 rounded-xl bg-zinc-950 border border-zinc-800/80">
              <span className="text-2xl font-black text-amber-400 font-mono">01.</span>
              <h4 className="font-bold text-white text-sm">
                {isBn ? 'যোগ্যতা ও দক্ষতা নিবন্ধন' : 'Skill & Profile Registration'}
              </h4>
              <p className="text-zinc-400 leading-relaxed">
                {isBn
                  ? 'আপনার প্রাতিষ্ঠানিক শিক্ষা, কারিগরি প্রশিক্ষণ এবং ভাষাগত দক্ষতার সত্য তথ্য জমা দিন।'
                  : 'Submit verified education, technical certifications, and English accents self-rating.'}
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-zinc-950 border border-zinc-800/80">
              <span className="text-2xl font-black text-amber-400 font-mono">02.</span>
              <h4 className="font-bold text-white text-sm">
                {isBn ? 'তাৎক্ষণিক প্রস্তুতি বিশ্লেষণ' : 'Preliminary Readiness Report'}
              </h4>
              <p className="text-zinc-400 leading-relaxed">
                {isBn
                  ? '৭টি মাত্রায় আপনার শক্তি ও উন্নয়নযোগ্য ক্ষেত্রগুলোর স্বয়ংক্রিয় স্বচ্ছ রিপোর্ট ও স্লিপ পান।'
                  : 'Receive instant multidimensional index with identified strengths and missing requirements.'}
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-zinc-950 border border-zinc-800/80">
              <span className="text-2xl font-black text-amber-400 font-mono">03.</span>
              <h4 className="font-bold text-white text-sm">
                {isBn ? 'বিশেষজ্ঞ কাউন্সেলিং সেশন' : 'Expert Counsellor Advisory'}
              </h4>
              <p className="text-zinc-400 leading-relaxed">
                {isBn
                  ? 'জিসিসির সার্টিফাইড সিনিয়র কাউন্সেলরের সাথে সরাসরি সাক্ষাৎকার ও ক্যারিয়ার পরিকল্পনা।'
                  : 'One-on-one session with assigned GCC mentor to bridge skill gaps and verify documents.'}
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-zinc-950 border border-zinc-800/80">
              <span className="text-2xl font-black text-amber-400 font-mono">04.</span>
              <h4 className="font-bold text-white text-sm">
                {isBn ? 'বৈধ কর্মসংস্থান বা উদ্যোক্তা' : 'Safe Placement & Enterprise'}
              </h4>
              <p className="text-zinc-400 leading-relaxed">
                {isBn
                  ? 'বিএমইটি অনুমোদিত বৈধ বৈদেশিক কর্মসংস্থান, দেশীয় শিল্প বা নিজস্ব ব্যবসার শুরু।'
                  : 'BMET-compliant legal migration, domestic enterprise placements, or registered SME launch.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* SAFE MIGRATION & ETHICAL PLEDGE BANNER */}
      {/* ========================================== */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-500/10 via-zinc-900 to-zinc-950 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>{isBn ? 'নিরাপদ অভিবাসন ও শূন্য অবৈধতা অঙ্গীকার' : 'Zero Illegal Migration Commitment'}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {isBn ? 'দালাল ও ভুয়া ভিসামুক্ত ক্যারিয়ার কাউন্সেলিং' : 'Transparent, Ethical Counselling without Intermediaries'}
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {isBn
                ? 'জিসিসি কোনো ভুয়া চাকরির প্রতিশ্রুতি দেয় না। আমরা আপনাকে আন্তর্জাতিক শ্রম বাজারের উপযোগী দক্ষতা, ভাষা এবং বৈধ আইনি প্রক্রিয়ায় প্রস্তুত করি।'
                : 'GCC prepares aspiring professionals with verified technical skills, language capability, and BMET-compliant visa requirements. We never promise undocumented or illegal pathways.'}
            </p>
          </div>

          <button
            onClick={onStartRegistration}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs shadow-md transition cursor-pointer whitespace-nowrap"
          >
            {t.hero.ctaPrimary}
          </button>
        </div>
      </section>
    </div>
  );
};

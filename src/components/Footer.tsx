import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, MessageSquare, Globe, Smartphone } from 'lucide-react';
import { BrandLogoSlot } from './BrandLogoSlot';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface FooterProps {
  language: Language;
  onNavigate: (view: 'landing' | 'register' | 'verify' | 'admin' | 'help') => void;
  customLogoUrl?: string;
}

export const Footer: React.FC<FooterProps> = ({ language, onNavigate, customLogoUrl }) => {
  const t = translations[language];

  return (
    <footer className="w-full bg-[#08080B] border-t border-zinc-900 text-zinc-400 text-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <BrandLogoSlot customLogoUrl={customLogoUrl} size="md" />
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-md">
              {t.hero.subtitle}
            </p>
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{language === 'bn' ? '১০০% স্বচ্ছ, তথ্যভিত্তিক ও নিরাপদ ক্যারিয়ার নির্দেশনা' : '100% Ethical, Verified & Transparent Career Guidance'}</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              {language === 'bn' ? 'দ্রুত লিংক' : 'Quick Access'}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('landing')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('register')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {t.nav.register}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('verify')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {t.nav.verify}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('help')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {t.nav.help}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {t.nav.admin}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Centres */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>{language === 'bn' ? 'যোগাযোগ ও প্রধান কার্যালয়' : 'Contact & Head Office'}</span>
            </h4>
            <div className="space-y-2.5 text-zinc-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                <span className="leading-snug text-zinc-300">
                  House 21, Road 01, Block-A, Section-02, Mirpur, Dhaka-1216
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <a href="tel:+8801722051183" className="hover:text-amber-400 transition-colors font-mono">
                    +8801722051183
                  </a>
                  <a href="tel:+8801703797957" className="hover:text-amber-400 transition-colors font-mono">
                    +8801703797957
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                <a href="mailto:gccounceling@gmail.com" className="hover:text-amber-400 transition-colors font-mono">
                  gccounceling@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Globe className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                <a href="https://www.gcc-bd.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors font-mono">
                  www.gcc-bd.com
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Smartphone className="w-3.5 h-3.5 text-pink-400 mt-0.5 flex-shrink-0" />
                <span className="text-[11px] leading-tight text-zinc-300">
                  bKash: <strong className="text-white font-mono">+8801722051183</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ethical Warning Banner */}
        <div className="mt-10 p-4 rounded-xl bg-zinc-950 border border-zinc-900 text-[11px] text-zinc-400 leading-relaxed">
          <strong className="text-zinc-200">
            {language === 'bn' ? 'গুরুত্বপূর্ণ সতর্কতা:' : 'Important Advisory:'}
          </strong>{' '}
          {language === 'bn' 
            ? 'জিসিসি কোনো অবস্থাতেই ভুয়া ভিসা, চাকরির গ্যারান্টি বা অবৈধ উপায়ে বিদেশযাত্রাকে সমর্থন করে না। বিএমইটি ও সরকারি লাইসেন্সকৃত বৈধ চ্যানেল ব্যতীত কোনো মধ্যস্বত্বভোগী বা দালালের সাথে কোনো প্রকার আর্থিক লেনদেন করবেন না।'
            : 'GCC strictly adheres to international ethical counselling standards and does not guarantee visas, jobs, or migration outcomes. Legal eligibility depends solely on destination country regulations and verified BMET channels. Beware of unlicensed intermediaries.'}
        </div>

        {/* Copyright & Data Protection */}
        <div className="mt-6 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-400">
          <div>
            © {new Date().getFullYear()} GCC – Global Career Counselling. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>{language === 'bn' ? 'বাংলাদেশ ডাটা প্রটেকশন মান অনুসরণকৃত' : 'Bangladesh Data Protection Compliant'}</span>
            <span>·</span>
            <button onClick={() => onNavigate('help')} className="hover:text-amber-400">
              {language === 'bn' ? 'গোপনীয়তা ও শর্তাবলী' : 'Privacy & Terms'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

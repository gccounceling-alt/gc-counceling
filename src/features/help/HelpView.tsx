import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  MapPin, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  CheckCircle2, 
  Smartphone, 
  ShieldCheck 
} from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';

interface HelpViewProps {
  language: Language;
}

export const HelpView: React.FC<HelpViewProps> = ({ language }) => {
  const t = translations[language];
  const isBn = language === 'bn';

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Contact Form State
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Career Guidance Inquiry');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile || !message) {
      setFormError(isBn ? 'নাম, মোবাইল ও বার্তা আবশ্যক' : 'Name, mobile and message are required');
      return;
    }

    setIsSending(true);
    setFormError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mobile, email, subject, message }),
      });

      if (!res.ok) throw new Error('Failed to send message');

      setSentSuccess(true);
      setName('');
      setMobile('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setFormError(err.message || 'Error sending message. Please try calling our hotline.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {t.help.title}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          {t.help.subtitle}
        </p>
      </div>

      {/* Contact Channels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Hotline */}
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2 text-center">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
            <Phone className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-zinc-300 block">{t.help.hotline}</span>
          <div className="text-xs sm:text-sm font-black text-white font-mono leading-tight">
            <a href="tel:+8801722051183" className="hover:text-amber-400 block">+8801722051183</a>
            <a href="tel:+8801703797957" className="hover:text-amber-400 block mt-0.5">+8801703797957</a>
          </div>
          <span className="text-[10px] text-zinc-400 block">{isBn ? 'সরাসরি হেল্পলাইন' : 'Direct Helpline'}</span>
        </div>

        {/* WhatsApp & bKash */}
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2 text-center">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
            <MessageSquare className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-zinc-300 block">{isBn ? 'হোয়াটসঅ্যাপ ও বিকাশ' : 'WhatsApp & bKash'}</span>
          <div className="text-sm font-black text-white font-mono">
            <a href="https://wa.me/8801722051183" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400">
              +8801722051183
            </a>
          </div>
          <span className="text-[10px] text-zinc-400 block">{isBn ? 'বার্তা ও ফি পরিশোধ' : 'Chat & Payments'}</span>
        </div>

        {/* Email */}
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2 text-center">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto">
            <Mail className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-zinc-300 block">{t.help.email}</span>
          <div className="text-xs font-black text-white font-mono break-all">
            <a href="mailto:gccounceling@gmail.com" className="hover:text-amber-400">
              gccounceling@gmail.com
            </a>
          </div>
          <span className="text-[10px] text-zinc-400 block">{isBn ? 'অফিসিয়াল ইমেইল' : 'Official Support'}</span>
        </div>

        {/* Official Website */}
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2 text-center">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
            <Smartphone className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-zinc-300 block">{isBn ? 'ওয়েবসাইট' : 'Website'}</span>
          <div className="text-xs sm:text-sm font-black text-amber-400 font-mono">
            <a href="https://www.gcc-bd.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
              www.gcc-bd.com
            </a>
          </div>
          <span className="text-[10px] text-zinc-400 block">{isBn ? 'ওয়েব পোর্টাল' : 'Web Portal'}</span>
        </div>
      </div>

      {/* Physical Locations */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
        <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{t.help.offices}</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
            <strong className="text-white block text-sm">{isBn ? 'ঢাকা প্রধান কার্যালয়' : 'Dhaka Head Office'}</strong>
            <p className="text-zinc-400 leading-relaxed">{t.help.dhakaOffice}</p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
            <strong className="text-white block text-sm">{isBn ? 'চট্টগ্রাম বিভাগীয় কেন্দ্র' : 'Chittagong Regional Centre'}</strong>
            <p className="text-zinc-400 leading-relaxed">{t.help.chittagongOffice}</p>
          </div>
        </div>
      </div>

      {/* FAQ & Contact Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* FAQ Accordion */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>{t.help.faqTitle}</span>
          </h2>

          <div className="space-y-2.5">
            {t.help.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-zinc-100 hover:text-amber-400 transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-amber-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-zinc-500 flex-shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* PWA Clarity Note */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-zinc-300 space-y-1.5">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span>{isBn ? 'মোবাইল ওয়েব অ্যাপ (PWA) সম্পর্কিত তথ্য' : 'Progressive Web App (PWA) Clarification'}</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {isBn
                ? 'জিসিসি কোনো ভারী এপিকে (APK) বা ফাইল ডাউনলোড ছাড়াই আপনার ব্রাউজার থেকে সরাসরি ইনস্টল হয়। এতে ফোন মেমরি সুরক্ষিত থাকে এবং কম ইন্টারনেটেও কাজ করে।'
                : 'GCC is built as a progressive web application that installs directly from modern Chromium, Edge, and iOS Safari browsers without third-party APK downloads.'}
            </p>
          </div>
        </div>

        {/* Message Inquiry Form */}
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-amber-400" />
            <span>{isBn ? 'সরাসরি বার্তা পাঠান' : 'Send an Inquiry to Counsellor'}</span>
          </h2>

          <form onSubmit={handleSubmitContact} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-zinc-300 font-bold">{isBn ? 'আপনার নাম' : 'Your Name'} *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g., Tanvir Hossain"
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-zinc-300 font-bold">{isBn ? 'মোবাইল নম্বর' : 'Mobile Number'} *</label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-bold">{isBn ? 'ইমেইল (যদি থাকে)' : 'Email (Optional)'}</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 font-bold">{isBn ? 'বিষয়' : 'Subject'}</label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white"
              >
                <option value="Career Guidance Inquiry">Career Guidance & Evaluation</option>
                <option value="Overseas Safe Migration">Overseas Safe Migration Guidance</option>
                <option value="Technical Trade Training">Technical Trade Training Support</option>
                <option value="Entrepreneurship Advisory">Entrepreneurship & SME Advisory</option>
                <option value="Fee & Payment Help">Fee & Payment Status Inquiries</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 font-bold">{isBn ? 'বার্তা / প্রশ্ন' : 'Your Message'} *</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={isBn ? 'আপনার ক্যারিয়ার লক্ষ্য বা প্রশ্ন বিস্তারিত লিখুন...' : 'Write your question or describe your career goal...'}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500"
              />
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-300 text-xs">
                {formError}
              </div>
            )}

            {sentSuccess && (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{isBn ? 'আপনার বার্তা সফলভাবে পাঠানো হয়েছে!' : 'Message sent successfully! A counsellor will respond promptly.'}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow transition cursor-pointer disabled:opacity-50"
            >
              {isSending ? (isBn ? 'পাঠানো হচ্ছে...' : 'Sending...') : (isBn ? 'বার্তা পাঠান' : 'Submit Inquiry')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

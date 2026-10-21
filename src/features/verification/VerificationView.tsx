import React, { useState } from 'react';
import { Search, ShieldCheck, CheckCircle2, Clock, AlertCircle, FileText, ArrowRight, Printer } from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../i18n/translations';

interface VerificationViewProps {
  language: Language;
  onStartRegistration: () => void;
}

export const VerificationView: React.FC<VerificationViewProps> = ({
  language,
  onStartRegistration,
}) => {
  const t = translations[language];
  const isBn = language === 'bn';

  const [searchId, setSearchId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const res = await fetch(`/api/registration/${encodeURIComponent(searchId.trim().toUpperCase())}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (isBn ? 'কোনো রেজিস্ট্রেশন রেকর্ড পাওয়া যায়নি' : 'No registration found'));
      }
      setResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8 animate-fadeIn">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{isBn ? 'অফিসিয়াল রেজিস্ট্রেশন যাচাই' : 'Official Registry Verification'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {isBn ? 'রেজিস্ট্রেশন স্ট্যাটাস ও রসিদ যাচাই' : 'Verify Registration & Track Status'}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
          {isBn
            ? 'আপনার ইউনিক রেজিস্ট্রেশন আইডি (যেমনঃ GCC-2026-XXXXXXXX) দিয়ে বর্তমান স্থিতি ও মূল্যায়ন ফলাফল যাচাই করুন।'
            : 'Enter your unique Registration Reference ID (e.g., GCC-2026-XXXXXXXX) to verify authentic status.'}
        </p>
      </div>

      {/* Search Input Box */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
        <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              required
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
              placeholder="GCC-2026-XXXXXXXX"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-400 focus:outline-none text-xs sm:text-sm text-white font-mono uppercase placeholder-zinc-400"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (isBn ? 'যাচাই হচ্ছে...' : 'Verifying...') : (isBn ? 'স্ট্যাটাস দেখুন' : 'Verify Status')}
          </button>
        </form>

        {errorMsg && (
          <div className="mt-4 p-3.5 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Verified Dossier Card */}
      {result && (
        <div className="p-6 sm:p-7 rounded-2xl bg-zinc-900 border border-amber-500/30 shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-zinc-800 gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                {isBn ? 'যাচাইকৃত রেজিস্ট্রেশন' : 'Verified Registration'}
              </span>
              <div className="text-xl font-black text-white font-mono">{result.id}</div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isBn ? 'সক্রিয় রেকর্ড' : 'Authentic GCC Record'}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1.5">
              <span className="text-zinc-500 block">{isBn ? 'আবেদনকারী:' : 'Applicant Name:'}</span>
              <div className="font-bold text-white text-sm">
                {result.applicantName} {result.applicantNameBn && `(${result.applicantNameBn})`}
              </div>
              <div className="text-zinc-400 text-[11px]">
                {result.district}, {result.division} · Mobile: {result.mobileMasked}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1.5">
              <span className="text-zinc-500 block">{isBn ? 'সার্বিক প্রস্তুতি স্কোর:' : 'Career Readiness Score:'}</span>
              <div className="text-2xl font-black text-amber-400 font-mono">
                {result.assessmentScore} / 100
              </div>
              <div className="text-zinc-400 text-[11px] uppercase">
                Pathway: {result.careerPaths.join(' · ')}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
              <span className="text-zinc-500 block">{isBn ? 'ক্যারিয়ার অগ্রগতি স্ট্যাটাস:' : 'Workflow Status:'}</span>
              <div className="font-bold text-white capitalize">
                {result.status.replace('_', ' ')}
              </div>
              {result.assignedCounsellor && (
                <div className="text-[11px] text-amber-400">
                  Assigned: {result.assignedCounsellor}
                </div>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
              <span className="text-zinc-500 block">{isBn ? 'পেমেন্ট অবস্থা:' : 'Fee Status:'}</span>
              <div className="font-bold text-emerald-400 uppercase">
                {result.payment?.status} ({result.payment?.amount} {result.payment?.currency})
              </div>
              {result.payment?.transactionId && (
                <div className="text-[11px] font-mono text-zinc-400">
                  Txn: {result.payment.transactionId}
                </div>
              )}
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 text-xs text-zinc-300 leading-relaxed">
            <strong>{isBn ? 'কাউন্সেলিং পরামর্শ:' : 'Advisory Notice:'}</strong>{' '}
            {isBn
              ? 'আপনার আবেদনটি জিসিসি সেন্টারে প্রক্রিয়াধীন রয়েছে। যে কোনো জিজ্ঞাসায় আপনার রেজিস্ট্রেশন আইডি নিয়ে সরাসরি আমাদের হেল্পলাইনে যোগাযোগ করতে পারেন।'
              : 'Your dossier is actively on file with GCC. Please quote this ID for expedited support at any GCC regional counselling centre.'}
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="text-center pt-4">
        <p className="text-xs text-zinc-400 mb-3">
          {isBn ? 'নতুন আবেদন করতে চান?' : 'Looking to start a new career assessment?'}
        </p>
        <button
          onClick={onStartRegistration}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-amber-400 transition cursor-pointer"
        >
          <span>{t.nav.register}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

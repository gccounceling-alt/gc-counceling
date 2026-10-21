import React from 'react';
import { Printer, Download, X, CheckCircle, Clock, ShieldAlert, ExternalLink, QrCode } from 'lucide-react';
import { RegistrationRecord, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { BrandLogoSlot } from '../../components/BrandLogoSlot';

interface ReceiptModalProps {
  record: RegistrationRecord;
  language: Language;
  onClose: () => void;
  onOpenPayment?: () => void;
  onOpenAssessment?: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  record,
  language,
  onClose,
  onOpenPayment,
  onOpenAssessment,
}) => {
  const t = translations[language];
  const isBn = language === 'bn';

  const handlePrint = () => {
    window.print();
  };

  const isPaid = record.payment.status === 'paid';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 overflow-y-auto backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-6 print:border-none print:shadow-none print:bg-white print:m-0 print:p-0">
        
        {/* Top Action Bar (hidden in print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 bg-zinc-950 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              {t.receipt.title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.receipt.btnPrint}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Slip Content */}
        <div className="p-6 sm:p-8 text-zinc-100 print:text-black print:p-4 print-card">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-zinc-800 print:border-black gap-4">
            <div>
              <BrandLogoSlot size="md" showTagline={true} />
              <p className="text-[11px] text-zinc-400 print:text-gray-700 mt-1">
                {isBn ? 'গণপ্রজাতন্ত্রী বাংলাদেশ অনুমোদিত ক্যারিয়ার মূল্যায়ন সেবা' : 'Standardized Career Pathway & Vocational Advisory'}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 print:text-black">
                {t.receipt.refNo}
              </span>
              <div className="text-lg sm:text-xl font-mono font-black text-white print:text-black tracking-wider">
                {record.id}
              </div>
              <div className="text-[11px] text-zinc-400 print:text-gray-600">
                {t.receipt.issuedOn} {new Date(record.createdAt).toLocaleDateString(isBn ? 'bn-BD' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Status Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-5">
            <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 print:border print:border-gray-300 print:bg-gray-50 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-zinc-400 print:text-gray-600 uppercase font-semibold">
                  {t.assessment.overallReadiness}
                </div>
                <div className="text-base font-bold text-amber-400 print:text-black">
                  {record.assessment.overallScore} / 100
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 print:text-black print:border-gray-400">
                {record.assessment.overallScore >= 75 ? (isBn ? 'উচ্চ প্রস্তুতি' : 'High Readiness') : (isBn ? 'মধ্যম প্রস্তুতি' : 'Moderate Readiness')}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 print:border print:border-gray-300 print:bg-gray-50 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-zinc-400 print:text-gray-600 uppercase font-semibold">
                  {t.receipt.paymentStatus}
                </div>
                <div className="text-base font-bold text-white print:text-black flex items-center gap-1.5">
                  {isPaid ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>{isBn ? 'পরিশোধিত' : 'PAID'} ({record.payment.amount} {record.payment.currency})</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>{isBn ? 'অপেক্ষমাণ' : 'PENDING'} ({record.payment.amount} {record.payment.currency})</span>
                    </>
                  )}
                </div>
              </div>
              {!isPaid && onOpenPayment && (
                <button
                  onClick={onOpenPayment}
                  className="no-print text-xs font-bold px-2.5 py-1 rounded bg-amber-500 text-black hover:bg-amber-400 transition cursor-pointer"
                >
                  {isBn ? 'ফি দিন' : 'Pay Now'}
                </button>
              )}
            </div>
          </div>

          {/* Applicant Dossier Table */}
          <div className="border border-zinc-800 rounded-xl overflow-hidden print:border-black text-xs my-4">
            <div className="grid grid-cols-3 p-2.5 bg-zinc-950 print:bg-gray-100 border-b border-zinc-800 print:border-black font-semibold text-zinc-300 print:text-black">
              <span className="col-span-1">{isBn ? 'ক্ষেত্র' : 'Information Field'}</span>
              <span className="col-span-2">{isBn ? 'বিবরণ' : 'Details'}</span>
            </div>
            <div className="divide-y divide-zinc-800/60 print:divide-gray-300">
              <div className="grid grid-cols-3 p-2.5">
                <span className="text-zinc-400 print:text-gray-600">{t.receipt.applicantName}</span>
                <span className="col-span-2 font-bold text-white print:text-black">
                  {record.personal.fullName} {record.personal.fullNameBn ? `(${record.personal.fullNameBn})` : ''}
                </span>
              </div>
              <div className="grid grid-cols-3 p-2.5">
                <span className="text-zinc-400 print:text-gray-600">{t.receipt.phone}</span>
                <span className="col-span-2 font-mono text-zinc-200 print:text-black">{record.personal.mobile}</span>
              </div>
              <div className="grid grid-cols-3 p-2.5">
                <span className="text-zinc-400 print:text-gray-600">{t.receipt.ageDistrict}</span>
                <span className="col-span-2 text-zinc-200 print:text-black">
                  {record.personal.age} {isBn ? 'বছর' : 'Years'} · {record.personal.district}, {record.personal.division}
                </span>
              </div>
              <div className="grid grid-cols-3 p-2.5">
                <span className="text-zinc-400 print:text-gray-600">{t.receipt.chosenPath}</span>
                <span className="col-span-2 font-semibold text-amber-400 print:text-black uppercase">
                  {record.careerPaths.selectedPaths.join(' · ')}
                </span>
              </div>
              <div className="grid grid-cols-3 p-2.5">
                <span className="text-zinc-400 print:text-gray-600">{isBn ? 'সর্বোচ্চ শিক্ষা ও ট্রেড:' : 'Education & Trade:'}</span>
                <span className="col-span-2 text-zinc-200 print:text-black">
                  {record.education.highestEducation} ({record.education.tradeOccupation || (isBn ? 'সাধারণ' : 'General')})
                </span>
              </div>
              {record.payment.transactionId && (
                <div className="grid grid-cols-3 p-2.5 bg-emerald-950/20 print:bg-transparent">
                  <span className="text-zinc-400 print:text-gray-600">{isBn ? 'ট্রানজেকশন আইডি:' : 'Txn ID:'}</span>
                  <span className="col-span-2 font-mono font-bold text-emerald-400 print:text-black">
                    {record.payment.transactionId} ({record.payment.provider})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* QR Verification Placeholder & Official Seal */}
          <div className="flex items-center justify-between p-3.5 bg-zinc-950/60 rounded-xl border border-zinc-800 print:border-gray-400 my-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg text-black print:p-1">
                <QrCode className="w-8 h-8" />
              </div>
              <div className="text-[11px] leading-tight text-zinc-300 print:text-black">
                <div className="font-bold text-amber-400 print:text-black">
                  {isBn ? 'ডিজিটাল যাচাইকৃত আইডি' : 'Digitally Verified ID'}
                </div>
                <div className="text-zinc-400 print:text-gray-600 text-[10px]">
                  https://gcc.org/verify/{record.id}
                </div>
              </div>
            </div>
            <div className="text-right text-[11px] text-zinc-400 print:text-black">
              <div className="font-bold uppercase tracking-wider">{isBn ? 'জিসিসি পরীক্ষা শাখা' : 'GCC Registry'}</div>
              <div className="text-[10px] text-zinc-400">{isBn ? 'স্বয়ংক্রিয় সিল' : 'Verified Signature'}</div>
            </div>
          </div>

          {/* Important instructions */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-zinc-300 print:border-gray-300 print:bg-gray-50 print:text-black text-xs space-y-1.5 my-4">
            <div className="font-bold text-amber-400 print:text-black flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 print:text-black" />
              <span>{t.receipt.instructionsTitle}</span>
            </div>
            <p className="text-[11px] leading-relaxed">1. {t.receipt.instruction1}</p>
            <p className="text-[11px] leading-relaxed">2. {t.receipt.instruction2}</p>
            <p className="text-[11px] leading-relaxed">3. {t.receipt.instruction3}</p>
          </div>

          {/* Disclaimer */}
          <p className="text-[10px] text-zinc-400 print:text-gray-600 text-center italic mt-4">
            {t.assessment.officialDisclaimer}
          </p>

          {/* Bottom Actions (hidden in print) */}
          <div className="no-print mt-6 pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
            {onOpenAssessment && (
              <button
                onClick={onOpenAssessment}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                <span>{t.receipt.btnViewAssessment}</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              </button>
            )}

            <div className="flex items-center gap-2">
              {!isPaid && onOpenPayment && (
                <button
                  onClick={onOpenPayment}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow transition cursor-pointer"
                >
                  {t.receipt.btnMakePayment}
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 transition"
              >
                {isBn ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

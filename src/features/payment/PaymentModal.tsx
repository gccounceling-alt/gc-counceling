import React, { useState } from 'react';
import { CreditCard, Smartphone, Building, ShieldCheck, AlertCircle, CheckCircle2, Loader2, X } from 'lucide-react';
import { RegistrationRecord, Language, PaymentProvider } from '../../types';
import { translations } from '../../i18n/translations';

interface PaymentModalProps {
  record: RegistrationRecord;
  language: Language;
  onClose: () => void;
  onPaymentSuccess: (updatedRecord: RegistrationRecord) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  record,
  language,
  onClose,
  onPaymentSuccess,
}) => {
  const t = translations[language];
  const isBn = language === 'bn';

  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('bkash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ txId: string } | null>(null);

  // If already paid
  if (record.payment.status === 'paid') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center text-white">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold">
            {isBn ? 'পেমেন্ট পূর্বেই পরিশোধিত ও যাচাইকৃত' : 'Fee Already Paid & Verified'}
          </h3>
          <p className="text-xs text-zinc-400 mt-2 font-mono">
            Transaction ID: {record.payment.transactionId}
          </p>
          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition cursor-pointer"
            >
              {isBn ? 'ফিরে যান' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleInitiateAndVerify = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Step 1: Server-side payment initiation
      const initRes = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId: record.id,
          provider: selectedProvider,
        }),
      });

      const initData = await initRes.json();
      if (!initRes.ok) {
        throw new Error(initData.error || 'Failed to initiate payment');
      }

      // Step 2: Server-side idempotent payment verification
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId: record.id,
          provider: selectedProvider,
          paymentId: initData.paymentId,
          clientNonce: `nonce_${Date.now()}`,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        throw new Error(verifyData.error || 'Payment verification failed');
      }

      // Update parent state with verified payment
      const updated: RegistrationRecord = {
        ...record,
        payment: {
          ...record.payment,
          status: 'paid',
          provider: selectedProvider,
          transactionId: verifyData.transactionId,
          paidAt: verifyData.timestamp,
        },
      };

      setSuccessInfo({ txId: verifyData.transactionId });
      onPaymentSuccess(updated);
    } catch (err: any) {
      console.error('Payment error:', err);
      setErrorMessage(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-7 text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {t.payment.title}
            </h3>
            <span className="text-xs text-zinc-400">
              {record.id} · {record.personal.fullName}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Display */}
        <div className="my-5 p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-400">{t.payment.amount}</span>
            <div className="text-2xl font-black text-amber-400 tracking-tight">
              {record.payment.amount} {record.payment.currency}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">
              {isBn ? 'সেবা:' : 'Service:'}
            </span>
            <span className="text-xs text-zinc-300 font-medium">
              {isBn ? 'ক্যারিয়ার কাউন্সেলিং ও মূল্যায়ন' : 'Career Counselling & Assessment'}
            </span>
          </div>
        </div>

        {/* Sandbox Notice Banner (Transparent & Honest) */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5 mb-5">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-amber-400">
              {isBn ? 'পরীক্ষামূলক স্যান্ডবক্স মোড:' : 'Safe Test Sandbox Mode:'}
            </strong>{' '}
            {t.payment.simulationNotice}
          </div>
        </div>

        {/* Provider Tabs */}
        <div className="space-y-2 mb-6">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            {t.payment.selectMethod}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* bKash */}
            <button
              type="button"
              onClick={() => setSelectedProvider('bkash')}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-colors cursor-pointer ${
                selectedProvider === 'bkash'
                  ? 'bg-pink-950/40 border-pink-500 text-white shadow-sm ring-1 ring-pink-500'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              <Smartphone className={`w-5 h-5 mb-2 ${selectedProvider === 'bkash' ? 'text-pink-400' : 'text-zinc-500'}`} />
              <span className="text-xs font-bold leading-tight">bKash Merchant</span>
              <span className="text-[10px] text-pink-300 font-mono mt-0.5">+8801722051183</span>
            </button>

            {/* Bank Gateway */}
            <button
              type="button"
              onClick={() => setSelectedProvider('bank_gateway')}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-colors cursor-pointer ${
                selectedProvider === 'bank_gateway'
                  ? 'bg-amber-950/40 border-amber-500 text-white shadow-sm ring-1 ring-amber-500'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              <Building className={`w-5 h-5 mb-2 ${selectedProvider === 'bank_gateway' ? 'text-amber-400' : 'text-zinc-500'}`} />
              <span className="text-xs font-bold leading-tight">Bank Gateway</span>
              <span className="text-[10px] text-zinc-400 mt-0.5">ব্যাংক ও ডেবিট কার্ড</span>
            </button>

            {/* Card Gateway */}
            <button
              type="button"
              onClick={() => setSelectedProvider('card_gateway')}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-colors cursor-pointer ${
                selectedProvider === 'card_gateway'
                  ? 'bg-blue-950/40 border-blue-500 text-white shadow-sm ring-1 ring-blue-500'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              <CreditCard className={`w-5 h-5 mb-2 ${selectedProvider === 'card_gateway' ? 'text-blue-400' : 'text-zinc-500'}`} />
              <span className="text-xs font-bold leading-tight">Card Gateway</span>
              <span className="text-[10px] text-zinc-400 mt-0.5">ভিসা ও মাস্টারকার্ড</span>
            </button>
          </div>
        </div>

        {/* Security & Zero Credentials Disclosure */}
        <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80 text-[11px] text-zinc-400 flex items-center gap-2 mb-5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            {isBn
              ? 'নিরাপত্তা নিশ্চিতকরণ: জিসিসি কখনোই আপনার কার্ড পিন, ওটিপি বা পাসওয়ার্ড সংরক্ষণ করে না।'
              : 'Security Assurance: GCC never stores sensitive PINs, OTPs, or financial credentials.'}
          </span>
        </div>

        {errorMessage && (
          <div className="p-3 mb-4 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs">
            {errorMessage}
          </div>
        )}

        {successInfo ? (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs text-center space-y-2">
            <div className="font-bold text-sm">
              {isBn ? 'পেমেন্ট সফলভাবে যাচাইকৃত!' : 'Payment Successfully Verified!'}
            </div>
            <div className="font-mono text-white text-xs">
              Txn ID: {successInfo.txId}
            </div>
            <button
              onClick={onClose}
              className="mt-3 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition cursor-pointer"
            >
              {isBn ? 'রসিদ দেখুন' : 'View Updated Receipt'}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition cursor-pointer"
            >
              {isBn ? 'পরে পরিশোধ করব' : 'Pay Later'}
            </button>
            <button
              type="button"
              onClick={handleInitiateAndVerify}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black shadow-md transition cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isBn ? 'যাচাই করা হচ্ছে...' : 'Verifying Server-side...'}</span>
                </>
              ) : (
                <span>{t.payment.btnPayNow}</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

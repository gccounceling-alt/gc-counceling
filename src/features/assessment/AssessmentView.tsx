import React from 'react';
import { Award, CheckCircle2, TrendingUp, AlertTriangle, ArrowRight, Printer, Receipt } from 'lucide-react';
import { RegistrationRecord, Language } from '../../types';
import { translations } from '../../i18n/translations';

interface AssessmentViewProps {
  record: RegistrationRecord;
  language: Language;
  onOpenReceipt: () => void;
  onOpenPayment?: () => void;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  record,
  language,
  onOpenReceipt,
  onOpenPayment,
}) => {
  const t = translations[language];
  const isBn = language === 'bn';
  const { assessment } = record;

  const dimensionList = [
    {
      key: 'educationTraining',
      label: t.assessment.dimensions.educationTraining,
      score: assessment.dimensionScores.educationTraining,
      color: 'bg-amber-500',
    },
    {
      key: 'practicalSkills',
      label: t.assessment.dimensions.practicalSkills,
      score: assessment.dimensionScores.practicalSkills,
      color: 'bg-emerald-500',
    },
    {
      key: 'language',
      label: t.assessment.dimensions.language,
      score: assessment.dimensionScores.language,
      color: 'bg-blue-500',
    },
    {
      key: 'digitalSkills',
      label: t.assessment.dimensions.digitalSkills,
      score: assessment.dimensionScores.digitalSkills,
      color: 'bg-purple-500',
    },
    {
      key: 'careerClarity',
      label: t.assessment.dimensions.careerClarity,
      score: assessment.dimensionScores.careerClarity,
      color: 'bg-yellow-400',
    },
  ];

  if (assessment.dimensionScores.financialPlanning !== undefined) {
    dimensionList.push({
      key: 'financialPlanning',
      label: t.assessment.dimensions.financialPlanning,
      score: assessment.dimensionScores.financialPlanning,
      color: 'bg-teal-500',
    });
  }

  if (assessment.dimensionScores.destinationAwareness !== undefined) {
    dimensionList.push({
      key: 'destinationAwareness',
      label: t.assessment.dimensions.destinationAwareness,
      score: assessment.dimensionScores.destinationAwareness,
      color: 'bg-indigo-500',
    });
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Top Banner with Overall Index */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-amber-500/30 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>{t.assessment.counsellorBadge}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {t.assessment.title}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {t.assessment.subtitle}
            </p>
            <div className="text-xs text-zinc-400 font-mono">
              {record.id} · {record.personal.fullName}
            </div>
          </div>

          {/* Radial / Box Score */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-center min-w-[140px]">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              {t.assessment.overallReadiness}
            </span>
            <div className="text-4xl sm:text-5xl font-black text-amber-400 my-1 font-mono">
              {assessment.overallScore}
              <span className="text-sm text-zinc-500">/100</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-400">
              {assessment.overallScore >= 75
                ? (isBn ? 'শক্তিশালী সম্ভাবনা' : 'High Potential')
                : (isBn ? 'উন্নয়নযোগ্য সম্ভাবনা' : 'Developing Profile')}
            </span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="mt-6 pt-5 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onOpenReceipt}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition cursor-pointer"
          >
            <Receipt className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.receipt.title}</span>
          </button>

          {record.payment.status !== 'paid' && onOpenPayment && (
            <button
              onClick={onOpenPayment}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black shadow-md transition cursor-pointer"
            >
              <span>{t.receipt.btnMakePayment}</span>
            </button>
          )}
        </div>
      </div>

      {/* Multidimensional Score Bars */}
      <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800/90 p-6 sm:p-7 space-y-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <span>{isBn ? 'দক্ষতার পৃথক মাত্রাসমূহ' : 'Evaluation by Competency Dimension'}</span>
        </h3>

        <div className="space-y-4">
          {dimensionList.map((dim) => (
            <div key={dim.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-zinc-200">{dim.label}</span>
                <span className="font-mono font-bold text-amber-400">{dim.score}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-950 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${dim.color}`}
                  style={{ width: `${dim.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Growth Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Strengths */}
        <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800/90 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{t.assessment.strengthsTitle}</span>
          </h3>
          <ul className="space-y-2.5 text-xs text-zinc-300 leading-relaxed">
            {(isBn ? assessment.strengthsBn : assessment.strengths).map((str, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Growth Areas & Missing Data */}
        <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800/90 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>{t.assessment.growthAreasTitle}</span>
          </h3>
          <ul className="space-y-2.5 text-xs text-zinc-300 leading-relaxed">
            {(isBn ? assessment.growthAreasBn : assessment.growthAreas).map((growth, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <span>{growth}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended Immediate Steps */}
      <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800/90 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ArrowRight className="w-4 h-4 text-amber-400" />
          <span>{t.assessment.recommendationsTitle}</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(isBn ? assessment.recommendedStepsBn : assessment.recommendedSteps).map((step, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs text-zinc-300 flex items-start gap-2.5 leading-relaxed"
            >
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-[11px]">
                {i + 1}
              </span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Official Mandatory Disclaimer */}
      <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 text-[11px] text-zinc-400 text-center leading-relaxed italic">
        {t.assessment.officialDisclaimer}
      </div>
    </div>
  );
};

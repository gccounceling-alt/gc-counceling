import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Upload, 
  FileText, 
  Check, 
  Globe, 
  Briefcase, 
  Plane, 
  Compass, 
  Sparkles,
  Copy,
  Receipt
} from 'lucide-react';
import { 
  Language, 
  PersonalDetails, 
  EducationTrainingDetails, 
  LanguageSkillsDetails, 
  DigitalSkillsDetails, 
  HealthAccommodationDetails, 
  CareerPathsData, 
  ConsentDeclarations, 
  RegistrationRecord, 
  CareerPathType,
  ProficiencyLevel,
  YesNoPreferNot
} from '../../types';
import { translations } from '../../i18n/translations';
import { bangladeshLocations } from '../../data/bangladeshLocations';
import { calculateReadinessProfile } from '../assessment/assessmentEngine';
import { AssessmentView } from '../assessment/AssessmentView';
import { ReceiptModal } from '../receipt/ReceiptModal';
import { PaymentModal } from '../payment/PaymentModal';

interface RegistrationWizardProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onRegistrationComplete?: (record: RegistrationRecord) => void;
}

export const RegistrationWizard: React.FC<RegistrationWizardProps> = ({
  language,
  onLanguageChange,
  onRegistrationComplete,
}) => {
  const t = translations[language];
  const isBn = language === 'bn';

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [completedRecord, setCompletedRecord] = useState<RegistrationRecord | null>(null);

  // Modals
  const [showReceipt, setShowReceipt] = useState<boolean>(false);
  const [showPayment, setShowPayment] = useState<boolean>(false);
  const [showDraftModal, setShowDraftModal] = useState<boolean>(false);
  const [draftResumeToken, setDraftResumeToken] = useState<string>('');
  const [copiedToken, setCopiedToken] = useState<boolean>(false);

  // Resume Draft input
  const [inputResumeCode, setInputResumeCode] = useState<string>('');
  const [resumeError, setResumeError] = useState<string | null>(null);

  // ==========================================
  // FORM STATE
  // ==========================================
  const [personal, setPersonal] = useState<PersonalDetails>({
    fullName: '',
    fullNameBn: '',
    dob: '2000-01-01',
    age: 26,
    gender: 'male',
    fatherName: '',
    motherName: '',
    currentAddress: '',
    permanentAddress: '',
    sameAddress: false,
    division: 'Dhaka',
    district: 'Dhaka',
    mobile: '',
    whatsapp: '',
    sameWhatsapp: true,
    email: '',
    socialProfile: '',
    preferredLanguage: language,
    emergencyContactName: '',
    emergencyContactPhone: '',
  });

  const [education, setEducation] = useState<EducationTrainingDetails>({
    highestEducation: 'Diploma in Engineering / Technical Diploma',
    institution: '',
    passingYear: '2022',
    technicalInstitute: '',
    tradeOccupation: '',
    courseType: 'diploma',
    duration: '3 Years',
    certificationStatus: 'certified',
    practicalExperienceYears: 2,
    workHistory: '',
    skills: [],
    expectedSalary: '40,000 BDT',
    cvFileName: undefined,
  });
  const [rawSkillsInput, setRawSkillsInput] = useState<string>('');

  const [langSkills, setLangSkills] = useState<LanguageSkillsDetails>({
    banglaProficiency: 'fluent',
    englishListening: 'intermediate',
    englishAccents: 'basic',
    englishSpeaking: 'basic',
    englishReading: 'intermediate',
    englishWriting: 'basic',
    otherLanguages: [],
  });
  const [rawOtherLangInput, setRawOtherLangInput] = useState<string>('');

  const [digital, setDigital] = useState<DigitalSkillsDetails>({
    computerLiteracy: 'intermediate',
    smartphoneSkills: 'advanced',
    internetUse: 'advanced',
    emailUse: 'intermediate',
    officeApps: 'basic',
    tradeSoftware: '',
    aiToolsAwareness: 'yes',
    designTools: {
      photoshop: false,
      illustrator: false,
      canva: true,
    },
  });

  const [health, setHealth] = useState<HealthAccommodationDetails>({
    hasAccommodationNeed: 'no',
    physicalLimitation: 'no',
    sensoryLimitation: 'no',
    speechSupport: 'no',
    optionalExplanation: '',
    sensitiveConsent: true,
  });

  const [careerPaths, setCareerPaths] = useState<CareerPathsData>({
    selectedPaths: ['overseas'],
    bangladesh: {
      preferredJobTitles: 'Production Supervisor / Welder',
      targetIndustries: ['Manufacturing & Steel', 'Garments & Textile'],
      preferredEmployers: '',
      workLocation: 'Dhaka / Gazipur',
      jobType: 'full_time',
      experienceYears: 2,
      expectedSalary: '35,000 BDT',
      availability: 'Immediate',
      shiftPreference: 'day',
      trainingNeeds: 'Advanced Blueprint Reading',
    },
    overseas: {
      hasPassport: 'yes',
      passportExpiryDate: '2030-05-15',
      passportValidityMonths: 43,
      previousTravelCountries: [],
      targetCountries: ['Saudi Arabia', 'UAE', 'Qatar'],
      targetTrade: 'Pipe Fabricator / Welder',
      targetDeparture: '1_3_months',
      budgetRange: 'BDT 2,50,000 - 3,50,000',
      financialReadiness: 'own_savings',
      informationSource: 'training_institute',
      relativesInDestination: false,
      destinationKnowledge: {
        jobMarket: true,
        livingCosts: true,
        localLanguage: false,
        workplaceCulture: true,
        legalRules: true,
      },
      understandsPermitRequired: true,
      understandsAgencyVerificationNeeded: true,
      understandsNoIllegalMigrationCommitment: true,
    },
    entrepreneurship: {
      proposedBusiness: 'Solar Panel Maintenance & Small Agro Firm',
      customerSegment: 'Local homeowners & rural farms',
      customerProblem: 'Frequent electrical outage & lack of reliable solar technician',
      businessLocation: 'Brahmanbaria',
      estimatedBudgetBand: 'BDT 3,00,000 - 5,00,000',
      ownInvestment: '1,50,000',
      fundingNeeded: '2,00,000',
      businessModel: 'hybrid',
      marketResearchAwareness: true,
      pricingStrategy: 'Cost-plus fair pricing',
      digitalMarketingAwareness: true,
      designBrandingAwareness: true,
      bookkeepingAwareness: true,
      tradeLicenseAwareness: true,
      requestedCounselling: ['SME Loan Process', 'Digital Marketing'],
    },
    upskilling: {
      currentStage: 'Mid-level Technician',
      targetSkills: ['Programmable Logic Controllers (PLC)', 'Conversational German'],
      preferredLearningMode: 'in_person_weekend',
      mentorshipInterest: true,
      certificationGoals: 'International NVQ Level 3',
    },
  });

  const [consent, setConsent] = useState<ConsentDeclarations>({
    dataProcessingConsent: true,
    marketingConsent: true,
    truthfulnessDeclaration: true,
  });

  // Calculate Age automatically when DOB changes
  useEffect(() => {
    if (personal.dob) {
      const birthDate = new Date(personal.dob);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setPersonal(prev => ({ ...prev, age: Math.max(14, calculatedAge) }));
    }
  }, [personal.dob]);

  // Calculate Passport remaining validity automatically
  useEffect(() => {
    if (careerPaths.overseas?.passportExpiryDate) {
      const expiry = new Date(careerPaths.overseas.passportExpiryDate);
      const today = new Date();
      const diffMonths = (expiry.getFullYear() - today.getFullYear()) * 12 + (expiry.getMonth() - today.getMonth());
      setCareerPaths(prev => ({
        ...prev,
        overseas: {
          ...prev.overseas!,
          passportValidityMonths: Math.max(0, diffMonths),
        },
      }));
    }
  }, [careerPaths.overseas?.passportExpiryDate]);

  // Address sync
  const handleAddressSync = (checked: boolean) => {
    setPersonal(prev => ({
      ...prev,
      sameAddress: checked,
      permanentAddress: checked ? prev.currentAddress : prev.permanentAddress,
    }));
  };

  // WhatsApp sync
  const handleWhatsappSync = (checked: boolean) => {
    setPersonal(prev => ({
      ...prev,
      sameWhatsapp: checked,
      whatsapp: checked ? prev.mobile : prev.whatsapp,
    }));
  };

  // Career path toggling
  const handleTogglePath = (path: CareerPathType) => {
    setCareerPaths(prev => {
      const exists = prev.selectedPaths.includes(path);
      const nextPaths = exists
        ? prev.selectedPaths.filter(p => p !== path)
        : [...prev.selectedPaths, path];
      return {
        ...prev,
        selectedPaths: nextPaths.length > 0 ? nextPaths : [path], // ensure at least 1 path
      };
    });
  };

  // Step Validation
  const validateStep = (step: number): string | null => {
    if (step === 1) {
      if (!personal.fullName.trim()) return isBn ? 'দয়া করে আপনার পূর্ণ নাম লিখুন' : 'Please enter your full name';
      if (!personal.mobile.trim() || personal.mobile.trim().length < 10) {
        return isBn ? 'সঠিক মোবাইল নম্বর লিখুন (কমপক্ষে ১০-১১ ডিজিট)' : 'Please enter a valid mobile number (10-11 digits)';
      }
      if (personal.age < 16) {
        return isBn ? 'ক্যারিয়ার কাউন্সেলিংয়ের জন্য ন্যূনতম বয়স ১৬ বছর হতে হবে' : 'Minimum age for career counselling is 16 years';
      }
      if (!personal.currentAddress.trim()) {
        return isBn ? 'বর্তমান ঠিকানা আবশ্যক' : 'Current address is required';
      }
    }
    if (step === 2) {
      if (!education.institution.trim()) {
        return isBn ? 'শিক্ষা প্রতিষ্ঠানের নাম লিখুন' : 'Please enter your educational institution name';
      }
    }
    if (step === 5) {
      if (careerPaths.selectedPaths.length === 0) {
        return isBn ? 'কমপক্ষে একটি ক্যারিয়ার পথ নির্বাচন করুন' : 'Please select at least one career pathway';
      }
      if (careerPaths.selectedPaths.includes('overseas')) {
        if (!careerPaths.overseas?.understandsPermitRequired || !careerPaths.overseas?.understandsNoIllegalMigrationCommitment) {
          return isBn 
            ? 'বিদেশযাত্রার জন্য বাধ্যতামূলক নিরাপদ ও বৈধ অভিবাসন অঙ্গীকারগুলো টিক দিন' 
            : 'Please acknowledge the mandatory legal and safe migration commitments';
        }
      }
    }
    if (step === 6) {
      if (!consent.dataProcessingConsent) {
        return isBn ? 'তথ্য প্রক্রিয়াকরণের সম্মতি আবশ্যক' : 'Data processing consent is mandatory';
      }
      if (!consent.truthfulnessDeclaration) {
        return isBn ? 'তথ্যের সত্যতা ঘোষণা আবশ্যক' : 'Declaration of truthfulness is mandatory';
      }
    }
    return null;
  };

  const handleNext = () => {
    const error = validateStep(currentStep);
    if (error) {
      alert(error);
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  // Save Draft
  const handleSaveDraft = async () => {
    // Generate or retrieve token
    const token = draftResumeToken || `DRAFT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setDraftResumeToken(token);

    const draftData = {
      personal,
      education,
      language: langSkills,
      digital,
      health,
      careerPaths,
      consent,
    };

    try {
      await fetch('/api/draft/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          step: currentStep,
          preferredLanguage: language,
          data: draftData,
        }),
      });
      // Store in localStorage for instant convenience
      localStorage.setItem('gcc_draft_token', token);
      setShowDraftModal(true);
    } catch (err) {
      console.warn('Draft save network fallback:', err);
      localStorage.setItem('gcc_draft_token', token);
      localStorage.setItem(`gcc_draft_${token}`, JSON.stringify(draftData));
      setShowDraftModal(true);
    }
  };

  // Resume Draft
  const handleResumeDraft = async (codeToUse?: string) => {
    const token = codeToUse || inputResumeCode.trim();
    if (!token) return;
    setResumeError(null);

    try {
      const res = await fetch(`/api/draft/${token}`);
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Draft not found');
      }
      const draft = result.draft;
      if (draft && draft.data) {
        if (draft.data.personal) setPersonal(draft.data.personal);
        if (draft.data.education) setEducation(draft.data.education);
        if (draft.data.language) setLangSkills(draft.data.language);
        if (draft.data.digital) setDigital(draft.data.digital);
        if (draft.data.health) setHealth(draft.data.health);
        if (draft.data.careerPaths) setCareerPaths(draft.data.careerPaths);
        if (draft.data.consent) setConsent(draft.data.consent);
        if (draft.step) setCurrentStep(draft.step);
        if (draft.preferredLanguage) onLanguageChange(draft.preferredLanguage);
        alert(isBn ? 'ড্রাফট সফলভাবে লোড হয়েছে!' : 'Draft loaded successfully!');
      }
    } catch (err: any) {
      setResumeError(err.message || 'Unable to load draft. Please check your token.');
    }
  };

  // Final Submission
  const handleSubmit = async () => {
    const error = validateStep(6);
    if (error) {
      alert(error);
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    // Compute transparent assessment scores
    const calculatedAssessment = calculateReadinessProfile(
      personal,
      education,
      langSkills,
      digital,
      health,
      careerPaths
    );

    const fullPayload = {
      personal,
      education: {
        ...education,
        skills: rawSkillsInput.trim() ? rawSkillsInput.split(',').map(s => s.trim()) : education.skills,
      },
      language: {
        ...langSkills,
        otherLanguages: rawOtherLangInput.trim() ? rawOtherLangInput.split(',').map(s => s.trim()) : langSkills.otherLanguages,
      },
      digital,
      health,
      careerPaths,
      consent,
      assessment: calculatedAssessment,
    };

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullPayload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration submission failed');
      }

      setCompletedRecord(data.record);
      setCurrentStep(7); // Jump to Assessment & Receipt step
      if (onRegistrationComplete) {
        onRegistrationComplete(data.record);
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setSubmissionError(err.message || 'Failed to submit registration. Please check inputs and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Available districts for current division
  const currentDivisionData = bangladeshLocations.find(d => d.en === personal.division) || bangladeshLocations[0];

  // If on step 7 (Assessment View)
  if (currentStep === 7 && completedRecord) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <AssessmentView
          record={completedRecord}
          language={language}
          onOpenReceipt={() => setShowReceipt(true)}
          onOpenPayment={() => setShowPayment(true)}
        />

        {showReceipt && (
          <ReceiptModal
            record={completedRecord}
            language={language}
            onClose={() => setShowReceipt(false)}
            onOpenPayment={() => {
              setShowReceipt(false);
              setShowPayment(true);
            }}
          />
        )}

        {showPayment && (
          <PaymentModal
            record={completedRecord}
            language={language}
            onClose={() => setShowPayment(false)}
            onPaymentSuccess={(updated) => {
              setCompletedRecord(updated);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Wizard Progress Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              {isBn ? `ধাপ ${currentStep} / ৬` : `Step ${currentStep} of 6`}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
              {t.steps[`step${currentStep}` as keyof typeof t.steps]}
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              {t.stepDescriptions[`step${currentStep}` as keyof typeof t.stepDescriptions]}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-amber-400 transition cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t.brand.saveDraft}</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Form Container */}
      <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 sm:p-8 shadow-xl text-zinc-100">
        
        {/* ========================================================= */}
        {/* STEP 1: PERSONAL & CONTACT */}
        {/* ========================================================= */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  {t.form.fullName} <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={personal.fullName}
                  onChange={e => setPersonal({ ...personal, fullName: e.target.value })}
                  placeholder={t.form.fullNamePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-400 focus:outline-none text-xs text-white placeholder-zinc-400 transition"
                />
              </div>

              {/* Full Name in Bangla */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  {t.form.fullNameBn}
                </label>
                <input
                  type="text"
                  value={personal.fullNameBn}
                  onChange={e => setPersonal({ ...personal, fullNameBn: e.target.value })}
                  placeholder={t.form.fullNameBnPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-400 focus:outline-none text-xs text-white placeholder-zinc-400 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* DOB */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  {t.form.dob} <span className="text-amber-400">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={personal.dob}
                  onChange={e => setPersonal({ ...personal, dob: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-400 focus:outline-none text-xs text-white transition"
                />
              </div>

              {/* Auto Calculated Age */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  {t.form.age}
                </label>
                <div className="px-3.5 py-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs font-mono font-bold text-amber-400 flex items-center justify-between">
                  <span>{personal.age} {isBn ? 'বছর' : 'Years'}</span>
                  <span className="text-[10px] text-zinc-400 font-sans">{t.form.ageNote}</span>
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  {t.form.gender}
                </label>
                <select
                  value={personal.gender}
                  onChange={e => setPersonal({ ...personal, gender: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-400 focus:outline-none text-xs text-white transition"
                >
                  <option value="male">{t.form.genders.male}</option>
                  <option value="female">{t.form.genders.female}</option>
                  <option value="other">{t.form.genders.other}</option>
                  <option value="prefer_not_to_say">{t.form.genders.prefer_not_to_say}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Father's Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  {t.form.fatherName}
                </label>
                <input
                  type="text"
                  value={personal.fatherName}
                  onChange={e => setPersonal({ ...personal, fatherName: e.target.value })}
                  placeholder={t.form.fatherNamePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-400 focus:outline-none text-xs text-white placeholder-zinc-400 transition"
                />
              </div>

              {/* Mother's Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  {t.form.motherName}
                </label>
                <input
                  type="text"
                  value={personal.motherName}
                  onChange={e => setPersonal({ ...personal, motherName: e.target.value })}
                  placeholder={t.form.motherNamePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-400 focus:outline-none text-xs text-white placeholder-zinc-400 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Current Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  {t.form.currentAddress} <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={personal.currentAddress}
                  onChange={e => setPersonal({ ...personal, currentAddress: e.target.value })}
                  placeholder={t.form.currentAddressPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-400 focus:outline-none text-xs text-white placeholder-zinc-400 transition"
                />
              </div>

              {/* Permanent Address */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-300">
                    {t.form.permanentAddress}
                  </label>
                  <label className="flex items-center gap-1.5 text-[11px] text-zinc-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={personal.sameAddress}
                      onChange={e => handleAddressSync(e.target.checked)}
                      className="rounded border-zinc-700 text-amber-500 focus:ring-0"
                    />
                    <span>{t.form.sameAddress}</span>
                  </label>
                </div>
                <input
                  type="text"
                  disabled={personal.sameAddress}
                  value={personal.sameAddress ? personal.currentAddress : personal.permanentAddress}
                  onChange={e => setPersonal({ ...personal, permanentAddress: e.target.value })}
                  placeholder={t.form.permanentAddressPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-400 focus:outline-none text-xs text-white placeholder-zinc-400 disabled:opacity-50 transition"
                />
              </div>
            </div>

            {/* Division & District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  {t.form.division} <span className="text-amber-400">*</span>
                </label>
                <select
                  value={personal.division}
                  onChange={e => {
                    const newDiv = e.target.value;
                    const divData = bangladeshLocations.find(d => d.en === newDiv) || bangladeshLocations[0];
                    setPersonal({
                      ...personal,
                      division: newDiv,
                      district: divData.districts[0].en,
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-400 focus:outline-none text-xs text-white transition"
                >
                  {bangladeshLocations.map(div => (
                    <option key={div.en} value={div.en}>
                      {isBn ? div.bn : div.en}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  {t.form.district} <span className="text-amber-400">*</span>
                </label>
                <select
                  value={personal.district}
                  onChange={e => setPersonal({ ...personal, district: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-400 focus:outline-none text-xs text-white transition"
                >
                  {currentDivisionData.districts.map(dst => (
                    <option key={dst.en} value={dst.en}>
                      {isBn ? dst.bn : dst.en}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mobile & WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  {t.form.mobile} <span className="text-amber-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={personal.mobile}
                  onChange={e => {
                    const val = e.target.value;
                    setPersonal(prev => ({
                      ...prev,
                      mobile: val,
                      whatsapp: prev.sameWhatsapp ? val : prev.whatsapp,
                    }));
                  }}
                  placeholder={t.form.mobilePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-400 focus:outline-none text-xs text-white placeholder-zinc-400 transition"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-300">
                    {t.form.whatsapp}
                  </label>
                  <label className="flex items-center gap-1.5 text-[11px] text-zinc-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={personal.sameWhatsapp}
                      onChange={e => handleWhatsappSync(e.target.checked)}
                      className="rounded border-zinc-700 text-amber-500 focus:ring-0"
                    />
                    <span>{t.form.sameWhatsapp}</span>
                  </label>
                </div>
                <input
                  type="tel"
                  disabled={personal.sameWhatsapp}
                  value={personal.sameWhatsapp ? personal.mobile : personal.whatsapp}
                  onChange={e => setPersonal({ ...personal, whatsapp: e.target.value })}
                  placeholder={t.form.whatsappPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-400 focus:outline-none text-xs text-white placeholder-zinc-400 disabled:opacity-50 transition"
                />
              </div>
            </div>

            {/* Email & Social Profile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  {t.form.email}
                </label>
                <input
                  type="email"
                  value={personal.email}
                  onChange={e => setPersonal({ ...personal, email: e.target.value })}
                  placeholder={t.form.emailPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-400 focus:outline-none text-xs text-white placeholder-zinc-400 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  {t.form.socialProfile}
                </label>
                <input
                  type="url"
                  value={personal.socialProfile}
                  onChange={e => setPersonal({ ...personal, socialProfile: e.target.value })}
                  placeholder={t.form.socialProfilePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-400 focus:outline-none text-xs text-white placeholder-zinc-400 transition"
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-4">
              <span className="text-xs font-bold text-zinc-300 block">
                {isBn ? 'জরুরি যোগাযোগের বিবরণ (ঐচ্ছিক)' : 'Emergency Contact Details (Optional)'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={personal.emergencyContactName}
                  onChange={e => setPersonal({ ...personal, emergencyContactName: e.target.value })}
                  placeholder={t.form.emergencyContactNamePlaceholder}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-400"
                />
                <input
                  type="tel"
                  value={personal.emergencyContactPhone}
                  onChange={e => setPersonal({ ...personal, emergencyContactPhone: e.target.value })}
                  placeholder={t.form.emergencyContactPhonePlaceholder}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 2: EDUCATION, TRAINING & WORK */}
        {/* ========================================================= */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  {t.form.highestEducation} <span className="text-amber-400">*</span>
                </label>
                <select
                  value={education.highestEducation}
                  onChange={e => setEducation({ ...education, highestEducation: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-400 focus:outline-none text-xs text-white transition"
                >
                  {t.form.educationLevels.map((lvl: string) => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  {t.form.institution} <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={education.institution}
                  onChange={e => setEducation({ ...education, institution: e.target.value })}
                  placeholder={t.form.institutionPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-400 focus:outline-none text-xs text-white placeholder-zinc-400 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  {t.form.passingYear}
                </label>
                <input
                  type="text"
                  value={education.passingYear}
                  onChange={e => setEducation({ ...education, passingYear: e.target.value })}
                  placeholder="e.g., 2022"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-400 focus:outline-none text-xs text-white transition"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-zinc-300">
                  {t.form.technicalInstitute}
                </label>
                <input
                  type="text"
                  value={education.technicalInstitute}
                  onChange={e => setEducation({ ...education, technicalInstitute: e.target.value })}
                  placeholder={t.form.technicalInstitutePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-400 focus:outline-none text-xs text-white placeholder-zinc-400 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  {t.form.tradeOccupation}
                </label>
                <input
                  type="text"
                  value={education.tradeOccupation}
                  onChange={e => setEducation({ ...education, tradeOccupation: e.target.value })}
                  placeholder={t.form.tradeOccupationPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-400 focus:outline-none text-xs text-white placeholder-zinc-400 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  {t.form.courseType}
                </label>
                <select
                  value={education.courseType}
                  onChange={e => setEducation({ ...education, courseType: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-400 focus:outline-none text-xs text-white transition"
                >
                  <option value="short_course">{t.form.courseTypes.short_course}</option>
                  <option value="certificate">{t.form.courseTypes.certificate}</option>
                  <option value="diploma">{t.form.courseTypes.diploma}</option>
                  <option value="bsc">{t.form.courseTypes.bsc}</option>
                  <option value="other">{t.form.courseTypes.other}</option>
                  <option value="none">{t.form.courseTypes.none}</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  {t.form.certificationStatus}
                </label>
                <select
                  value={education.certificationStatus}
                  onChange={e => setEducation({ ...education, certificationStatus: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-400 focus:outline-none text-xs text-white transition"
                >
                  <option value="certified">{t.form.certStatuses.certified}</option>
                  <option value="ongoing">{t.form.certStatuses.ongoing}</option>
                  <option value="completed_no_cert">{t.form.certStatuses.completed_no_cert}</option>
                  <option value="none">{t.form.certStatuses.none}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  {t.form.practicalExperienceYears}
                </label>
                <input
                  type="number"
                  min="0"
                  max="45"
                  value={education.practicalExperienceYears}
                  onChange={e => setEducation({ ...education, practicalExperienceYears: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-400 focus:outline-none text-xs text-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  {t.form.expectedSalary}
                </label>
                <input
                  type="text"
                  value={education.expectedSalary}
                  onChange={e => setEducation({ ...education, expectedSalary: e.target.value })}
                  placeholder={t.form.expectedSalaryPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-400 focus:outline-none text-xs text-white placeholder-zinc-400 transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-300">
                {t.form.workHistory}
              </label>
              <textarea
                rows={3}
                value={education.workHistory}
                onChange={e => setEducation({ ...education, workHistory: e.target.value })}
                placeholder={t.form.workHistoryPlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-400 focus:outline-none text-xs text-white placeholder-zinc-400 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-300">
                {t.form.skills}
              </label>
              <input
                type="text"
                value={rawSkillsInput || education.skills.join(', ')}
                onChange={e => setRawSkillsInput(e.target.value)}
                placeholder={t.form.skillsPlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-400 focus:outline-none text-xs text-white placeholder-zinc-400 transition"
              />
            </div>

            {/* CV Upload Slot */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
              <label className="text-xs font-bold text-zinc-300 flex items-center gap-2">
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.form.cvUpload}</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,image/*"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setEducation(prev => ({
                        ...prev,
                        cvFileName: file.name,
                        cvFileSize: file.size,
                      }));
                    }
                  }}
                  className="text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-amber-400 hover:file:bg-zinc-700 cursor-pointer"
                />
                {education.cvFileName && (
                  <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    {education.cvFileName}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 3: LANGUAGE & DIGITAL SKILLS */}
        {/* ========================================================= */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-4">
                {isBn ? 'ভাষা ও আন্তর্জাতিক যোগাযোগ দক্ষতা' : 'Language & Global Communication Proficiency'}
              </h3>
              
              <div className="space-y-4">
                {/* Bangla */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center p-3 rounded-xl bg-zinc-950 border border-zinc-800/80">
                  <span className="text-xs font-semibold text-zinc-200">{t.form.banglaProficiency}</span>
                  <select
                    value={langSkills.banglaProficiency}
                    onChange={e => setLangSkills({ ...langSkills, banglaProficiency: e.target.value as any })}
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white"
                  >
                    <option value="fluent">{t.form.proficiencyOptions.fluent}</option>
                    <option value="advanced">{t.form.proficiencyOptions.advanced}</option>
                    <option value="intermediate">{t.form.proficiencyOptions.intermediate}</option>
                  </select>
                </div>

                {/* English 5 Dimensions */}
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-4">
                  <span className="text-xs font-bold text-white block pb-2 border-b border-zinc-800">
                    {isBn ? 'ইংরেজি ভাষার ৫টি পৃথক মূল্যায়ন মাত্রা:' : 'Five Separate English Proficiency Dimensions:'}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <span className="text-xs text-zinc-300">{t.form.englishListening}</span>
                    <select
                      value={langSkills.englishListening}
                      onChange={e => setLangSkills({ ...langSkills, englishListening: e.target.value as any })}
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white"
                    >
                      {Object.entries(t.form.proficiencyOptions).map(([key, val]) => (
                        <option key={key} value={key}>{val as string}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <span className="text-xs text-zinc-300">{t.form.englishAccents}</span>
                    <select
                      value={langSkills.englishAccents}
                      onChange={e => setLangSkills({ ...langSkills, englishAccents: e.target.value as any })}
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white"
                    >
                      {Object.entries(t.form.proficiencyOptions).map(([key, val]) => (
                        <option key={key} value={key}>{val as string}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <span className="text-xs text-zinc-300">{t.form.englishSpeaking}</span>
                    <select
                      value={langSkills.englishSpeaking}
                      onChange={e => setLangSkills({ ...langSkills, englishSpeaking: e.target.value as any })}
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white"
                    >
                      {Object.entries(t.form.proficiencyOptions).map(([key, val]) => (
                        <option key={key} value={key}>{val as string}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <span className="text-xs text-zinc-300">{t.form.englishReading}</span>
                    <select
                      value={langSkills.englishReading}
                      onChange={e => setLangSkills({ ...langSkills, englishReading: e.target.value as any })}
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white"
                    >
                      {Object.entries(t.form.proficiencyOptions).map(([key, val]) => (
                        <option key={key} value={key}>{val as string}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <span className="text-xs text-zinc-300">{t.form.englishWriting}</span>
                    <select
                      value={langSkills.englishWriting}
                      onChange={e => setLangSkills({ ...langSkills, englishWriting: e.target.value as any })}
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white"
                    >
                      {Object.entries(t.form.proficiencyOptions).map(([key, val]) => (
                        <option key={key} value={key}>{val as string}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-zinc-300">
                    {t.form.otherLanguages}
                  </label>
                  <input
                    type="text"
                    value={rawOtherLangInput || langSkills.otherLanguages.join(', ')}
                    onChange={e => setRawOtherLangInput(e.target.value)}
                    placeholder="e.g., Arabic, Korean, Japanese, Malay, German"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-400 focus:outline-none text-xs text-white placeholder-zinc-400 transition"
                  />
                </div>
              </div>
            </div>

            {/* Digital & Software Literacy */}
            <div className="pt-4 border-t border-zinc-800 space-y-4">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
                {t.form.digitalHeader}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-300">{t.form.computerLiteracy}</label>
                  <select
                    value={digital.computerLiteracy}
                    onChange={e => setDigital({ ...digital, computerLiteracy: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                  >
                    {Object.entries(t.form.proficiencyOptions).map(([key, val]) => (
                      <option key={key} value={key}>{val as string}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-zinc-300">{t.form.smartphoneSkills}</label>
                  <select
                    value={digital.smartphoneSkills}
                    onChange={e => setDigital({ ...digital, smartphoneSkills: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                  >
                    {Object.entries(t.form.proficiencyOptions).map(([key, val]) => (
                      <option key={key} value={key}>{val as string}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-zinc-300">{t.form.internetUse}</label>
                  <select
                    value={digital.internetUse}
                    onChange={e => setDigital({ ...digital, internetUse: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                  >
                    {Object.entries(t.form.proficiencyOptions).map(([key, val]) => (
                      <option key={key} value={key}>{val as string}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-zinc-300">{t.form.officeApps}</label>
                  <select
                    value={digital.officeApps}
                    onChange={e => setDigital({ ...digital, officeApps: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                  >
                    {Object.entries(t.form.proficiencyOptions).map(([key, val]) => (
                      <option key={key} value={key}>{val as string}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  {t.form.tradeSoftware}
                </label>
                <input
                  type="text"
                  value={digital.tradeSoftware}
                  onChange={e => setDigital({ ...digital, tradeSoftware: e.target.value })}
                  placeholder={t.form.tradeSoftwarePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-400"
                />
              </div>

              {/* Design Tools & AI Awareness */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-3">
                <span className="text-xs font-bold text-zinc-200 block">
                  {t.form.designToolsLabel}
                </span>
                <div className="flex flex-wrap gap-4 text-xs text-zinc-300">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={digital.designTools.photoshop}
                      onChange={e => setDigital({
                        ...digital,
                        designTools: { ...digital.designTools, photoshop: e.target.checked }
                      })}
                      className="rounded border-zinc-700 text-amber-500 focus:ring-0"
                    />
                    <span>{t.form.photoshop}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={digital.designTools.illustrator}
                      onChange={e => setDigital({
                        ...digital,
                        designTools: { ...digital.designTools, illustrator: e.target.checked }
                      })}
                      className="rounded border-zinc-700 text-amber-500 focus:ring-0"
                    />
                    <span>{t.form.illustrator}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={digital.designTools.canva}
                      onChange={e => setDigital({
                        ...digital,
                        designTools: { ...digital.designTools, canva: e.target.checked }
                      })}
                      className="rounded border-zinc-700 text-amber-500 focus:ring-0"
                    />
                    <span>{t.form.canva}</span>
                  </label>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-xs text-zinc-300 font-medium">{t.form.aiToolsAwareness}</span>
                <select
                  value={digital.aiToolsAwareness}
                  onChange={e => setDigital({ ...digital, aiToolsAwareness: e.target.value as any })}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white"
                >
                  <option value="yes">{isBn ? 'হ্যাঁ, ব্যবহার করি / জানি' : 'Yes, Familiar / User'}</option>
                  <option value="no">{isBn ? 'না, ধারণা নেই' : 'No, Not Familiar'}</option>
                  <option value="prefer_not_to_say">{isBn ? 'বলতে ইচ্ছুক নই' : 'Prefer not to say'}</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 4: HEALTH & WORKPLACE ACCOMMODATION */}
        {/* ========================================================= */}
        {currentStep === 4 && (
          <div className="space-y-6">
            {/* Respectful Purpose Disclosure */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wide">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{t.form.healthNoticeTitle}</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {t.form.healthNoticeBody}
              </p>
            </div>

            <div className="space-y-4">
              {/* Question 1 */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-xs text-zinc-200 font-medium max-w-lg">
                  {t.form.hasAccommodationNeed}
                </span>
                <select
                  value={health.hasAccommodationNeed}
                  onChange={e => setHealth({ ...health, hasAccommodationNeed: e.target.value as any })}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white"
                >
                  <option value="no">{isBn ? 'না' : 'No'}</option>
                  <option value="yes">{isBn ? 'হ্যাঁ' : 'Yes'}</option>
                  <option value="prefer_not_to_say">{isBn ? 'বলতে ইচ্ছুক নই' : 'Prefer not to say'}</option>
                </select>
              </div>

              {/* Question 2 */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-xs text-zinc-200 font-medium max-w-lg">
                  {t.form.physicalLimitation}
                </span>
                <select
                  value={health.physicalLimitation}
                  onChange={e => setHealth({ ...health, physicalLimitation: e.target.value as any })}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white"
                >
                  <option value="no">{isBn ? 'না' : 'No'}</option>
                  <option value="yes">{isBn ? 'হ্যাঁ' : 'Yes'}</option>
                  <option value="prefer_not_to_say">{isBn ? 'বলতে ইচ্ছুক নই' : 'Prefer not to say'}</option>
                </select>
              </div>

              {/* Question 3 */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-xs text-zinc-200 font-medium max-w-lg">
                  {t.form.sensoryLimitation}
                </span>
                <select
                  value={health.sensoryLimitation}
                  onChange={e => setHealth({ ...health, sensoryLimitation: e.target.value as any })}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white"
                >
                  <option value="no">{isBn ? 'না' : 'No'}</option>
                  <option value="yes">{isBn ? 'হ্যাঁ' : 'Yes'}</option>
                  <option value="prefer_not_to_say">{isBn ? 'বলতে ইচ্ছুক নই' : 'Prefer not to say'}</option>
                </select>
              </div>

              {/* Question 4 */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-xs text-zinc-200 font-medium max-w-lg">
                  {t.form.speechSupport}
                </span>
                <select
                  value={health.speechSupport}
                  onChange={e => setHealth({ ...health, speechSupport: e.target.value as any })}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white"
                >
                  <option value="no">{isBn ? 'না' : 'No'}</option>
                  <option value="yes">{isBn ? 'হ্যাঁ' : 'Yes'}</option>
                  <option value="prefer_not_to_say">{isBn ? 'বলতে ইচ্ছুক নই' : 'Prefer not to say'}</option>
                </select>
              </div>

              {/* Optional brief explanation */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  {t.form.optionalExplanation}
                </label>
                <input
                  type="text"
                  value={health.optionalExplanation}
                  onChange={e => setHealth({ ...health, optionalExplanation: e.target.value })}
                  placeholder={t.form.optionalExplanationPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-400"
                />
              </div>

              {/* Explicit Consent for Sensitive Health Data */}
              <label className="flex items-start gap-3 p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={health.sensitiveConsent}
                  onChange={e => setHealth({ ...health, sensitiveConsent: e.target.checked })}
                  className="mt-0.5 rounded border-zinc-700 text-amber-500 focus:ring-0"
                />
                <span className="text-xs text-zinc-300 leading-relaxed font-medium">
                  {t.form.sensitiveConsent}
                </span>
              </label>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 5: CAREER PATH SELECTION & CONDITIONAL QUESTIONS */}
        {/* ========================================================= */}
        {currentStep === 5 && (
          <div className="space-y-8">
            {/* Pathway Selectors (Card grid) */}
            <div>
              <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
                {t.form.choosePathsLabel}
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Bangladesh */}
                <button
                  type="button"
                  onClick={() => handleTogglePath('bangladesh')}
                  className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                    careerPaths.selectedPaths.includes('bangladesh')
                      ? 'bg-amber-500/10 border-amber-500 text-white shadow-sm ring-1 ring-amber-500'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Briefcase className={`w-5 h-5 ${careerPaths.selectedPaths.includes('bangladesh') ? 'text-amber-400' : 'text-zinc-500'}`} />
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-amber-400">
                      {t.paths.bangladesh.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{t.paths.bangladesh.title}</h4>
                  <p className="text-xs text-zinc-400 leading-snug">{t.paths.bangladesh.subtitle}</p>
                </button>

                {/* Overseas */}
                <button
                  type="button"
                  onClick={() => handleTogglePath('overseas')}
                  className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                    careerPaths.selectedPaths.includes('overseas')
                      ? 'bg-amber-500/10 border-amber-500 text-white shadow-sm ring-1 ring-amber-500'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Plane className={`w-5 h-5 ${careerPaths.selectedPaths.includes('overseas') ? 'text-amber-400' : 'text-zinc-500'}`} />
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-amber-400">
                      {t.paths.overseas.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{t.paths.overseas.title}</h4>
                  <p className="text-xs text-zinc-400 leading-snug">{t.paths.overseas.subtitle}</p>
                </button>

                {/* Entrepreneurship */}
                <button
                  type="button"
                  onClick={() => handleTogglePath('entrepreneurship')}
                  className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                    careerPaths.selectedPaths.includes('entrepreneurship')
                      ? 'bg-amber-500/10 border-amber-500 text-white shadow-sm ring-1 ring-amber-500'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Compass className={`w-5 h-5 ${careerPaths.selectedPaths.includes('entrepreneurship') ? 'text-amber-400' : 'text-zinc-500'}`} />
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-amber-400">
                      {t.paths.entrepreneurship.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{t.paths.entrepreneurship.title}</h4>
                  <p className="text-xs text-zinc-400 leading-snug">{t.paths.entrepreneurship.subtitle}</p>
                </button>

                {/* Upskilling */}
                <button
                  type="button"
                  onClick={() => handleTogglePath('upskilling')}
                  className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                    careerPaths.selectedPaths.includes('upskilling')
                      ? 'bg-amber-500/10 border-amber-500 text-white shadow-sm ring-1 ring-amber-500'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Sparkles className={`w-5 h-5 ${careerPaths.selectedPaths.includes('upskilling') ? 'text-amber-400' : 'text-zinc-500'}`} />
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-amber-400">
                      {t.paths.upskilling.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{t.paths.upskilling.title}</h4>
                  <p className="text-xs text-zinc-400 leading-snug">{t.paths.upskilling.subtitle}</p>
                </button>
              </div>
            </div>

            {/* CONDITIONAL SECTION: OVERSEAS EMPLOYMENT */}
            {careerPaths.selectedPaths.includes('overseas') && (
              <div className="p-5 sm:p-6 rounded-2xl bg-zinc-950 border border-amber-500/30 space-y-5">
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Plane className="w-4 h-4" />
                  <span>{t.form.overseasSectionTitle}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300">{t.form.hasPassport}</label>
                    <select
                      value={careerPaths.overseas?.hasPassport}
                      onChange={e => setCareerPaths({
                        ...careerPaths,
                        overseas: { ...careerPaths.overseas!, hasPassport: e.target.value as any }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                    >
                      <option value="yes">{isBn ? 'হ্যাঁ, সক্রিয় পাসপোর্ট আছে' : 'Yes, Valid Passport'}</option>
                      <option value="in_process">{isBn ? 'আবেদন করেছি / প্রক্রিয়াধীন' : 'In Process'}</option>
                      <option value="no">{isBn ? 'না, পাসপোর্ট নেই' : 'No Passport'}</option>
                    </select>
                  </div>

                  {careerPaths.overseas?.hasPassport === 'yes' && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-300">{t.form.passportExpiryDate}</label>
                        <input
                          type="date"
                          value={careerPaths.overseas?.passportExpiryDate}
                          onChange={e => setCareerPaths({
                            ...careerPaths,
                            overseas: { ...careerPaths.overseas!, passportExpiryDate: e.target.value }
                          })}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-300">{t.form.passportRemaining}</label>
                        <div className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono font-bold text-amber-400">
                          {careerPaths.overseas?.passportValidityMonths} {t.form.months}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300">{t.form.targetCountries}</label>
                    <input
                      type="text"
                      value={careerPaths.overseas?.targetCountries.join(', ')}
                      onChange={e => setCareerPaths({
                        ...careerPaths,
                        overseas: {
                          ...careerPaths.overseas!,
                          targetCountries: e.target.value.split(',').map(c => c.trim())
                        }
                      })}
                      placeholder={t.form.targetCountriesPlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300">{t.form.targetTradeOverseas}</label>
                    <input
                      type="text"
                      value={careerPaths.overseas?.targetTrade}
                      onChange={e => setCareerPaths({
                        ...careerPaths,
                        overseas: { ...careerPaths.overseas!, targetTrade: e.target.value }
                      })}
                      placeholder={t.form.targetTradePlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300">{t.form.targetDeparture}</label>
                    <select
                      value={careerPaths.overseas?.targetDeparture}
                      onChange={e => setCareerPaths({
                        ...careerPaths,
                        overseas: { ...careerPaths.overseas!, targetDeparture: e.target.value as any }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                    >
                      {Object.entries(t.form.targetDepartureOptions).map(([k, v]) => (
                        <option key={k} value={k}>{v as string}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300">{t.form.financialReadiness}</label>
                    <select
                      value={careerPaths.overseas?.financialReadiness}
                      onChange={e => setCareerPaths({
                        ...careerPaths,
                        overseas: { ...careerPaths.overseas!, financialReadiness: e.target.value as any }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                    >
                      {Object.entries(t.form.financialOptions).map(([k, v]) => (
                        <option key={k} value={k}>{v as string}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300">{t.form.budgetRange}</label>
                    <input
                      type="text"
                      value={careerPaths.overseas?.budgetRange}
                      onChange={e => setCareerPaths({
                        ...careerPaths,
                        overseas: { ...careerPaths.overseas!, budgetRange: e.target.value }
                      })}
                      placeholder={t.form.budgetRangePlaceholder}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Destination Awareness Checklist */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2.5">
                  <span className="text-xs font-bold text-amber-400 block">
                    {t.form.destinationKnowledgeLabel}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={careerPaths.overseas?.destinationKnowledge.jobMarket}
                        onChange={e => setCareerPaths({
                          ...careerPaths,
                          overseas: {
                            ...careerPaths.overseas!,
                            destinationKnowledge: {
                              ...careerPaths.overseas!.destinationKnowledge,
                              jobMarket: e.target.checked
                            }
                          }
                        })}
                        className="rounded border-zinc-700 text-amber-500 focus:ring-0"
                      />
                      <span>{t.form.knowJobMarket}</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={careerPaths.overseas?.destinationKnowledge.livingCosts}
                        onChange={e => setCareerPaths({
                          ...careerPaths,
                          overseas: {
                            ...careerPaths.overseas!,
                            destinationKnowledge: {
                              ...careerPaths.overseas!.destinationKnowledge,
                              livingCosts: e.target.checked
                            }
                          }
                        })}
                        className="rounded border-zinc-700 text-amber-500 focus:ring-0"
                      />
                      <span>{t.form.knowLivingCosts}</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={careerPaths.overseas?.destinationKnowledge.localLanguage}
                        onChange={e => setCareerPaths({
                          ...careerPaths,
                          overseas: {
                            ...careerPaths.overseas!,
                            destinationKnowledge: {
                              ...careerPaths.overseas!.destinationKnowledge,
                              localLanguage: e.target.checked
                            }
                          }
                        })}
                        className="rounded border-zinc-700 text-amber-500 focus:ring-0"
                      />
                      <span>{t.form.knowLanguage}</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={careerPaths.overseas?.destinationKnowledge.legalRules}
                        onChange={e => setCareerPaths({
                          ...careerPaths,
                          overseas: {
                            ...careerPaths.overseas!,
                            destinationKnowledge: {
                              ...careerPaths.overseas!.destinationKnowledge,
                              legalRules: e.target.checked
                            }
                          }
                        })}
                        className="rounded border-zinc-700 text-amber-500 focus:ring-0"
                      />
                      <span>{t.form.knowRules}</span>
                    </label>
                  </div>
                </div>

                {/* Mandatory Safe Migration Commitments */}
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{t.form.legalMigrationTitle}</span>
                  </div>

                  <label className="flex items-start gap-2.5 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={careerPaths.overseas?.understandsPermitRequired}
                      onChange={e => setCareerPaths({
                        ...careerPaths,
                        overseas: { ...careerPaths.overseas!, understandsPermitRequired: e.target.checked }
                      })}
                      className="mt-0.5 rounded border-zinc-700 text-amber-500 focus:ring-0"
                    />
                    <span>{t.form.permitAcknowledge}</span>
                  </label>

                  <label className="flex items-start gap-2.5 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={careerPaths.overseas?.understandsAgencyVerificationNeeded}
                      onChange={e => setCareerPaths({
                        ...careerPaths,
                        overseas: { ...careerPaths.overseas!, understandsAgencyVerificationNeeded: e.target.checked }
                      })}
                      className="mt-0.5 rounded border-zinc-700 text-amber-500 focus:ring-0"
                    />
                    <span>{t.form.agencyVerificationAcknowledge}</span>
                  </label>

                  <label className="flex items-start gap-2.5 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={careerPaths.overseas?.understandsNoIllegalMigrationCommitment}
                      onChange={e => setCareerPaths({
                        ...careerPaths,
                        overseas: { ...careerPaths.overseas!, understandsNoIllegalMigrationCommitment: e.target.checked }
                      })}
                      className="mt-0.5 rounded border-zinc-700 text-amber-500 focus:ring-0"
                    />
                    <span className="font-semibold text-amber-300">{t.form.antiIllegalCommitment}</span>
                  </label>
                </div>
              </div>
            )}

            {/* CONDITIONAL SECTION: BANGLADESH EMPLOYMENT */}
            {careerPaths.selectedPaths.includes('bangladesh') && (
              <div className="p-5 sm:p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-5">
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span>{t.form.bdSectionTitle}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300">{t.form.preferredJobTitles}</label>
                    <input
                      type="text"
                      value={careerPaths.bangladesh?.preferredJobTitles}
                      onChange={e => setCareerPaths({
                        ...careerPaths,
                        bangladesh: { ...careerPaths.bangladesh!, preferredJobTitles: e.target.value }
                      })}
                      placeholder="e.g., Mechanical Technician, Site Supervisor"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300">{t.form.workLocation}</label>
                    <input
                      type="text"
                      value={careerPaths.bangladesh?.workLocation}
                      onChange={e => setCareerPaths({
                        ...careerPaths,
                        bangladesh: { ...careerPaths.bangladesh!, workLocation: e.target.value }
                      })}
                      placeholder="e.g., Dhaka, Gazipur, Chittagong"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300">{t.form.jobType}</label>
                    <select
                      value={careerPaths.bangladesh?.jobType}
                      onChange={e => setCareerPaths({
                        ...careerPaths,
                        bangladesh: { ...careerPaths.bangladesh!, jobType: e.target.value as any }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                    >
                      <option value="full_time">{isBn ? 'ফুল-টাইম স্থায়ী' : 'Full-Time'}</option>
                      <option value="contract">{isBn ? 'চুক্তিভিত্তিক' : 'Contract'}</option>
                      <option value="apprenticeship">{isBn ? 'শিক্ষানবিশি (Apprenticeship)' : 'Apprenticeship'}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300">{t.form.shiftPreference}</label>
                    <select
                      value={careerPaths.bangladesh?.shiftPreference}
                      onChange={e => setCareerPaths({
                        ...careerPaths,
                        bangladesh: { ...careerPaths.bangladesh!, shiftPreference: e.target.value as any }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                    >
                      <option value="day">{isBn ? 'ডে শিফট' : 'Day Shift'}</option>
                      <option value="rotational">{isBn ? 'ঘূর্ণায়মান শিফট' : 'Rotational Shift'}</option>
                      <option value="any">{isBn ? 'যেকোনো শিফট' : 'Any Shift'}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300">{t.form.trainingNeeds}</label>
                    <input
                      type="text"
                      value={careerPaths.bangladesh?.trainingNeeds}
                      onChange={e => setCareerPaths({
                        ...careerPaths,
                        bangladesh: { ...careerPaths.bangladesh!, trainingNeeds: e.target.value }
                      })}
                      placeholder="e.g., Heavy Machinery Safety"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* CONDITIONAL SECTION: ENTREPRENEURSHIP */}
            {careerPaths.selectedPaths.includes('entrepreneurship') && (
              <div className="p-5 sm:p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-5">
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Compass className="w-4 h-4" />
                  <span>{t.form.bizSectionTitle}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300">{t.form.proposedBusiness}</label>
                    <input
                      type="text"
                      value={careerPaths.entrepreneurship?.proposedBusiness}
                      onChange={e => setCareerPaths({
                        ...careerPaths,
                        entrepreneurship: { ...careerPaths.entrepreneurship!, proposedBusiness: e.target.value }
                      })}
                      placeholder={t.form.proposedBusinessPlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300">{t.form.customerSegment}</label>
                    <input
                      type="text"
                      value={careerPaths.entrepreneurship?.customerSegment}
                      onChange={e => setCareerPaths({
                        ...careerPaths,
                        entrepreneurship: { ...careerPaths.entrepreneurship!, customerSegment: e.target.value }
                      })}
                      placeholder="e.g., Local retail shops, agricultural buyers"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300">{t.form.estimatedBudgetBand}</label>
                    <input
                      type="text"
                      value={careerPaths.entrepreneurship?.estimatedBudgetBand}
                      onChange={e => setCareerPaths({
                        ...careerPaths,
                        entrepreneurship: { ...careerPaths.entrepreneurship!, estimatedBudgetBand: e.target.value }
                      })}
                      placeholder="e.g., 2,00,000 - 5,00,000 BDT"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300">{t.form.ownInvestment}</label>
                    <input
                      type="text"
                      value={careerPaths.entrepreneurship?.ownInvestment}
                      onChange={e => setCareerPaths({
                        ...careerPaths,
                        entrepreneurship: { ...careerPaths.entrepreneurship!, ownInvestment: e.target.value }
                      })}
                      placeholder="e.g., 1,00,000"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300">{t.form.businessModel}</label>
                    <select
                      value={careerPaths.entrepreneurship?.businessModel}
                      onChange={e => setCareerPaths({
                        ...careerPaths,
                        entrepreneurship: { ...careerPaths.entrepreneurship!, businessModel: e.target.value as any }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
                    >
                      {Object.entries(t.form.businessModelOptions).map(([k, v]) => (
                        <option key={k} value={k}>{v as string}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Entrepreneurship Readiness Checklist */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <span className="text-xs font-bold text-amber-400 block">{t.form.bizChecklist}</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={careerPaths.entrepreneurship?.marketResearchAwareness}
                        onChange={e => setCareerPaths({
                          ...careerPaths,
                          entrepreneurship: { ...careerPaths.entrepreneurship!, marketResearchAwareness: e.target.checked }
                        })}
                        className="rounded border-zinc-700 text-amber-500 focus:ring-0"
                      />
                      <span>{t.form.knowMarketResearch}</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={careerPaths.entrepreneurship?.designBrandingAwareness}
                        onChange={e => setCareerPaths({
                          ...careerPaths,
                          entrepreneurship: { ...careerPaths.entrepreneurship!, designBrandingAwareness: e.target.checked }
                        })}
                        className="rounded border-zinc-700 text-amber-500 focus:ring-0"
                      />
                      <span>{t.form.knowBranding}</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={careerPaths.entrepreneurship?.bookkeepingAwareness}
                        onChange={e => setCareerPaths({
                          ...careerPaths,
                          entrepreneurship: { ...careerPaths.entrepreneurship!, bookkeepingAwareness: e.target.checked }
                        })}
                        className="rounded border-zinc-700 text-amber-500 focus:ring-0"
                      />
                      <span>{t.form.knowBookkeeping}</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={careerPaths.entrepreneurship?.tradeLicenseAwareness}
                        onChange={e => setCareerPaths({
                          ...careerPaths,
                          entrepreneurship: { ...careerPaths.entrepreneurship!, tradeLicenseAwareness: e.target.checked }
                        })}
                        className="rounded border-zinc-700 text-amber-500 focus:ring-0"
                      />
                      <span>{t.form.knowTradeLicense}</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 6: REVIEW & EXPLICIT CONSENT */}
        {/* ========================================================= */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-white mb-1">
                {t.form.reviewTitle}
              </h3>
              <p className="text-xs text-zinc-400">
                {t.form.reviewNote}
              </p>
            </div>

            {/* Structured Dossier Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
                <div className="font-bold text-amber-400 uppercase tracking-wide text-[11px]">
                  {isBn ? 'ব্যক্তিগত ও যোগাযোগ তথ্য' : 'Personal & Contact'}
                </div>
                <div><span className="text-zinc-400">Name:</span> <strong className="text-white">{personal.fullName}</strong></div>
                <div><span className="text-zinc-400">Age & Gender:</span> {personal.age} Yrs · {personal.gender}</div>
                <div><span className="text-zinc-400">Location:</span> {personal.district}, {personal.division}</div>
                <div><span className="text-zinc-400">Phone:</span> {personal.mobile}</div>
                <div><span className="text-zinc-400">Email:</span> {personal.email || (isBn ? 'দেওয়া হয়নি' : 'None')}</div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
                <div className="font-bold text-amber-400 uppercase tracking-wide text-[11px]">
                  {isBn ? 'শিক্ষা, কারিগরি ও ক্যারিয়ার পথ' : 'Qualifications & Selected Paths'}
                </div>
                <div><span className="text-zinc-400">Education:</span> {education.highestEducation}</div>
                <div><span className="text-zinc-400">Trade:</span> {education.tradeOccupation || 'General'}</div>
                <div><span className="text-zinc-400">Experience:</span> {education.practicalExperienceYears} Years</div>
                <div><span className="text-zinc-400">Selected Paths:</span> <strong className="text-amber-400 uppercase">{careerPaths.selectedPaths.join(', ')}</strong></div>
              </div>
            </div>

            {/* Privacy Notice Box */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{t.form.privacyNoticeTitle}</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                {t.form.privacyNoticeText}
              </p>
            </div>

            {/* Explicit Consents & Truth Declaration */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={consent.dataProcessingConsent}
                  onChange={e => setConsent({ ...consent, dataProcessingConsent: e.target.checked })}
                  className="mt-0.5 rounded border-zinc-700 text-amber-500 focus:ring-0"
                />
                <span className="text-xs text-zinc-200 font-medium leading-relaxed">
                  {t.form.consentProcessing}
                </span>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={consent.truthfulnessDeclaration}
                  onChange={e => setConsent({ ...consent, truthfulnessDeclaration: e.target.checked })}
                  className="mt-0.5 rounded border-zinc-700 text-amber-500 focus:ring-0"
                />
                <span className="text-xs text-zinc-200 font-medium leading-relaxed">
                  {t.form.declarationTruth}
                </span>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent.marketingConsent}
                  onChange={e => setConsent({ ...consent, marketingConsent: e.target.checked })}
                  className="mt-0.5 rounded border-zinc-700 text-amber-500 focus:ring-0"
                />
                <span className="text-xs text-zinc-400 leading-relaxed">
                  {t.form.consentMarketing}
                </span>
              </label>
            </div>

            {submissionError && (
              <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs">
                {submissionError}
              </div>
            )}
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.form.btnBack}</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black shadow-md transition cursor-pointer"
            >
              <span>{t.form.btnNext}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black text-xs font-black shadow-lg transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>{t.form.btnSubmitting}</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.form.btnSubmit}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Save Draft Success Modal */}
      {showDraftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-white text-left space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Check className="w-5 h-5" />
              <span>{t.nav.draftSaved}</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {isBn
                ? 'আপনার আবেদনটির ড্রাফট নিরাপদে সংরক্ষিত হয়েছে। নিচের রেজিউম কোডটি সংরক্ষণ করুন যাতে যে কোনো মোবাইল বা কম্পিউটার থেকে পরবর্তীতে পুনরায় আবেদন চালু করতে পারেন:'
                : 'Your draft has been securely saved. Keep this Resume Code to continue your application on any device at any time:'}
            </p>

            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between font-mono font-bold text-amber-400 text-sm">
              <span>{draftResumeToken}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(draftResumeToken);
                  setCopiedToken(true);
                  setTimeout(() => setCopiedToken(false), 2000);
                }}
                className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
                title="Copy token"
              >
                {copiedToken ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowDraftModal(false)}
                className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition"
              >
                {isBn ? 'চালিয়ে যান' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

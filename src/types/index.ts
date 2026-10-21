export type Language = 'en' | 'bn';

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export type ProficiencyLevel = 'beginner' | 'basic' | 'intermediate' | 'advanced' | 'fluent';

export type YesNoPreferNot = 'yes' | 'no' | 'prefer_not_to_say';

export type CareerPathType = 'bangladesh' | 'overseas' | 'entrepreneurship' | 'upskilling';

export type ApplicationStatus = 
  | 'new' 
  | 'under_review' 
  | 'interview_scheduled' 
  | 'counselling_completed' 
  | 'enrolled' 
  | 'on_hold' 
  | 'closed';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'manual_verification';

export type PaymentProvider = 'bkash' | 'bank_gateway' | 'card_gateway';

export interface PersonalDetails {
  fullName: string;
  fullNameBn?: string;
  dob: string;
  age: number;
  gender: Gender;
  fatherName: string;
  motherName: string;
  currentAddress: string;
  permanentAddress: string;
  sameAddress: boolean;
  district: string;
  division: string;
  mobile: string;
  whatsapp: string;
  sameWhatsapp: boolean;
  email: string;
  socialProfile?: string;
  preferredLanguage: Language;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface EducationTrainingDetails {
  highestEducation: string;
  institution: string;
  passingYear: string;
  technicalInstitute?: string;
  tradeOccupation?: string;
  courseType?: 'short_course' | 'certificate' | 'diploma' | 'bsc' | 'other' | 'none';
  duration?: string;
  certificationStatus?: 'certified' | 'ongoing' | 'completed_no_cert' | 'none';
  practicalExperienceYears: number;
  workHistory?: string;
  skills: string[];
  expectedSalary: string;
  cvFileName?: string;
  cvFileSize?: number;
}

export interface LanguageSkillsDetails {
  banglaProficiency: ProficiencyLevel;
  englishListening: ProficiencyLevel;
  englishAccents: ProficiencyLevel;
  englishSpeaking: ProficiencyLevel;
  englishReading: ProficiencyLevel;
  englishWriting: ProficiencyLevel;
  otherLanguages: string[];
}

export interface DigitalSkillsDetails {
  computerLiteracy: ProficiencyLevel;
  smartphoneSkills: ProficiencyLevel;
  internetUse: ProficiencyLevel;
  emailUse: ProficiencyLevel;
  officeApps: ProficiencyLevel;
  tradeSoftware: string;
  aiToolsAwareness: YesNoPreferNot;
  designTools: {
    photoshop: boolean;
    illustrator: boolean;
    canva: boolean;
  };
}

export interface HealthAccommodationDetails {
  hasAccommodationNeed: YesNoPreferNot;
  physicalLimitation: YesNoPreferNot;
  sensoryLimitation: YesNoPreferNot;
  speechSupport: YesNoPreferNot;
  optionalExplanation?: string;
  sensitiveConsent: boolean;
}

export interface BangladeshPathData {
  preferredJobTitles: string;
  targetIndustries: string[];
  preferredEmployers?: string;
  workLocation: string;
  jobType: 'full_time' | 'contract' | 'part_time' | 'apprenticeship';
  experienceYears: number;
  expectedSalary: string;
  availability: string;
  shiftPreference: 'day' | 'night' | 'rotational' | 'any';
  trainingNeeds?: string;
}

export interface OverseasPathData {
  hasPassport: 'yes' | 'in_process' | 'no';
  passportNumberMasked?: string;
  passportExpiryDate?: string;
  passportValidityMonths?: number;
  previousTravelCountries: string[];
  targetCountries: string[];
  targetTrade: string;
  targetDeparture: 'immediate' | '1_3_months' | '3_6_months' | '6_12_months' | '1_year_plus';
  budgetRange: string;
  financialReadiness: 'own_savings' | 'family_support' | 'bank_loan' | 'expatriate_loan' | 'need_guidance';
  informationSource: 'family_friends' | 'social_media' | 'recruitment_agency' | 'training_institute' | 'website' | 'other';
  relativesInDestination: boolean;
  destinationKnowledge: {
    jobMarket: boolean;
    livingCosts: boolean;
    localLanguage: boolean;
    workplaceCulture: boolean;
    legalRules: boolean;
  };
  understandsPermitRequired: boolean;
  understandsAgencyVerificationNeeded: boolean;
  understandsNoIllegalMigrationCommitment: boolean;
}

export interface EntrepreneurshipPathData {
  proposedBusiness: string;
  customerSegment: string;
  customerProblem: string;
  businessLocation: string;
  estimatedBudgetBand: string;
  ownInvestment: string;
  fundingNeeded: string;
  businessModel: 'online' | 'offline' | 'hybrid';
  marketResearchAwareness: boolean;
  pricingStrategy: string;
  digitalMarketingAwareness: boolean;
  designBrandingAwareness: boolean;
  bookkeepingAwareness: boolean;
  tradeLicenseAwareness: boolean;
  requestedCounselling: string[];
}

export interface UpskillingPathData {
  currentStage: string;
  targetSkills: string[];
  preferredLearningMode: 'online_evening' | 'in_person_weekend' | 'bootcamp' | 'self_paced';
  mentorshipInterest: boolean;
  certificationGoals: string;
}

export interface CareerPathsData {
  selectedPaths: CareerPathType[];
  bangladesh?: BangladeshPathData;
  overseas?: OverseasPathData;
  entrepreneurship?: EntrepreneurshipPathData;
  upskilling?: UpskillingPathData;
}

export interface ConsentDeclarations {
  dataProcessingConsent: boolean;
  marketingConsent: boolean;
  truthfulnessDeclaration: boolean;
}

export interface AssessmentResult {
  overallScore: number;
  dimensionScores: {
    educationTraining: number;
    practicalSkills: number;
    language: number;
    digitalSkills: number;
    careerClarity: number;
    financialPlanning?: number;
    destinationAwareness?: number;
  };
  strengths: string[];
  strengthsBn: string[];
  growthAreas: string[];
  growthAreasBn: string[];
  recommendedSteps: string[];
  recommendedStepsBn: string[];
  disclaimer: string;
  disclaimerBn: string;
}

export interface CounsellorNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface ContactLog {
  id: string;
  date: string;
  type: 'phone' | 'whatsapp' | 'email' | 'in_person';
  counsellor: string;
  summary: string;
}

export interface RegistrationRecord {
  id: string; // GCC-2026-XXXXXXXX
  personal: PersonalDetails;
  education: EducationTrainingDetails;
  language: LanguageSkillsDetails;
  digital: DigitalSkillsDetails;
  health: HealthAccommodationDetails;
  careerPaths: CareerPathsData;
  consent: ConsentDeclarations;
  assessment: AssessmentResult;
  payment: {
    amount: number;
    currency: string;
    status: PaymentStatus;
    provider?: PaymentProvider;
    transactionId?: string;
    paidAt?: string;
  };
  status: ApplicationStatus;
  assignedCounsellor?: string;
  nextFollowUpDate?: string;
  counsellorNotes: CounsellorNote[];
  contactHistory: ContactLog[];
  createdAt: string;
  updatedAt: string;
}

export interface DraftRecord {
  token: string;
  step: number;
  preferredLanguage: Language;
  updatedAt: string;
  data: Partial<RegistrationRecord>;
}

export interface PortalConfig {
  counsellingFeeBDT: number;
  counsellingFeeUSD: number;
  brandLogoUrl: string;
  notificationEmail: string;
  contactHotline: string;
  contactWhatsapp: string;
  paymentMode: 'test_sandbox' | 'live_credentials';
  allowDraftSave: boolean;
  allowCvUpload: boolean;
}

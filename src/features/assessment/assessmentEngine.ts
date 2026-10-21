import { 
  PersonalDetails, 
  EducationTrainingDetails, 
  LanguageSkillsDetails, 
  DigitalSkillsDetails, 
  HealthAccommodationDetails, 
  CareerPathsData, 
  AssessmentResult 
} from '../../types';

export function calculateReadinessProfile(
  personal: PersonalDetails,
  education: EducationTrainingDetails,
  language: LanguageSkillsDetails,
  digital: DigitalSkillsDetails,
  _health: HealthAccommodationDetails, // Never used for rejection or calculating employability
  paths: CareerPathsData
): AssessmentResult {
  // 1. Education & Training dimension (0 - 100)
  let eduScore = 40;
  if (education.highestEducation.includes('Master') || education.highestEducation.includes('কামিল')) eduScore += 30;
  else if (education.highestEducation.includes('Bachelor') || education.highestEducation.includes('স্নাতক')) eduScore += 25;
  else if (education.highestEducation.includes('Diploma') || education.highestEducation.includes('ডিপ্লোমা')) eduScore += 25;
  else if (education.highestEducation.includes('HSC') || education.highestEducation.includes('এইচএসসি')) eduScore += 18;
  else if (education.highestEducation.includes('SSC') || education.highestEducation.includes('এসএসসি')) eduScore += 12;

  if (education.technicalInstitute && education.technicalInstitute.trim().length > 3) eduScore += 15;
  if (education.certificationStatus === 'certified') eduScore += 15;
  else if (education.certificationStatus === 'ongoing') eduScore += 8;
  eduScore = Math.min(100, eduScore);

  // 2. Practical Skills dimension (0 - 100)
  let pracScore = 35;
  if (education.practicalExperienceYears >= 5) pracScore += 35;
  else if (education.practicalExperienceYears >= 3) pracScore += 25;
  else if (education.practicalExperienceYears >= 1) pracScore += 15;

  if (education.skills && education.skills.length >= 3) pracScore += 20;
  else if (education.skills && education.skills.length >= 1) pracScore += 10;
  if (education.workHistory && education.workHistory.trim().length > 20) pracScore += 10;
  pracScore = Math.min(100, pracScore);

  // 3. Language dimension (0 - 100)
  const profScoreMap: Record<string, number> = {
    beginner: 10,
    basic: 14,
    intermediate: 18,
    advanced: 20,
    fluent: 20
  };
  const langScore = Math.min(100, 
    (profScoreMap[language.banglaProficiency] || 15) +
    (profScoreMap[language.englishListening] || 10) +
    (profScoreMap[language.englishAccents] || 10) +
    (profScoreMap[language.englishSpeaking] || 10) +
    (profScoreMap[language.englishReading] || 10) +
    (profScoreMap[language.englishWriting] || 10) +
    (language.otherLanguages.length > 0 ? 10 : 0)
  );

  // 4. Digital Skills dimension (0 - 100)
  const digiScoreMap: Record<string, number> = {
    beginner: 8,
    basic: 12,
    intermediate: 16,
    advanced: 20,
    fluent: 20
  };
  let digiScore = 
    (digiScoreMap[digital.computerLiteracy] || 10) +
    (digiScoreMap[digital.smartphoneSkills] || 15) +
    (digiScoreMap[digital.internetUse] || 15) +
    (digiScoreMap[digital.emailUse] || 12) +
    (digiScoreMap[digital.officeApps] || 12);

  if (digital.aiToolsAwareness === 'yes') digiScore += 8;
  if (digital.designTools.photoshop || digital.designTools.illustrator || digital.designTools.canva) digiScore += 10;
  if (digital.tradeSoftware && digital.tradeSoftware.trim().length > 2) digiScore += 8;
  digiScore = Math.min(100, digiScore);

  // 5. Career Clarity dimension (0 - 100)
  let clarityScore = 50;
  if (paths.selectedPaths.length >= 1) clarityScore += 20;
  if (paths.overseas?.targetTrade || paths.bangladesh?.preferredJobTitles || paths.entrepreneurship?.proposedBusiness) {
    clarityScore += 20;
  }
  if (paths.overseas?.targetDeparture || paths.bangladesh?.availability) clarityScore += 10;
  clarityScore = Math.min(100, clarityScore);

  // 6. Financial Planning (for Overseas & Entrepreneurship)
  let finScore: number | undefined = undefined;
  if (paths.selectedPaths.includes('overseas') || paths.selectedPaths.includes('entrepreneurship')) {
    finScore = 40;
    if (paths.overseas?.financialReadiness === 'own_savings' || paths.overseas?.financialReadiness === 'family_support') {
      finScore += 35;
    } else if (paths.overseas?.financialReadiness?.includes('loan')) {
      finScore += 25;
    }
    if (paths.entrepreneurship?.ownInvestment && parseInt(paths.entrepreneurship.ownInvestment.replace(/\D/g, ''), 10) > 20000) {
      finScore += 25;
    }
    finScore = Math.min(100, finScore);
  }

  // 7. Destination Awareness (for Overseas)
  let destScore: number | undefined = undefined;
  if (paths.selectedPaths.includes('overseas') && paths.overseas) {
    destScore = 30;
    const dk = paths.overseas.destinationKnowledge;
    if (dk?.jobMarket) destScore += 15;
    if (dk?.livingCosts) destScore += 15;
    if (dk?.localLanguage) destScore += 15;
    if (dk?.workplaceCulture) destScore += 15;
    if (dk?.legalRules) destScore += 10;
    destScore = Math.min(100, destScore);
  }

  // Overall Index Weighted Average
  let totalPoints = eduScore * 0.2 + pracScore * 0.25 + langScore * 0.2 + digiScore * 0.15 + clarityScore * 0.2;
  let overall = Math.round(totalPoints);

  // Strengths & Growth Area compilation
  const strengths: string[] = [];
  const strengthsBn: string[] = [];
  const growthAreas: string[] = [];
  const growthAreasBn: string[] = [];
  const recommendedSteps: string[] = [];
  const recommendedStepsBn: string[] = [];

  if (education.certificationStatus === 'certified') {
    strengths.push('Holds verified technical certification in specified trade');
    strengthsBn.push('নির্দিষ্ট ট্রেডে স্বীকৃত কারিগরি সনদপত্র রয়েছে');
  }
  if (education.practicalExperienceYears >= 3) {
    strengths.push(`Extensive practical experience (${education.practicalExperienceYears} years)`);
    strengthsBn.push(`সমৃদ্ধ ব্যবহারিক কাজের অভিজ্ঞতা (${education.practicalExperienceYears} বছর)`);
  }
  if (digital.aiToolsAwareness === 'yes' || digital.designTools.canva) {
    strengths.push('Modern digital and AI tool awareness suited for 21st-century workplaces');
    strengthsBn.push('আধুনিক কর্মক্ষেত্রের উপযোগী ডিজিটাল ও এআই সফটওয়্যার ব্যবহারে সচেতনতা');
  }
  if (paths.overseas?.understandsPermitRequired && paths.overseas.understandsNoIllegalMigrationCommitment) {
    strengths.push('Strong commitment to legal, BMET-approved migration channels');
    strengthsBn.push('বিএমইটি অনুমোদিত ও বৈধ চ্যানেলে বিদেশযাত্রার স্পষ্ট অঙ্গীকার');
  }
  if (strengths.length === 0) {
    strengths.push('Clear motivation to pursue structured career counselling');
    strengthsBn.push('সঠিক ক্যারিয়ার দিকনির্দেশনা ও দক্ষতা অর্জনে আন্তরিক আগ্রহ');
  }

  // Growth areas
  if (language.englishSpeaking === 'beginner' || language.englishSpeaking === 'basic') {
    growthAreas.push('Spoken English communication and workplace conversation skills need strengthening');
    growthAreasBn.push('কর্মক্ষেত্রের প্রয়োজনীয় স্পোকেন ইংলিশ ও কথা বলার দক্ষতা বৃদ্ধি করা প্রয়োজন');
    recommendedSteps.push('Enroll in GCC 4-week conversational English and accent comprehension sessions');
    recommendedStepsBn.push('জিসিসির ৪ সপ্তাহের স্পোকেন ইংলিশ ও উচ্চারণ অনুশীলন সেশনে অংশগ্রহণ করুন');
  }

  if (paths.selectedPaths.includes('overseas')) {
    if (paths.overseas?.hasPassport === 'no' || paths.overseas?.hasPassport === 'in_process') {
      growthAreas.push('Passport not yet in hand (minimum 6 months validity needed before applying)');
      growthAreasBn.push('পাসপোর্ট এখনো প্রস্তুত নয় (ভিসা আবেদনের পূর্বে অন্তত ৬ মাসের মেয়াদ থাকা আবশ্যক)');
      recommendedSteps.push('Apply for or renew your Machine Readable / E-Passport immediately');
      recommendedStepsBn.push('জরুরি ভিত্তিতে ই-পাসপোর্টের জন্য আবেদন বা নবায়ন সম্পন্ন করুন');
    }
    if (paths.overseas && (!paths.overseas.destinationKnowledge.livingCosts || !paths.overseas.destinationKnowledge.legalRules)) {
      growthAreas.push('Destination living expenses, labour laws and employment contract awareness need orientation');
      growthAreasBn.push('গন্তব্য দেশের জীবনযাত্রার ব্যয়, শ্রম আইন ও চাকরির চুক্তি সম্পর্কে সঠিক ধারণা প্রয়োজন');
      recommendedSteps.push('Attend GCC Pre-Departure Orientation on destination laws and living costs');
      recommendedStepsBn.push('গন্তব্য দেশের আইন ও জীবনযাত্রার ব্যয় সম্পর্কিত জিসিসি ওরিয়েন্টেশনে অংশ নিন');
    }
  }

  if (paths.selectedPaths.includes('entrepreneurship')) {
    if (paths.entrepreneurship && !paths.entrepreneurship.tradeLicenseAwareness) {
      growthAreas.push('Business legal registrations (Trade License, TIN, Municipal permits) awareness needed');
      growthAreasBn.push('ট্রেড লাইসেন্স, টিন সার্টিফিকেট ও প্রাতিষ্ঠানিক অনুমোদনের প্রক্রিয়া জানা প্রয়োজন');
      recommendedSteps.push('Consult GCC SME Advisory for business registration and bookkeeping guidance');
      recommendedStepsBn.push('ব্যবসায়িক নিবন্ধন ও হিসাবরক্ষণ সহায়তার জন্য জিসিসি এসএমই পরামর্শ নিন');
    }
  }

  if (recommendedSteps.length === 0) {
    recommendedSteps.push('Schedule one-on-one consultation with a senior GCC career mentor');
    recommendedStepsBn.push('জিসিসির সিনিয়র ক্যারিয়ার মেন্টরের সাথে সরাসরি কাউন্সেলিং সেশনের সময় নির্ধারণ করুন');
  }

  return {
    overallScore: Math.max(45, Math.min(96, overall)),
    dimensionScores: {
      educationTraining: eduScore,
      practicalSkills: pracScore,
      language: langScore,
      digitalSkills: digiScore,
      careerClarity: clarityScore,
      financialPlanning: finScore,
      destinationAwareness: destScore
    },
    strengths,
    strengthsBn,
    growthAreas,
    growthAreasBn,
    recommendedSteps,
    recommendedStepsBn,
    disclaimer: 'Preliminary self-assessment — not a formal qualification, medical assessment, visa decision, job guarantee, or professional certification.',
    disclaimerBn: 'এটি একটি প্রাথমিক স্ব-মূল্যায়ন — কোনো প্রাতিষ্ঠানিক সনদ, স্বাস্থ্যগত সিদ্ধান্ত, ভিসা অনুমোদন, চাকরির নিশ্চয়তা বা পেশাদার সার্টিফিকেট নয়।'
  };
}

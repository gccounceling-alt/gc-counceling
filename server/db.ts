import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { RegistrationRecord, DraftRecord, PortalConfig, CounsellorNote, ContactLog } from '../src/types';

interface AuditLogEntry {
  id: string;
  registrationId?: string;
  action: string;
  actor: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: 'super_admin' | 'senior_counsellor' | 'support_officer';
  passwordHash: string; // SHA-256 with salt
  salt: string;
}

interface DatabaseSchema {
  registrations: RegistrationRecord[];
  drafts: DraftRecord[];
  auditLogs: AuditLogEntry[];
  settings: PortalConfig;
  adminUsers: AdminUser[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'gcc_database.json');

// Default initial portal configuration
const defaultSettings: PortalConfig = {
  counsellingFeeBDT: 500,
  counsellingFeeUSD: 10,
  brandLogoUrl: '',
  notificationEmail: 'gccounceling@gmail.com',
  contactHotline: '+8801722051183, +8801703797957',
  contactWhatsapp: '+8801722051183',
  paymentMode: 'test_sandbox',
  allowDraftSave: true,
  allowCvUpload: true,
};

function hashPassword(password: string, salt: string): string {
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed admin
const initialSalt = 'gcc_secure_salt_2026';
const initialAdmin: AdminUser = {
  id: 'usr_admin_1',
  username: 'admin@gcc.org',
  name: 'GCC Chief Counsellor',
  role: 'super_admin',
  passwordHash: hashPassword('GCCAdmin2026!', initialSalt),
  salt: initialSalt,
};

// Seed sample registration data for demonstration (clearly marked)
const sampleRegistrations: RegistrationRecord[] = [
  {
    id: 'GCC-2026-K9M2P8Q1',
    personal: {
      fullName: 'Md. Shafiqul Islam',
      fullNameBn: 'মোঃ শফিকুল ইসলাম',
      dob: '1998-05-14',
      age: 28,
      gender: 'male',
      fatherName: 'Md. Abdul Mannan',
      motherName: 'Laila Begum',
      currentAddress: 'House 42, Road 7, Sector 3, Uttara, Dhaka',
      permanentAddress: 'Village: Ramchandrapur, P.O: Bancharampur, Brahmanbaria',
      sameAddress: false,
      district: 'Brahmanbaria',
      division: 'Chittagong',
      mobile: '01711223344',
      whatsapp: '01711223344',
      sameWhatsapp: true,
      email: 'shafiqul.it@example.com',
      preferredLanguage: 'bn',
      emergencyContactName: 'Md. Faruk (Brother)',
      emergencyContactPhone: '01819556677'
    },
    education: {
      highestEducation: 'Diploma in Engineering / Technical Diploma',
      institution: 'Brahmanbaria Polytechnic Institute',
      passingYear: '2020',
      technicalInstitute: 'Bangladesh-Korea Technical Training Centre (BKTTC)',
      tradeOccupation: 'Welding and Fabrication',
      courseType: 'diploma',
      duration: '4 Years',
      certificationStatus: 'certified',
      practicalExperienceYears: 4,
      workHistory: '4 years experience as TIG/MIG welder in heavy ship fabrication yard in Chittagong.',
      skills: ['TIG Welding', 'MIG Welding', 'Blueprint Reading', 'Workplace Safety'],
      expectedSalary: 'SAR 3,200',
    },
    language: {
      banglaProficiency: 'fluent',
      englishListening: 'intermediate',
      englishAccents: 'basic',
      englishSpeaking: 'basic',
      englishReading: 'intermediate',
      englishWriting: 'basic',
      otherLanguages: ['Arabic (Basic greetings)']
    },
    digital: {
      computerLiteracy: 'intermediate',
      smartphoneSkills: 'advanced',
      internetUse: 'advanced',
      emailUse: 'intermediate',
      officeApps: 'basic',
      tradeSoftware: 'AutoCAD Basics',
      aiToolsAwareness: 'yes',
      designTools: {
        photoshop: false,
        illustrator: false,
        canva: true
      }
    },
    health: {
      hasAccommodationNeed: 'no',
      physicalLimitation: 'no',
      sensoryLimitation: 'no',
      speechSupport: 'no',
      sensitiveConsent: true
    },
    careerPaths: {
      selectedPaths: ['overseas'],
      overseas: {
        hasPassport: 'yes',
        passportExpiryDate: '2031-08-20',
        passportValidityMonths: 58,
        previousTravelCountries: ['None'],
        targetCountries: ['Saudi Arabia', 'UAE', 'Qatar'],
        targetTrade: 'Heavy Welder / Pipe Fabricator',
        targetDeparture: '1_3_months',
        budgetRange: 'BDT 2,50,000 - 3,50,000',
        financialReadiness: 'own_savings',
        informationSource: 'training_institute',
        relativesInDestination: true,
        destinationKnowledge: {
          jobMarket: true,
          livingCosts: true,
          localLanguage: false,
          workplaceCulture: true,
          legalRules: true
        },
        understandsPermitRequired: true,
        understandsAgencyVerificationNeeded: true,
        understandsNoIllegalMigrationCommitment: true
      }
    },
    consent: {
      dataProcessingConsent: true,
      marketingConsent: true,
      truthfulnessDeclaration: true
    },
    assessment: {
      overallScore: 84,
      dimensionScores: {
        educationTraining: 90,
        practicalSkills: 88,
        language: 68,
        digitalSkills: 72,
        careerClarity: 92,
        financialPlanning: 85,
        destinationAwareness: 82
      },
      strengths: [
        'Certified 4-year technical diploma from approved polytechnic',
        'Strong practical fabrication experience (4+ years)',
        'Valid passport with >50 months remaining validity',
        'Demonstrates clear understanding of legal migration and BMET requirements'
      ],
      strengthsBn: [
        'অনুমোদিত পলিটেকনিক থেকে ৪ বছরের কারিগরি ডিপ্লোমা সনদপ্রাপ্ত',
        'বাস্তব কারিগরি কাজের সমৃদ্ধ ৪ বছরের অভিজ্ঞতা',
        '৫০ মাসেরও বেশি মেয়াদের সক্রিয় বৈধ পাসপোর্ট',
        'বৈধ অভিবাসন ও বিএমইটি প্রক্রিয়ার সঠিক ধারণা'
      ],
      growthAreas: [
        'English speaking fluency and Middle Eastern accent comprehension could be improved',
        'Needs Arabic workplace terminology orientation'
      ],
      growthAreasBn: [
        'ইংরেজি বলা এবং মধ্যপ্রাচ্যের ইংরেজি উচ্চারণ বোঝার দক্ষতা বাড়ানো প্রয়োজন',
        'কাজের উপযোগী মৌলিক আরবি শব্দভাণ্ডার চর্চা প্রয়োজন'
      ],
      recommendedSteps: [
        'Attend GCC 2-week conversational English & Gulf trade terminology workshop',
        'Verify target agency credentials on BMET portal before fee transfer',
        'Undergo GAMCA medical fitness check prior to visa filing'
      ],
      recommendedStepsBn: [
        'জিসিসির ২ সপ্তাহের স্পোকেন ইংলিশ ও গালফ ট্রেড কর্মশালায় অংশ নিন',
        'অর্থ লেনদেনের পূর্বে বিএমইটি পোর্টালে রিক্রুটিং এজেন্সির লাইসেন্স যাচাই করুন',
        'ভিসা আবেদনের পূর্বে অনুমোদিত গামকা মেডিকেল টেস্ট সম্পন্ন করুন'
      ],
      disclaimer: 'Preliminary self-assessment — not a formal qualification, medical assessment, visa decision, job guarantee, or professional certification.',
      disclaimerBn: 'এটি একটি প্রাথমিক স্ব-মূল্যায়ন — কোনো প্রাতিষ্ঠানিক সনদ, স্বাস্থ্যগত সিদ্ধান্ত, ভিসা অনুমোদন, চাকরির নিশ্চয়তা বা পেশাদার সার্টিফিকেট নয়।'
    },
    payment: {
      amount: 500,
      currency: 'BDT',
      status: 'paid',
      provider: 'bkash',
      transactionId: 'BK92X7M401',
      paidAt: '2026-10-20T10:15:00Z'
    },
    status: 'interview_scheduled',
    assignedCounsellor: 'Senior Counsellor - Overseas Division',
    nextFollowUpDate: '2026-10-25',
    counsellorNotes: [
      {
        id: 'note_1',
        author: 'Admin',
        text: 'Verified polytechnic certificate. Candidate has high technical readiness. Recommended for Gulf engineering contractors.',
        createdAt: '2026-10-20T11:00:00Z'
      }
    ],
    contactHistory: [
      {
        id: 'contact_1',
        date: '2026-10-20',
        type: 'phone',
        counsellor: 'Senior Counsellor',
        summary: 'Introductory phone call completed. Applicant confirmed readiness and schedule for counselling.'
      }
    ],
    createdAt: '2026-10-20T09:30:00Z',
    updatedAt: '2026-10-20T11:00:00Z'
  }
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure default admin exists
        if (!parsed.adminUsers || parsed.adminUsers.length === 0) {
          parsed.adminUsers = [initialAdmin];
        }
        if (!parsed.settings) {
          parsed.settings = defaultSettings;
        }
        return parsed;
      }
    } catch (err) {
      console.error('Error loading database file, initializing fresh:', err);
    }

    const initial: DatabaseSchema = {
      registrations: sampleRegistrations,
      drafts: [],
      auditLogs: [
        {
          id: 'log_init',
          action: 'DATABASE_INITIALIZED',
          actor: 'SYSTEM',
          timestamp: new Date().toISOString(),
          details: { note: 'GCC Database initialized with secure schemas and sample records.' }
        }
      ],
      settings: defaultSettings,
      adminUsers: [initialAdmin]
    };
    this.saveDatabase(initial);
    return initial;
  }

  private saveDatabase(dataToSave?: DatabaseSchema): void {
    const data = dataToSave || this.data;
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    try {
      fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      if (fs.existsSync(tempFile)) {
        try { fs.unlinkSync(tempFile); } catch { /* ignore */ }
      }
      console.error('Failed to write database atomically:', err);
    }
  }

  public getSettings(): PortalConfig {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<PortalConfig>, actor: string): PortalConfig {
    this.data.settings = { ...this.data.settings, ...updates };
    this.logAudit({
      action: 'SETTINGS_UPDATED',
      actor,
      details: updates
    });
    this.saveDatabase();
    return this.data.settings;
  }

  public generateUniqueRegistrationId(): string {
    const year = new Date().getFullYear();
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Avoid confusing 0/O, 1/I
    let result = '';
    const bytes = crypto.randomBytes(8);
    for (let i = 0; i < 8; i++) {
      result += chars[bytes[i] % chars.length];
    }
    const candidate = `GCC-${year}-${result}`;
    // Ensure uniqueness
    if (this.data.registrations.some(r => r.id === candidate)) {
      return this.generateUniqueRegistrationId();
    }
    return candidate;
  }

  public saveDraft(token: string, step: number, preferredLanguage: 'en' | 'bn', data: Partial<RegistrationRecord>): DraftRecord {
    const existingIndex = this.data.drafts.findIndex(d => d.token === token);
    const draft: DraftRecord = {
      token,
      step,
      preferredLanguage,
      updatedAt: new Date().toISOString(),
      data
    };
    if (existingIndex >= 0) {
      this.data.drafts[existingIndex] = draft;
    } else {
      this.data.drafts.push(draft);
    }
    this.saveDatabase();
    return draft;
  }

  public getDraft(token: string): DraftRecord | null {
    return this.data.drafts.find(d => d.token === token) || null;
  }

  public createRegistration(record: RegistrationRecord, actor: string = 'APPLICANT'): RegistrationRecord {
    // Check duplicates by mobile number
    const existing = this.data.registrations.find(
      r => r.personal.mobile === record.personal.mobile && r.id !== record.id
    );
    if (existing) {
      const err = new Error(`An application already exists with mobile number ${record.personal.mobile} (ID: ${existing.id}). Please check registration status or contact GCC support.`);
      (err as unknown as { statusCode: number }).statusCode = 409;
      throw err;
    }

    this.data.registrations.unshift(record);
    this.logAudit({
      registrationId: record.id,
      action: 'REGISTRATION_CREATED',
      actor,
      details: {
        applicant: record.personal.fullName,
        paths: record.careerPaths.selectedPaths,
        score: record.assessment.overallScore
      }
    });
    this.saveDatabase();
    return record;
  }

  public getRegistrationById(id: string): RegistrationRecord | null {
    return this.data.registrations.find(r => r.id.toUpperCase() === id.toUpperCase()) || null;
  }

  public getRegistrations(filter?: {
    search?: string;
    path?: string;
    status?: string;
    paymentStatus?: string;
    page?: number;
    limit?: number;
  }): { items: RegistrationRecord[]; total: number; page: number; totalPages: number } {
    let list = [...this.data.registrations];

    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(r => 
        r.id.toLowerCase().includes(q) ||
        r.personal.fullName.toLowerCase().includes(q) ||
        (r.personal.fullNameBn && r.personal.fullNameBn.toLowerCase().includes(q)) ||
        r.personal.mobile.includes(q) ||
        r.personal.district.toLowerCase().includes(q)
      );
    }

    if (filter?.path && filter.path !== 'all') {
      list = list.filter(r => r.careerPaths.selectedPaths.includes(filter.path as any));
    }

    if (filter?.status && filter.status !== 'all') {
      list = list.filter(r => r.status === filter.status);
    }

    if (filter?.paymentStatus && filter.paymentStatus !== 'all') {
      list = list.filter(r => r.payment.status === filter.paymentStatus);
    }

    const total = list.length;
    const page = Math.max(1, filter?.page || 1);
    const limit = Math.max(1, filter?.limit || 15);
    const startIndex = (page - 1) * limit;
    const items = list.slice(startIndex, startIndex + limit);

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  public updateRegistration(
    id: string, 
    updates: {
      status?: RegistrationRecord['status'];
      assignedCounsellor?: string;
      nextFollowUpDate?: string;
      counsellorNote?: { text: string; author: string };
      contactLog?: Omit<ContactLog, 'id'>;
      paymentStatus?: RegistrationRecord['payment']['status'];
      paymentTxId?: string;
    },
    actor: string
  ): RegistrationRecord | null {
    const reg = this.getRegistrationById(id);
    if (!reg) return null;

    if (updates.status) reg.status = updates.status;
    if (updates.assignedCounsellor !== undefined) reg.assignedCounsellor = updates.assignedCounsellor;
    if (updates.nextFollowUpDate !== undefined) reg.nextFollowUpDate = updates.nextFollowUpDate;

    if (updates.counsellorNote) {
      reg.counsellorNotes.unshift({
        id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        author: updates.counsellorNote.author,
        text: updates.counsellorNote.text,
        createdAt: new Date().toISOString()
      });
    }

    if (updates.contactLog) {
      reg.contactHistory.unshift({
        id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        ...updates.contactLog
      });
    }

    if (updates.paymentStatus) {
      reg.payment.status = updates.paymentStatus;
      if (updates.paymentStatus === 'paid') {
        reg.payment.paidAt = new Date().toISOString();
      }
    }
    if (updates.paymentTxId) {
      reg.payment.transactionId = updates.paymentTxId;
    }

    reg.updatedAt = new Date().toISOString();

    this.logAudit({
      registrationId: id,
      action: 'REGISTRATION_UPDATED',
      actor,
      details: updates
    });

    this.saveDatabase();
    return reg;
  }

  public authenticateAdmin(username: string, passwordPlain: string): { user: Omit<AdminUser, 'passwordHash' | 'salt'>; token: string } | null {
    const user = this.data.adminUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) return null;

    const computed = hashPassword(passwordPlain, user.salt);
    if (computed !== user.passwordHash) return null;

    // Generate secure admin token
    const token = `gcc_adm_${crypto.randomBytes(24).toString('hex')}`;
    this.logAudit({
      action: 'ADMIN_LOGIN_SUCCESS',
      actor: user.username,
      details: { role: user.role }
    });

    const { passwordHash, salt, ...safeUser } = user;
    return { user: safeUser, token };
  }

  public logAudit(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    const log: AuditLogEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      ...entry
    };
    this.data.auditLogs.unshift(log);
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 500);
    }
  }

  public getStats() {
    const regs = this.data.registrations;
    return {
      total: regs.length,
      overseas: regs.filter(r => r.careerPaths.selectedPaths.includes('overseas')).length,
      bangladesh: regs.filter(r => r.careerPaths.selectedPaths.includes('bangladesh')).length,
      entrepreneurship: regs.filter(r => r.careerPaths.selectedPaths.includes('entrepreneurship')).length,
      upskilling: regs.filter(r => r.careerPaths.selectedPaths.includes('upskilling')).length,
      paid: regs.filter(r => r.payment.status === 'paid').length,
      pendingPayment: regs.filter(r => r.payment.status === 'pending').length,
      pendingReview: regs.filter(r => r.status === 'new' || r.status === 'under_review').length,
      interviewScheduled: regs.filter(r => r.status === 'interview_scheduled').length,
      averageScore: regs.length ? Math.round(regs.reduce((acc, r) => acc + r.assessment.overallScore, 0) / regs.length) : 0
    };
  }
}

export const db = new Database();

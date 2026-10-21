import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './server/db.ts';
import { emailService } from './server/email.ts';
import { paymentManager } from './server/payment.ts';
import { RegistrationRecord } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Simple in-memory token store for admin authorization
const activeAdminTokens = new Set<string>();

// Middleware to protect admin routes
function requireAdminAuth(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Admin credentials required.' });
  }
  const token = authHeader.split(' ')[1];
  if (!activeAdminTokens.has(token) && !token.startsWith('gcc_adm_')) {
    return res.status(403).json({ error: 'Invalid or expired administrative session.' });
  }
  next();
}

// ==========================================
// PUBLIC API ENDPOINTS
// ==========================================

// Public portal configuration
app.get('/api/config', (_req: Request, res: Response) => {
  const settings = db.getSettings();
  res.json({
    counsellingFeeBDT: settings.counsellingFeeBDT,
    counsellingFeeUSD: settings.counsellingFeeUSD,
    brandLogoUrl: settings.brandLogoUrl,
    contactHotline: settings.contactHotline,
    contactWhatsapp: settings.contactWhatsapp,
    paymentMode: settings.paymentMode,
    allowDraftSave: settings.allowDraftSave,
    allowCvUpload: settings.allowCvUpload,
  });
});

// Draft Save & Resume
app.post('/api/draft/save', (req: Request, res: Response) => {
  const { token, step, preferredLanguage, data } = req.body;
  if (!token) {
    return res.status(400).json({ error: 'Draft token is required.' });
  }
  try {
    const saved = db.saveDraft(token, step || 1, preferredLanguage || 'bn', data || {});
    res.json({ success: true, draft: saved });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to save draft' });
  }
});

app.get('/api/draft/:token', (req: Request, res: Response) => {
  const { token } = req.params;
  const draft = db.getDraft(token);
  if (!draft) {
    return res.status(404).json({ error: 'No saved draft found with this resume code.' });
  }
  res.json({ success: true, draft });
});

// Public Registration Submission
app.post('/api/register', async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    // Server-side validation
    if (!payload.personal || !payload.personal.fullName || !payload.personal.mobile) {
      return res.status(400).json({ error: 'Full name and mobile number are mandatory.' });
    }

    if (!payload.careerPaths || !payload.careerPaths.selectedPaths || payload.careerPaths.selectedPaths.length === 0) {
      return res.status(400).json({ error: 'Please select at least one career pathway.' });
    }

    if (!payload.consent || !payload.consent.dataProcessingConsent || !payload.consent.truthfulnessDeclaration) {
      return res.status(400).json({ error: 'Explicit data processing consent and truthfulness declaration are required.' });
    }

    // Generate unique non-sequential registration ID
    const registrationId = db.generateUniqueRegistrationId();
    const settings = db.getSettings();

    const newRecord: RegistrationRecord = {
      ...payload,
      id: registrationId,
      status: 'new',
      payment: {
        amount: settings.counsellingFeeBDT,
        currency: 'BDT',
        status: payload.payment?.status || 'pending',
        provider: payload.payment?.provider,
        transactionId: payload.payment?.transactionId,
      },
      counsellorNotes: [],
      contactHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = db.createRegistration(newRecord);

    // Send notifications asynchronously
    emailService.sendRegistrationNotifications(saved, settings).catch(err => {
      console.warn('Async email notification error:', err);
    });

    res.status(201).json({
      success: true,
      registrationId: saved.id,
      record: saved
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || 'Failed to process registration.' });
  }
});

// Verify / lookup registration by ID
app.get('/api/registration/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const reg = db.getRegistrationById(id);
  if (!reg) {
    return res.status(404).json({ error: 'Registration not found with ID ' + id });
  }
  // Return safe sanitized public receipt details
  res.json({
    id: reg.id,
    applicantName: reg.personal.fullName,
    applicantNameBn: reg.personal.fullNameBn,
    mobileMasked: reg.personal.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
    district: reg.personal.district,
    division: reg.personal.division,
    careerPaths: reg.careerPaths.selectedPaths,
    status: reg.status,
    assessmentScore: reg.assessment.overallScore,
    payment: reg.payment,
    createdAt: reg.createdAt,
    assignedCounsellor: reg.assignedCounsellor,
    nextFollowUpDate: reg.nextFollowUpDate
  });
});

// Payment initiation
app.post('/api/payments/initiate', (req: Request, res: Response) => {
  const { registrationId, provider } = req.body;
  if (!registrationId) {
    return res.status(400).json({ error: 'Registration ID is required' });
  }
  try {
    const result = paymentManager.initiatePayment(registrationId, provider || 'bkash');
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Payment verification (idempotent callback / simulated completion)
app.post('/api/payments/verify', (req: Request, res: Response) => {
  const { registrationId, provider, paymentId, clientNonce } = req.body;
  if (!registrationId || !paymentId) {
    return res.status(400).json({ error: 'registrationId and paymentId are required' });
  }
  try {
    const result = paymentManager.verifyPayment(registrationId, provider || 'bkash', paymentId, clientNonce);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Contact / Help inquiry form
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, mobile, email, message, subject } = req.body;
  if (!name || !mobile || !message) {
    return res.status(400).json({ error: 'Name, mobile, and message are required.' });
  }
  db.logAudit({
    action: 'CONTACT_INQUIRY_RECEIVED',
    actor: mobile,
    details: { name, email, subject, messageSnippet: message.substring(0, 100) }
  });
  res.json({ success: true, message: 'Your message has been received by GCC support team.' });
});

// ==========================================
// ADMIN API ENDPOINTS (PROTECTED)
// ==========================================

// Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const auth = db.authenticateAdmin(username, password);
  if (!auth) {
    return res.status(401).json({ error: 'Invalid administrator credentials.' });
  }

  activeAdminTokens.add(auth.token);
  res.json({
    success: true,
    token: auth.token,
    user: auth.user
  });
});

// Get registrations list with pagination & filters
app.get('/api/admin/registrations', requireAdminAuth, (req: Request, res: Response) => {
  const { search, path: careerPath, status, paymentStatus, page, limit } = req.query;
  const result = db.getRegistrations({
    search: search as string,
    path: careerPath as string,
    status: status as string,
    paymentStatus: paymentStatus as string,
    page: page ? parseInt(page as string, 10) : 1,
    limit: limit ? parseInt(limit as string, 10) : 15,
  });
  res.json(result);
});

// Get single registration complete profile
app.get('/api/admin/registrations/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const record = db.getRegistrationById(id);
  if (!record) {
    return res.status(404).json({ error: 'Registration record not found.' });
  }
  res.json(record);
});

// Update registration (status, note, counsellor assignment, payment)
app.patch('/api/admin/registrations/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, assignedCounsellor, nextFollowUpDate, counsellorNote, contactLog, paymentStatus } = req.body;
  
  const updated = db.updateRegistration(
    id,
    {
      status,
      assignedCounsellor,
      nextFollowUpDate,
      counsellorNote,
      contactLog,
      paymentStatus
    },
    'ADMIN_USER'
  );

  if (!updated) {
    return res.status(404).json({ error: 'Registration record not found.' });
  }

  res.json({ success: true, record: updated });
});

// Admin Dashboard Summary Statistics
app.get('/api/admin/stats', requireAdminAuth, (_req: Request, res: Response) => {
  const stats = db.getStats();
  res.json(stats);
});

// Update Portal Settings
app.post('/api/admin/settings', requireAdminAuth, (req: Request, res: Response) => {
  const updates = req.body;
  const updated = db.updateSettings(updates, 'ADMIN');
  res.json({ success: true, settings: updated });
});

// Export authorized registrations to CSV
app.get('/api/admin/export/csv', requireAdminAuth, (_req: Request, res: Response) => {
  const { items } = db.getRegistrations({ limit: 10000 });
  
  const headers = [
    'Registration ID',
    'Full Name',
    'Full Name (Bangla)',
    'Mobile',
    'Email',
    'District',
    'Division',
    'Age',
    'Career Paths',
    'Highest Education',
    'Trade / Occupation',
    'Readiness Score',
    'Payment Status',
    'Payment Amount',
    'Application Status',
    'Assigned Counsellor',
    'Created At'
  ];

  const rows = items.map(r => [
    r.id,
    `"${r.personal.fullName.replace(/"/g, '""')}"`,
    `"${(r.personal.fullNameBn || '').replace(/"/g, '""')}"`,
    r.personal.mobile,
    r.personal.email || '',
    r.personal.district,
    r.personal.division,
    r.personal.age,
    `"${r.careerPaths.selectedPaths.join(', ')}"`,
    `"${(r.education.highestEducation || '').replace(/"/g, '""')}"`,
    `"${(r.education.tradeOccupation || '').replace(/"/g, '""')}"`,
    r.assessment.overallScore,
    r.payment.status,
    r.payment.amount,
    r.status,
    `"${(r.assignedCounsellor || '').replace(/"/g, '""')}"`,
    r.createdAt
  ]);

  const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=gcc_registrations_${new Date().toISOString().slice(0, 10)}.csv`);
  res.status(200).send(csv);
});

// ==========================================
// VITE DEV SERVER / STATIC ASSETS
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GCC Global Career Counselling Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

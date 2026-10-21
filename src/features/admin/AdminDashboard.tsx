import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  FileSpreadsheet, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Calendar, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Eye, 
  Settings, 
  RefreshCw, 
  UserCheck, 
  DollarSign, 
  Building, 
  Plane, 
  Compass, 
  Plus, 
  X,
  PhoneCall
} from 'lucide-react';
import { RegistrationRecord, Language, ApplicationStatus, PaymentStatus, PortalConfig } from '../../types';
import { translations } from '../../i18n/translations';
import { ReceiptModal } from '../receipt/ReceiptModal';

interface AdminDashboardProps {
  language: Language;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ language }) => {
  const t = translations[language];
  const isBn = language === 'bn';

  // Auth State
  const [adminToken, setAdminToken] = useState<string | null>(() => localStorage.getItem('gcc_admin_token'));
  const [adminUser, setAdminUser] = useState<{ username: string; name: string; role: string } | null>(() => {
    const raw = localStorage.getItem('gcc_admin_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loginEmail, setLoginEmail] = useState('admin@gcc.org');
  const [loginPassword, setLoginPassword] = useState('GCCAdmin2026!');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard Data State
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'registrations' | 'settings'>('registrations');

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [pathFilter, setPathFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Selected Registration Dossier Modal
  const [selectedRecord, setSelectedRecord] = useState<RegistrationRecord | null>(null);
  const [receiptRecord, setReceiptRecord] = useState<RegistrationRecord | null>(null);

  // Dossier Edit Form
  const [editStatus, setEditStatus] = useState<ApplicationStatus>('new');
  const [editCounsellor, setEditCounsellor] = useState('');
  const [editFollowUpDate, setEditFollowUpDate] = useState('');
  const [newNoteText, setNewNoteText] = useState('');
  const [newContactType, setNewContactType] = useState<'phone' | 'whatsapp' | 'email' | 'in_person'>('phone');
  const [newContactSummary, setNewContactSummary] = useState('');
  const [isSavingDossier, setIsSavingDossier] = useState(false);

  // Settings tab state
  const [settingsFeeBDT, setSettingsFeeBDT] = useState(500);
  const [settingsFeeUSD, setSettingsFeeUSD] = useState(10);
  const [settingsEmail, setSettingsEmail] = useState('gccounceling@gmail.com');
  const [settingsLogoUrl, setSettingsLogoUrl] = useState('');
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false);

  // Fetch registrations
  const fetchRegistrations = async () => {
    if (!adminToken) return;
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        search: searchQuery,
        path: pathFilter,
        status: statusFilter,
        paymentStatus: paymentFilter,
      });

      const res = await fetch(`/api/admin/registrations?${params.toString()}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (res.status === 401 || res.status === 403) {
        handleLogout();
        return;
      }

      const data = await res.json();
      setRegistrations(data.items || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.total || 0);

      // Also fetch stats
      const statsRes = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchRegistrations();
    }
  }, [adminToken, page, pathFilter, statusFilter, paymentFilter]);

  // Handle Search Debounce / Submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchRegistrations();
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginEmail, password: loginPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid administrator credentials');
      }

      setAdminToken(data.token);
      setAdminUser(data.user);
      localStorage.setItem('gcc_admin_token', data.token);
      localStorage.setItem('gcc_admin_user', JSON.stringify(data.user));
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem('gcc_admin_token');
    localStorage.removeItem('gcc_admin_user');
  };

  // Open candidate dossier
  const handleOpenDossier = (record: RegistrationRecord) => {
    setSelectedRecord(record);
    setEditStatus(record.status);
    setEditCounsellor(record.assignedCounsellor || '');
    setEditFollowUpDate(record.nextFollowUpDate || '');
    setNewNoteText('');
    setNewContactSummary('');
  };

  // Save changes to candidate dossier
  const handleSaveDossierChanges = async () => {
    if (!selectedRecord || !adminToken) return;
    setIsSavingDossier(true);

    const payload: any = {
      status: editStatus,
      assignedCounsellor: editCounsellor,
      nextFollowUpDate: editFollowUpDate,
    };

    if (newNoteText.trim()) {
      payload.counsellorNote = {
        text: newNoteText.trim(),
        author: adminUser?.name || 'Counsellor',
      };
    }

    if (newContactSummary.trim()) {
      payload.contactLog = {
        date: new Date().toISOString().slice(0, 10),
        type: newContactType,
        counsellor: adminUser?.name || 'Counsellor',
        summary: newContactSummary.trim(),
      };
    }

    try {
      const res = await fetch(`/api/admin/registrations/${selectedRecord.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to update record');

      const data = await res.json();
      setSelectedRecord(data.record);
      setNewNoteText('');
      setNewContactSummary('');
      fetchRegistrations();
      alert(isBn ? 'সফলভাবে সংরক্ষিত হয়েছে!' : 'Updated candidate record successfully!');
    } catch (err: any) {
      alert(err.message || 'Error updating record');
    } finally {
      setIsSavingDossier(false);
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    if (!adminToken) return;
    window.location.href = `/api/admin/export/csv?token=${encodeURIComponent(adminToken)}`;
  };

  // Update Settings
  const handleSaveSettings = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          counsellingFeeBDT: settingsFeeBDT,
          counsellingFeeUSD: settingsFeeUSD,
          notificationEmail: settingsEmail,
          brandLogoUrl: settingsLogoUrl,
        }),
      });

      if (res.ok) {
        setSettingsSavedMsg(true);
        setTimeout(() => setSettingsSavedMsg(false), 3000);
      }
    } catch (err) {
      console.error('Settings save error:', err);
    }
  };

  // ==========================================
  // LOGIN SCREEN (If not authenticated)
  // ==========================================
  if (!adminToken) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-7 shadow-2xl text-left space-y-6">
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              {t.admin.loginTitle}
            </h2>
            <p className="text-xs text-zinc-400">
              {t.admin.subtitle}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">
                {t.admin.username}
              </label>
              <input
                type="text"
                required
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-400 focus:outline-none text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">
                {t.admin.password}
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-400 focus:outline-none text-xs text-white font-mono"
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
            >
              {isLoggingIn ? 'Verifying Credentials...' : t.admin.btnLogin}
            </button>
          </form>

          {/* Secure Seed Credentials Indicator */}
          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
            <span className="font-bold text-zinc-300 block">Default Admin Account:</span>
            <div>Username: <code className="text-amber-400 font-mono">admin@gcc.org</code></div>
            <div>Password: <code className="text-amber-400 font-mono">GCCAdmin2026!</code></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Role */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {t.admin.title}
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Logged in as: <strong className="text-white">{adminUser?.name}</strong> ({adminUser?.role})
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex p-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveTab('registrations')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                activeTab === 'registrations' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {t.admin.registrationsTab}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                activeTab === 'settings' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {t.admin.settingsTab}
            </button>
          </div>

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 transition cursor-pointer"
            title="Download authorized registrations in CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{t.admin.exportCsv}</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-red-400 transition cursor-pointer"
          >
            {t.admin.logout}
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <span className="text-[10px] font-bold text-zinc-400 uppercase">{t.admin.stats.totalRegistrations}</span>
            <div className="text-2xl font-black text-white mt-1 font-mono">{stats.total}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <span className="text-[10px] font-bold text-zinc-400 uppercase">{t.admin.stats.overseasSeekers}</span>
            <div className="text-2xl font-black text-amber-400 mt-1 font-mono">{stats.overseas}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <span className="text-[10px] font-bold text-zinc-400 uppercase">{t.admin.stats.localEmployment}</span>
            <div className="text-2xl font-black text-blue-400 mt-1 font-mono">{stats.bangladesh}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <span className="text-[10px] font-bold text-zinc-400 uppercase">{t.admin.stats.entrepreneurs}</span>
            <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">{stats.entrepreneurship}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <span className="text-[10px] font-bold text-zinc-400 uppercase">{t.admin.stats.paidFees}</span>
            <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">{stats.paid}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <span className="text-[10px] font-bold text-zinc-400 uppercase">{t.admin.stats.pendingReview}</span>
            <div className="text-2xl font-black text-yellow-400 mt-1 font-mono">{stats.pendingReview}</div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 1: REGISTRATIONS TABLE & FILTERS */}
      {/* ========================================== */}
      {activeTab === 'registrations' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-3">
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t.admin.searchPlaceholder}
                className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-amber-400"
              />
            </form>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              {/* Path Filter */}
              <select
                value={pathFilter}
                onChange={e => { setPathFilter(e.target.value); setPage(1); }}
                className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300"
              >
                <option value="all">{t.admin.filterPath}</option>
                <option value="overseas">Overseas Employment</option>
                <option value="bangladesh">Employment in BD</option>
                <option value="entrepreneurship">Entrepreneurship</option>
                <option value="upskilling">Upskilling</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300"
              >
                <option value="all">{t.admin.filterStatus}</option>
                <option value="new">New</option>
                <option value="under_review">Under Review</option>
                <option value="interview_scheduled">Interview Scheduled</option>
                <option value="counselling_completed">Counselling Completed</option>
                <option value="enrolled">Enrolled</option>
                <option value="closed">Closed</option>
              </select>

              {/* Payment Filter */}
              <select
                value={paymentFilter}
                onChange={e => { setPaymentFilter(e.target.value); setPage(1); }}
                className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300"
              >
                <option value="all">{t.admin.filterPayment}</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="manual_verification">Manual Verification</option>
              </select>

              <button
                type="button"
                onClick={fetchRegistrations}
                className="p-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300"
                title="Refresh registrations"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Registrations Data Table */}
          <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3.5">{t.admin.regIdCol}</th>
                    <th className="px-4 py-3.5">{t.admin.nameCol}</th>
                    <th className="px-4 py-3.5">{t.admin.phoneCol}</th>
                    <th className="px-4 py-3.5">{t.admin.pathCol}</th>
                    <th className="px-4 py-3.5">{t.admin.scoreCol}</th>
                    <th className="px-4 py-3.5">Payment</th>
                    <th className="px-4 py-3.5">{t.admin.statusCol}</th>
                    <th className="px-4 py-3.5 text-right">{t.admin.actionCol}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-zinc-500">
                        Loading registrations...
                      </td>
                    </tr>
                  ) : registrations.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-zinc-500">
                        No registration records match your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    registrations.map(r => (
                      <tr key={r.id} className="hover:bg-zinc-800/40 transition">
                        <td className="px-4 py-3 font-mono font-bold text-amber-400 whitespace-nowrap">
                          {r.id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-bold text-white">{r.personal.fullName}</div>
                          <div className="text-[11px] text-zinc-400">{r.personal.district}, {r.personal.division}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-mono text-zinc-300">
                          {r.personal.mobile}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="font-semibold text-[11px] uppercase text-zinc-300">
                            {r.careerPaths.selectedPaths.join(', ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-mono">
                          <span className={`font-bold ${r.assessment.overallScore >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {r.assessment.overallScore}%
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            r.payment.status === 'paid'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}>
                            {r.payment.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] font-semibold uppercase">
                            {r.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right space-x-1">
                          <button
                            onClick={() => handleOpenDossier(r)}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 transition cursor-pointer"
                            title="View candidate dossier"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setReceiptRecord(r)}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition cursor-pointer"
                            title="Print official receipt"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-3.5 bg-zinc-950/80 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <div>
                Showing <strong>{registrations.length}</strong> of <strong>{totalCount}</strong> records
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white disabled:opacity-40 transition"
                >
                  Previous
                </button>
                <span className="px-2 font-mono">
                  {page} / {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white disabled:opacity-40 transition"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 2: PORTAL SETTINGS & FEES */}
      {/* ========================================== */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-7 space-y-5 text-left">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Settings className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">
              Counselling Fees, Brand & Notification Settings
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Counselling Fee (BDT)</label>
              <input
                type="number"
                value={settingsFeeBDT}
                onChange={e => setSettingsFeeBDT(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Counselling Fee (USD)</label>
              <input
                type="number"
                value={settingsFeeUSD}
                onChange={e => setSettingsFeeUSD(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300">GCC Administrative Notification Email</label>
            <input
              type="email"
              value={settingsEmail}
              onChange={e => setSettingsEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300">Custom Brand Logo URL (Optional)</label>
            <input
              type="url"
              value={settingsLogoUrl}
              onChange={e => setSettingsLogoUrl(e.target.value)}
              placeholder="https://example.com/gcc-official-logo.png"
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500"
            />
            <span className="text-[11px] text-zinc-500 block">
              When left empty, the official high-contrast GCC Brand Emblem Slot is used.
            </span>
          </div>

          {settingsSavedMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs">
              Portal configuration updated and saved persistently.
            </div>
          )}

          <div className="pt-3">
            <button
              onClick={handleSaveSettings}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow transition cursor-pointer"
            >
              Save Configuration
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* CANDIDATE DOSSIER DRAWER / MODAL */}
      {/* ========================================== */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-white my-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                  {selectedRecord.id}
                </span>
                <h3 className="text-lg font-black text-white">
                  {selectedRecord.personal.fullName} {selectedRecord.personal.fullNameBn && `(${selectedRecord.personal.fullNameBn})`}
                </h3>
                <span className="text-xs text-zinc-400">
                  {selectedRecord.personal.district}, {selectedRecord.personal.division} · Mobile: {selectedRecord.personal.mobile}
                </span>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier Tabs / Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6 text-xs">
              {/* Column 1: Candidate Overview */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
                  <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px] block">
                    Academic & Technical Background
                  </span>
                  <div><span className="text-zinc-500">Highest Education:</span> <div>{selectedRecord.education.highestEducation}</div></div>
                  <div><span className="text-zinc-500">Institution:</span> <div>{selectedRecord.education.institution}</div></div>
                  <div><span className="text-zinc-500">Technical Institute:</span> <div>{selectedRecord.education.technicalInstitute || 'None'}</div></div>
                  <div><span className="text-zinc-500">Trade:</span> <div>{selectedRecord.education.tradeOccupation || 'None'}</div></div>
                  <div><span className="text-zinc-500">Certification Status:</span> <div className="text-emerald-400 uppercase">{selectedRecord.education.certificationStatus}</div></div>
                  <div><span className="text-zinc-500">Practical Experience:</span> <div>{selectedRecord.education.practicalExperienceYears} Years</div></div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
                  <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px] block">
                    Language & Digital Skills
                  </span>
                  <div><span className="text-zinc-500">Bangla:</span> {selectedRecord.language.banglaProficiency}</div>
                  <div><span className="text-zinc-500">English Speaking:</span> {selectedRecord.language.englishSpeaking}</div>
                  <div><span className="text-zinc-500">English Accents:</span> {selectedRecord.language.englishAccents}</div>
                  <div><span className="text-zinc-500">Computer & Smartphone:</span> {selectedRecord.digital.computerLiteracy} / {selectedRecord.digital.smartphoneSkills}</div>
                  <div><span className="text-zinc-500">AI Tool Awareness:</span> {selectedRecord.digital.aiToolsAwareness}</div>
                  <div><span className="text-zinc-500">Design Tools:</span> Canva: {selectedRecord.digital.designTools.canva ? 'Yes' : 'No'}, Photoshop: {selectedRecord.digital.designTools.photoshop ? 'Yes' : 'No'}</div>
                </div>

                {/* Confidential Health Accommodation */}
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px] block">
                    Workplace Accommodations (Strictly Confidential)
                  </span>
                  <div><span className="text-zinc-500">Physical Limitation:</span> {selectedRecord.health.physicalLimitation}</div>
                  <div><span className="text-zinc-500">Sensory / Support Needed:</span> {selectedRecord.health.sensoryLimitation}</div>
                  {selectedRecord.health.optionalExplanation && (
                    <div><span className="text-zinc-500">Applicant Note:</span> <div>{selectedRecord.health.optionalExplanation}</div></div>
                  )}
                </div>
              </div>

              {/* Column 2: Career Path Specifics & Readiness */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
                  <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px] block">
                    Selected Career Pathway(s)
                  </span>
                  <div className="font-bold text-white uppercase text-sm">
                    {selectedRecord.careerPaths.selectedPaths.join(', ')}
                  </div>

                  {selectedRecord.careerPaths.overseas && (
                    <div className="pt-2 border-t border-zinc-800 space-y-1.5 text-zinc-300">
                      <div><span className="text-zinc-500">Passport Status:</span> <strong className="text-amber-400">{selectedRecord.careerPaths.overseas.hasPassport}</strong> ({selectedRecord.careerPaths.overseas.passportValidityMonths || 0} mos remaining)</div>
                      <div><span className="text-zinc-500">Target Countries:</span> {selectedRecord.careerPaths.overseas.targetCountries.join(', ')}</div>
                      <div><span className="text-zinc-500">Target Trade:</span> {selectedRecord.careerPaths.overseas.targetTrade}</div>
                      <div><span className="text-zinc-500">Target Departure:</span> {selectedRecord.careerPaths.overseas.targetDeparture}</div>
                      <div><span className="text-zinc-500">Budget Range:</span> {selectedRecord.careerPaths.overseas.budgetRange}</div>
                    </div>
                  )}

                  {selectedRecord.careerPaths.bangladesh && (
                    <div className="pt-2 border-t border-zinc-800 space-y-1.5 text-zinc-300">
                      <div><span className="text-zinc-500">Target Role:</span> {selectedRecord.careerPaths.bangladesh.preferredJobTitles}</div>
                      <div><span className="text-zinc-500">Location:</span> {selectedRecord.careerPaths.bangladesh.workLocation}</div>
                      <div><span className="text-zinc-500">Job Type:</span> {selectedRecord.careerPaths.bangladesh.jobType}</div>
                    </div>
                  )}

                  {selectedRecord.careerPaths.entrepreneurship && (
                    <div className="pt-2 border-t border-zinc-800 space-y-1.5 text-zinc-300">
                      <div><span className="text-zinc-500">Business Concept:</span> {selectedRecord.careerPaths.entrepreneurship.proposedBusiness}</div>
                      <div><span className="text-zinc-500">Budget Needed:</span> {selectedRecord.careerPaths.entrepreneurship.estimatedBudgetBand}</div>
                      <div><span className="text-zinc-500">Business Model:</span> {selectedRecord.careerPaths.entrepreneurship.businessModel}</div>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
                  <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px] block">
                    Readiness Evaluation ({selectedRecord.assessment.overallScore}/100)
                  </span>
                  <div className="space-y-1">
                    <span className="text-zinc-500 block">Identified Strengths:</span>
                    <ul className="list-disc list-inside text-zinc-300 space-y-1">
                      {selectedRecord.assessment.strengths.slice(0, 3).map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-1 pt-2 border-t border-zinc-800">
                    <span className="text-zinc-500 block">Identified Growth Areas:</span>
                    <ul className="list-disc list-inside text-amber-300 space-y-1">
                      {selectedRecord.assessment.growthAreas.slice(0, 2).map((g, i) => (
                        <li key={i}>{g}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Column 3: Counsellor Actions & Follow-up */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-3">
                  <span className="font-bold text-white uppercase tracking-wider text-[10px] block">
                    Manage Application Status
                  </span>

                  <div className="space-y-1">
                    <label className="text-zinc-400 text-[11px]">Workflow Status</label>
                    <select
                      value={editStatus}
                      onChange={e => setEditStatus(e.target.value as any)}
                      className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white"
                    >
                      <option value="new">New Application</option>
                      <option value="under_review">Under Review</option>
                      <option value="interview_scheduled">Interview Scheduled</option>
                      <option value="counselling_completed">Counselling Completed</option>
                      <option value="enrolled">Enrolled in Pathway</option>
                      <option value="on_hold">On Hold</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-400 text-[11px]">Assign Responsible Counsellor</label>
                    <input
                      type="text"
                      value={editCounsellor}
                      onChange={e => setEditCounsellor(e.target.value)}
                      placeholder="e.g. Senior Counsellor - Gulf Trade"
                      className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-400 text-[11px]">Next Follow-Up Date</label>
                    <input
                      type="date"
                      value={editFollowUpDate}
                      onChange={e => setEditFollowUpDate(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Add Private Note */}
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
                  <span className="font-bold text-white uppercase tracking-wider text-[10px] block">
                    Add Private Counsellor Note
                  </span>
                  <textarea
                    rows={2}
                    value={newNoteText}
                    onChange={e => setNewNoteText(e.target.value)}
                    placeholder="Enter confidential advisory notes..."
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white"
                  />
                </div>

                {/* Add Contact Log */}
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
                  <span className="font-bold text-white uppercase tracking-wider text-[10px] block">
                    Record Contact History
                  </span>
                  <div className="flex gap-2">
                    <select
                      value={newContactType}
                      onChange={e => setNewContactType(e.target.value as any)}
                      className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-white"
                    >
                      <option value="phone">Phone</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="email">Email</option>
                      <option value="in_person">In Person</option>
                    </select>
                    <input
                      type="text"
                      value={newContactSummary}
                      onChange={e => setNewContactSummary(e.target.value)}
                      placeholder="Summary of interaction..."
                      className="w-full px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-white"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveDossierChanges}
                  disabled={isSavingDossier}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow transition cursor-pointer"
                >
                  {isSavingDossier ? 'Saving...' : 'Save Dossier Updates'}
                </button>
              </div>
            </div>

            {/* Counsellor Notes Timeline */}
            {selectedRecord.counsellorNotes.length > 0 && (
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Counsellor Private Notes History
                </h4>
                <div className="space-y-2">
                  {selectedRecord.counsellorNotes.map(n => (
                    <div key={n.id} className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1">
                        <strong className="text-amber-400">{n.author}</strong>
                        <span>{new Date(n.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-zinc-200">{n.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Receipt Modal Viewer if triggered */}
      {receiptRecord && (
        <ReceiptModal
          record={receiptRecord}
          language={language}
          onClose={() => setReceiptRecord(null)}
        />
      )}
    </div>
  );
};

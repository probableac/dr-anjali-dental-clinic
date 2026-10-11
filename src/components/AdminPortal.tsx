import React, { useState, useEffect } from 'react';
import { Appointment, Review, Treatment } from '../types';
import { api } from '../services/api';

interface AdminPortalProps {
  onReviewsUpdated?: () => void;
  onServicesUpdated?: () => void;
  onClose?: () => void;
  onAuthChange?: (authenticated: boolean) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onReviewsUpdated,
  onServicesUpdated,
  onClose,
  onAuthChange
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => api.isAdminAuthenticated());
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard Sub-tabs
  const [activeTab, setActiveTab] = useState<'consultations' | 'reviews' | 'services'>('consultations');

  // Data states
  const [consultations, setConsultations] = useState<Appointment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [services, setServices] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Consultations filtering
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // New review modal / form
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewLocation, setNewReviewLocation] = useState('');
  const [newReviewTreatment, setNewReviewTreatment] = useState('Preventative Ultrasonic Care');
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [newReviewText, setNewReviewText] = useState('');

  // Editing service prices
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editedPrice, setEditedPrice] = useState<number>(0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [cList, rList, sList] = await Promise.all([
        api.getConsultations(),
        api.getReviews(false), // get all reviews including unapproved/pending
        api.getServices()
      ]);
      setConsultations(cList);
      setReviews(rList);
      setServices(sList);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      const unsub = api.subscribeConsultations((cList) => {
        setConsultations(cList);
      });
      return () => {
        if (unsub) unsub();
      };
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = await api.adminLogin(pinInput.trim());
    if (res.success) {
      setIsAuthenticated(true);
      onAuthChange?.(true);
      showToast('Welcome, Clinic Administrator');
    } else {
      setLoginError(res.message);
    }
  };

  const handleLogout = () => {
    api.adminLogout();
    setIsAuthenticated(false);
    onAuthChange?.(false);
    setPinInput('');
  };

  // Status updates on consultations
  const handleStatusChange = async (id: string, newStatus: any) => {
    await api.updateConsultationStatus(id, newStatus);
    setConsultations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    showToast(`Consultation ${id} marked as ${newStatus}`);
  };

  // Export consultations to CSV
  const handleExportCSV = () => {
    if (consultations.length === 0) {
      showToast('No consultations available to export');
      return;
    }

    const headers = [
      'Appointment ID',
      'Patient Name',
      'Phone Number',
      'Email',
      'Treatment',
      'Doctor',
      'Date',
      'Time Slot',
      'Status',
      'Anxiety Score (1-5)',
      'Aromatherapy',
      'Weighted Blanket',
      'Welcome Drink',
      'Audio Preference',
      'Patient Notes',
      'Created At'
    ];

    const rows = consultations.map((c) => [
      `"${c.id}"`,
      `"${c.patientName}"`,
      `"${c.patientPhone}"`,
      `"${c.patientEmail}"`,
      `"${c.treatmentName}"`,
      `"${c.dentist}"`,
      `"${c.date}"`,
      `"${c.timeSlot}"`,
      `"${c.status}"`,
      c.comfortPreferences?.anxietyScore || 1,
      `"${c.comfortPreferences?.aromatherapy || 'N/A'}"`,
      `"${c.comfortPreferences?.weightedBlanket || 'N/A'}"`,
      `"${c.comfortPreferences?.organicTea || 'N/A'}"`,
      `"${c.comfortPreferences?.audioStreaming || 'N/A'}"`,
      `"${(c.comfortPreferences?.specialNotes || '').replace(/"/g, '""')}"`,
      `"${c.createdAt}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Serene-Dental-Consultations-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported patient consultations to CSV');
  };

  // Reviews handlers
  const handleToggleReviewApproval = async (id: string, currentStatus: boolean | undefined) => {
    const nextStatus = currentStatus === false ? true : false;
    await api.toggleReviewApproval(id, nextStatus);
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, approved: nextStatus } : r))
    );
    onReviewsUpdated?.();
    showToast(nextStatus ? 'Review approved & published on Home page' : 'Review hidden from public feed');
  };

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this review?')) return;
    await api.deleteReview(id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
    onReviewsUpdated?.();
    showToast('Review deleted successfully');
  };

  const handleAddNewReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewText.trim()) return;

    const initials = newReviewAuthor
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'PT';

    const newRev = await api.addReview({
      name: newReviewAuthor,
      initials,
      location: newReviewLocation || 'Sector 18, Noida • Verified Patient',
      treatment: newReviewTreatment,
      rating: newReviewRating,
      text: `"${newReviewText.replace(/^"|"$/g, '')}"`,
      date: 'Just now',
      approved: true
    });

    setReviews((prev) => [newRev, ...prev]);
    setIsAddReviewOpen(false);
    setNewReviewAuthor('');
    setNewReviewLocation('');
    setNewReviewText('');
    onReviewsUpdated?.();
    showToast('New patient review added and published live!');
  };

  // Service price update
  const handleSavePrice = async (serviceId: string) => {
    if (editedPrice <= 0) return;
    await api.updateServicePrice(serviceId, editedPrice);
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, priceStarting: editedPrice } : s))
    );
    setEditingServiceId(null);
    onServicesUpdated?.();
    showToast('Treatment pricing updated in database');
  };

  // Filtered consultations
  const filteredConsultations = consultations.filter((c) => {
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesSearch =
      c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.patientPhone.includes(searchQuery) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.treatmentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate statistics
  const totalConsultations = consultations.length;
  const completedCount = consultations.filter((c) => c.status === 'Completed').length;
  const highAnxietyCount = consultations.filter((c) => (c.comfortPreferences?.anxietyScore || 1) >= 4).length;
  const approvedReviewsCount = reviews.filter((r) => r.approved !== false).length;

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 animate-fadeIn">
        <div className="bg-[#ffffff] rounded-3xl p-8 shadow-xl border border-[#e5e8ee] text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#0f5238] text-white flex items-center justify-center mx-auto mb-4 shadow">
            <span className="material-symbols-outlined text-[28px]">admin_panel_settings</span>
          </div>

          <h2 className="text-[22px] font-bold text-[#181c20] font-['Plus_Jakarta_Sans']">
            Clinic Administrator Portal
          </h2>
          <p className="text-xs text-[#404943] mt-1 mb-6">
            Enter your secure clinic credentials to manage reviews, services, and patient consultations.
          </p>

          {loginError && (
            <div className="mb-4 p-3 bg-[#ffdad6] text-[#ba1a1a] rounded-xl text-xs font-semibold">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter PIN (1804) or Password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full text-center tracking-widest text-lg font-bold bg-[#f1f4f9] border border-[#bfc9c1]/80 rounded-xl px-4 py-3 text-[#181c20] focus:ring-2 focus:ring-[#0f5238] focus:outline-none"
                autoFocus
                required
              />
              <span className="text-[11px] text-[#707973] mt-1.5 block">
                Default clinic PIN: <code className="bg-[#e5e8ee] px-1.5 py-0.5 rounded font-mono font-bold text-[#0f5238]">1804</code>
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-[#2d6a4f] hover:bg-[#0f5238] text-white py-3 rounded-xl font-bold text-sm shadow-sm transition-all"
            >
              Sign In to Admin Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#0f5238] text-white px-5 py-2.5 rounded-full shadow-2xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-[#ffffff] rounded-3xl p-6 md:p-8 shadow-sm border border-[#e5e8ee] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006c48] animate-pulse"></span>
            <span className="text-xs uppercase font-bold text-[#0f5238] tracking-wider">
              Serene Dental Studio • Sector 18 Noida
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#181c20] font-['Plus_Jakarta_Sans']">
            Clinic Operations &amp; Review Management
          </h1>
          <p className="text-xs text-[#404943] mt-0.5">
            Logged in as Dr. Anjali Bhardwaj (Chief Administrator)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 rounded-xl border border-[#e5e8ee] text-[#404943] hover:bg-[#f1f4f9] transition-colors"
            title="Refresh Database"
          >
            <span className={`material-symbols-outlined text-[18px] ${loading ? 'animate-spin' : ''}`}>
              refresh
            </span>
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-[#ffdad6] text-[#ba1a1a] text-xs font-bold hover:bg-[#ba1a1a] hover:text-white transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#e5e8ee] shadow-sm">
          <span className="text-[11px] font-bold text-[#707973] uppercase tracking-wider block">
            Total Consultations
          </span>
          <span className="text-3xl font-bold text-[#181c20] font-['Plus_Jakarta_Sans'] mt-1 block">
            {totalConsultations}
          </span>
          <span className="text-[11px] text-[#0f5238] font-semibold mt-1 block">
            Stored in persistent database
          </span>
        </div>

        <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#e5e8ee] shadow-sm">
          <span className="text-[11px] font-bold text-[#707973] uppercase tracking-wider block">
            Completed Visits
          </span>
          <span className="text-3xl font-bold text-[#0f5238] font-['Plus_Jakarta_Sans'] mt-1 block">
            {completedCount}
          </span>
          <span className="text-[11px] text-[#404943] mt-1 block">
            Patient history logged
          </span>
        </div>

        <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#e5e8ee] shadow-sm">
          <span className="text-[11px] font-bold text-[#707973] uppercase tracking-wider block">
            High-Anxiety Flagged
          </span>
          <span className="text-3xl font-bold text-[#ba1a1a] font-['Plus_Jakarta_Sans'] mt-1 block">
            {highAnxietyCount}
          </span>
          <span className="text-[11px] text-[#404943] mt-1 block">
            Scale 4–5 extra-calm protocol
          </span>
        </div>

        <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#e5e8ee] shadow-sm">
          <span className="text-[11px] font-bold text-[#707973] uppercase tracking-wider block">
            Published Reviews
          </span>
          <span className="text-3xl font-bold text-[#0f5238] font-['Plus_Jakarta_Sans'] mt-1 block">
            {approvedReviewsCount}
          </span>
          <span className="text-[11px] text-[#404943] mt-1 block">
            Live on Home page feed
          </span>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-[#e5e8ee] gap-2">
        <button
          onClick={() => setActiveTab('consultations')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'consultations'
              ? 'border-[#0f5238] text-[#0f5238]'
              : 'border-transparent text-[#404943] hover:text-[#181c20]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">calendar_month</span>
          <span>Booked Consultations ({consultations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'reviews'
              ? 'border-[#0f5238] text-[#0f5238]'
              : 'border-transparent text-[#404943] hover:text-[#181c20]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">reviews</span>
          <span>Review Management ({reviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'services'
              ? 'border-[#0f5238] text-[#0f5238]'
              : 'border-transparent text-[#404943] hover:text-[#181c20]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">medical_services</span>
          <span>Services &amp; Pricing ({services.length})</span>
        </button>
      </div>

      {/* TAB 1: CONSULTATIONS & PATIENT RECORDS */}
      {activeTab === 'consultations' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-[#ffffff] p-4 rounded-2xl border border-[#e5e8ee] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-bold text-[#707973] mr-1">Status:</span>
              {['All', 'Confirmed', 'Completed', 'Rescheduled', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    statusFilter === st
                      ? 'bg-[#0f5238] text-white shadow-sm'
                      : 'bg-[#f1f4f9] text-[#404943] hover:bg-[#e5e8ee]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707973] text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search patient, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#f1f4f9] border border-[#bfc9c1]/60 rounded-xl text-xs text-[#181c20] focus:ring-2 focus:ring-[#0f5238] focus:outline-none"
                />
              </div>

              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-[#2d6a4f] hover:bg-[#0f5238] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 shrink-0"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Table of Consultations */}
          <div className="bg-[#ffffff] rounded-2xl border border-[#e5e8ee] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f1f4f9] text-[#404943] font-bold border-b border-[#e5e8ee]">
                  <tr>
                    <th className="p-3.5">ID / Date</th>
                    <th className="p-3.5">Patient Details</th>
                    <th className="p-3.5">Procedure &amp; Doctor</th>
                    <th className="p-3.5">Sensory Preferences</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e8ee]">
                  {filteredConsultations.map((c) => (
                    <tr key={c.id} className="hover:bg-[#f7f9ff] transition-colors">
                      <td className="p-3.5 align-top">
                        <span className="font-mono font-bold text-[#0f5238] block">{c.id}</span>
                        <span className="text-[11px] text-[#181c20] font-semibold">{c.date}</span>
                        <span className="text-[11px] text-[#707973] block">{c.timeSlot}</span>
                      </td>

                      <td className="p-3.5 align-top">
                        <span className="font-bold text-[#181c20] block">{c.patientName}</span>
                        <a href={`tel:${c.patientPhone}`} className="text-[#0f5238] hover:underline font-mono block">
                          {c.patientPhone}
                        </a>
                        <span className="text-[11px] text-[#707973] block">{c.patientEmail}</span>
                      </td>

                      <td className="p-3.5 align-top">
                        <span className="font-semibold text-[#181c20] block">{c.treatmentName}</span>
                        <span className="text-[11px] text-[#404943] block">{c.dentist}</span>
                        {c.comfortPreferences?.specialNotes && (
                          <p className="text-[11px] text-[#ba1a1a] mt-1 bg-[#ffdad6]/40 p-1.5 rounded">
                            <strong>Note:</strong> {c.comfortPreferences.specialNotes}
                          </p>
                        )}
                      </td>

                      <td className="p-3.5 align-top">
                        <div className="space-y-0.5 text-[11px] text-[#404943]">
                          <span className="block">
                            <strong>Scent:</strong> {c.comfortPreferences?.aromatherapy}
                          </span>
                          <span className="block">
                            <strong>Blanket:</strong> {c.comfortPreferences?.weightedBlanket}
                          </span>
                          <span className="block">
                            <strong>Drink:</strong> {c.comfortPreferences?.organicTea}
                          </span>
                          <span className="block">
                            <strong>Anxiety Score:</strong>{' '}
                            <span className={`font-bold ${
                              (c.comfortPreferences?.anxietyScore || 1) >= 4 ? 'text-[#ba1a1a]' : 'text-[#0f5238]'
                            }`}>
                              {c.comfortPreferences?.anxietyScore || 1} / 5
                            </span>
                          </span>
                        </div>
                      </td>

                      <td className="p-3.5 align-top">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-block ${
                          c.status === 'Completed'
                            ? 'bg-[#92f7c3]/60 text-[#005235]'
                            : c.status === 'Cancelled'
                            ? 'bg-[#ffdad6] text-[#ba1a1a]'
                            : c.status === 'Rescheduled'
                            ? 'bg-[#e5e8ee] text-[#181c20]'
                            : 'bg-[#b1f0ce] text-[#002114]'
                        }`}>
                          {c.status}
                        </span>
                      </td>

                      <td className="p-3.5 align-top text-right space-y-1.5">
                        <select
                          value={c.status}
                          onChange={(e) => handleStatusChange(c.id, e.target.value)}
                          className="bg-[#f1f4f9] border border-[#bfc9c1]/70 rounded-lg p-1 text-[11px] font-semibold text-[#181c20] focus:outline-none"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Mark Completed</option>
                          <option value="Rescheduled">Rescheduled</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>

                        <div className="flex items-center justify-end gap-1.5 pt-1">
                          <a
                            href={api.generatePatientConfirmationWhatsAppLink(c)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 bg-[#25D366]/15 hover:bg-[#25D366] text-[#075E54] hover:text-white rounded-lg text-[10px] font-bold inline-flex items-center gap-1 transition-all"
                            title="Send WhatsApp confirmation to patient"
                          >
                            <span className="material-symbols-outlined text-[12px]">chat</span>
                            <span>WhatsApp</span>
                          </a>
                          <a
                            href={`tel:${c.patientPhone}`}
                            className="px-2 py-1 bg-[#f1f4f9] hover:bg-[#e5e8ee] text-[#181c20] rounded-lg text-[10px] font-bold inline-flex items-center gap-1 transition-all"
                            title="Call patient"
                          >
                            <span className="material-symbols-outlined text-[12px]">call</span>
                            <span>Call</span>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredConsultations.length === 0 && (
                <div className="text-center py-12 text-[#707973]">
                  <span className="material-symbols-outlined text-4xl mb-1">search_off</span>
                  <p className="text-sm font-semibold">No consultations matched your search criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REVIEW MANAGEMENT */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#ffffff] p-5 rounded-2xl border border-[#e5e8ee]">
            <div>
              <h3 className="text-base font-bold text-[#181c20] font-['Plus_Jakarta_Sans']">
                Patient Testimonials &amp; Google Reviews
              </h3>
              <p className="text-xs text-[#404943]">
                Manage public visibility or post new verified reviews from in-clinic feedback.
              </p>
            </div>

            <button
              onClick={() => setIsAddReviewOpen(true)}
              className="px-4 py-2 bg-[#2d6a4f] hover:bg-[#0f5238] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>Add Verified Patient Review</span>
            </button>
          </div>

          {/* Add Review Form Modal */}
          {isAddReviewOpen && (
            <div className="bg-[#ffffff] p-6 rounded-2xl border-2 border-[#0f5238] shadow-lg animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-[#181c20]">
                  Create New Verified Patient Review
                </h4>
                <button
                  onClick={() => setIsAddReviewOpen(false)}
                  className="text-xs text-[#707973] hover:underline"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleAddNewReview} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#181c20] mb-1">Patient Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Shalini Roy"
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      className="w-full bg-[#f1f4f9] border border-[#bfc9c1]/80 rounded-xl p-2.5 text-xs text-[#181c20] focus:ring-2 focus:ring-[#0f5238] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#181c20] mb-1">Location / Verification Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. Sector 50, Noida • Patient since 2024"
                      value={newReviewLocation}
                      onChange={(e) => setNewReviewLocation(e.target.value)}
                      className="w-full bg-[#f1f4f9] border border-[#bfc9c1]/80 rounded-xl p-2.5 text-xs text-[#181c20] focus:ring-2 focus:ring-[#0f5238] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#181c20] mb-1">Rating (Stars)</label>
                    <select
                      value={newReviewRating}
                      onChange={(e) => setNewReviewRating(parseInt(e.target.value))}
                      className="w-full bg-[#f1f4f9] border border-[#bfc9c1]/80 rounded-xl p-2.5 text-xs text-[#181c20] focus:ring-2 focus:ring-[#0f5238] focus:outline-none"
                    >
                      <option value={5}>★★★★★ (5 Stars - Excellent)</option>
                      <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                      <option value={3}>★★★☆☆ (3 Stars - Satisfactory)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#181c20] mb-1">Procedure Received</label>
                  <input
                    type="text"
                    placeholder="e.g. CAD/CAM Zirconia Crown &amp; Gentle Scaling"
                    value={newReviewTreatment}
                    onChange={(e) => setNewReviewTreatment(e.target.value)}
                    className="w-full bg-[#f1f4f9] border border-[#bfc9c1]/80 rounded-xl p-2.5 text-xs text-[#181c20] focus:ring-2 focus:ring-[#0f5238] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#181c20] mb-1">Review Feedback Text *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Write the patient's exact feedback regarding Dr. Anjali Bhardwaj and the anxiety-free protocol..."
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    className="w-full bg-[#f1f4f9] border border-[#bfc9c1]/80 rounded-xl p-2.5 text-xs text-[#181c20] focus:ring-2 focus:ring-[#0f5238] focus:outline-none"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddReviewOpen(false)}
                    className="px-4 py-2 border border-[#bfc9c1] text-xs font-semibold rounded-xl text-[#404943] hover:bg-[#f1f4f9]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#2d6a4f] text-white text-xs font-bold rounded-xl hover:bg-[#0f5238] shadow-sm transition-all"
                  >
                    Publish Review to Home Page
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reviews List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((r) => {
              const isApproved = r.approved !== false;
              return (
                <div
                  key={r.id}
                  className={`bg-[#ffffff] p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isApproved ? 'border-[#e5e8ee] shadow-sm' : 'border-[#e5e8ee] opacity-60 bg-[#f1f4f9]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex text-amber-500">
                        {Array.from({ length: r.rating || 5 }).map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isApproved ? 'bg-[#92f7c3]/60 text-[#005235]' : 'bg-[#e5e8ee] text-[#707973]'
                        }`}>
                          {isApproved ? 'Live on Website' : 'Hidden'}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#404943] italic leading-relaxed mb-3">
                      {r.text}
                    </p>

                    <div className="text-[11px] text-[#707973] border-t border-[#f1f4f9] pt-2">
                      <strong className="text-[#181c20]">{r.name}</strong> • {r.location}
                      <span className="block text-[10px] text-[#0f5238] mt-0.5 font-semibold">
                        Treatment: {r.treatment}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#e5e8ee] flex items-center justify-between mt-3">
                    <button
                      onClick={() => handleToggleReviewApproval(r.id, r.approved)}
                      className={`text-xs font-bold px-3 py-1 rounded-lg transition-all ${
                        isApproved
                          ? 'bg-[#e5e8ee] text-[#404943] hover:bg-[#d7dadf]'
                          : 'bg-[#0f5238] text-white hover:bg-[#2d6a4f]'
                      }`}
                    >
                      {isApproved ? 'Hide from Feed' : 'Approve & Publish'}
                    </button>

                    <button
                      onClick={() => handleDeleteReview(r.id)}
                      className="text-xs text-[#ba1a1a] hover:underline font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: SERVICES & DYNAMIC PRICING */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#e5e8ee]">
            <h3 className="text-base font-bold text-[#181c20] font-['Plus_Jakarta_Sans']">
              Clinical Procedures &amp; INR Tariff Control
            </h3>
            <p className="text-xs text-[#404943] mt-0.5">
              Change the starting price for any dental treatment in real time. Updated rates will immediately reflect in the public Treatments and Booking calculator.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {services.map((s) => (
              <div key={s.id} className="bg-[#ffffff] p-5 rounded-2xl border border-[#e5e8ee] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-[#0f5238] px-2 py-0.5 rounded bg-[#f1f4f9]">
                      {s.category}
                    </span>
                    <span className="text-[11px] text-[#707973]">{s.turnaround}</span>
                  </div>

                  <h4 className="text-sm font-bold text-[#181c20] font-['Plus_Jakarta_Sans'] mb-1">
                    {s.name}
                  </h4>
                  <p className="text-[11px] text-[#404943] line-clamp-2 mb-3">
                    {s.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#e5e8ee]">
                  {editingServiceId === s.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#0f5238]">₹</span>
                      <input
                        type="number"
                        value={editedPrice}
                        onChange={(e) => setEditedPrice(parseInt(e.target.value) || 0)}
                        className="w-28 bg-[#f1f4f9] border border-[#0f5238] rounded-lg px-2 py-1 text-xs font-bold text-[#181c20] focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSavePrice(s.id)}
                        className="px-2.5 py-1 bg-[#0f5238] text-white text-[11px] font-bold rounded-lg hover:bg-[#2d6a4f]"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingServiceId(null)}
                        className="text-[11px] text-[#707973] hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#707973] block">Current Fee:</span>
                        <span className="text-base font-bold text-[#0f5238] font-['Plus_Jakarta_Sans']">
                          ₹{s.priceStarting.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setEditingServiceId(s.id);
                          setEditedPrice(s.priceStarting);
                        }}
                        className="text-xs font-bold text-[#2d6a4f] hover:underline flex items-center gap-0.5"
                      >
                        <span className="material-symbols-outlined text-[14px]">edit</span>
                        Edit Fee
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

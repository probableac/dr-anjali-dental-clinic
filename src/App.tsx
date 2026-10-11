/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavigationTab, ComfortPreferences, Appointment, Review, Treatment } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { TreatmentsView } from './components/TreatmentsView';
import { BookingView } from './components/BookingView';
import { PortalView } from './components/PortalView';
import { AdminPortal } from './components/AdminPortal';
import { ComfortModal } from './components/ComfortModal';
import { EmergencyModal } from './components/EmergencyModal';
import { MapModal } from './components/MapModal';
import { api } from './services/api';
import { TREATMENTS } from './data/treatments';
import { REVIEWS } from './data/reviews';

const DEFAULT_PREFERENCES: ComfortPreferences = {
  aromatherapy: 'French Lavender',
  weightedBlanket: '12-lb Plush',
  audioStreaming: 'Bose QuietComfort + Spotify Calm',
  handRaiseAgreement: true,
  organicTea: 'Organic Tulsi Chamomile',
  numbingPreference: 'The Wand® Computer Numbing',
  anxietyScore: 2
};

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [bookingTreatmentId, setBookingTreatmentId] = useState<string | undefined>(undefined);

  // Modals
  const [isComfortModalOpen, setIsComfortModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // Live Database States
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reviews, setReviews] = useState<Review[]>(REVIEWS);
  const [services, setServices] = useState<Treatment[]>(TREATMENTS);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => api.isAdminAuthenticated());

  // User Comfort Preferences State
  const [preferences, setPreferences] = useState<ComfortPreferences>(() => {
    try {
      const saved = localStorage.getItem('serene_comfort_prefs');
      return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  // Sync initial data from database / server
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [cList, rList, sList] = await Promise.all([
          api.getConsultations(),
          api.getReviews(true),
          api.getServices()
        ]);
        if (cList && cList.length > 0) setAppointments(cList);
        if (rList && rList.length > 0) setReviews(rList);
        if (sList && sList.length > 0) setServices(sList);
      } catch (err) {
        console.warn('Initial data load warning:', err);
      }
    }
    loadInitialData();

    const unsubC = api.subscribeConsultations((list) => {
      setAppointments(list);
    });

    return () => {
      if (unsubC) unsubC();
    };
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('serene_comfort_prefs', JSON.stringify(preferences));
    } catch (e) {
      console.warn('Could not store preferences in localStorage', e);
    }
  }, [preferences]);

  const handleNavigate = (tab: NavigationTab) => {
    setIsAdmin(api.isAdminAuthenticated());
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = (treatmentId?: string) => {
    if (treatmentId) {
      setBookingTreatmentId(treatmentId);
    }
    setActiveTab('book-appointment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAppointmentBooked = async (newAppt: Appointment) => {
    try {
      await api.addConsultation(newAppt);
    } catch (err) {
      console.error('Failed to persist consultation to server/storage:', err);
    }
    setAppointments((prev) => [newAppt, ...prev]);
  };

  const handleCancelAppointment = async (id: string) => {
    try {
      await api.updateConsultationStatus(id, 'Cancelled');
    } catch (err) {
      console.error('Failed to cancel consultation:', err);
    }
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Cancelled' as const } : a))
    );
  };

  const handleRefreshReviews = async () => {
    const rList = await api.getReviews(true);
    setReviews(rList);
  };

  const handleRefreshServices = async () => {
    const sList = await api.getServices();
    setServices(sList);
  };

  return (
    <div className="min-h-screen bg-[#f7f9ff] text-[#181c20] flex flex-col font-['Inter',sans-serif]">
      {/* Header with Navigation and Branding */}
      <Header
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onOpenBooking={() => handleOpenBooking()}
        onOpenEmergency={() => setIsEmergencyModalOpen(true)}
      />

      {/* Main Content Body */}
      <main className="w-full pt-20 flex-grow min-h-screen">
        {activeTab === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onOpenBooking={handleOpenBooking}
            onOpenComfortMenu={() => setIsComfortModalOpen(true)}
            onOpenEmergency={() => setIsEmergencyModalOpen(true)}
            onOpenMap={() => setIsMapModalOpen(true)}
            reviews={reviews}
            treatments={services}
            appointments={appointments}
            isAdmin={isAdmin}
          />
        )}

        {activeTab === 'treatments-and-services' && (
          <TreatmentsView
            onBookTreatment={handleOpenBooking}
            onOpenComfortMenu={() => setIsComfortModalOpen(true)}
            onOpenEmergency={() => setIsEmergencyModalOpen(true)}
            treatments={services}
          />
        )}

        {activeTab === 'book-appointment' && (
          <BookingView
            initialTreatmentId={bookingTreatmentId}
            defaultPreferences={preferences}
            onAppointmentBooked={handleAppointmentBooked}
            onNavigateToPortal={() => handleNavigate('patient-portal')}
            treatments={services}
          />
        )}

        {activeTab === 'patient-portal' && (
          <PortalView
            appointments={appointments}
            preferences={preferences}
            onUpdatePreferences={(newPrefs) => setPreferences(newPrefs)}
            onCancelAppointment={handleCancelAppointment}
            onOpenBooking={() => handleOpenBooking()}
          />
        )}

        {activeTab === 'admin-portal' && (
          <AdminPortal
            onReviewsUpdated={handleRefreshReviews}
            onServicesUpdated={handleRefreshServices}
            onClose={() => handleNavigate('home')}
            onAuthChange={(auth) => setIsAdmin(auth)}
          />
        )}
      </main>

      {/* Floating Quick Sensory Tray & Emergency Widget */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2 items-end">
        <button
          onClick={() => setIsComfortModalOpen(true)}
          className="bg-white/95 backdrop-blur-md text-[#0f5238] border border-[#0f5238]/30 px-3.5 py-2 rounded-full shadow-lg hover:bg-[#92f7c3]/30 transition-all text-xs font-bold flex items-center gap-1.5 active:scale-95 group"
          title="Customize Sensory Comfort Tray"
        >
          <span className="material-symbols-outlined text-[18px] text-[#006c48]">spa</span>
          <span className="hidden sm:inline">Sensory Comfort Tray</span>
        </button>

        <button
          onClick={() => setIsEmergencyModalOpen(true)}
          className="bg-[#ba1a1a] text-white px-3.5 py-2 rounded-full shadow-xl hover:bg-[#93000a] transition-all text-xs font-bold flex items-center gap-1.5 active:scale-95"
          title="24/7 Dental Emergency Care"
        >
          <span className="material-symbols-outlined text-[18px]">emergency</span>
          <span className="hidden sm:inline">24/7 Emergency Line</span>
        </button>
      </div>

      {/* Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onOpenMap={() => setIsMapModalOpen(true)}
        onOpenEmergency={() => setIsEmergencyModalOpen(true)}
        onOpenAdmin={() => handleNavigate('admin-portal')}
      />

      {/* Interactive Modals */}
      <ComfortModal
        isOpen={isComfortModalOpen}
        onClose={() => setIsComfortModalOpen(false)}
        preferences={preferences}
        onSavePreferences={(newPrefs) => setPreferences(newPrefs)}
        onProceedToBooking={() => handleOpenBooking()}
      />

      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        onBookEmergencySlot={() => handleOpenBooking('emergency-pain-relief')}
      />

      <MapModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
      />
    </div>
  );
}

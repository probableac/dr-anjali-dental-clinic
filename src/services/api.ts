import { Appointment, Review, Treatment } from '../types';
import { TREATMENTS as DEFAULT_TREATMENTS } from '../data/treatments';
import { REVIEWS as DEFAULT_REVIEWS } from '../data/reviews';
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  Unsubscribe 
} from 'firebase/firestore';

const STORAGE_KEYS = {
  CONSULTATIONS: 'serene_noida_consultations',
  REVIEWS: 'serene_noida_reviews',
  SERVICES: 'serene_noida_services',
  ADMIN_SESSION: 'serene_admin_session'
};

const INITIAL_CONSULTATIONS: Appointment[] = [
  {
    id: 'SRN-NOIDA-829104',
    patientName: 'Pooja Verma',
    patientEmail: 'pooja.verma@example.in',
    patientPhone: '+91 98112 34567',
    treatmentId: 'preventative-cleaning',
    treatmentName: 'Preventative Ultrasonic Care & Airflow Polishing',
    dentist: 'Dr. Anjali Bhardwaj, BDS, MDS',
    date: '2026-10-18',
    timeSlot: '11:00 AM',
    comfortPreferences: {
      aromatherapy: 'French Lavender',
      weightedBlanket: '12-lb Plush',
      audioStreaming: 'Ceiling Screen: Planet Earth / Nature',
      handRaiseAgreement: true,
      organicTea: 'Organic Tulsi Chamomile',
      numbingPreference: 'The Wand® Computer Numbing',
      anxietyScore: 2,
      specialNotes: 'Prefers warm water ultrasonic tip and extra gentle gum check'
    },
    status: 'Confirmed',
    createdAt: '2026-10-01T09:30:00Z'
  },
  {
    id: 'SRN-NOIDA-712894',
    patientName: 'Vikram Sethi',
    patientEmail: 'vikram.sethi@example.in',
    patientPhone: '+91 98711 99283',
    treatmentId: 'gentle-root-canal',
    treatmentName: 'Microscopic Single-Sitting Rotary Root Canal (RCT)',
    dentist: 'Dr. Anjali Bhardwaj, BDS, MDS',
    date: '2026-10-14',
    timeSlot: '2:00 PM',
    comfortPreferences: {
      aromatherapy: 'Sweet Bergamot',
      weightedBlanket: '15-lb Deep Pressure',
      audioStreaming: 'Bose QuietComfort + Spotify Calm',
      handRaiseAgreement: true,
      organicTea: 'Kashmiri Kahwa Green Tea',
      numbingPreference: 'The Wand® Computer Numbing',
      anxietyScore: 4,
      specialNotes: 'Severe fear of drill sounds; requested Bose headphones with high volume'
    },
    status: 'Confirmed',
    createdAt: '2026-10-08T14:20:00Z'
  },
  {
    id: 'SRN-NOIDA-938120',
    patientName: 'Rohit Agrawal',
    patientEmail: 'rohit.agrawal@example.in',
    patientPhone: '+91 99100 48291',
    treatmentId: 'invisalign-aligners',
    treatmentName: 'Invisalign® & Clear Orthodontic Aligners',
    dentist: 'Dr. Anjali Bhardwaj, BDS, MDS',
    date: '2026-10-16',
    timeSlot: '10:30 AM',
    comfortPreferences: {
      aromatherapy: 'French Lavender',
      weightedBlanket: 'None',
      audioStreaming: 'Silence',
      handRaiseAgreement: true,
      organicTea: 'Fresh Tender Coconut Water',
      numbingPreference: 'Discuss at consult',
      anxietyScore: 1,
      specialNotes: '3D scan follow-up for aligner tray delivery'
    },
    status: 'Confirmed',
    createdAt: '2026-10-09T11:15:00Z'
  }
];

function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Could not save to ${key}:`, e);
  }
}

export const api = {
  // --- Consultations / Bookings ---
  async getConsultations(): Promise<Appointment[]> {
    // 1. Try Firestore
    if (db) {
      try {
        const snap = await getDocs(collection(db, 'consultations'));
        if (!snap.empty) {
          const list = snap.docs.map(d => d.data() as Appointment);
          setStored(STORAGE_KEYS.CONSULTATIONS, list);
          return list;
        }
      } catch (err) {
        console.warn('Firestore getConsultations error, trying API/cache:', err);
      }
    }

    // 2. Try Local Express API
    try {
      const res = await fetch('/api/consultations');
      if (res.ok) {
        const data = await res.json();
        setStored(STORAGE_KEYS.CONSULTATIONS, data);
        return data;
      }
    } catch {
      // Backend unavailable; fallback to storage
    }

    // 3. Fallback to localStorage / seed
    return getStored(STORAGE_KEYS.CONSULTATIONS, INITIAL_CONSULTATIONS);
  },

  async addConsultation(appt: Appointment): Promise<Appointment> {
    const current = getStored<Appointment[]>(STORAGE_KEYS.CONSULTATIONS, INITIAL_CONSULTATIONS);
    const updated = [appt, ...current];
    setStored(STORAGE_KEYS.CONSULTATIONS, updated);

    // 1. Try Firestore
    if (db) {
      try {
        await setDoc(doc(db, 'consultations', appt.id), appt);
        console.log('Consultation saved to Firestore:', appt.id);
      } catch (err) {
        console.warn('Firestore addConsultation failed, trying API:', err);
      }
    }

    // 2. Try Local Express API
    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appt)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Offline fallback succeeded
    }

    return appt;
  },

  async updateConsultationStatus(id: string, status: 'Confirmed' | 'Completed' | 'Rescheduled' | 'Cancelled'): Promise<void> {
    const current = getStored<Appointment[]>(STORAGE_KEYS.CONSULTATIONS, INITIAL_CONSULTATIONS);
    const updated = current.map((c) => (c.id === id ? { ...c, status } : c));
    setStored(STORAGE_KEYS.CONSULTATIONS, updated);

    // 1. Try Firestore
    if (db) {
      try {
        await updateDoc(doc(db, 'consultations', id), { status });
      } catch (err) {
        console.warn('Firestore update status notice:', err);
      }
    }

    // 2. Try Express API
    try {
      await fetch(`/api/consultations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch {
      // Storage fallback succeeded
    }
  },

  // Real-time listener for consultations
  subscribeConsultations(onUpdate: (consultations: Appointment[]) => void): Unsubscribe | null {
    if (!db) return null;
    try {
      const q = query(collection(db, 'consultations'), orderBy('createdAt', 'desc'));
      return onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(doc => doc.data() as Appointment);
        if (list.length > 0) {
          setStored(STORAGE_KEYS.CONSULTATIONS, list);
          onUpdate(list);
        }
      }, (err) => {
        console.warn('Firestore subscription notice:', err);
      });
    } catch {
      return null;
    }
  },

  // --- Reviews Management ---
  async getReviews(approvedOnly = true): Promise<Review[]> {
    // 1. Try Firestore
    if (db) {
      try {
        const snap = await getDocs(collection(db, 'reviews'));
        if (!snap.empty) {
          let list = snap.docs.map(d => d.data() as Review);
          if (approvedOnly) {
            list = list.filter(r => r.approved !== false);
          }
          setStored(STORAGE_KEYS.REVIEWS, list);
          return list;
        }
      } catch (err) {
        console.warn('Firestore getReviews notice:', err);
      }
    }

    // 2. Try Express API
    try {
      const res = await fetch(`/api/reviews${approvedOnly ? '?approved_only=true' : ''}`);
      if (res.ok) {
        const data = await res.json();
        setStored(STORAGE_KEYS.REVIEWS, data);
        return data;
      }
    } catch {
      // Fallback to cache
    }

    const stored = getStored<Review[]>(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
    if (approvedOnly) {
      return stored.filter((r) => r.approved !== false);
    }
    return stored;
  },

  async addReview(newRev: Omit<Review, 'id'>): Promise<Review> {
    const review: Review = {
      id: `rev-${Date.now()}`,
      approved: true,
      ...newRev
    };

    const current = getStored<Review[]>(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
    const updated = [review, ...current];
    setStored(STORAGE_KEYS.REVIEWS, updated);

    // 1. Try Firestore
    if (db) {
      try {
        await setDoc(doc(db, 'reviews', review.id), review);
      } catch (err) {
        console.warn('Firestore addReview notice:', err);
      }
    }

    // 2. Try Express API
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Storage fallback succeeded
    }

    return review;
  },

  async toggleReviewApproval(id: string, approved: boolean): Promise<void> {
    const current = getStored<Review[]>(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
    const updated = current.map((r) => (r.id === id ? { ...r, approved } : r));
    setStored(STORAGE_KEYS.REVIEWS, updated);

    if (db) {
      try {
        await updateDoc(doc(db, 'reviews', id), { approved });
      } catch (err) {
        console.warn('Firestore toggleReview notice:', err);
      }
    }

    try {
      await fetch(`/api/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved })
      });
    } catch {
      // Storage fallback succeeded
    }
  },

  async deleteReview(id: string): Promise<void> {
    const current = getStored<Review[]>(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
    const updated = current.filter((r) => r.id !== id);
    setStored(STORAGE_KEYS.REVIEWS, updated);

    if (db) {
      try {
        await deleteDoc(doc(db, 'reviews', id));
      } catch (err) {
        console.warn('Firestore deleteReview notice:', err);
      }
    }

    try {
      await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
    } catch {
      // Storage fallback succeeded
    }
  },

  // --- Services / Treatments Dynamic Pricing ---
  async getServices(): Promise<Treatment[]> {
    if (db) {
      try {
        const snap = await getDocs(collection(db, 'services'));
        if (!snap.empty) {
          const list = snap.docs.map(d => d.data() as Treatment);
          setStored(STORAGE_KEYS.SERVICES, list);
          return list;
        }
      } catch (err) {
        console.warn('Firestore getServices notice:', err);
      }
    }

    try {
      const res = await fetch('/api/services');
      if (res.ok) {
        const data = await res.json();
        setStored(STORAGE_KEYS.SERVICES, data);
        return data;
      }
    } catch {
      // Fallback
    }

    return getStored<Treatment[]>(STORAGE_KEYS.SERVICES, DEFAULT_TREATMENTS);
  },

  async updateServicePrice(id: string, priceStarting: number): Promise<void> {
    const current = getStored<Treatment[]>(STORAGE_KEYS.SERVICES, DEFAULT_TREATMENTS);
    const updated = current.map((s) => (s.id === id ? { ...s, priceStarting } : s));
    setStored(STORAGE_KEYS.SERVICES, updated);

    if (db) {
      try {
        await updateDoc(doc(db, 'services', id), { priceStarting });
      } catch (err) {
        console.warn('Firestore updateServicePrice notice:', err);
      }
    }

    try {
      await fetch(`/api/services/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceStarting })
      });
    } catch {
      // Storage fallback succeeded
    }
  },

  // --- Multi-Channel Notification Dispatch Helpers ---
  generateWhatsAppLink(appt: Appointment, targetNumber = '+919810739638'): string {
    const cleanNumber = targetNumber.replace(/[^0-9]/g, '');
    const msg = [
      `*New Appointment Booking - Serene Dental Studio, Noida*`,
      `*Patient:* ${appt.patientName}`,
      `*Phone:* ${appt.patientPhone}`,
      `*Email:* ${appt.patientEmail || 'Not provided'}`,
      `*Doctor:* ${appt.dentist}`,
      `*Procedure:* ${appt.treatmentName}`,
      `*Date & Time:* ${appt.date} at ${appt.timeSlot}`,
      `*Anxiety Level:* ${appt.comfortPreferences?.anxietyScore || 1}/5`,
      `*Sensory Tray:* ${appt.comfortPreferences?.aromatherapy || 'Lavender'}, ${appt.comfortPreferences?.organicTea || 'Tulsi Tea'}`,
      appt.comfortPreferences?.specialNotes ? `*Notes:* ${appt.comfortPreferences.specialNotes}` : '',
      `*Booking Ref:* ${appt.id}`
    ].filter(Boolean).join('\n');

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
  },

  generatePatientConfirmationWhatsAppLink(appt: Appointment): string {
    const cleanNumber = (appt.patientPhone || '').replace(/[^0-9]/g, '');
    const msg = [
      `Namaste ${appt.patientName}!`,
      `Your calm appointment at *Serene Dental Studio, Sector 18, Noida* with ${appt.dentist} is confirmed.`,
      `📅 *Date:* ${appt.date}`,
      `⏰ *Time Slot:* ${appt.timeSlot}`,
      `🌿 *Sensory Tray:* Prepped with ${appt.comfortPreferences?.aromatherapy || 'Aromatherapy'} & ${appt.comfortPreferences?.organicTea || 'Herbal Tea'}.`,
      `📍 *Location:* Suite 402, Ocean Heights, Sector 18, Noida (Metro Gate 2, Free Validated Parking).`,
      `We look forward to giving you a gentle, anxiety-free experience.`
    ].join('\n');

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
  },

  generateEmailAlertMailto(appt: Appointment, clinicEmail = 'reception@serenedental.in'): string {
    const subject = encodeURIComponent(`[Booking Alert] ${appt.patientName} - ${appt.date} ${appt.timeSlot} (${appt.treatmentName})`);
    const body = encodeURIComponent(
      `Patient Name: ${appt.patientName}\n` +
      `Phone Number: ${appt.patientPhone}\n` +
      `Email: ${appt.patientEmail}\n` +
      `Doctor: ${appt.dentist}\n` +
      `Procedure: ${appt.treatmentName}\n` +
      `Date & Time: ${appt.date} at ${appt.timeSlot}\n` +
      `Anxiety Rating (1-5): ${appt.comfortPreferences?.anxietyScore || 1}\n` +
      `Aromatherapy: ${appt.comfortPreferences?.aromatherapy}\n` +
      `Weighted Blanket: ${appt.comfortPreferences?.weightedBlanket}\n` +
      `Tea Choice: ${appt.comfortPreferences?.organicTea}\n` +
      `Notes: ${appt.comfortPreferences?.specialNotes || 'None'}\n` +
      `Booking ID: ${appt.id}\n`
    );
    return `mailto:${clinicEmail}?subject=${subject}&body=${body}`;
  },

  // --- Admin Authentication ---
  async adminLogin(credential: string): Promise<{ success: boolean; message: string }> {
    const valid = credential === '1804' || credential === 'serene@noida18';

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: credential, password: credential })
      });
      if (res.ok) {
        const data = await res.json();
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
        return { success: true, message: data.message };
      }
    } catch {
      // Local fallback
    }

    if (valid) {
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
      return { success: true, message: 'Admin access granted' };
    }

    return { success: false, message: 'Invalid Admin PIN or Password. (Default PIN: 1804)' };
  },

  isAdminAuthenticated(): boolean {
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true';
  },

  adminLogout(): void {
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  }
};

export type NavigationTab = 
  | 'home' 
  | 'treatments-and-services' 
  | 'book-appointment' 
  | 'patient-portal'
  | 'admin-portal';

export interface Treatment {
  id: string;
  name: string;
  category: 'Preventative' | 'Restorative' | 'Cosmetic' | 'Sedation' | 'Emergency';
  turnaround: string;
  priceStarting: number;
  priceNote?: string;
  description: string;
  gentleFeature: string;
  icon: string;
  isPopular?: boolean;
  priority?: boolean;
}

export interface ComfortPreferences {
  aromatherapy: 'French Lavender' | 'Sweet Bergamot' | 'Eucalyptus Peppermint' | 'Unscented';
  weightedBlanket: '12-lb Plush' | '15-lb Deep Pressure' | 'None';
  audioStreaming: 'Ocean & Forest Soundscapes' | 'Bose QuietComfort + Spotify Calm' | 'Ceiling Screen: Planet Earth / Nature' | 'Ceiling Screen: Netflix / Shows' | 'Silence';
  handRaiseAgreement: boolean;
  organicTea: 'Organic Tulsi Chamomile' | 'Kashmiri Kahwa Green Tea' | 'Organic Peppermint Refresh' | 'Fresh Tender Coconut Water' | 'Unsweetened Masala Chai' | 'None';
  numbingPreference: 'The Wand® Computer Numbing' | 'Micro-Needle with Profound Gel' | 'Nitrous Oxide (Laughing Gas)' | 'Discuss at consult';
  anxietyScore: number; // 1 (mild) to 5 (extreme panic)
  specialNotes?: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  treatmentId: string;
  treatmentName: string;
  dentist: string;
  date: string;
  timeSlot: string;
  comfortPreferences: ComfortPreferences;
  status: 'Confirmed' | 'Completed' | 'Rescheduled' | 'Cancelled';
  createdAt: string;
  calendarLink?: string;
}

export interface Review {
  id: string;
  name: string;
  initials: string;
  location: string;
  treatment: string;
  rating: number;
  text: string;
  date: string;
  approved?: boolean;
}

export interface AdminSession {
  isAuthenticated: boolean;
  token?: string;
  loggedInAt?: string;
}

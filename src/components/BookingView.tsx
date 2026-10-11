import React, { useState } from 'react';
import { TREATMENTS } from '../data/treatments';
import { Appointment, ComfortPreferences, Treatment } from '../types';
import { api } from '../services/api';

interface BookingViewProps {
  initialTreatmentId?: string;
  defaultPreferences: ComfortPreferences;
  onAppointmentBooked: (appt: Appointment) => void;
  onNavigateToPortal: () => void;
  treatments?: Treatment[];
}

export const BookingView: React.FC<BookingViewProps> = ({
  initialTreatmentId,
  defaultPreferences,
  onAppointmentBooked,
  onNavigateToPortal,
  treatments = TREATMENTS
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string>(
    initialTreatmentId || 'calm-consultation'
  );
  const [selectedDentist, setSelectedDentist] = useState<string>('Dr. Anjali Bhardwaj, BDS, MDS');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-14');
  const [selectedTime, setSelectedTime] = useState<string>('11:00 AM');
  const [preferences, setPreferences] = useState<ComfortPreferences>(defaultPreferences);

  // Patient Info
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState<Appointment | null>(null);

  const availableTreatments = treatments || TREATMENTS;
  const currentTreatment = availableTreatments.find((t) => t.id === selectedTreatmentId) || availableTreatments[0];

  const timeSlots = [
    '9:30 AM', '10:30 AM', '11:30 AM', '12:30 PM', 
    '2:00 PM', '3:30 PM', '5:00 PM', '6:30 PM'
  ];

  const dentists = [
    {
      name: 'Dr. Anjali Bhardwaj, BDS, MDS',
      title: 'Founder & Chief Dental Surgeon (Sedation & Prosthodontics, DCI Reg. 34892)',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7sb8YtVI6DDCeFeDKf-OgO-rNkLaqtMq8voGqPqgYsM0Ek7snTu6aD5tTvuZvOh11J0QjtfwmWDJleAIyolRX_JU3-u-DI_BBGAhM1P_4FGMSzegoEYMXdMmyLsw2ee7QGnh7L3b7CTNp3QEOc3-Ynxl8iRCjjSU4dmqgoVdyt5cDVFJ0IQ0mYcVQ8Lh9OIfAYHdR8zOPqZ6B2wg27AHn1IezRl5gXghv0hEHiMej'
    },
    {
      name: 'Dr. Rohan Sharma, BDS, MDS',
      title: 'Associate Consultant (Micro-Endodontics & Restorative Dentistry)',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const handleCompleteBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const newAppt: Appointment = {
      id: `SRN-NOIDA-${Math.floor(100000 + Math.random() * 900000)}`,
      patientName: patientName || 'Valued Patient',
      patientEmail: patientEmail || 'patient@example.com',
      patientPhone: patientPhone || '+91 98000 00000',
      treatmentId: currentTreatment.id,
      treatmentName: currentTreatment.name,
      dentist: selectedDentist,
      date: selectedDate,
      timeSlot: selectedTime,
      comfortPreferences: {
        ...preferences,
        specialNotes: notes
      },
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    setBookedAppointment(newAppt);
    onAppointmentBooked(newAppt);
    setHasConfirmed(true);
  };

  const handleDownloadCalendar = () => {
    if (!bookedAppointment) return;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Serene Dental Studio Noida//Appointment//EN
BEGIN:VEVENT
SUMMARY:Dental Visit: ${bookedAppointment.treatmentName} with ${bookedAppointment.dentist}
DESCRIPTION:Serene Dental Studio appointment with Dr. Anjali Bhardwaj. Sensory comfort tray reserved. Validated parking at Sector 18 Noida.
LOCATION:Suite 402, Ocean Heights, Sector 18, Noida, UP 201301
DTSTART:${bookedAppointment.date.replace(/-/g, '')}T110000Z
DTEND:${bookedAppointment.date.replace(/-/g, '')}T120000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Serene-Dental-Noida-${bookedAppointment.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (hasConfirmed && bookedAppointment) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 animate-fadeIn">
        <div className="bg-[#ffffff] rounded-3xl p-8 md:p-12 shadow-xl border border-[#92f7c3] text-center">
          <div className="w-16 h-16 rounded-full bg-[#92f7c3] text-[#0f5238] flex items-center justify-center mx-auto mb-6 shadow-md">
            <span className="material-symbols-outlined text-[36px]">check_circle</span>
          </div>

          <span className="text-[12px] font-bold uppercase tracking-wider text-[#0f5238] bg-[#92f7c3]/40 px-3 py-1 rounded-full">
            Appointment Confirmed • Noida Clinic
          </span>

          <h2 className="text-[32px] font-bold text-[#181c20] font-['Plus_Jakarta_Sans'] mt-3 mb-2">
            Dr. Anjali Bhardwaj &amp; Team are ready for you
          </h2>
          <p className="text-[15px] text-[#404943] max-w-lg mx-auto mb-8">
            Your appointment has been confirmed. A WhatsApp &amp; SMS confirmation message has been dispatched to {bookedAppointment.patientPhone}.
          </p>

          {/* Ticket Details Card */}
          <div className="bg-[#f1f4f9] rounded-2xl p-6 text-left border border-[#e5e8ee] mb-8 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#e5e8ee]">
              <span className="text-xs text-[#707973] uppercase font-bold">Booking Reference (DCI Audit)</span>
              <span className="text-sm font-mono font-bold text-[#0f5238] bg-white px-2.5 py-1 rounded border">
                {bookedAppointment.id}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-[#707973] block">Procedure:</span>
                <span className="font-bold text-[#181c20]">{bookedAppointment.treatmentName}</span>
              </div>
              <div>
                <span className="text-xs text-[#707973] block">Dental Surgeon:</span>
                <span className="font-bold text-[#181c20]">{bookedAppointment.dentist}</span>
              </div>
              <div>
                <span className="text-xs text-[#707973] block">Date &amp; Time:</span>
                <span className="font-bold text-[#181c20]">
                  {bookedAppointment.date} at {bookedAppointment.timeSlot}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#707973] block">Location:</span>
                <span className="font-semibold text-[#181c20]">Suite 402, Ocean Heights, Sector 18, Noida</span>
              </div>
            </div>

            {/* Selected Comfort Summary */}
            <div className="pt-3 border-t border-[#e5e8ee] text-xs text-[#404943]">
              <span className="font-bold text-[#0f5238] block mb-1">Your Prepared Sensory Tray:</span>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-white rounded border">
                  Scent: {bookedAppointment.comfortPreferences.aromatherapy}
                </span>
                <span className="px-2 py-1 bg-white rounded border">
                  Blanket: {bookedAppointment.comfortPreferences.weightedBlanket}
                </span>
                <span className="px-2 py-1 bg-white rounded border">
                  Audio: {bookedAppointment.comfortPreferences.audioStreaming}
                </span>
                <span className="px-2 py-1 bg-white rounded border">
                  Welcome Drink: {bookedAppointment.comfortPreferences.organicTea}
                </span>
              </div>
            </div>
          </div>

          {/* Multi-Channel Alerts & Action buttons */}
          <div className="flex flex-col gap-3 max-w-md mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={api.generateWhatsAppLink(bookedAppointment)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-xl font-semibold text-xs hover:bg-[#128C7E] transition-all shadow-md active:scale-95"
                title="Send instant WhatsApp booking alert to Dr. Anjali Bhardwaj and clinic reception"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Send WhatsApp Alert to Clinic</span>
              </a>

              <a
                href={api.generateEmailAlertMailto(bookedAppointment)}
                className="inline-flex items-center gap-2 bg-[#0f5238] text-white px-5 py-3 rounded-xl font-semibold text-xs hover:bg-[#002113] transition-all shadow-md active:scale-95"
                title="Send email confirmation receipt to clinic reception"
              >
                <span className="material-symbols-outlined text-[18px]">mail</span>
                <span>Email Reception Alert</span>
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <button
                onClick={handleDownloadCalendar}
                className="inline-flex items-center gap-1.5 bg-[#f1f4f9] text-[#181c20] px-4 py-2.5 rounded-xl font-semibold text-xs hover:bg-[#e5e8ee] transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">calendar_add_on</span>
                <span>Add to Calendar (.ics)</span>
              </button>

              <button
                onClick={onNavigateToPortal}
                className="inline-flex items-center gap-1.5 bg-white text-[#0f5238] border border-[#0f5238]/40 px-4 py-2.5 rounded-xl font-semibold text-xs hover:bg-[#f1f4f9] transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">person</span>
                <span>View Patient Portal</span>
              </button>
            </div>

            <button
              onClick={() => {
                setHasConfirmed(false);
                setStep(1);
              }}
              className="text-xs text-[#707973] hover:underline block w-full mt-3"
            >
              Book another appointment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-xl mx-auto mb-4">
          {[
            { num: 1, label: 'Service' },
            { num: 2, label: 'Doctor & Slot' },
            { num: 3, label: 'Comfort Tray' },
            { num: 4, label: 'Patient Info' }
          ].map((st) => (
            <div key={st.num} className="flex flex-col items-center flex-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === st.num
                    ? 'bg-[#0f5238] text-white ring-4 ring-[#b1f0ce]'
                    : step > st.num
                    ? 'bg-[#2d6a4f] text-white'
                    : 'bg-[#e5e8ee] text-[#707973]'
                }`}
              >
                {step > st.num ? '✓' : st.num}
              </div>
              <span className={`text-[11px] font-semibold mt-1 ${
                step === st.num ? 'text-[#0f5238]' : 'text-[#707973]'
              }`}>
                {st.label}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full bg-[#e5e8ee] h-1 rounded-full overflow-hidden">
          <div 
            className="bg-[#2d6a4f] h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-[#ffffff] rounded-3xl p-6 md:p-10 shadow-lg border border-[#e5e8ee]">
        {/* Step 1: Select Service */}
        {step === 1 && (
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold text-[#0f5238] uppercase tracking-wider">Step 1 of 4</span>
              <h2 className="text-[26px] font-bold text-[#181c20] font-['Plus_Jakarta_Sans']">
                What procedure or consultation do you need?
              </h2>
              <p className="text-sm text-[#404943] mt-1">
                Select your primary visit reason. Every consultation includes our zero-judgment, anxiety-free protocol.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              {TREATMENTS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTreatmentId(t.id)}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    selectedTreatmentId === t.id
                      ? 'border-[#0f5238] bg-[#2d6a4f]/10 ring-2 ring-[#0f5238]'
                      : 'border-[#e5e8ee] hover:bg-[#f1f4f9]'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    selectedTreatmentId === t.id ? 'bg-[#0f5238] text-white' : 'bg-[#e5e8ee] text-[#0f5238]'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">{t.icon}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-[14px] font-bold text-[#181c20] leading-tight font-['Plus_Jakarta_Sans']">
                        {t.name}
                      </h4>
                      {t.isPopular && (
                        <span className="text-[10px] bg-[#92f7c3] text-[#005235] px-1.5 py-0.5 rounded font-bold">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-[#404943] line-clamp-2 mt-1">
                      {t.description}
                    </p>
                    <span className="text-[12px] text-[#0f5238] font-bold mt-1 block">
                      ₹{t.priceStarting.toLocaleString('en-IN')} {t.priceNote && <span className="font-normal text-[#707973] text-[11px]">• {t.priceNote}</span>}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="bg-[#2d6a4f] hover:bg-[#0f5238] text-white px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-1.5"
              >
                <span>Continue to Doctor &amp; Slot</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Date & Clinician */}
        {step === 2 && (
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold text-[#0f5238] uppercase tracking-wider">Step 2 of 4</span>
              <h2 className="text-[26px] font-bold text-[#181c20] font-['Plus_Jakarta_Sans']">
                Select Dental Surgeon &amp; Time
              </h2>
              <p className="text-sm text-[#404943] mt-1">
                We never double-book appointments. Your consultation slot is exclusively reserved for you.
              </p>
            </div>

            {/* Clinician selection */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-[#181c20] mb-3">
                Select Your Clinician
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dentists.map((d) => (
                  <button
                    key={d.name}
                    type="button"
                    onClick={() => setSelectedDentist(d.name)}
                    className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      selectedDentist === d.name
                        ? 'border-[#0f5238] bg-[#2d6a4f]/10 ring-2 ring-[#0f5238]'
                        : 'border-[#e5e8ee] hover:bg-[#f1f4f9]'
                    }`}
                  >
                    <img
                      src={d.image}
                      alt={d.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-[#181c20]">{d.name}</h4>
                      <p className="text-xs text-[#404943] leading-snug">{d.title}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Picker */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-bold text-[#181c20] mb-2">
                  Select Consultation Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min="2026-10-11"
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-[#f1f4f9] border border-[#bfc9c1]/80 rounded-xl px-4 py-3 text-sm text-[#181c20] focus:ring-2 focus:ring-[#0f5238] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#181c20] mb-2">
                  Select Preferred Slot
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                        selectedTime === time
                          ? 'border-[#0f5238] bg-[#0f5238] text-white shadow-sm'
                          : 'border-[#e5e8ee] bg-[#f1f4f9] text-[#181c20] hover:bg-[#e5e8ee]'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-xl border border-[#bfc9c1] text-[#404943] text-sm font-semibold hover:bg-[#f1f4f9]"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="bg-[#2d6a4f] hover:bg-[#0f5238] text-white px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-1.5"
              >
                <span>Customize Comfort Tray</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Sensory Comfort Tray */}
        {step === 3 && (
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold text-[#0f5238] uppercase tracking-wider">Step 3 of 4</span>
              <h2 className="text-[26px] font-bold text-[#181c20] font-['Plus_Jakarta_Sans']">
                Your Bespoke Sensory Tray
              </h2>
              <p className="text-sm text-[#404943] mt-1">
                Customize calming elements for your chair in Noida. All amenities are 100% complimentary.
              </p>
            </div>

            <div className="space-y-6 mb-8">
              {/* Aromatherapy */}
              <div>
                <label className="block text-sm font-bold text-[#181c20] mb-2">
                  1. Aromatherapy Diffuser Scent
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['French Lavender', 'Sweet Bergamot', 'Eucalyptus Peppermint', 'Unscented'] as const).map((sc) => (
                    <button
                      key={sc}
                      type="button"
                      onClick={() => setPreferences({ ...preferences, aromatherapy: sc })}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                        preferences.aromatherapy === sc
                          ? 'border-[#0f5238] bg-[#2d6a4f]/10 text-[#0f5238] ring-1 ring-[#0f5238]'
                          : 'border-[#e5e8ee] hover:bg-[#f1f4f9] text-[#404943]'
                      }`}
                    >
                      {sc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Blanket */}
              <div>
                <label className="block text-sm font-bold text-[#181c20] mb-2">
                  2. Weighted Blanket
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['12-lb Plush', '15-lb Deep Pressure', 'None'] as const).map((wb) => (
                    <button
                      key={wb}
                      type="button"
                      onClick={() => setPreferences({ ...preferences, weightedBlanket: wb })}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                        preferences.weightedBlanket === wb
                          ? 'border-[#0f5238] bg-[#2d6a4f]/10 text-[#0f5238] ring-1 ring-[#0f5238]'
                          : 'border-[#e5e8ee] hover:bg-[#f1f4f9] text-[#404943]'
                      }`}
                    >
                      {wb}
                    </button>
                  ))}
                </div>
              </div>

              {/* Streaming */}
              <div>
                <label className="block text-sm font-bold text-[#181c20] mb-2">
                  3. Noise-Cancelling Audio &amp; Overhead Screen
                </label>
                <div className="space-y-2">
                  {([
                    'Bose QuietComfort + Spotify Calm',
                    'Ocean & Forest Soundscapes',
                    'Ceiling Screen: Planet Earth / Nature',
                    'Silence'
                  ] as const).map((aud) => (
                    <button
                      key={aud}
                      type="button"
                      onClick={() => setPreferences({ ...preferences, audioStreaming: aud })}
                      className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                        preferences.audioStreaming === aud
                          ? 'border-[#0f5238] bg-[#2d6a4f]/10 text-[#0f5238] ring-1 ring-[#0f5238]'
                          : 'border-[#e5e8ee] hover:bg-[#f1f4f9] text-[#404943]'
                      }`}
                    >
                      {aud}
                    </button>
                  ))}
                </div>
              </div>

              {/* Welcome Beverage */}
              <div>
                <label className="block text-sm font-bold text-[#181c20] mb-2">
                  4. Herbal Tea or Fresh Beverage on Arrival
                </label>
                <select
                  value={preferences.organicTea}
                  onChange={(e) => setPreferences({ ...preferences, organicTea: e.target.value as any })}
                  className="w-full bg-[#f1f4f9] border border-[#bfc9c1]/80 rounded-xl p-3 text-xs text-[#181c20] focus:ring-2 focus:ring-[#0f5238] focus:outline-none"
                >
                  <option value="Organic Tulsi Chamomile">Organic Tulsi Chamomile (Caffeine-Free)</option>
                  <option value="Kashmiri Kahwa Green Tea">Authentic Kashmiri Kahwa with Saffron &amp; Cardamom</option>
                  <option value="Organic Peppermint Refresh">Organic Peppermint Refresh</option>
                  <option value="Fresh Tender Coconut Water">Fresh Tender Coconut Water</option>
                  <option value="Unsweetened Masala Chai">Handcrafted Ginger Masala Chai</option>
                  <option value="None">Just Pure Water or None</option>
                </select>
              </div>

              {/* Hand Raise Guarantee Check */}
              <div className="p-4 bg-[#92f7c3]/30 rounded-2xl border border-[#92f7c3] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#0f5238]">front_hand</span>
                  <div>
                    <p className="text-xs font-bold text-[#0f5238]">Hand-Raise Immediate Pause Agreement</p>
                    <p className="text-[11px] text-[#404943]">Dr. Anjali pauses whenever you raise your finger.</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.handRaiseAgreement}
                  onChange={(e) => setPreferences({ ...preferences, handRaiseAgreement: e.target.checked })}
                  className="w-5 h-5 accent-[#0f5238] cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl border border-[#bfc9c1] text-[#404943] text-sm font-semibold hover:bg-[#f1f4f9]"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="bg-[#2d6a4f] hover:bg-[#0f5238] text-white px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-1.5"
              >
                <span>Continue to Details</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Patient Info & Anxiety Rating */}
        {step === 4 && (
          <form onSubmit={handleCompleteBooking}>
            <div className="mb-6">
              <span className="text-xs font-bold text-[#0f5238] uppercase tracking-wider">Step 4 of 4</span>
              <h2 className="text-[26px] font-bold text-[#181c20] font-['Plus_Jakarta_Sans']">
                Patient Contact &amp; Gentle Notes
              </h2>
              <p className="text-sm text-[#404943] mt-1">
                Tell us anything that might help you feel comfortable. No judgment, ever.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-[#181c20] mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-[#f1f4f9] border border-[#bfc9c1]/80 rounded-xl px-4 py-3 text-sm text-[#181c20] focus:ring-2 focus:ring-[#0f5238] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#181c20] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="rahul@example.com"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full bg-[#f1f4f9] border border-[#bfc9c1]/80 rounded-xl px-4 py-3 text-sm text-[#181c20] focus:ring-2 focus:ring-[#0f5238] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#181c20] mb-1">Mobile Phone (WhatsApp &amp; SMS) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98123 45678"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full bg-[#f1f4f9] border border-[#bfc9c1]/80 rounded-xl px-4 py-3 text-sm text-[#181c20] focus:ring-2 focus:ring-[#0f5238] focus:outline-none"
                  />
                </div>
              </div>

              {/* Anxiety score */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-[#181c20]">
                    Dental Anxiety Self-Score: {preferences.anxietyScore} / 5
                  </label>
                  <span className="text-[11px] text-[#0f5238] font-bold">
                    {preferences.anxietyScore >= 4 ? 'Gentle Extra-Care Protocol Flagged' : 'Standard Calm Care'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={preferences.anxietyScore}
                  onChange={(e) => setPreferences({ ...preferences, anxietyScore: parseInt(e.target.value) })}
                  className="w-full accent-[#0f5238] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#181c20] mb-1">
                  Anything you’d like Dr. Anjali Bhardwaj to know beforehand?
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Haven't visited a dentist in 5 years, sensitive gag reflex, needle phobia, previous traumatic extraction..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#f1f4f9] border border-[#bfc9c1]/80 rounded-xl px-4 py-3 text-sm text-[#181c20] focus:ring-2 focus:ring-[#0f5238] focus:outline-none"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl border border-[#bfc9c1] text-[#404943] text-sm font-semibold hover:bg-[#f1f4f9]"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-[#2d6a4f] hover:bg-[#0f5238] text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 flex items-center gap-1.5"
              >
                <span>Confirm &amp; Book Appointment</span>
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

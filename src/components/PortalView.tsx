import React, { useState } from 'react';
import { Appointment, ComfortPreferences } from '../types';

interface PortalViewProps {
  appointments: Appointment[];
  preferences: ComfortPreferences;
  onUpdatePreferences: (prefs: ComfortPreferences) => void;
  onCancelAppointment: (id: string) => void;
  onOpenBooking: () => void;
}

export const PortalView: React.FC<PortalViewProps> = ({
  appointments,
  preferences,
  onUpdatePreferences,
  onCancelAppointment,
  onOpenBooking
}) => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'comfort-tray' | 'messages' | 'forms'>('appointments');
  const [localPrefs, setLocalPrefs] = useState<ComfortPreferences>(preferences);
  const [prefsSaved, setPrefsSaved] = useState(false);

  // Calming message box
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'doctor'; text: string; time: string }>>([
    {
      sender: 'doctor',
      text: 'Namaste! I am Dr. Anjali Bhardwaj. Welcome to your Serene Dental portal. If you feel nervous about your upcoming appointment or want to discuss any sensitivity beforehand, you can message me directly here.',
      time: '10:14 AM'
    }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: messageInput,
      time: 'Just now'
    };
    setMessages((prev) => [...prev, userMsg]);
    setMessageInput('');

    // Compassionate doctor reply simulation
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'doctor' as const,
          text: 'Thank you for letting me know! I have updated your chart. We will have your room prepped with soothing aromatherapy and take as many pauses as you need.',
          time: 'Just now'
        }
      ]);
    }, 1200);
  };

  const handleSavePreferences = () => {
    onUpdatePreferences(localPrefs);
    setPrefsSaved(true);
    setTimeout(() => setPrefsSaved(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Patient Header Banner */}
      <div className="bg-[#ffffff] rounded-3xl p-8 md:p-10 shadow-sm border border-[#e5e8ee] mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7sb8YtVI6DDCeFeDKf-OgO-rNkLaqtMq8voGqPqgYsM0Ek7snTu6aD5tTvuZvOh11J0QjtfwmWDJleAIyolRX_JU3-u-DI_BBGAhM1P_4FGMSzegoEYMXdMmyLsw2ee7QGnh7L3b7CTNp3QEOc3-Ynxl8iRCjjSU4dmqgoVdyt5cDVFJ0IQ0mYcVQ8Lh9OIfAYHdR8zOPqZ6B2wg27AHn1IezRl5gXghv0hEHiMej"
            alt="Profile Avatar"
            className="w-16 h-16 rounded-full object-cover ring-4 ring-[#b1f0ce] shadow"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[24px] font-bold text-[#181c20] font-['Plus_Jakarta_Sans']">
                Welcome back, Pooja
              </h1>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#92f7c3]/60 text-[#005235]">
                Serene Member • Noida
              </span>
            </div>
            <p className="text-xs text-[#404943]">
              Patient ID: SRN-NOIDA-4821 • Primary Surgeon: Dr. Anjali Bhardwaj, BDS, MDS • Sector 18 Studio
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenBooking}
            className="bg-[#2d6a4f] hover:bg-[#0f5238] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">calendar_add_on</span>
            <span>Book New Slot</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-[#e5e8ee] gap-2 mb-8">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'appointments'
              ? 'border-[#0f5238] text-[#0f5238]'
              : 'border-transparent text-[#404943] hover:text-[#181c20]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">event</span>
          <span>Appointments ({appointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('comfort-tray')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'comfort-tray'
              ? 'border-[#0f5238] text-[#0f5238]'
              : 'border-transparent text-[#404943] hover:text-[#181c20]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">spa</span>
          <span>Sensory Comfort Tray</span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'messages'
              ? 'border-[#0f5238] text-[#0f5238]'
              : 'border-transparent text-[#404943] hover:text-[#181c20]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">forum</span>
          <span>Doctor Consultation Chat</span>
        </button>

        <button
          onClick={() => setActiveTab('forms')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'forms'
              ? 'border-[#0f5238] text-[#0f5238]'
              : 'border-transparent text-[#404943] hover:text-[#181c20]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">assignment</span>
          <span>DCI &amp; Medical Forms</span>
        </button>
      </div>

      {/* Tab 1: Appointments */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          {appointments.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-[#e5e8ee] text-center max-w-lg mx-auto">
              <span className="material-symbols-outlined text-4xl text-[#707973] mb-2">calendar_month</span>
              <h3 className="text-lg font-bold text-[#181c20]">No Scheduled Visits</h3>
              <p className="text-xs text-[#404943] mt-1 mb-6">
                Whenever you feel ready, book a gentle cleaning or 20-minute chat with Dr. Anjali.
              </p>
              <button
                onClick={onOpenBooking}
                className="bg-[#2d6a4f] text-white px-6 py-2.5 rounded-xl font-bold text-xs"
              >
                Schedule Visit
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {appointments.map((appt) => (
                <div
                  key={appt.id}
                  className="bg-white p-6 rounded-3xl border border-[#e5e8ee] shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-mono font-bold text-[#0f5238] bg-[#f1f4f9] px-2 py-0.5 rounded border">
                        {appt.id}
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#92f7c3]/60 text-[#005235]">
                        {appt.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#181c20] font-['Plus_Jakarta_Sans']">
                      {appt.treatmentName}
                    </h3>
                    <p className="text-xs text-[#404943] mb-4">With {appt.dentist}</p>

                    <div className="bg-[#f1f4f9] p-3 rounded-2xl border border-[#e5e8ee] text-xs space-y-1 mb-4">
                      <div className="flex justify-between">
                        <span className="text-[#707973]">Date:</span>
                        <strong className="text-[#181c20]">{appt.date}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#707973]">Time:</span>
                        <strong className="text-[#181c20]">{appt.timeSlot}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#707973]">Location:</span>
                        <span className="text-[#181c20]">Suite 402, Ocean Heights, Sector 18, Noida</span>
                      </div>
                    </div>

                    {/* Comfort tray preview */}
                    <div className="text-[11px] text-[#404943] space-y-1 mb-4">
                      <span className="font-bold text-[#0f5238] block">Prepped Comfort Tray:</span>
                      <p>• Scent: {appt.comfortPreferences.aromatherapy}</p>
                      <p>• Blanket: {appt.comfortPreferences.weightedBlanket}</p>
                      <p>• Audio: {appt.comfortPreferences.audioStreaming}</p>
                      <p>• Drink: {appt.comfortPreferences.organicTea}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#e5e8ee] flex items-center justify-between">
                    <span className="text-[11px] text-[#0f5238] flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-[14px]">local_parking</span>
                      Sector 18 Parking Validated
                    </span>
                    <button
                      onClick={() => onCancelAppointment(appt.id)}
                      className="text-xs text-[#ba1a1a] hover:underline font-semibold"
                    >
                      Cancel / Reschedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Comfort Tray Customizer */}
      {activeTab === 'comfort-tray' && (
        <div className="bg-white p-8 md:p-10 rounded-3xl border border-[#e5e8ee] shadow-sm max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#181c20] font-['Plus_Jakarta_Sans']">
                Default Sensory Comfort Profile
              </h2>
              <p className="text-xs text-[#404943] mt-1">
                These preferences are automatically loaded into Dr. Anjali's operatory before you enter.
              </p>
            </div>
            {prefsSaved && (
              <span className="text-xs font-bold text-[#0f5238] bg-[#92f7c3]/60 px-3 py-1 rounded-full animate-fadeIn">
                Saved!
              </span>
            )}
          </div>

          <div className="space-y-6">
            {/* Aromatherapy */}
            <div>
              <label className="block text-xs font-bold text-[#181c20] mb-2">Preferred Diffuser Scent</label>
              <div className="grid grid-cols-2 gap-2">
                {(['French Lavender', 'Sweet Bergamot', 'Eucalyptus Peppermint', 'Unscented'] as const).map((sc) => (
                  <button
                    key={sc}
                    onClick={() => setLocalPrefs({ ...localPrefs, aromatherapy: sc })}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold ${
                      localPrefs.aromatherapy === sc
                        ? 'border-[#0f5238] bg-[#2d6a4f]/10 text-[#0f5238]'
                        : 'border-[#e5e8ee] text-[#404943] hover:bg-[#f1f4f9]'
                    }`}
                  >
                    {sc}
                  </button>
                ))}
              </div>
            </div>

            {/* Blanket */}
            <div>
              <label className="block text-xs font-bold text-[#181c20] mb-2">Weighted Blanket Preference</label>
              <div className="grid grid-cols-3 gap-2">
                {(['12-lb Plush', '15-lb Deep Pressure', 'None'] as const).map((wb) => (
                  <button
                    key={wb}
                    onClick={() => setLocalPrefs({ ...localPrefs, weightedBlanket: wb })}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold ${
                      localPrefs.weightedBlanket === wb
                        ? 'border-[#0f5238] bg-[#2d6a4f]/10 text-[#0f5238]'
                        : 'border-[#e5e8ee] text-[#404943] hover:bg-[#f1f4f9]'
                    }`}
                  >
                    {wb}
                  </button>
                ))}
              </div>
            </div>

            {/* Audio */}
            <div>
              <label className="block text-xs font-bold text-[#181c20] mb-2">Audio &amp; Display Mode</label>
              <select
                value={localPrefs.audioStreaming}
                onChange={(e) => setLocalPrefs({ ...localPrefs, audioStreaming: e.target.value as any })}
                className="w-full bg-[#f1f4f9] border border-[#bfc9c1]/80 rounded-xl p-3 text-xs text-[#181c20] focus:ring-2 focus:ring-[#0f5238] focus:outline-none"
              >
                <option value="Ocean & Forest Soundscapes">Ocean &amp; Forest Soundscapes (Binaural)</option>
                <option value="Bose QuietComfort + Spotify Calm">Bose QuietComfort + Spotify Calming Beats</option>
                <option value="Ceiling Screen: Planet Earth / Nature">Ceiling 4K Screen: Planet Earth / Wildlife</option>
                <option value="Ceiling Screen: Netflix / Shows">Ceiling 4K Screen: Netflix / OTT Shows</option>
                <option value="Silence">Pure Silence</option>
              </select>
            </div>

            {/* Tea */}
            <div>
              <label className="block text-xs font-bold text-[#181c20] mb-2">Welcome Beverage on Arrival</label>
              <select
                value={localPrefs.organicTea}
                onChange={(e) => setLocalPrefs({ ...localPrefs, organicTea: e.target.value as any })}
                className="w-full bg-[#f1f4f9] border border-[#bfc9c1]/80 rounded-xl p-3 text-xs text-[#181c20] focus:ring-2 focus:ring-[#0f5238] focus:outline-none"
              >
                <option value="Organic Tulsi Chamomile">Organic Tulsi Chamomile (Caffeine-Free)</option>
                <option value="Kashmiri Kahwa Green Tea">Authentic Kashmiri Kahwa with Saffron &amp; Cardamom</option>
                <option value="Organic Peppermint Refresh">Organic Peppermint Refresh</option>
                <option value="Fresh Tender Coconut Water">Fresh Tender Coconut Water</option>
                <option value="Unsweetened Masala Chai">Handcrafted Ginger Masala Chai</option>
                <option value="None">None</option>
              </select>
            </div>

            <button
              onClick={handleSavePreferences}
              className="bg-[#2d6a4f] hover:bg-[#0f5238] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all"
            >
              Save Profile Preferences
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Direct Care Chat with Dr. Anjali Bhardwaj */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-3xl border border-[#e5e8ee] shadow-sm max-w-3xl overflow-hidden flex flex-col h-[520px]">
          <div className="p-4 bg-[#f1f4f9] border-b border-[#e5e8ee] flex items-center gap-3">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7sb8YtVI6DDCeFeDKf-OgO-rNkLaqtMq8voGqPqgYsM0Ek7snTu6aD5tTvuZvOh11J0QjtfwmWDJleAIyolRX_JU3-u-DI_BBGAhM1P_4FGMSzegoEYMXdMmyLsw2ee7QGnh7L3b7CTNp3QEOc3-Ynxl8iRCjjSU4dmqgoVdyt5cDVFJ0IQ0mYcVQ8Lh9OIfAYHdR8zOPqZ6B2wg27AHn1IezRl5gXghv0hEHiMej"
              alt="Dr. Anjali Bhardwaj"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
            />
            <div>
              <h3 className="text-sm font-bold text-[#181c20]">Dr. Anjali Bhardwaj, BDS, MDS</h3>
              <p className="text-[11px] text-[#0f5238] flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0f5238] animate-pulse"></span>
                Direct Encrypted Consultation • Active
              </p>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#f7f9ff]/50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col max-w-md ${
                  msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#2d6a4f] text-white rounded-br-none'
                      : 'bg-white border border-[#e5e8ee] text-[#181c20] rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-[#707973] mt-1 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-[#e5e8ee] flex gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Ask Dr. Anjali a question or mention a sensitivity..."
              className="flex-1 bg-[#f1f4f9] border border-[#bfc9c1]/80 rounded-xl px-4 py-2.5 text-xs text-[#181c20] focus:ring-2 focus:ring-[#0f5238] focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#2d6a4f] text-white rounded-xl text-xs font-bold hover:bg-[#0f5238] transition-all flex items-center gap-1"
            >
              <span>Send</span>
              <span className="material-symbols-outlined text-[16px]">send</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 4: Forms - DPDP & DCI compliant */}
      {activeTab === 'forms' && (
        <div className="bg-white p-8 rounded-3xl border border-[#e5e8ee] shadow-sm max-w-3xl space-y-4">
          <h2 className="text-xl font-bold text-[#181c20] font-['Plus_Jakarta_Sans']">
            Digital Health &amp; DCI Consent Forms
          </h2>
          <p className="text-xs text-[#404943]">
            Completed digitally under the Digital Personal Data Protection (DPDP) Act 2023 for seamless, paperless check-in at our Sector 18 studio.
          </p>

          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-2xl bg-[#f1f4f9] border border-[#e5e8ee] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#0f5238]">check_circle</span>
                <div>
                  <h4 className="text-xs font-bold text-[#181c20]">Patient Medical History &amp; Allergy Declaration</h4>
                  <p className="text-[11px] text-[#707973]">Verified on file • DCI Schedule II</p>
                </div>
              </div>
              <span className="text-xs text-[#0f5238] font-bold">Up to Date</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#f1f4f9] border border-[#e5e8ee] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#0f5238]">check_circle</span>
                <div>
                  <h4 className="text-xs font-bold text-[#181c20]">Zero-Panic &amp; Hand-Raise Care Agreement</h4>
                  <p className="text-[11px] text-[#707973]">Signed electronically</p>
                </div>
              </div>
              <span className="text-xs text-[#0f5238] font-bold">Active</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#f1f4f9] border border-[#e5e8ee] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#0f5238]">check_circle</span>
                <div>
                  <h4 className="text-xs font-bold text-[#181c20]">DPDP Act 2023 Medical Data Privacy Consent</h4>
                  <p className="text-[11px] text-[#707973]">Signed electronically</p>
                </div>
              </div>
              <span className="text-xs text-[#0f5238] font-bold">Active</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

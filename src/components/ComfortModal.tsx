import React from 'react';
import { COMFORT_AMENITIES, TEA_OPTIONS } from '../data/comfortMenu';
import { ComfortPreferences } from '../types';

interface ComfortModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: ComfortPreferences;
  onSavePreferences: (prefs: ComfortPreferences) => void;
  onProceedToBooking: () => void;
}

export const ComfortModal: React.FC<ComfortModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSavePreferences,
  onProceedToBooking
}) => {
  const [localPrefs, setLocalPrefs] = React.useState<ComfortPreferences>(preferences);
  const [savedToast, setSavedToast] = React.useState(false);

  React.useEffect(() => {
    setLocalPrefs(preferences);
  }, [preferences, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSavePreferences(localPrefs);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-[#ffffff] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#e5e8ee] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-[#e5e8ee] bg-[#f1f4f9] flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#92f7c3]/60 text-[#0f5238] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">spa</span>
            </div>
            <div>
              <h3 className="text-[20px] font-bold text-[#181c20] font-['Plus_Jakarta_Sans'] leading-tight">
                Your Sensory Comfort Tray
              </h3>
              <p className="text-[13px] text-[#404943]">
                Complimentary for every visit. Tailored to soothe your nervous system.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#ffffff] hover:bg-[#e5e8ee] text-[#181c20] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {savedToast && (
            <div className="p-3 bg-[#92f7c3]/50 border border-[#006c48] text-[#005236] rounded-xl text-sm font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              Sensory preferences updated successfully!
            </div>
          )}

          {/* Hand Raise Guarantee Notice */}
          <div className="bg-[#92f7c3]/30 border border-[#92f7c3] p-4 rounded-xl flex items-start gap-3">
            <span className="material-symbols-outlined text-[#0f5238] text-[24px] shrink-0">front_hand</span>
            <div>
              <p className="text-[14px] font-bold text-[#0f5238]">Zero-Panic Hand-Raise Guarantee</p>
              <p className="text-[12px] text-[#404943] mt-0.5">
                Whenever you raise your hand, our clinician pauses treatment within 2 seconds. You are always in control.
              </p>
            </div>
          </div>

          {/* Option 1: Aromatherapy */}
          <div>
            <label className="block text-[14px] font-bold text-[#181c20] mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0f5238] text-[18px]">air</span>
              Aromatherapy Scent
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['French Lavender', 'Sweet Bergamot', 'Eucalyptus Peppermint', 'Unscented'] as const).map((sc) => (
                <button
                  key={sc}
                  type="button"
                  onClick={() => setLocalPrefs({ ...localPrefs, aromatherapy: sc })}
                  className={`p-3 rounded-xl border text-left text-[13px] font-medium transition-all ${
                    localPrefs.aromatherapy === sc
                      ? 'border-[#0f5238] bg-[#2d6a4f]/10 text-[#0f5238] font-bold ring-1 ring-[#0f5238]'
                      : 'border-[#bfc9c1]/60 hover:bg-[#f1f4f9] text-[#181c20]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{sc}</span>
                    {localPrefs.aromatherapy === sc && (
                      <span className="material-symbols-outlined text-[16px] text-[#0f5238]">check</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Option 2: Weighted Blanket */}
          <div>
            <label className="block text-[14px] font-bold text-[#181c20] mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0f5238] text-[18px]">bedtime</span>
              Deep Pressure Weighted Blanket
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['12-lb Plush', '15-lb Deep Pressure', 'None'] as const).map((wb) => (
                <button
                  key={wb}
                  type="button"
                  onClick={() => setLocalPrefs({ ...localPrefs, weightedBlanket: wb })}
                  className={`p-3 rounded-xl border text-left text-[13px] font-medium transition-all ${
                    localPrefs.weightedBlanket === wb
                      ? 'border-[#0f5238] bg-[#2d6a4f]/10 text-[#0f5238] font-bold ring-1 ring-[#0f5238]'
                      : 'border-[#bfc9c1]/60 hover:bg-[#f1f4f9] text-[#181c20]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{wb}</span>
                    {localPrefs.weightedBlanket === wb && (
                      <span className="material-symbols-outlined text-[16px] text-[#0f5238]">check</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Option 3: Audio & Streaming */}
          <div>
            <label className="block text-[14px] font-bold text-[#181c20] mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0f5238] text-[18px]">headphones</span>
              Audio &amp; Ceiling Streaming
            </label>
            <div className="space-y-2">
              {([
                'Ocean & Forest Soundscapes',
                'Bose QuietComfort + Spotify Calm',
                'Ceiling Screen: Planet Earth / Nature',
                'Ceiling Screen: Netflix / Shows',
                'Silence'
              ] as const).map((aud) => (
                <button
                  key={aud}
                  type="button"
                  onClick={() => setLocalPrefs({ ...localPrefs, audioStreaming: aud })}
                  className={`w-full p-2.5 rounded-xl border text-left text-[13px] font-medium transition-all flex items-center justify-between ${
                    localPrefs.audioStreaming === aud
                      ? 'border-[#0f5238] bg-[#2d6a4f]/10 text-[#0f5238] font-bold ring-1 ring-[#0f5238]'
                      : 'border-[#bfc9c1]/60 hover:bg-[#f1f4f9] text-[#181c20]'
                  }`}
                >
                  <span>{aud}</span>
                  {localPrefs.audioStreaming === aud && (
                    <span className="material-symbols-outlined text-[16px] text-[#0f5238]">check</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Option 4: Organic Tea Bar */}
          <div>
            <label className="block text-[14px] font-bold text-[#181c20] mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0f5238] text-[18px]">coffee</span>
              Complimentary Herbal Tea on Arrival
            </label>
            <select
              value={localPrefs.organicTea}
              onChange={(e) => setLocalPrefs({ ...localPrefs, organicTea: e.target.value as any })}
              className="w-full bg-[#f1f4f9] border border-[#bfc9c1]/80 rounded-xl px-4 py-2.5 text-[14px] text-[#181c20] focus:ring-2 focus:ring-[#0f5238] focus:outline-none"
            >
              <option value="Organic Tulsi Chamomile">Organic Tulsi Chamomile (Caffeine-Free)</option>
              <option value="Kashmiri Kahwa Green Tea">Authentic Kashmiri Kahwa with Saffron &amp; Cardamom</option>
              <option value="Organic Peppermint Refresh">Organic Peppermint Refresh</option>
              <option value="Fresh Tender Coconut Water">Fresh Tender Coconut Water</option>
              <option value="Unsweetened Masala Chai">Handcrafted Ginger Masala Chai</option>
              <option value="None">Just Pure Water or None</option>
            </select>
          </div>

          {/* Option 5: Anxiety Level Self-Rating */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[14px] font-bold text-[#181c20] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0f5238] text-[18px]">favorite</span>
                Dental Anxiety Self-Check (1–5)
              </label>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#e5e8ee] text-[#0f5238]">
                Level {localPrefs.anxietyScore} / 5
              </span>
            </div>
            <input 
              type="range"
              min="1"
              max="5"
              step="1"
              value={localPrefs.anxietyScore}
              onChange={(e) => setLocalPrefs({ ...localPrefs, anxietyScore: parseInt(e.target.value) })}
              className="w-full accent-[#0f5238] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#707973] mt-1">
              <span>1 - Relaxed &amp; Ready</span>
              <span>3 - Mildly Nervous</span>
              <span>5 - Severe Phobia / Avoided Care</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-[#e5e8ee] bg-[#f1f4f9] flex items-center justify-between gap-3">
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl border border-[#0f5238] text-[#0f5238] font-semibold text-[14px] hover:bg-[#0f5238]/5 transition-colors"
          >
            Save to Profile
          </button>
          <button
            onClick={() => {
              onSavePreferences(localPrefs);
              onClose();
              onProceedToBooking();
            }}
            className="px-6 py-2.5 rounded-xl bg-[#2d6a4f] hover:bg-[#0f5238] text-white font-semibold text-[14px] transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>Apply &amp; Book Appointment</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

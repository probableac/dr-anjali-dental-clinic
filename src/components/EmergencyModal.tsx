import React from 'react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookEmergencySlot: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onBookEmergencySlot
}) => {
  if (!isOpen) return null;

  const emergencyScenarios = [
    {
      title: 'Severe Throbbing Toothache',
      action: 'Rinse gently with lukewarm salt water. Avoid placing Disprin/Aspirin directly on the gum tissue. Call our emergency doctor line immediately.',
      icon: 'sentiment_very_dissatisfied'
    },
    {
      title: 'Cracked, Chipped, or Fractured Molar',
      action: 'Save any broken tooth fragments in cold milk or clean saline. Avoid chewing or pressure on that side until evaluated.',
      icon: 'broken_image'
    },
    {
      title: 'Knocked-Out (Avulsed) Permanent Tooth',
      action: 'Handle by the white crown only (never touch the root). Gently re-insert into socket if possible or submerge in whole milk. Time is vital (<60 mins).',
      icon: 'emergency'
    },
    {
      title: 'Facial Swelling, Abscess, or Gum Infection',
      action: 'Apply an external ice pack over cheek. Do not apply hot compresses. Requires immediate antibiotic triage and decompression by Dr. Anjali.',
      icon: 'medical_services'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-[#ffffff] rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#e5e8ee] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#ffdad6] border-b border-[#ba1a1a]/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ba1a1a] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">emergency</span>
            </div>
            <div>
              <h3 className="text-[20px] font-bold text-[#93000a] font-['Plus_Jakarta_Sans'] leading-tight">
                24/7 Dental Emergency Helpline
              </h3>
              <p className="text-[13px] text-[#93000a]/80">
                Same-day pain relief &amp; triage blocks reserved daily in Sector 18, Noida
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/70 hover:bg-white text-[#93000a] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Direct Emergency Call Banner */}
          <div className="bg-[#ba1a1a] text-white p-5 rounded-xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#ffdad6]">
                Priority Doctor Helpline (Noida / NCR)
              </span>
              <p className="text-[22px] font-bold font-['Plus_Jakarta_Sans']">+91 98107 39638</p>
              <p className="text-[12px] text-white/90">Direct On-Call Triage with Dr. Anjali Bhardwaj</p>
            </div>
            <a
              href="tel:+919810739638"
              className="bg-white text-[#ba1a1a] px-5 py-3 rounded-xl font-bold text-[14px] hover:bg-[#ffdad6] transition-colors shrink-0 shadow-sm flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">call</span>
              Call Doctor Now
            </a>
          </div>

          <div>
            <h4 className="text-[15px] font-bold text-[#181c20] mb-3">
              First-Aid Steps Before Arriving at Sector 18 Studio
            </h4>
            <div className="space-y-2.5">
              {emergencyScenarios.map((item, idx) => (
                <div key={idx} className="p-3.5 bg-[#f1f4f9] rounded-xl border border-[#e5e8ee] flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#ba1a1a] text-[20px] shrink-0 mt-0.5">
                    {item.icon}
                  </span>
                  <div>
                    <h5 className="text-[13px] font-bold text-[#181c20]">{item.title}</h5>
                    <p className="text-[12px] text-[#404943] mt-0.5 leading-relaxed">{item.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-[#f1f4f9] border-t border-[#e5e8ee] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-[#404943] text-[14px] font-medium hover:bg-[#e5e8ee] transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onBookEmergencySlot();
            }}
            className="px-6 py-2.5 rounded-xl bg-[#ba1a1a] text-white text-[14px] font-bold hover:bg-[#93000a] transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>Reserve Today’s Emergency Block (₹650)</span>
            <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-[#ffffff] rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#e5e8ee] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 bg-[#f1f4f9] border-b border-[#e5e8ee] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2d6a4f] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">pin_drop</span>
            </div>
            <div>
              <h3 className="text-[20px] font-bold text-[#181c20] font-['Plus_Jakarta_Sans'] leading-tight">
                Noida Studio &amp; Parking Guide
              </h3>
              <p className="text-[13px] text-[#404943]">
                Suite 402, Ocean Heights, Sector 18, Noida, Uttar Pradesh 201301
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#e5e8ee] text-[#181c20] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Simulated Map Graphic with Noida Landmarks */}
          <div className="relative rounded-2xl overflow-hidden border border-[#bfc9c1]/60 bg-[#e0e3e8] h-64 flex flex-col justify-between p-4 shadow-inner">
            <div className="absolute inset-0 bg-[radial-gradient(#2d6a4f_1px,transparent_1px)] [background-size:16px_16px] opacity-15"></div>
            
            {/* Overlay Markers */}
            <div className="relative z-10 flex justify-between items-start">
              <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-md text-xs font-semibold text-[#181c20] border border-[#e5e8ee]">
                <p className="font-bold text-[#0f5238]">Serene Dental Studio - Noida</p>
                <p className="text-[#404943]">Dr. Anjali Bhardwaj • 4th Floor</p>
              </div>

              <div className="bg-[#92f7c3]/90 backdrop-blur-md p-2 rounded-xl text-xs font-semibold text-[#005235] border border-[#006c48]/30">
                🅿️ Validated Parking across complex
              </div>
            </div>

            {/* Central Pin */}
            <div className="relative z-10 self-center text-center">
              <div className="w-12 h-12 bg-[#0f5238] text-white rounded-full flex items-center justify-center mx-auto shadow-lg ring-4 ring-[#b1f0ce] animate-bounce">
                <span className="material-symbols-outlined text-[28px]">dentistry</span>
              </div>
              <span className="inline-block mt-2 px-3 py-1 bg-white text-[#0f5238] rounded-full text-xs font-bold shadow">
                Sector 18, Noida
              </span>
            </div>

            <div className="relative z-10 flex justify-between items-end text-[11px] text-[#404943]">
              <span className="bg-white/90 px-2 py-1 rounded">Noida Sec 18 Metro (2 min walk)</span>
              <span className="bg-white/90 px-2 py-1 rounded">Adjacent to DLF Mall / Radisson</span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="p-4 bg-[#92f7c3]/30 rounded-xl border border-[#92f7c3] flex items-start gap-3">
              <span className="material-symbols-outlined text-[#0f5238] text-[24px] shrink-0">local_parking</span>
              <div>
                <p className="text-[14px] font-bold text-[#0f5238]">Sector 18 Multi-Level Parking Validation</p>
                <p className="text-[12px] text-[#404943] mt-1 leading-relaxed">
                  Park comfortably at the Sector 18 Multi-Level Automated Parking or Wave complex. Show your parking slip at our reception desk; our staff will validate it for <strong>2 hours of complimentary parking</strong>.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-[#404943]">
              <div className="p-3 bg-[#f1f4f9] rounded-xl border border-[#e5e8ee]">
                <strong className="text-[#181c20] block mb-1">Delhi Metro Blue Line:</strong>
                Noida Sector 18 Metro Station (Gate No. 2) is just 200 meters away. Direct connectivity from Rajiv Chowk, Mayur Vihar, and Botanical Garden.
              </div>
              <div className="p-3 bg-[#f1f4f9] rounded-xl border border-[#e5e8ee]">
                <strong className="text-[#181c20] block mb-1">Accessibility &amp; DND:</strong>
                5 minutes drive from DND Flyway and Greater Noida Expressway. Building features automatic stretcher-sized elevators and ramp access.
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-[#f1f4f9] border-t border-[#e5e8ee] flex justify-end">
          <a
            href="https://maps.google.com/?q=Sector+18+Noida+Uttar+Pradesh"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-xl bg-[#2d6a4f] text-white text-[14px] font-semibold hover:bg-[#0f5238] transition-all flex items-center gap-1.5"
          >
            <span>Open in Google Maps</span>
            <span className="material-symbols-outlined text-[18px]">launch</span>
          </a>
        </div>
      </div>
    </div>
  );
};

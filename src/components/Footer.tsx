import React, { useState } from 'react';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenMap: () => void;
  onOpenEmergency: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBooking,
  onOpenMap,
  onOpenEmergency,
  onOpenAdmin
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 3000);
    }
  };

  return (
    <footer className="w-full bg-[#ffffff] text-[#181c20] pt-16 pb-12 shadow-[0_-1px_12px_rgba(45,106,79,0.04)] border-t border-[#e5e8ee]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-16">
          {/* Col 1: Brand & Emergency */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img 
                alt="Serene Dental Studio Logo" 
                className="h-7 w-auto object-contain" 
                src="https://lh3.googleusercontent.com/aida/AEtjO1VZhjRpTyh8uqG1EVp2acJ0cAjN5tCvWkQuTzTiHlO2Mdt6HDWm_CSVa0G66EGA2s52l1UcHGE6uhwJr9NJaf4K_hZkxhZ9NNM7IvTvLPe-ds63BXJTNDAJm49AjAgZ6GTPXCUNA4yvEkIB2-92CLp4gqdGWuDjNIokFByezaf7QXSDjp-gBqoPgsz3CZ9RNQi5Sy6VAczfVGwuDCKGfeB89SA3-VTjGoSs4lkJahcCgw" 
              />
              <span className="text-[18px] font-bold text-[#0f5238] font-['Plus_Jakarta_Sans']">
                Serene Dental Studio
              </span>
            </div>
            <p className="text-[14px] text-[#404943] leading-relaxed max-w-xs">
              Reimagining oral healthcare through calm, sensory-considered dental medicine under Dr. Anjali Bhardwaj in Noida.
            </p>
            <div className="flex flex-col gap-1 mt-2">
              <span className="text-[11px] uppercase text-[#404943] font-semibold tracking-wider">
                Emergency Doctor Helpline
              </span>
              <div className="flex items-center gap-2">
                <a 
                  className="text-[20px] text-[#0f5238] font-bold hover:underline font-['Plus_Jakarta_Sans']" 
                  href="tel:+919810739638"
                >
                  +91 98107 39638
                </a>
                <button
                  onClick={onOpenEmergency}
                  className="px-2 py-0.5 text-xs bg-[#ffdad6] text-[#ba1a1a] rounded font-semibold hover:bg-[#ba1a1a] hover:text-white transition-colors"
                >
                  Triage
                </button>
              </div>
              <span className="text-[13px] text-[#404943]">
                24/7 on-call trauma response &amp; same-day pain cessation
              </span>
            </div>
          </div>

          {/* Col 2: Studio & Hours */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[18px] font-semibold text-[#181c20] font-['Plus_Jakarta_Sans']">
              Clinic &amp; Timings
            </h4>
            <div className="flex flex-col gap-3 text-[#404943] text-[14px]">
              <div className="flex flex-col">
                <span className="text-[14px] font-semibold text-[#181c20]">Noida Sector 18 Flagship</span>
                <span>Suite 402, Ocean Heights, Pocket A</span>
                <span>Noida, UP 201301 (Near Metro Gate 2)</span>
              </div>
              <div className="flex flex-col gap-1 pt-1 border-t border-[#e5e8ee]">
                <div className="flex justify-between py-1">
                  <span>Mon – Sat</span>
                  <span className="text-[13px] font-semibold text-[#181c20]">9:00 AM – 8:00 PM</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Sunday</span>
                  <span className="text-[13px] font-semibold text-[#181c20]">10:00 AM – 2:00 PM (By Appt)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Autoclave Deep Clean</span>
                  <span className="text-[13px] italic text-[#707973]">Daily 2:00 PM – 3:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 3: Location & Parking */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[18px] font-semibold text-[#181c20] font-['Plus_Jakarta_Sans']">
              Metro &amp; Parking
            </h4>
            <div className="rounded-xl bg-[#f1f4f9] p-4 flex flex-col gap-3 border border-[#e5e8ee]/80">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-[#181c20]">Sector 18 Hub</span>
                <button 
                  onClick={onOpenMap} 
                  className="text-[12px] font-semibold text-[#0f5238] hover:underline flex items-center gap-0.5"
                >
                  <span className="material-symbols-outlined text-[14px]">map</span>
                  View Map
                </button>
              </div>

              {/* Map Preview Box */}
              <div 
                onClick={onOpenMap}
                className="h-24 w-full bg-[#e5e8ee] rounded-lg flex flex-col items-center justify-center text-[#404943] text-[12px] font-medium p-2 text-center cursor-pointer hover:bg-[#d7dadf] transition-colors relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-[#0f5238]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="material-symbols-outlined text-[#0f5238] text-[20px] mb-1">local_parking</span>
                <span className="font-semibold text-[#181c20]">Sector 18 Multi-Level Parking</span>
                <span className="text-[11px] text-[#0f5238]">2 Hours Fully Validated</span>
              </div>

              <span className="text-[13px] text-[#404943] leading-snug">
                Noida Sector 18 Metro (Blue Line) is 2 minutes walk. Stretcher elevators and wheelchair ramps available.
              </span>
            </div>
          </div>

          {/* Col 4: Studio Journal */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[18px] font-semibold text-[#181c20] font-['Plus_Jakarta_Sans']">
              Dental Wellness Journal
            </h4>
            <p className="text-[14px] text-[#404943] leading-relaxed">
              Receive Dr. Anjali Bhardwaj’s guides on oral microbiome care, aligners, and anxiety-free oral health.
            </p>

            {subscribed ? (
              <div className="bg-[#92f7c3]/40 border border-[#006c48]/30 text-[#005236] p-3 rounded-lg text-xs font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                Thank you! You’re subscribed to the Studio Journal.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <input 
                  className="bg-[#ffffff] px-4 py-2.5 rounded-lg text-[14px] text-[#181c20] placeholder:text-[#707973] border border-[#bfc9c1]/60 focus:outline-none focus:ring-2 focus:ring-[#0f5238]" 
                  placeholder="your.email@serene.in" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button 
                  className="bg-[#2d6a4f] text-[#ffffff] font-semibold text-[13px] py-2.5 px-4 rounded-lg hover:bg-[#0f5238] transition-all text-center active:scale-98" 
                  type="submit"
                >
                  Join Studio Journal
                </button>
              </form>
            )}

            <div className="flex items-center gap-3 pt-2 text-[#404943]">
              <span className="text-[12px] font-medium">Accreditations:</span>
              <div className="flex gap-1 text-[11px] font-bold">
                <span className="px-2 py-0.5 rounded bg-[#e5e8ee] text-[#181c20]" title="Dental Council of India">DCI</span>
                <span className="px-2 py-0.5 rounded bg-[#e5e8ee] text-[#181c20]" title="Indian Dental Association">IDA</span>
                <span className="px-2 py-0.5 rounded bg-[#e5e8ee] text-[#181c20]" title="NABH Clinic Standards">NABH</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-6 border-t border-[#e5e8ee] flex flex-col md:flex-row items-center justify-between gap-4 text-[#404943] text-[13px]">
          <p>© 2026 Serene Dental Studio, Noida. Dr. Anjali Bhardwaj, BDS, MDS. DCI Reg. #34892-UP. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[12px]">
            <a className="hover:text-[#0f5238] transition-colors" href="#privacy">
              Data Privacy Notice (DPDP Act 2023)
            </a>
            <a className="hover:text-[#0f5238] transition-colors" href="#bio-medical">
              Bio-Medical Waste Compliance
            </a>
            <a className="hover:text-[#0f5238] transition-colors" href="#terms">
              Clinical Terms of Care
            </a>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hover:text-[#0f5238] text-[#707973] transition-colors flex items-center gap-1 font-semibold"
              >
                <span className="material-symbols-outlined text-[14px]">lock</span>
                <span>Clinic Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

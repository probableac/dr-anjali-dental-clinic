import React from 'react';
import { NavigationTab, Treatment, Review, Appointment } from '../types';
import { TREATMENTS } from '../data/treatments';
import { REVIEWS } from '../data/reviews';
import { UpcomingAppointmentBanner } from './UpcomingAppointmentBanner';

interface HomeViewProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenBooking: (treatmentId?: string) => void;
  onOpenComfortMenu: () => void;
  onOpenEmergency: () => void;
  onOpenMap: () => void;
  reviews?: Review[];
  treatments?: Treatment[];
  appointments?: Appointment[];
  isAdmin?: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenBooking,
  onOpenComfortMenu,
  onOpenEmergency,
  onOpenMap,
  reviews = REVIEWS,
  treatments = TREATMENTS,
  appointments = [],
  isAdmin
}) => {
  const featuredTreatments = (treatments || TREATMENTS).slice(0, 4);
  const activeReviews = (reviews || REVIEWS).filter((r) => r.approved !== false);

  return (
    <div className="flex flex-col w-full">
      {/* Admin Upcoming Appointment Countdown Banner */}
      <UpcomingAppointmentBanner
        appointments={appointments}
        isAdmin={isAdmin}
        onNavigate={onNavigate}
      />

      {/* Top Visual Accent / Ambient Glow */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[360px] bg-[#92f7c3]/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-48 right-10 w-[420px] h-[420px] bg-[#b1f0ce]/20 rounded-full blur-3xl pointer-events-none -z-10"></div>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-10 pb-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Text Column (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="inline-flex items-center gap-1.5 self-start px-4 py-1.5 rounded-full bg-[#92f7c3]/50 text-[#00734d]">
                <span className="material-symbols-outlined text-[#006c48] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  spa
                </span>
                <span className="text-[12px] tracking-wide uppercase font-semibold">
                  Boutique Sensory Dental Care • Sector 18, Noida (Delhi-NCR)
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <h1 className="text-[38px] md:text-[50px] font-bold text-[#181c20] tracking-tight leading-[1.12] font-['Plus_Jakarta_Sans']">
                  Gentle, modern dentistry designed around your{' '}
                  <span className="text-[#0f5238] italic font-serif">peace of mind</span>.
                </h1>
                <p className="text-[18px] text-[#404943] max-w-2xl leading-relaxed mt-2">
                  Eliminate dental anxiety forever. Experience bespoke appointments surrounded by warm Ayurvedic herbal towels, Bose noise-cancelling headphones, and ultra-gentle computer-assisted numbing.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button
                  onClick={() => onOpenBooking()}
                  className="inline-flex items-center gap-2 bg-[#2d6a4f] text-white font-semibold text-[15px] px-8 py-4 rounded-xl hover:bg-[#0f5238] transition-all shadow-md shadow-[#2d6a4f]/20 group active:scale-95"
                >
                  <span>Schedule an Appointment</span>
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('treatments');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      onNavigate('treatments-and-services');
                    }
                  }}
                  className="inline-flex items-center gap-1.5 bg-[#f1f4f9] text-[#0f5238] font-semibold text-[15px] px-6 py-4 rounded-xl hover:bg-[#e5e8ee] transition-all"
                >
                  <span>Explore Services</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                </button>
              </div>

              {/* Trust Badges Strip (India Regulations & Standards) */}
              <div className="pt-4 flex flex-wrap items-center gap-4 text-[#404943] text-[13px]">
                <div className="flex items-center gap-2 bg-[#ffffff] px-4 py-2 rounded-xl shadow-sm border border-[#e5e8ee]">
                  <div className="flex text-amber-500">
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                  <span className="text-[#181c20] font-semibold">2,400+ Verified Patient Reviews</span>
                </div>

                <div className="flex items-center gap-2 bg-[#ffffff] px-4 py-2 rounded-xl shadow-sm border border-[#e5e8ee]">
                  <span className="material-symbols-outlined text-[#0f5238] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                  <span>Registered with <strong className="text-[#181c20]">DCI &amp; IDA</strong></span>
                </div>

                <div className="flex items-center gap-2 bg-[#ffffff] px-4 py-2 rounded-xl shadow-sm border border-[#e5e8ee]">
                  <span className="material-symbols-outlined text-[#006c48] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    credit_card
                  </span>
                  <span>Cashless Insurance &amp; <strong className="text-[#181c20]">0% Bajaj EMI</strong></span>
                </div>
              </div>
            </div>

            {/* Visual Hero Card (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative bg-[#ffffff] rounded-3xl p-4 shadow-xl border border-[#e5e8ee] overflow-hidden">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-[#e5e8ee]">
                  <img 
                    className="w-full h-full object-cover" 
                    alt="Tranquil dental sanctuary in Noida"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDplwEi5nbQYJF9kvrE4M1ZLvUpVgmoaCJ3_Akkigj-4YwQ26tbHDBwjTik13KrdhQK4BPis-La4d9-aDcaVDM-1soOwluzUkmH8j7OcdOV7JUR-qLiqbHRw51TUeDaig7mOrLqG_wtg9SMiRXvxDNwKGcHwsCh39GYPCRG2dUtnkvVgCt6c55TU8MyTYVSz57h013Za4bJp0FJgkmsGN0zMCwZ1LqSkXtuemxDB3f6" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181c20]/70 via-transparent to-transparent"></div>

                  {/* Floating Micro-Badge */}
                  <div className="absolute bottom-4 left-4 right-4 bg-[#ffffff]/95 backdrop-blur-md p-4 rounded-2xl shadow-md flex items-center justify-between border border-white/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#92f7c3]/60 flex items-center justify-center text-[#0f5238]">
                        <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          sentiment_calm
                        </span>
                      </div>
                      <div>
                        <p className="text-[15px] font-bold text-[#181c20] leading-tight font-['Plus_Jakarta_Sans']">
                          Zero-Panic Guarantee
                        </p>
                        <p className="text-[12px] text-[#404943]">Pause care anytime with a hand raise</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#0f5238] font-bold bg-[#f1f4f9] px-2.5 py-1 rounded-full border border-[#b1f0ce]">
                      100% Gentle
                    </span>
                  </div>
                </div>

                {/* Overlapping Float Pill */}
                <div className="absolute -top-3 -right-3 bg-[#0f5238] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 text-[12px] font-semibold border-2 border-white">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    eco
                  </span>
                  <span>Biocompatible &amp; NABH Certified</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Dentist Bio & Story Section - Dr. Anjali Bhardwaj */}
      <section className="w-full bg-[#ffffff] py-16 border-y border-[#e5e8ee]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Photo Column with Asymmetric accents */}
            <div className="lg:col-span-5 relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl bg-[#f1f4f9] aspect-square max-w-md mx-auto border-4 border-white">
                <img 
                  alt="Dr. Anjali Bhardwaj, BDS, MDS" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7sb8YtVI6DDCeFeDKf-OgO-rNkLaqtMq8voGqPqgYsM0Ek7snTu6aD5tTvuZvOh11J0QjtfwmWDJleAIyolRX_JU3-u-DI_BBGAhM1P_4FGMSzegoEYMXdMmyLsw2ee7QGnh7L3b7CTNp3QEOc3-Ynxl8iRCjjSU4dmqgoVdyt5cDVFJ0IQ0mYcVQ8Lh9OIfAYHdR8zOPqZ6B2wg27AHn1IezRl5gXghv0hEHiMej" 
                />
              </div>
              <div className="absolute -bottom-6 -left-4 z-20 bg-[#92f7c3] text-[#002113] p-4 rounded-2xl shadow-lg max-w-xs hidden sm:block border border-[#006c48]/20">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="material-symbols-outlined text-[#006c48] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    school
                  </span>
                  <span className="text-[12px] font-bold uppercase tracking-wider">
                    Education &amp; Care
                  </span>
                </div>
                <p className="text-[13px] leading-snug">
                  Maulana Azad Medical Sciences alumnus with advanced specialization in Sedation &amp; Aesthetic Dentistry.
                </p>
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#b1f0ce]/40 rounded-full blur-2xl pointer-events-none"></div>
            </div>

            {/* Narrative Column */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="flex items-center gap-1.5 text-[#0f5238] text-[12px] tracking-wider uppercase font-bold">
                <span className="material-symbols-outlined text-[18px]">medical_services</span>
                <span>Founder &amp; Chief Dental Surgeon</span>
              </div>
              <h2 className="text-[32px] md:text-[38px] font-bold text-[#181c20] tracking-tight font-['Plus_Jakarta_Sans']">
                Meet Dr. Anjali Bhardwaj, BDS, MDS
              </h2>

              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-3.5 py-1 rounded-full bg-[#ebeef3] text-[#404943] text-[12px] font-medium">
                  MDS Prosthodontics &amp; Implantology
                </span>
                <span className="px-3.5 py-1 rounded-full bg-[#ebeef3] text-[#404943] text-[12px] font-medium">
                  12+ Years Clinical Excellence
                </span>
                <span className="px-3.5 py-1 rounded-full bg-[#92f7c3]/70 text-[#00734d] text-[12px] font-bold">
                  DCI Reg. #34892-UP • IDA Life Member
                </span>
                <span className="px-3.5 py-1 rounded-full bg-[#ebeef3] text-[#404943] text-[12px] font-medium">
                  Certified Clear Aligner Specialist
                </span>
              </div>

              <blockquote className="text-[16px] text-[#404943] pt-2 leading-relaxed italic border-l-2 border-[#0f5238] pl-4">
                "For so many patients across Noida and Delhi-NCR, visiting the dentist is linked to painful childhood memories or feelings of shame and loss of control. When I founded Serene Dental Studio in Sector 18, I promised that compassion would always precede procedure. We move only at your pace, explain every sensation before it occurs, and treat you with radical gentleness."
              </blockquote>

              <div className="bg-[#f1f4f9] p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-3 border border-[#e5e8ee]">
                <div className="flex flex-col">
                  <span className="text-[16px] font-bold text-[#181c20] font-['Plus_Jakarta_Sans']">
                    Nervous or haven’t been to a dentist in years?
                  </span>
                  <span className="text-[13px] text-[#404943]">
                    We offer a 20-minute tea &amp; chat consult with zero scraping, digital x-rays only when you’re ready.
                  </span>
                </div>
                <button
                  onClick={() => onOpenBooking('calm-consultation')}
                  className="shrink-0 bg-[#2d6a4f] text-white font-semibold text-[13px] px-5 py-2.5 rounded-xl hover:bg-[#0f5238] transition-all shadow-sm active:scale-95"
                >
                  Book Calm Consult (₹500)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Anxiety-Free Comfort Menu Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="flex flex-col items-center text-center gap-2 mb-12">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#e5e8ee] text-[#404943] text-[12px] font-semibold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px] text-[#0f5238]">heart_check</span>
            <span>The Serene Comfort Protocol</span>
          </div>
          <h2 className="text-[32px] md:text-[38px] font-bold text-[#181c20] tracking-tight max-w-xl font-['Plus_Jakarta_Sans']">
            Every appointment includes our bespoke Comfort Menu
          </h2>
          <p className="text-[16px] text-[#404943] max-w-2xl">
            Select your sensory preferences directly in our patient portal before you arrive. Every amenity is complimentary with every dental treatment.
          </p>
          <button
            onClick={onOpenComfortMenu}
            className="mt-3 inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#92f7c3]/60 text-[#005236] hover:bg-[#92f7c3] font-bold text-xs uppercase tracking-wider transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            Open Interactive Comfort Customizer
          </button>
        </div>

        {/* Comfort Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Amenity 1 */}
          <div 
            onClick={onOpenComfortMenu}
            className="bg-[#ffffff] p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group border border-[#e5e8ee] cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#92f7c3]/50 text-[#006c48] flex items-center justify-center mb-4 group-hover:bg-[#0f5238] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>air</span>
              </div>
              <h3 className="text-[17px] font-bold text-[#181c20] mb-1.5 font-['Plus_Jakarta_Sans']">Aromatherapy</h3>
              <p className="text-[13px] text-[#404943] leading-relaxed">
                Subtle medical-grade diffuser notes of organic French lavender, sweet bergamot, and eucalyptus neutralize clinical odors instantly.
              </p>
            </div>
            <span className="mt-4 text-[12px] text-[#0f5238] font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">check_circle</span> Choice of 3 scents
            </span>
          </div>

          {/* Amenity 2 */}
          <div 
            onClick={onOpenComfortMenu}
            className="bg-[#ffffff] p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group border border-[#e5e8ee] cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#92f7c3]/50 text-[#006c48] flex items-center justify-center mb-4 group-hover:bg-[#0f5238] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>bedtime</span>
              </div>
              <h3 className="text-[17px] font-bold text-[#181c20] mb-1.5 font-['Plus_Jakarta_Sans']">Weighted Blankets</h3>
              <p className="text-[13px] text-[#404943] leading-relaxed">
                Plush deep pressure therapy blankets that ease autonomic nervous system tension throughout your session in Noida.
              </p>
            </div>
            <span className="mt-4 text-[12px] text-[#0f5238] font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">check_circle</span> Hypoallergenic cotton
            </span>
          </div>

          {/* Amenity 3: The Wand */}
          <div 
            onClick={onOpenComfortMenu}
            className="bg-[#ffffff] p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group border border-[#e5e8ee] cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#92f7c3]/50 text-[#006c48] flex items-center justify-center mb-4 group-hover:bg-[#0f5238] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>magic_button</span>
              </div>
              <h3 className="text-[17px] font-bold text-[#181c20] mb-1.5 font-['Plus_Jakarta_Sans']">The Wand® STA</h3>
              <p className="text-[13px] text-[#404943] leading-relaxed">
                Computerized syringe-free numbing that targets single teeth gently with zero stinging sensation and no drooping lips.
              </p>
            </div>
            <span className="mt-4 text-[12px] text-[#0f5238] font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">check_circle</span> Needle-free sensation
            </span>
          </div>

          {/* Amenity 4 */}
          <div 
            onClick={onOpenComfortMenu}
            className="bg-[#ffffff] p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group border border-[#e5e8ee] cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#92f7c3]/50 text-[#006c48] flex items-center justify-center mb-4 group-hover:bg-[#0f5238] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>headphones</span>
              </div>
              <h3 className="text-[17px] font-bold text-[#181c20] mb-1.5 font-['Plus_Jakarta_Sans']">Noise-Cancelling Audio</h3>
              <p className="text-[13px] text-[#404943] leading-relaxed">
                Bose QuietComfort headphones paired with calming acoustic playlists, Indian classical ragas, or overhead streaming screens.
              </p>
            </div>
            <span className="mt-4 text-[12px] text-[#0f5238] font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">check_circle</span> Zero drill sound
            </span>
          </div>

          {/* Amenity 5 */}
          <div 
            onClick={() => onNavigate('treatments-and-services')}
            className="bg-[#ffffff] p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group border border-[#e5e8ee] cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#92f7c3]/50 text-[#006c48] flex items-center justify-center mb-4 group-hover:bg-[#0f5238] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>price_check</span>
              </div>
              <h3 className="text-[17px] font-bold text-[#181c20] mb-1.5 font-['Plus_Jakarta_Sans']">Transparent INR Pricing</h3>
              <p className="text-[13px] text-[#404943] leading-relaxed">
                Itemized printed estimates in ₹ prior to touching a tooth. No surprise charges, hidden consultation fees, or awkward checkout moments.
              </p>
            </div>
            <span className="mt-4 text-[12px] text-[#0f5238] font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">check_circle</span> 100% upfront clarity
            </span>
          </div>
        </div>
      </section>

      {/* Featured Clinical Treatments Grid with INR Pricing */}
      <section className="w-full bg-[#f1f4f9] py-16" id="treatments">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div className="flex flex-col gap-1">
              <div className="text-[#0f5238] text-[12px] font-bold tracking-wider uppercase">
                High-Precision Procedures
              </div>
              <h2 className="text-[32px] md:text-[38px] font-bold text-[#181c20] tracking-tight font-['Plus_Jakarta_Sans']">
                Featured Clinical Treatments
              </h2>
              <p className="text-[16px] text-[#404943] max-w-xl">
                Clean, conservative dentistry emphasizing tooth preservation, biocompatibility, and transparent Indian rates.
              </p>
            </div>
            <button
              onClick={() => onNavigate('treatments-and-services')}
              className="inline-flex items-center gap-1 text-[#0f5238] text-[14px] font-bold hover:underline"
            >
              <span>View All 18 Dental Services</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTreatments.map((tr) => (
              <div
                key={tr.id}
                className="bg-[#ffffff] rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all border border-[#e5e8ee]"
              >
                <div className="flex flex-col">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    tr.priority ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#ebeef3] text-[#0f5238]'
                  }`}>
                    <span className="material-symbols-outlined text-[24px]">{tr.icon}</span>
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                    <span className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
                      tr.priority ? 'bg-[#ffdad6] text-[#93000a]' : 'bg-[#e5e8ee] text-[#181c20]'
                    }`}>
                      {tr.priority ? 'Immediate Priority' : `Turnaround: ${tr.turnaround}`}
                    </span>
                  </div>

                  <h3 className="text-[18px] font-bold text-[#181c20] mb-2 font-['Plus_Jakarta_Sans']">
                    {tr.name}
                  </h3>
                  <p className="text-[13px] text-[#404943] leading-relaxed mb-4">
                    {tr.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#f1f4f9] flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-[#404943]">
                      {tr.priority ? 'Exam & Triage' : 'Starting at'}
                    </span>
                    <span className="text-[18px] text-[#0f5238] font-bold font-['Plus_Jakarta_Sans']">
                      ₹{tr.priceStarting.toLocaleString('en-IN')}{' '}
                      <span className="text-[11px] text-[#404943] font-normal">{tr.priceNote}</span>
                    </span>
                  </div>

                  {tr.priority ? (
                    <button
                      onClick={onOpenEmergency}
                      className="w-10 h-10 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center hover:opacity-90 transition-all shadow-sm"
                      title="Emergency Priority"
                    >
                      <span className="material-symbols-outlined text-[18px]">call</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenBooking(tr.id)}
                      className="w-10 h-10 rounded-full bg-[#f1f4f9] hover:bg-[#0f5238] hover:text-white text-[#0f5238] flex items-center justify-center transition-colors"
                      title={`Book ${tr.name}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Patient Testimonials & Google Rating Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Ratings Summary Card (4 cols) */}
          <div className="lg:col-span-4 bg-[#2d6a4f] text-white p-8 rounded-3xl flex flex-col justify-between shadow-xl">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#a8e7c5] text-[12px] font-semibold mb-6">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  reviews
                </span>
                <span>Verified NCR Patient Reviews</span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-[56px] font-extrabold leading-none font-['Plus_Jakarta_Sans']">4.9</span>
                <span className="text-[20px] text-[#a8e7c5] font-semibold">/ 5.0</span>
              </div>
              <div className="flex text-[#92f7c3] mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                ))}
              </div>
              <p className="text-[15px] text-[#a8e7c5] leading-relaxed">
                Rated the #1 calm, pain-free dental clinic in Noida across Google Maps, Practo, and Lybrate with 2,400+ verified patient reviews.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white text-[#0f5238] flex items-center justify-center font-bold text-xs shadow">
                G
              </div>
              <span className="text-[12px] text-[#a8e7c5]">
                Live Google &amp; Practo Rating Feed • Verified
              </span>
            </div>
          </div>

          {/* Testimonials Grid (8 cols) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeReviews.slice(0, 3).map((rev) => (
              <div
                key={rev.id}
                className="bg-[#ffffff] p-6 rounded-2xl shadow-sm border border-[#e5e8ee] flex flex-col justify-between"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                    ))}
                  </div>
                  <p className="text-[13px] text-[#404943] italic leading-relaxed">
                    {rev.text}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#f1f4f9] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#e5e8ee] flex items-center justify-center font-bold text-[#0f5238] text-[13px]">
                    {rev.initials}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-[#181c20] leading-tight font-['Plus_Jakarta_Sans']">
                      {rev.name}
                    </p>
                    <p className="text-[11px] text-[#404943]">{rev.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Practice Location & Noida Studio Details */}
      <section className="w-full bg-[#f1f4f9] py-16 border-t border-[#e5e8ee]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Interactive Location / Map Card (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <div className="inline-flex items-center gap-1.5 text-[#0f5238] text-[12px] font-bold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[18px]">apartment</span>
                  <span>Noida Flagship Clinic</span>
                </div>
                <h2 className="text-[32px] md:text-[38px] font-bold text-[#181c20] tracking-tight font-['Plus_Jakarta_Sans']">
                  Located in the Heart of Sector 18, Noida
                </h2>
                <p className="text-[16px] text-[#404943]">
                  Designed as an urban retreat. Natural acoustic buffering, HEPA-13 air filtration, strict biomedical waste protocol, and state-of-the-art sterilization right next to Noida Sector 18 Metro Station.
                </p>
              </div>

              {/* Studio Imagery Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-[#e5e8ee] shadow-sm border border-[#bfc9c1]/40">
                  <img 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                    alt="Warm welcoming dental reception lounge in Sector 18, Noida"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1APj60MCnvPEydtvGMaO2tx7VVglAt8Z71pTXinXwP_U7X4hZnsFyNkrHP71m8zplJy6Uu3oe6KZ6u7rFmQHOWhVvmgOCEjDyQNe4zXQYzqzjfh6K3anRltchoMN4ZEOsxmz-1clR2-GrIQAh6amNpjHUoHG2Cs6y6EhPi_myqk1t7XUeMLddaUj48xbaY9zdwG1fLwrOadgvi2796mQCTVIboiMobkkd7f_tMCat" 
                  />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-[#e5e8ee] shadow-sm border border-[#bfc9c1]/40">
                  <img 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                    alt="High-tech clinical treatment suite at Serene Dental"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBN3rzlQBurAiQ2Z_fgjw_gbFfHsWnfkQLhZf-Zbpdt7cztPuAGq2A79lqbbQpCI9zj5zsaLFN5VGHfvDR2E87d9L2oDFnG6nYbyZLk0ZwzRMej1H_HG1I76_d3uScPLjyslzXeBMWQcGm5D88unUQbGWlPakpc85LA2UBjB76HOddA4YhP6psPSUsePDmSE0u-Yx9WnteV5kD93Ml_RzPA3uTwL0tmQPmUvG9gwSpl" 
                  />
                </div>
              </div>

              {/* Key Amenities Highlights List */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                <div className="flex items-center gap-2 text-[13px] text-[#181c20]">
                  <span className="material-symbols-outlined text-[#0f5238] text-[18px]">verified_user</span>
                  <span>HEPA-13 Air Cleaners</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-[#181c20]">
                  <span className="material-symbols-outlined text-[#0f5238] text-[18px]">hot_tub</span>
                  <span>Warm Herbal Towels</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-[#181c20]">
                  <span className="material-symbols-outlined text-[#0f5238] text-[18px]">smart_display</span>
                  <span>Ceiling OTT Displays</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-[#181c20]">
                  <span className="material-symbols-outlined text-[#0f5238] text-[18px]">coffee</span>
                  <span>Ayurvedic Herbal Bar</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-[#181c20]">
                  <span className="material-symbols-outlined text-[#0f5238] text-[18px]">accessible</span>
                  <span>Elevator &amp; Wheelchair Access</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-[#181c20]">
                  <span className="material-symbols-outlined text-[#0f5238] text-[18px]">subway</span>
                  <span>2 Mins from Metro Gate 2</span>
                </div>
              </div>
            </div>

            {/* Address & Logistics Card (5 cols) */}
            <div className="lg:col-span-5 bg-[#ffffff] p-8 rounded-3xl shadow-lg flex flex-col gap-6 border border-[#e5e8ee]">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="text-[18px] font-bold text-[#181c20] font-['Plus_Jakarta_Sans']">
                    Serene Dental Studio - Noida
                  </span>
                  <span className="text-[15px] text-[#404943]">Suite 402, Ocean Heights, Pocket A, Sector 18</span>
                  <span className="text-[13px] text-[#404943]">Noida, Gautam Buddha Nagar, UP 201301</span>
                </div>
                <button
                  onClick={onOpenMap}
                  className="w-10 h-10 rounded-full bg-[#f1f4f9] text-[#0f5238] flex items-center justify-center hover:bg-[#2d6a4f] hover:text-white transition-all shadow-sm"
                  title="View directions & parking"
                >
                  <span className="material-symbols-outlined text-[20px]">near_me</span>
                </button>
              </div>

              {/* Hours block */}
              <div className="bg-[#f1f4f9] p-4 rounded-2xl flex flex-col gap-1.5 text-[13px]">
                <span className="text-[11px] font-bold uppercase text-[#0f5238] tracking-wider mb-0.5">
                  Clinic Consultation Hours
                </span>
                <div className="flex justify-between py-1 border-b border-[#e5e8ee]/80">
                  <span className="text-[#404943]">Monday – Saturday</span>
                  <span className="font-semibold text-[#181c20]">9:00 AM – 8:00 PM</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#e5e8ee]/80">
                  <span className="text-[#404943]">Sunday</span>
                  <span className="font-semibold text-[#181c20]">10:00 AM – 2:00 PM (By Appt)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#404943]">Emergency Triage</span>
                  <span className="text-[#0f5238] font-bold">24/7 On-Call Doctor</span>
                </div>
              </div>

              {/* Parking Validation Info */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#92f7c3]/40 text-[#002113] border border-[#006c48]/20">
                <span className="material-symbols-outlined text-[24px] text-[#006c48] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_parking
                </span>
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold text-[#181c20]">
                    Complimentary Valet &amp; Multi-Level Parking
                  </span>
                  <span className="text-[12px] text-[#404943] mt-0.5 leading-relaxed">
                    2 hours complimentary parking validation at the Sector 18 Multi-Level Parking Complex directly opposite our building.
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex flex-col">
                  <span className="text-[12px] text-[#404943]">Call for inquiries or directions:</span>
                  <a className="text-[18px] text-[#0f5238] font-bold hover:underline font-['Plus_Jakarta_Sans']" href="tel:+919810739638">
                    +91 98107 39638
                  </a>
                </div>
                <button
                  onClick={() => onOpenBooking()}
                  className="bg-[#2d6a4f] text-white font-semibold text-[14px] px-6 py-3 rounded-xl hover:bg-[#0f5238] transition-all shadow-sm active:scale-95"
                >
                  Reserve Time
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Calming CTA Card */}
      <section className="max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="relative bg-gradient-to-r from-[#2d6a4f] to-[#0f5238] text-white rounded-3xl p-8 md:p-14 overflow-hidden shadow-2xl">
          {/* Decorative background circles */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#92f7c3]/20 blur-2xl pointer-events-none"></div>
          <div className="absolute top-0 right-1/3 w-60 h-60 rounded-full bg-white/10 blur-xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl flex flex-col gap-4">
            <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-white/15 text-[#a8e7c5] text-[12px] font-bold uppercase tracking-wider self-start">
              <span className="material-symbols-outlined text-[16px]">sentiment_satisfied</span>
              <span>Your comfort comes first</span>
            </div>

            <h2 className="text-[32px] md:text-[46px] font-bold tracking-tight text-white leading-tight font-['Plus_Jakarta_Sans']">
              Ready for a dental experience that feels completely restorative?
            </h2>

            <p className="text-[17px] text-[#a8e7c5] max-w-2xl leading-relaxed">
              Book your gentle consultation with Dr. Anjali Bhardwaj online in under 90 seconds. Whether it is a routine cleaning or an urgent toothache, we are here to care for you with zero judgment.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button
                onClick={() => onOpenBooking()}
                className="inline-flex items-center gap-2 bg-white text-[#0f5238] font-bold text-[15px] px-8 py-4 rounded-xl hover:bg-[#f7f9ff] transition-all shadow-lg group active:scale-95"
              >
                <span>Book Your Calm Visit Now</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>

              <button
                onClick={onOpenEmergency}
                className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold text-[15px] px-6 py-4 rounded-xl transition-all backdrop-blur-sm"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
                <span>24/7 Dental Emergency Helpline</span>
              </button>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-6 text-[#a8e7c5] text-[13px] font-medium">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>No judgment, ever</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>UPI, Cards &amp; 0% Bajaj EMI</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Instant WhatsApp &amp; SMS confirmation</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

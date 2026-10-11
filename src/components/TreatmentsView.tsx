import React, { useState } from 'react';
import { TREATMENTS } from '../data/treatments';
import { Treatment } from '../types';

interface TreatmentsViewProps {
  onBookTreatment: (treatmentId: string) => void;
  onOpenComfortMenu: () => void;
  onOpenEmergency: () => void;
  treatments?: Treatment[];
}

export const TreatmentsView: React.FC<TreatmentsViewProps> = ({
  onBookTreatment,
  onOpenComfortMenu,
  onOpenEmergency,
  treatments = TREATMENTS
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [insuranceStatus, setInsuranceStatus] = useState<'standard' | 'cashless' | 'serene-club'>('cashless');

  const categories = ['All', 'Preventative', 'Restorative', 'Cosmetic', 'Sedation', 'Emergency'];
  const allTreatments = treatments || TREATMENTS;

  const filtered = allTreatments.filter((t) => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch = 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.gentleFeature.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const calculateEstimate = (basePrice: number, category: string) => {
    if (insuranceStatus === 'cashless') {
      if (category === 'Preventative') return 0; // cashless covered / corporate checkup
      if (category === 'Restorative') return Math.round(basePrice * 0.25); // 75% coverage
      if (category === 'Emergency') return Math.round(basePrice * 0.2);
      return Math.round(basePrice * 0.85); // Cosmetic out of pocket
    }
    if (insuranceStatus === 'serene-club') {
      if (category === 'Preventative') return 0; // included in club membership
      return Math.round(basePrice * 0.8); // 20% flat discount
    }
    return basePrice;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header Banner */}
      <div className="bg-[#ffffff] rounded-3xl p-8 md:p-12 shadow-sm border border-[#e5e8ee] mb-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#92f7c3]/50 text-[#00734d] text-[12px] font-bold uppercase tracking-wider mb-4">
            <span className="material-symbols-outlined text-[16px]">medical_services</span>
            <span>DCI &amp; NABH Compliant Clinical Standards</span>
          </div>
          <h1 className="text-[32px] md:text-[44px] font-bold text-[#181c20] tracking-tight font-['Plus_Jakarta_Sans'] leading-tight mb-3">
            Clinical Services Designed for Total Comfort
          </h1>
          <p className="text-[16px] text-[#404943] leading-relaxed">
            Every procedure at Serene Dental Studio Noida is performed by Dr. Anjali Bhardwaj and team using biological dentistry principles: preserving natural tooth enamel, utilizing computerized syringe-free numbing, and strictly adhering to Indian clinical hygiene guidelines.
          </p>
        </div>

        {/* Pricing Estimator Bar */}
        <div className="mt-8 pt-6 border-t border-[#e5e8ee] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#f1f4f9] p-4 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0f5238]">calculate</span>
            <div>
              <p className="text-xs font-bold text-[#181c20]">Interactive Indian Pricing &amp; Copay Calculator</p>
              <p className="text-[11px] text-[#404943]">Preview estimated out-of-pocket costs in Indian Rupees (₹)</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-[#bfc9c1]/50 text-xs font-semibold">
            <button
              onClick={() => setInsuranceStatus('cashless')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                insuranceStatus === 'cashless' ? 'bg-[#2d6a4f] text-white shadow-sm' : 'text-[#404943] hover:text-[#181c20]'
              }`}
            >
              Cashless Health / TPA
            </button>
            <button
              onClick={() => setInsuranceStatus('serene-club')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                insuranceStatus === 'serene-club' ? 'bg-[#2d6a4f] text-white shadow-sm' : 'text-[#404943] hover:text-[#181c20]'
              }`}
            >
              Serene Club (20% Off)
            </button>
            <button
              onClick={() => setInsuranceStatus('standard')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                insuranceStatus === 'standard' ? 'bg-[#2d6a4f] text-white shadow-sm' : 'text-[#404943] hover:text-[#181c20]'
              }`}
            >
              Standard Fee (UPI/Cards)
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#0f5238] text-white shadow-sm'
                  : 'bg-[#ffffff] text-[#404943] hover:bg-[#e5e8ee] border border-[#e5e8ee]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707973] text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search procedure, symptom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#ffffff] border border-[#bfc9c1]/60 rounded-xl text-[13px] text-[#181c20] focus:ring-2 focus:ring-[#0f5238] focus:outline-none"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((t) => {
          const estimatedCost = calculateEstimate(t.priceStarting, t.category);
          return (
            <div
              key={t.id}
              className={`bg-[#ffffff] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all border flex flex-col justify-between ${
                t.priority ? 'border-[#ba1a1a]/40 ring-1 ring-[#ba1a1a]/20' : 'border-[#e5e8ee]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    t.priority ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#f1f4f9] text-[#0f5238]'
                  }`}>
                    <span className="material-symbols-outlined text-[26px]">{t.icon}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#f1f4f9] text-[#404943]">
                      {t.turnaround}
                    </span>
                    {t.isPopular && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#92f7c3]/60 text-[#005235]">
                        Popular
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-[19px] font-bold text-[#181c20] font-['Plus_Jakarta_Sans'] mb-2">
                  {t.name}
                </h3>
                <p className="text-[13px] text-[#404943] leading-relaxed mb-4">
                  {t.description}
                </p>

                {/* Gentle feature highlight */}
                <div className="p-3 rounded-xl bg-[#f1f4f9] border border-[#e5e8ee] mb-4 flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#0f5238] text-[18px] shrink-0 mt-0.5">
                    spa
                  </span>
                  <p className="text-[12px] text-[#181c20] leading-snug">
                    <strong className="text-[#0f5238]">Gentle Protocol:</strong> {t.gentleFeature}
                  </p>
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="pt-4 border-t border-[#e5e8ee] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#404943] block">
                    {insuranceStatus === 'cashless' ? 'Est. Copay' : insuranceStatus === 'serene-club' ? 'Club Rate' : 'Standard'}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[20px] font-bold text-[#0f5238] font-['Plus_Jakarta_Sans']">
                      ₹{estimatedCost.toLocaleString('en-IN')}
                    </span>
                    {insuranceStatus !== 'standard' && (
                      <span className="text-[12px] line-through text-[#707973]">
                        ₹{t.priceStarting.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                {t.priority ? (
                  <button
                    onClick={onOpenEmergency}
                    className="bg-[#ba1a1a] hover:bg-[#93000a] text-white px-4 py-2 rounded-xl text-[13px] font-bold transition-all shadow-sm flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">call</span>
                    Emergency
                  </button>
                ) : (
                  <button
                    onClick={() => onBookTreatment(t.id)}
                    className="bg-[#2d6a4f] hover:bg-[#0f5238] text-white px-4 py-2 rounded-xl text-[13px] font-semibold transition-all shadow-sm flex items-center gap-1 active:scale-95"
                  >
                    <span>Book Service</span>
                    <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-[#e5e8ee] p-8">
          <span className="material-symbols-outlined text-4xl text-[#707973] mb-2">search_off</span>
          <h3 className="text-lg font-bold text-[#181c20]">No matching treatments found</h3>
          <p className="text-sm text-[#404943] mt-1">Try searching another keyword or reset category filter.</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="mt-4 px-4 py-2 bg-[#2d6a4f] text-white rounded-xl text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

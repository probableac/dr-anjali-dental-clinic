import React, { useState } from 'react';
import { NavigationTab } from '../types';

interface HeaderProps {
  activeTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  onOpenBooking: () => void;
  onOpenEmergency: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onNavigate,
  onOpenBooking,
  onOpenEmergency
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: NavigationTab) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#ffffff]/90 backdrop-blur-md shadow-[0_1px_8px_rgba(45,106,79,0.06)]">
      {/* Top Bar for Desktop */}
      <div className="bg-[#f1f4f9] px-6 hidden sm:block border-b border-[#e5e8ee]/60">
        <div className="max-w-7xl mx-auto h-9 flex items-center justify-between text-[#404943] text-[12px] font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0f5238] animate-pulse"></span>
              Mon–Sat: 9:00am–8:00pm, Sun: 10:00am–2:00pm
            </span>
            <span className="text-[#bfc9c1]">|</span>
            <span className="text-[#0f5238] font-semibold">Sector 18, Noida, Uttar Pradesh</span>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={onOpenEmergency}
              className="text-[#ba1a1a] hover:underline flex items-center gap-1 font-semibold transition-colors"
            >
              <span className="material-symbols-outlined text-[15px]">medical_services</span>
              Emergency Pain Triage
            </button>
            <a 
              className="text-[#0f5238] hover:underline font-semibold flex items-center gap-1" 
              href="tel:+919810739638"
            >
              <span className="material-symbols-outlined text-[15px]">call</span>
              +91 98107 39638
            </a>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="h-20 max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <button 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left focus:outline-none group"
        >
          <img 
            alt="Serene Dental Studio Logo" 
            className="h-8 w-auto object-contain transition-transform group-hover:scale-105" 
            src="https://lh3.googleusercontent.com/aida/AEtjO1VZhjRpTyh8uqG1EVp2acJ0cAjN5tCvWkQuTzTiHlO2Mdt6HDWm_CSVa0G66EGA2s52l1UcHGE6uhwJr9NJaf4K_hZkxhZ9NNM7IvTvLPe-ds63BXJTNDAJm49AjAgZ6GTPXCUNA4yvEkIB2-92CLp4gqdGWuDjNIokFByezaf7QXSDjp-gBqoPgsz3CZ9RNQi5Sy6VAczfVGwuDCKGfeB89SA3-VTjGoSs4lkJahcCgw" 
          onError={(e) => {
            // graceful fallback if external asset fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
          <div className="flex flex-col">
            <span className="text-[20px] font-bold tracking-tight text-[#0f5238] leading-none font-['Plus_Jakarta_Sans']">
              Serene
            </span>
            <span className="text-[11px] tracking-widest uppercase text-[#404943] font-semibold">
              Dental Studio
            </span>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden xl:flex items-center gap-1">
          <button
            onClick={() => handleNavClick('home')}
            className={`px-4 py-2 transition-all text-[14px] font-semibold rounded-lg ${
              activeTab === 'home'
                ? 'bg-[#2d6a4f] text-[#ffffff] shadow-sm'
                : 'text-[#404943] hover:bg-[#e5e8ee] hover:text-[#181c20]'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNavClick('treatments-and-services')}
            className={`px-4 py-2 transition-all text-[14px] font-semibold rounded-lg ${
              activeTab === 'treatments-and-services'
                ? 'bg-[#2d6a4f] text-[#ffffff] shadow-sm'
                : 'text-[#404943] hover:bg-[#e5e8ee] hover:text-[#181c20]'
            }`}
          >
            Treatments &amp; Services
          </button>

          <button
            onClick={() => handleNavClick('book-appointment')}
            className={`px-4 py-2 transition-all text-[14px] font-semibold rounded-lg ${
              activeTab === 'book-appointment'
                ? 'bg-[#2d6a4f] text-[#ffffff] shadow-sm'
                : 'text-[#404943] hover:bg-[#e5e8ee] hover:text-[#181c20]'
            }`}
          >
            Book Appointment
          </button>

          <button
            onClick={() => handleNavClick('patient-portal')}
            className={`px-4 py-2 transition-all text-[14px] font-semibold rounded-lg ${
              activeTab === 'patient-portal'
                ? 'bg-[#2d6a4f] text-[#ffffff] shadow-sm'
                : 'text-[#404943] hover:bg-[#e5e8ee] hover:text-[#181c20]'
            }`}
          >
            Patient Portal
          </button>

          <button
            onClick={() => handleNavClick('admin-portal')}
            className={`px-3 py-2 transition-all text-[13px] font-semibold rounded-lg flex items-center gap-1 ${
              activeTab === 'admin-portal'
                ? 'bg-[#0f5238] text-white shadow-sm'
                : 'text-[#707973] hover:bg-[#e5e8ee] hover:text-[#0f5238]'
            }`}
            title="Clinic Operations & Review Management"
          >
            <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
            <span>Admin</span>
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenBooking}
            className="hidden md:inline-flex items-center justify-center bg-[#2d6a4f] text-[#ffffff] font-semibold text-[14px] px-5 py-2.5 rounded-lg hover:bg-[#0f5238] transition-all shadow-sm active:scale-95"
          >
            Book Visit
          </button>

          {/* Profile Portal Avatar */}
          <button
            onClick={() => handleNavClick('patient-portal')}
            title="Patient Comfort Profile"
            className="flex items-center gap-1 p-0.5 rounded-full hover:ring-2 hover:ring-[#2d6a4f] transition-all"
          >
            <img 
              alt="Profile" 
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#b1f0ce]" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7sb8YtVI6DDCeFeDKf-OgO-rNkLaqtMq8voGqPqgYsM0Ek7snTu6aD5tTvuZvOh11J0QjtfwmWDJleAIyolRX_JU3-u-DI_BBGAhM1P_4FGMSzegoEYMXdMmyLsw2ee7QGnh7L3b7CTNp3QEOc3-Ynxl8iRCjjSU4dmqgoVdyt5cDVFJ0IQ0mYcVQ8Lh9OIfAYHdR8zOPqZ6B2wg27AHn1IezRl5gXghv0hEHiMej" 
            />
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg text-[#181c20] hover:bg-[#e5e8ee] transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-[28px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#ffffff] border-b border-[#e5e8ee] px-6 py-4 shadow-lg flex flex-col gap-2 animate-fadeIn">
          <div className="pb-2 border-b border-[#e5e8ee]/60 flex items-center justify-between text-xs text-[#404943]">
            <span>Mon–Sat 9am–8pm, Sun 10am–2pm</span>
            <a href="tel:+919810739638" className="text-[#0f5238] font-bold">
              +91 98107 39638
            </a>
          </div>

          <button
            onClick={() => handleNavClick('home')}
            className={`text-left px-4 py-2.5 rounded-lg text-[15px] font-semibold ${
              activeTab === 'home' ? 'bg-[#2d6a4f] text-white' : 'text-[#181c20] hover:bg-[#f1f4f9]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('treatments-and-services')}
            className={`text-left px-4 py-2.5 rounded-lg text-[15px] font-semibold ${
              activeTab === 'treatments-and-services' ? 'bg-[#2d6a4f] text-white' : 'text-[#181c20] hover:bg-[#f1f4f9]'
            }`}
          >
            Treatments &amp; Services
          </button>
          <button
            onClick={() => handleNavClick('book-appointment')}
            className={`text-left px-4 py-2.5 rounded-lg text-[15px] font-semibold ${
              activeTab === 'book-appointment' ? 'bg-[#2d6a4f] text-white' : 'text-[#181c20] hover:bg-[#f1f4f9]'
            }`}
          >
            Book Appointment
          </button>
          <button
            onClick={() => handleNavClick('patient-portal')}
            className={`text-left px-4 py-2.5 rounded-lg text-[15px] font-semibold ${
              activeTab === 'patient-portal' ? 'bg-[#2d6a4f] text-white' : 'text-[#181c20] hover:bg-[#f1f4f9]'
            }`}
          >
            Patient Portal &amp; Comfort Profile
          </button>
          <button
            onClick={() => handleNavClick('admin-portal')}
            className={`text-left px-4 py-2.5 rounded-lg text-[15px] font-semibold flex items-center justify-between ${
              activeTab === 'admin-portal' ? 'bg-[#0f5238] text-white' : 'text-[#707973] hover:bg-[#f1f4f9]'
            }`}
          >
            <span>Clinic Admin &amp; Reviews</span>
            <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
          </button>

          <div className="pt-3 border-t border-[#e5e8ee] flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full bg-[#2d6a4f] text-white font-semibold py-3 rounded-lg text-center"
            >
              Book Calm Visit
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEmergency();
              }}
              className="w-full bg-[#ffdad6] text-[#ba1a1a] font-semibold py-2.5 rounded-lg text-center flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">emergency</span>
              24/7 Dental Emergency Triage
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

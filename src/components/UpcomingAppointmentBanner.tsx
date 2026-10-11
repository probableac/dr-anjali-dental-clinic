import React, { useState, useEffect } from 'react';
import { Appointment, NavigationTab } from '../types';
import { api } from '../services/api';

interface UpcomingAppointmentBannerProps {
  appointments: Appointment[];
  isAdmin?: boolean;
  onNavigate: (tab: NavigationTab) => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isPast: boolean;
  isNow: boolean;
}

function parseAppointmentDateTime(dateStr: string, timeStr: string): Date | null {
  if (!dateStr) return null;
  try {
    // Try format YYYY-MM-DD
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);

      let hours = 10;
      let minutes = 0;

      if (timeStr) {
        const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
        if (timeMatch) {
          hours = parseInt(timeMatch[1], 10);
          minutes = parseInt(timeMatch[2], 10);
          const meridian = timeMatch[3]?.toUpperCase();
          if (meridian === 'PM' && hours < 12) hours += 12;
          if (meridian === 'AM' && hours === 12) hours = 0;
        }
      }

      const parsed = new Date(year, month, day, hours, minutes, 0);
      if (!isNaN(parsed.getTime())) return parsed;
    }

    // Fallback: standard Date parse
    const fallback = new Date(`${dateStr} ${timeStr || ''}`);
    if (!isNaN(fallback.getTime())) return fallback;
  } catch (e) {
    console.warn('Error parsing appointment datetime:', e);
  }
  return null;
}

function calculateTimeRemaining(targetDate: Date): TimeRemaining {
  const now = new Date().getTime();
  const diff = targetDate.getTime() - now;

  // If within the appointment hour (between 0 and -60 mins), treat as "In Progress"
  const isNow = diff <= 0 && diff > -60 * 60 * 1000;
  const isPast = diff <= -60 * 60 * 1000;

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalMs: diff,
      isPast,
      isNow
    };
  }

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return {
    days,
    hours,
    minutes,
    seconds,
    totalMs: diff,
    isPast: false,
    isNow: false
  };
}

export const UpcomingAppointmentBanner: React.FC<UpcomingAppointmentBannerProps> = ({
  appointments,
  isAdmin: propIsAdmin,
  onNavigate
}) => {
  // Check admin authorization
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof propIsAdmin === 'boolean') return propIsAdmin;
    return api.isAdminAuthenticated();
  });
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [nowTick, setNowTick] = useState<number>(Date.now());

  // Keep admin status updated
  useEffect(() => {
    if (typeof propIsAdmin === 'boolean') {
      setIsAdmin(propIsAdmin);
    } else {
      setIsAdmin(api.isAdminAuthenticated());
    }
  }, [propIsAdmin]);

  // Update clock every second for live countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setNowTick(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isAdmin) {
    return null;
  }

  // Filter for upcoming valid appointments
  const validAppointments = (appointments || [])
    .filter(
      (a) => a.status !== 'Cancelled' && a.status !== 'Completed'
    )
    .map((a) => {
      const parsedDate = parseAppointmentDateTime(a.date, a.timeSlot);
      return {
        appointment: a,
        parsedDate
      };
    })
    .filter((item): item is { appointment: Appointment; parsedDate: Date } => {
      if (!item.parsedDate) return false;
      // Allow ongoing appointments up to 60 mins past start
      return item.parsedDate.getTime() > nowTick - 60 * 60 * 1000;
    })
    .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());

  const nextSlot = validAppointments[0];

  // If no upcoming appointment scheduled
  if (!nextSlot) {
    return (
      <div className="w-full bg-[#f0faf4] border-b border-[#c8eed8] px-4 py-2.5 text-xs text-[#0f5238] flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2 font-medium">
            <span className="material-symbols-outlined text-[16px] text-[#00734d]">verified_user</span>
            <span className="bg-[#92f7c3]/60 text-[#005236] px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
              Admin View
            </span>
            <span>No pending appointments for today. Next slots will sync automatically from Firestore.</span>
          </div>
          <button
            onClick={() => onNavigate('admin-portal')}
            className="text-[11px] font-bold text-[#00734d] hover:underline flex items-center gap-1"
          >
            <span>Open Admin Dashboard</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      </div>
    );
  }

  const { appointment, parsedDate } = nextSlot;
  const timeRemaining = calculateTimeRemaining(parsedDate);
  const whatsAppLink = api.generatePatientConfirmationWhatsAppLink(appointment);

  if (isCollapsed) {
    return (
      <div className="w-full bg-[#0a3826] text-white border-b border-[#062418] px-4 py-2 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#92f7c3] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#92f7c3]"></span>
            </span>
            <span className="bg-[#92f7c3] text-[#003823] font-bold px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">
              Next Consult
            </span>
            <span className="font-semibold text-[#e1f5eb]">
              {appointment.patientName} ({appointment.treatmentName})
            </span>
            <span className="text-[#a4dfbf]">
              • {appointment.timeSlot}
            </span>
            <span className="font-mono bg-[#114b34] px-2 py-0.5 rounded text-[#92f7c3] text-[11px] font-bold">
              {timeRemaining.isNow
                ? 'IN PROGRESS'
                : `${timeRemaining.days > 0 ? `${timeRemaining.days}d ` : ''}${String(timeRemaining.hours).padStart(2, '0')}h ${String(timeRemaining.minutes).padStart(2, '0')}m ${String(timeRemaining.seconds).padStart(2, '0')}s`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('admin-portal')}
              className="text-[#92f7c3] hover:text-white font-medium text-[11px] flex items-center gap-0.5 px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors"
            >
              <span>Manage</span>
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            </button>
            <button
              onClick={() => setIsCollapsed(false)}
              className="text-white/70 hover:text-white p-1"
              title="Expand summary card"
              aria-label="Expand summary card"
            >
              <span className="material-symbols-outlined text-[18px]">expand_more</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-[#0a3826] via-[#0f5238] to-[#125c3e] text-white border-b-2 border-[#92f7c3]/40 shadow-md relative z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          {/* Left Column: Admin Tag & Patient Info */}
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#92f7c3]/20 border border-[#92f7c3]/30 flex items-center justify-center shrink-0 text-[#92f7c3]">
              <span className="material-symbols-outlined text-[22px]">timer</span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#92f7c3] text-[#003823] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wide shadow-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">lock</span>
                  Admin Alert
                </span>
                <span className="text-[#a8e8cb] text-xs font-medium">
                  Next Scheduled Patient
                </span>
                <span className="text-white/40 text-xs">•</span>
                <span className="text-[#d8f5e7] text-xs">
                  Ref: <span className="font-mono text-white/90">{appointment.id.slice(0, 10)}</span>
                </span>
              </div>

              <div className="flex items-baseline gap-2 mt-0.5 flex-wrap">
                <h4 className="text-base font-bold text-white tracking-tight">
                  {appointment.patientName}
                </h4>
                <span className="text-white/60 text-xs">for</span>
                <span className="text-[#92f7c3] text-sm font-semibold">
                  {appointment.treatmentName}
                </span>
                <span className="text-white/40 text-xs">•</span>
                <span className="text-white/80 text-xs">
                  {appointment.dentist || 'Dr. Anjali Bhardwaj'}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#b8ebd2] mt-0.5 flex-wrap">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                  {appointment.date}
                </span>
                <span className="flex items-center gap-1 font-semibold text-white">
                  <span className="material-symbols-outlined text-[14px] text-[#92f7c3]">schedule</span>
                  {appointment.timeSlot}
                </span>
                {appointment.patientPhone && (
                  <span className="flex items-center gap-1 text-white/80">
                    <span className="material-symbols-outlined text-[14px]">call</span>
                    {appointment.patientPhone}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Live Countdown Box & One-Click Actions */}
          <div className="flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 border-white/10 pt-2 md:pt-0">
            {/* Countdown Badge */}
            <div className="bg-[#062418]/80 border border-[#92f7c3]/30 rounded-xl px-3.5 py-1.5 flex flex-col items-center justify-center shrink-0 shadow-inner min-w-[140px]">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#92f7c3]">
                <span className="flex h-1.5 w-1.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#92f7c3] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#92f7c3]"></span>
                </span>
                {timeRemaining.isNow ? 'STATUS' : 'STARTS IN'}
              </div>

              {timeRemaining.isNow ? (
                <div className="text-sm font-extrabold text-[#ffe066] tracking-wide animate-pulse">
                  IN PROGRESS
                </div>
              ) : (
                <div className="font-mono text-base font-black text-white tracking-wider flex items-baseline gap-1">
                  {timeRemaining.days > 0 && (
                    <span>
                      {timeRemaining.days}<span className="text-[10px] text-[#92f7c3] font-sans mr-1">d</span>
                    </span>
                  )}
                  <span>
                    {String(timeRemaining.hours).padStart(2, '0')}<span className="text-[10px] text-[#92f7c3] font-sans mr-1">h</span>
                  </span>
                  <span>
                    {String(timeRemaining.minutes).padStart(2, '0')}<span className="text-[10px] text-[#92f7c3] font-sans mr-1">m</span>
                  </span>
                  <span className="text-[#92f7c3]">
                    {String(timeRemaining.seconds).padStart(2, '0')}<span className="text-[10px] text-white/60 font-sans">s</span>
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              {/* WhatsApp Patient Button */}
              {appointment.patientPhone && (
                <a
                  href={whatsAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba59] text-white p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow flex items-center gap-1.5"
                  title="Send WhatsApp confirmation / reminder to patient"
                >
                  <span className="material-symbols-outlined text-[17px]">chat</span>
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
              )}

              {/* Phone Call Button */}
              {appointment.patientPhone && (
                <a
                  href={`tel:${appointment.patientPhone}`}
                  className="bg-white/10 hover:bg-white/20 text-white p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5"
                  title="Call patient"
                >
                  <span className="material-symbols-outlined text-[17px]">call</span>
                  <span className="hidden sm:inline">Call</span>
                </a>
              )}

              {/* View in Admin Portal */}
              <button
                onClick={() => onNavigate('admin-portal')}
                className="bg-[#92f7c3] hover:bg-[#b2f9d5] text-[#003823] px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                title="Open patient record in Admin Portal"
              >
                <span>Manage</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>

              {/* Collapse Toggle */}
              <button
                onClick={() => setIsCollapsed(true)}
                className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors ml-1"
                title="Minimize banner"
                aria-label="Minimize banner"
              >
                <span className="material-symbols-outlined text-[20px]">expand_less</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import type { ReactNode } from "react";

function I({ children, className = "w-5 h-5" }: { children: ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const IcPencil = ({ className }: { className?: string }) => (
  <I className={className}>
    <path d="M17 3.5a2.1 2.1 0 0 1 3 3L8.5 18l-4.2 1.2L5.5 15 17 3.5Z" />
    <path d="m14.5 6 3 3" />
  </I>
);
export const IcCap = ({ className }: { className?: string }) => (
  <I className={className}>
    <path d="m2.5 9 9.5-4.5L21.5 9 12 13.5 2.5 9Z" />
    <path d="M6.5 11.2v4.3c0 1.2 2.5 2.5 5.5 2.5s5.5-1.3 5.5-2.5v-4.3" />
    <path d="M21.5 9v5" />
  </I>
);
export const IcChat = ({ className }: { className?: string }) => (
  <I className={className}>
    <path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12Z" />
    <path d="M8.5 10.5h7M8.5 13.8h4.5" />
  </I>
);
export const IcBook = ({ className }: { className?: string }) => (
  <I className={className}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5Z" />
    <path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20" />
    <path d="M9 8h7" />
  </I>
);
export const IcStar = ({ className = "w-4 h-4", filled = true }: { className?: string; filled?: boolean }) => (
  <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="m12 3 2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 16.9l-5.4 2.9 1.1-6.1-4.5-4.3 6.1-.8L12 3Z" strokeLinejoin="round" />
  </svg>
);
export const IcClock = ({ className }: { className?: string }) => (
  <I className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </I>
);
export const IcUsers = ({ className }: { className?: string }) => (
  <I className={className}>
    <circle cx="9" cy="8.5" r="3.2" />
    <path d="M3.5 19.5c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" />
    <path d="M15.5 5.8a3.2 3.2 0 0 1 0 5.4M17.6 14.9c1.6.7 2.6 2.3 2.9 4.6" />
  </I>
);
export const IcPlay = ({ className }: { className?: string }) => (
  <I className={className}>
    <path d="M8 5.5v13l10-6.5-10-6.5Z" />
  </I>
);
export const IcCheck = ({ className }: { className?: string }) => (
  <I className={className}>
    <path d="m4.5 12.5 5 5L19.5 6.5" />
  </I>
);
export const IcPlus = ({ className }: { className?: string }) => (
  <I className={className}>
    <path d="M12 5v14M5 12h14" />
  </I>
);
export const IcPhone = ({ className }: { className?: string }) => (
  <I className={className}>
    <path d="M5.5 4h4l1.5 4.5-2.2 1.6a12.5 12.5 0 0 0 5.1 5.1l1.6-2.2L20 14.5v4a1.8 1.8 0 0 1-2 1.8C10.5 19.5 4.5 13.5 3.7 6a1.8 1.8 0 0 1 1.8-2Z" />
  </I>
);
export const IcMail = ({ className }: { className?: string }) => (
  <I className={className}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="m4.5 7.5 7.5 5.5 7.5-5.5" />
  </I>
);
export const IcPin = ({ className }: { className?: string }) => (
  <I className={className}>
    <path d="M12 21s-6.5-5.4-6.5-10.3a6.5 6.5 0 0 1 13 0C18.5 15.6 12 21 12 21Z" />
    <circle cx="12" cy="10.5" r="2.3" />
  </I>
);
export const IcArrow = ({ className }: { className?: string }) => (
  <I className={className}>
    <path d="M19 12H5m6 6-6-6 6-6" />
  </I>
);
export const IcMenu = ({ className }: { className?: string }) => (
  <I className={className}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </I>
);
export const IcX = ({ className }: { className?: string }) => (
  <I className={className}>
    <path d="m6 6 12 12M18 6 6 18" />
  </I>
);
export const IcFlame = ({ className }: { className?: string }) => (
  <I className={className}>
    <path d="M12 3c.5 3-1.5 4.5-3 6.5a6.5 6.5 0 1 0 10 5.5c0-4.5-3.5-6-3.5-9C14 4.5 13 3.5 12 3Z" />
    <path d="M12 21a3 3 0 0 1-1.5-5.6c.8-.5 1.5-1.4 1.5-2.4 1.5 1 3 2.6 3 4.5A3 3 0 0 1 12 21Z" />
  </I>
);
export const IcShield = ({ className }: { className?: string }) => (
  <I className={className}>
    <path d="M12 3 5 5.8v5.4c0 4.5 3 8 7 9.8 4-1.8 7-5.3 7-9.8V5.8L12 3Z" />
    <path d="m9 11.5 2.2 2.2L15.5 9" />
  </I>
);
export const IcTruck = ({ className }: { className?: string }) => (
  <I className={className}>
    <path d="M2.5 6.5h11v10h-11zM13.5 10h4l3 3v3.5h-7" />
    <circle cx="6.5" cy="17.5" r="1.8" />
    <circle cx="17" cy="17.5" r="1.8" />
  </I>
);
export const IcHeadset = ({ className }: { className?: string }) => (
  <I className={className}>
    <path d="M4.5 13.5v-2a7.5 7.5 0 0 1 15 0v2" />
    <rect x="3.5" y="13" width="4" height="6" rx="1.5" />
    <rect x="16.5" y="13" width="4" height="6" rx="1.5" />
    <path d="M19 19v.5a2.5 2.5 0 0 1-2.5 2.5H13" />
  </I>
);
export const IcCalendar = ({ className }: { className?: string }) => (
  <I className={className}>
    <rect x="4" y="5.5" width="16" height="15" rx="2" />
    <path d="M8 3.5v4M16 3.5v4M4 10.5h16" />
    <path d="M8.5 14.5h2M13.5 14.5h2M8.5 17.5h2" />
  </I>
);
export const IcVideo = ({ className }: { className?: string }) => (
  <I className={className}>
    <rect x="3.5" y="6.5" width="12" height="11" rx="2" />
    <path d="m15.5 10.5 5-3v9l-5-3" />
  </I>
);
export const IcTarget = ({ className }: { className?: string }) => (
  <I className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.8" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" />
  </I>
);
export const IcChart = ({ className }: { className?: string }) => (
  <I className={className}>
    <path d="M4 4v16h16" />
    <path d="m7.5 14 3.5-4 3 2.5 4.5-6" />
  </I>
);
export const IcCart = ({ className }: { className?: string }) => (
  <I className={className}>
    <path d="M3.5 5h2.2l2.1 10.2a1.6 1.6 0 0 0 1.6 1.3h7.7a1.6 1.6 0 0 0 1.6-1.2L20.5 8H7" />
    <circle cx="9.8" cy="20" r="1.4" />
    <circle cx="17" cy="20" r="1.4" />
  </I>
);
export const IcInstagram = ({ className }: { className?: string }) => (
  <I className={className}>
    <rect x="4" y="4" width="16" height="16" rx="4.5" />
    <circle cx="12" cy="12" r="3.6" />
    <circle cx="16.8" cy="7.2" r="0.6" fill="currentColor" />
  </I>
);
export const IcTelegram = ({ className }: { className?: string }) => (
  <I className={className}>
    <path d="m21 4.5-3.2 15.2-6.3-4.5-2.9 2.7.4-4.3L19 6l-12 7.2L3 11.5 21 4.5Z" />
  </I>
);
export const IcYoutube = ({ className }: { className?: string }) => (
  <I className={className}>
    <rect x="3" y="6" width="18" height="12.5" rx="3.5" />
    <path d="m10.5 9.5 4.5 2.7-4.5 2.7v-5.4Z" />
  </I>
);
export const IcWhatsapp = ({ className }: { className?: string }) => (
  <I className={className}>
    <path d="M12 3.8a8.2 8.2 0 0 0-7.1 12.3L3.6 20.4l4.4-1.2A8.2 8.2 0 1 0 12 3.8Z" />
    <path d="M9 8.8c-.4 1.7 2.6 6 5.8 6.2.9 0 1.7-.5 1.7-1.3 0-.6-1-1.2-1.8-1.5-.5-.2-1 .3-1.3.5-.9-.3-2.2-1.6-2.4-2.5.3-.3.7-.7.5-1.2C11.3 8.3 9.2 8 9 8.8Z" />
  </I>
);
export const IcGear = ({ className }: { className?: string }) => (
  <I className={className}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6M5.5 5.5l1.8 1.8M16.7 16.7l1.8 1.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8" />
  </I>
);
export const IcSpark = ({ className }: { className?: string }) => (
  <I className={className}>
    <path d="M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 18l-1.8-5.4L4.5 10.8 10.2 9 12 3.5Z" />
    <path d="M19 16.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" />
  </I>
);

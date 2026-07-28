type IconProps = {
  name: string;
  className?: string;
};

export function Icon({ name, className }: IconProps) {
  const common = className ?? "h-5 w-5";
  switch (name) {
    case "calendar":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="4" width="18" height="17" rx="2" />
          <path d="M3 9h18M8 2v4M16 2v4" strokeLinecap="round" />
        </svg>
      );
    case "people":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="9" cy="8" r="3.2" />
          <path d="M3.5 19c0-3 2.5-4.5 5.5-4.5S14.5 16 14.5 19" strokeLinecap="round" />
          <circle cx="17" cy="9" r="2.6" />
          <path d="M15 19c0-2.2 1.4-3.4 3.2-3.4S21.5 16.8 21.5 19" strokeLinecap="round" />
        </svg>
      );
    case "package":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M21 8 12 3 3 8l9 5 9-5Z" strokeLinejoin="round" />
          <path d="M3 8v8l9 5 9-5V8" strokeLinejoin="round" />
          <path d="M12 13v8" strokeLinejoin="round" />
        </svg>
      );
    case "book":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 4.5C4 3.7 4.7 3 5.5 3H13v16H5.5C4.7 19 4 19.7 4 20.5V4.5Z" />
          <path d="M20 4.5C20 3.7 19.3 3 18.5 3H11v16h7.5c.8 0 1.5.7 1.5 1.5V4.5Z" />
        </svg>
      );
    case "lifebuoy":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="3.6" />
          <path d="M5 5l3 3M19 5l-3 3M5 19l3-3M19 19l-3-3" strokeLinecap="round" />
        </svg>
      );
    case "tree":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="9" y="3" width="6" height="5" rx="1" />
          <rect x="3" y="16" width="6" height="5" rx="1" />
          <rect x="15" y="16" width="6" height="5" rx="1" />
          <path d="M12 8v3M6 16v-2h12v2" strokeLinecap="round" />
        </svg>
      );
    case "invoice":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M6 3h9l3 3v15H6z" strokeLinejoin="round" />
          <path d="M9 9h6M9 13h6M9 17h3" strokeLinecap="round" />
        </svg>
      );
    case "doc":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M7 3h7l4 4v14H7z" strokeLinejoin="round" />
          <path d="M14 3v4h4" strokeLinejoin="round" />
          <path d="M10 12h6M10 16h6" strokeLinecap="round" />
        </svg>
      );
    case "chart":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 20V4M4 20h16" strokeLinecap="round" />
          <path d="M8 16v-3M12 16V9M16 16v-6" strokeLinecap="round" />
        </svg>
      );
    case "wallet":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="6" width="18" height="13" rx="2" />
          <path d="M3 9h18M17 13h2" strokeLinecap="round" />
        </svg>
      );
    case "megaphone":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 10v4h4l8 4V6L8 10H4Z" strokeLinejoin="round" />
          <path d="M18 9a3 3 0 0 1 0 6" strokeLinecap="round" />
        </svg>
      );
    case "gift":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="8" width="18" height="5" rx="1" />
          <path d="M5 13v8h14v-8M12 8v13" />
          <path d="M12 8S10 4 7.5 4 5 6.5 5 8M12 8s2-4 4.5-4S19 6.5 19 8" strokeLinecap="round" />
        </svg>
      );
    case "target":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      );
    case "tag":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9-9-9Z" strokeLinejoin="round" />
          <circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      );
    case "pdf":
    case "docx":
    case "xlsx":
    case "pptx":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M7 3h7l4 4v14H7z" strokeLinejoin="round" />
          <path d="M14 3v4h4" strokeLinejoin="round" />
        </svg>
      );
    case "link":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66L11 7" strokeLinecap="round" />
          <path d="M14 10a4 4 0 0 0-5.66 0l-3 3A4 4 0 0 0 11 18.66L13 17" strokeLinecap="round" />
        </svg>
      );
    case "folder":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z" strokeLinejoin="round" />
        </svg>
      );
    case "finance":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 20V8M10 20V4M16 20v-8M22 20H2" strokeLinecap="round" />
          <path d="M6 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM12 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "admin":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M5 21V10l7-5 7 5v11" strokeLinejoin="round" />
          <path d="M10 21v-6h4v6" strokeLinejoin="round" />
        </svg>
      );
    case "sales":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 20h18M6 20V11l5 3 5-3v9M9 14V9l3 1 3-1v5" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      );
    case "tech":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M9 20h6M12 16v4" strokeLinecap="round" />
          <path d="M7 9l2 2-2 2M11 13h4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

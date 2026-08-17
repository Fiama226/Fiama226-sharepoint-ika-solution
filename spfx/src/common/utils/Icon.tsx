import * as React from "react";

export interface IIconProps {
  name: string;
  className?: string;
  title?: string;
}

type PathSet = React.ReactElement;

const S = (d: string, extra?: Record<string, string>): PathSet =>
  React.createElement("path", { d, strokeLinecap: "round", strokeLinejoin: "round", ...extra });

const C = (cx: number, cy: number, r: number, filled?: boolean): PathSet =>
  React.createElement("circle", {
    cx,
    cy,
    r,
    ...(filled ? { fill: "currentColor", stroke: "none" } : {}),
  });

const R = (
  x: number,
  y: number,
  w: number,
  h: number,
  rx: number
): PathSet =>
  React.createElement("rect", { x, y, width: w, height: h, rx });

const FILE_GLYPH: PathSet[] = [
  S("M7 3h7l4 4v14H7z"),
  S("M14 3v4h4"),
];

/**
 * Icônes « solid » Font Awesome Free (CC BY 4.0), mêmes glyphes que ceux
 * utilisés par la maquette Next.js (react-icons/fa6) : bullhorn,
 * calendar-day, arrow-right, star, fire, envelope, phone.
 * Rendues en mode remplissage (viewBox 0 0 512 512).
 */
const FA_REGISTRY: Record<string, string> = {
  "fa-bullhorn":
    "M480 32c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9L381.7 53c-48 48-113.1 75-181 75l-8.7 0-32 0-96 0c-35.3 0-64 28.7-64 64l0 96c0 35.3 28.7 64 64 64l0 128c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32l0-128 8.7 0c67.9 0 133 27 181 75l43.6 43.6c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6l0-147.6c18.6-8.8 32-32.5 32-60.4s-13.4-51.6-32-60.4L480 32zm-64 76.7L416 240l0 131.3C357.2 317.8 280.5 288 200.7 288l-8.7 0 0-96 8.7 0c79.8 0 156.5-29.8 215.3-83.3z",
  "fa-calendar-day":
    "M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 48 0c26.5 0 48 21.5 48 48l0 48L0 160l0-48C0 85.5 21.5 64 48 64l48 0 0-32c0-17.7 14.3-32 32-32zM0 192l448 0 0 272c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 192zm80 64c-8.8 0-16 7.2-16 16l0 96c0 8.8 7.2 16 16 16l96 0c8.8 0 16-7.2 16-16l0-96c0-8.8-7.2-16-16-16l-96 0z",
  "fa-arrow-right":
    "M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z",
  "fa-star":
    "M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z",
  "fa-fire":
    "M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z",
  "fa-envelope":
    "M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z",
  "fa-phone":
    "M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z",
};

const REGISTRY: Record<string, PathSet[]> = {
  calendar: [R(3, 4, 18, 17, 2), S("M3 9h18M8 2v4M16 2v4")],
  people: [
    C(9, 8, 3.2),
    S("M3.5 19c0-3 2.5-4.5 5.5-4.5S14.5 16 14.5 19"),
    C(17, 9, 2.6),
    S("M15 19c0-2.2 1.4-3.4 3.2-3.4S21.5 16.8 21.5 19"),
  ],
  package: [S("M21 8 12 3 3 8l9 5 9-5Z"), S("M3 8v8l9 5 9-5V8"), S("M12 13v8")],
  book: [
    S("M4 4.5C4 3.7 4.7 3 5.5 3H13v16H5.5C4.7 19 4 19.7 4 20.5V4.5Z"),
    S("M20 4.5C20 3.7 19.3 3 18.5 3H11v16h7.5c.8 0 1.5.7 1.5 1.5V4.5Z"),
  ],
  lifebuoy: [C(12, 12, 9), C(12, 12, 3.6), S("M5 5l3 3M19 5l-3 3M5 19l3-3M19 19l-3-3")],
  tree: [R(9, 3, 6, 5, 1), R(3, 16, 6, 5, 1), R(15, 16, 6, 5, 1), S("M12 8v3M6 16v-2h12v2")],
  invoice: [S("M6 3h9l3 3v15H6z"), S("M15 3v4h3"), S("M9 12h6M9 16h4")],
  doc: [S("M7 3h7l4 4v14H7z"), S("M14 3v4h4"), S("M10 12h6M10 16h6")],
  chart: [S("M4 20V4M4 20h16"), S("M8 16v-3M12 16V9M16 16v-6")],
  wallet: [R(3, 6, 18, 13, 2), S("M3 9h18M17 13h2")],
  megaphone: [S("M4 10v4h4l8 4V6L8 10H4Z"), S("M18 9a3 3 0 0 1 0 6")],
  gift: [
    R(3, 8, 18, 5, 1),
    S("M5 13v8h14v-8M12 8v13"),
    S("M12 8S10 4 7.5 4 5 6.5 5 8M12 8s2-4 4.5-4S19 6.5 19 8"),
  ],
  target: [C(12, 12, 9), C(12, 12, 5), C(12, 12, 1.4, true)],
  tag: [S("M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9-9-9Z"), C(8, 8, 1.4, true)],
  pdf: FILE_GLYPH,
  docx: FILE_GLYPH,
  xlsx: FILE_GLYPH,
  pptx: FILE_GLYPH,
  link: [
    S("M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66L11 7"),
    S("M14 10a4 4 0 0 0-5.66 0l-3 3A4 4 0 0 0 11 18.66L13 17"),
  ],
  folder: [S("M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z")],
  finance: [S("M4 20V4M4 20h16"), S("M8 16v-3M12 16V9M16 16v-6")],
  admin: [R(3, 4, 18, 16, 2), S("M3 9h18M8 14h8")],
  sales: [S("M4 18 10 12l4 4 6-7"), S("M20 9h-4M20 9v4")],
  tech: [S("M8 6 3 12l5 6"), S("M16 6l5 6-5 6"), S("M13 4 11 20")],

  Code2: [S("M8 6 3 12l5 6"), S("M16 6l5 6-5 6")],
  Layers: [S("M12 2 2 7l10 5 10-5-10-5Z"), S("M2 17l10 5 10-5"), S("M2 12l10 5 10-5")],
  FileEdit: [S("M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"), S("M18.5 2.5a2.1 2.1 0 0 1 3 3L15 12l-4 1 1-4Z")],
  GitBranch: [S("M6 3v12"), C(6, 18, 3), C(18, 6, 3), S("M18 9c0 4-6 3-6 9")],
  CreditCard: [R(2, 5, 20, 14, 2), S("M2 10h20")],
  Shield: [S("M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6l-8-3Z")],
  ShieldCheck: [S("M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6l-8-3Z"), S("M9 12l2 2 4-4")],
  Users: [
    C(9, 8, 3.2),
    S("M3.5 19c0-3 2.5-4.5 5.5-4.5S14.5 16 14.5 19"),
    C(17, 9, 2.6),
    S("M15 19c0-2.2 1.4-3.4 3.2-3.4S21.5 16.8 21.5 19"),
  ],
  Globe: [C(12, 12, 9), S("M3 12h18"), S("M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z")],
  Clock: [C(12, 12, 9), S("M12 7v5l3 2")],
  Heart: [S("M12 20s-7-4.4-7-9.3A4 4 0 0 1 12 8a4 4 0 0 1 7 2.7c0 4.9-7 9.3-7 9.3Z")],
  Headphones: [S("M4 14v-2a8 8 0 0 1 16 0v2"), R(2, 14, 5, 7, 2), R(17, 14, 5, 7, 2)],
  Database: [S("M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3Z"), S("M20 6v12c0 1.7-3.6 3-8 3s-8-1.3-8-3V6"), S("M20 12c0 1.7-3.6 3-8 3s-8-1.3-8-3")],
  FileText: [S("M7 3h7l4 4v14H7z"), S("M14 3v4h4"), S("M10 12h6M10 16h6")],
  Settings: [C(12, 12, 3), S("M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2 2 2 0 1 1-4 0 1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 15a2 2 0 1 1 0-4 1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 4.1a2 2 0 1 1 4 0 1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 21 11a2 2 0 1 1 0 4Z")],
  Scale: [S("M12 3v18M7 21h10"), S("M5 7h14"), S("M5 7 2 13h6L5 7Z"), S("M19 7l-3 6h6l-3-6Z")],
  Plane: [S("M2 13l20-8-8 20-2-8-8-4Z")],
  Megaphone: [S("M4 10v4h4l8 4V6L8 10H4Z"), S("M18 9a3 3 0 0 1 0 6")],
  Briefcase: [R(2, 7, 20, 14, 2), S("M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2")],
  Calculator: [R(4, 2, 16, 20, 2), S("M8 6h8"), S("M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h8")],
  Rocket: [S("M9 15c-3 1-4 5-4 5s4-1 5-4"), S("M15 9a9 9 0 0 1-6 6l-3-3a9 9 0 0 1 6-6c3-3 7-3 7-3s0 4-3 7Z"), C(15, 9, 1.2, true)],
  Award: [C(12, 9, 6), S("M9 14l-2 7 5-3 5 3-2-7")],
  Star: [S("M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z")],
  FolderOpen: [S("M3 8a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v1H3V8Z"), S("M3 11h18l-2 8a2 2 0 0 1-2 1.5H6A2 2 0 0 1 4 19L3 11Z")],
  Target: [C(12, 12, 9), C(12, 12, 5), C(12, 12, 1.4, true)],
  Building2: [R(3, 3, 8, 18, 1), R(13, 8, 8, 13, 1), S("M6 7h2M6 11h2M6 15h2M16 12h2M16 16h2")],
  Mail: [R(2, 5, 20, 14, 2), S("M2 7l10 6 10-6")],
  Phone: [S("M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z")],
  MapPin: [S("M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z"), C(12, 10, 2.6)],
  Zap: [S("M13 2 4 14h7l-1 8 9-12h-7l1-8Z")],
  Home: [S("M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-9.5Z")],
  "arrow-right": [S("M5 12h14M13 5l7 7-7 7")],
  Bell: [S("M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"), S("M10.3 21a1.94 1.94 0 0 0 3.4 0")],
  Search: [C(11, 11, 8), S("M21 21l-4.35-4.35")],
  Menu: [S("M4 6h16M4 12h16M4 18h16")],
  X: [S("M18 6 6 18M6 6l12 12")],
  ChevronDown: [S("M6 9l6 6 6-6")],
  ChevronLeft: [S("M15 18l-6-6 6-6")],
  ChevronRight: [S("M9 18l6-6-6-6")],
  BookOpen: [
    S("M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"),
    S("M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"),
  ],
  Wrench: [
    S("M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"),
  ],
  Calendar: [R(3, 4, 18, 17, 2), S("M3 9h18M8 2v4M16 2v4")],
  Cake: [
    S("M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"),
    S("M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"),
    S("M2 21h20"),
    S("M7 8v3M12 8v3M17 8v3"),
    S("M7 4h.01M12 4h.01M17 4h.01"),
  ],
  Filter: [S("M22 3H2l8 9.46V19l4 2v-8.54L22 3z")],
  TrendingUp: [S("M22 7l-8.5 8.5-5-5L2 17"), S("M16 7h6v6")],
  CheckCircle2: [C(12, 12, 10), S("m9 12 2 2 4-4")],
  AlertCircle: [C(12, 12, 10), S("M12 8v4M12 16h.01")],
  Cpu: [
    R(4, 4, 16, 16, 2),
    R(9, 9, 6, 6, 2),
    S("M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"),
  ],
  BarChart3: [S("M3 3v18h18"), S("M18 17V9"), S("M13 17V5"), S("M8 17v-3")],
  File: [S("M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"), S("M14 2v4a2 2 0 0 0 2 2h4")],
  FileCode: [
    S("M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"),
    S("M14 2v6h6"),
    S("m10 13-2 2 2 2"),
    S("m14 17 2-2-2-2"),
  ],
  Table: [R(3, 3, 18, 18, 2), S("M12 3v18"), S("M3 12h18")],
  Download: [S("M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"), S("M7 10l5 5 5-5"), S("M12 15V3")],
  Eye: [S("M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"), C(12, 12, 3)],
  ImageIcon: [R(3, 3, 18, 18, 2), C(9, 9, 2), S("m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21")],
};

const FA_VIEWBOX: Record<string, string> = {
  "fa-bullhorn": "0 0 512 512",
  "fa-calendar-day": "0 0 448 512",
  "fa-arrow-right": "0 0 448 512",
  "fa-star": "0 0 576 512",
  "fa-fire": "0 0 448 512",
  "fa-envelope": "0 0 512 512",
  "fa-phone": "0 0 512 512",
};

const FA_PATH = (d: string): React.ReactElement =>
  React.createElement("path", { d });

export const Icon: React.FC<IIconProps> = (props) => {
  const { name, className, title } = props;

  // Icônes « solid » Font Awesome (remplissage, viewBox 512)
  const faPath = FA_REGISTRY[name];
  if (faPath) {
    return React.createElement(
      "svg",
      {
        className: className || "ika-h-5 ika-w-5",
        viewBox: FA_VIEWBOX[name] || "0 0 512 512",
        fill: "currentColor",
        role: title ? "img" : "presentation",
        "aria-hidden": title ? undefined : true,
        "aria-label": title,
        focusable: "false",
      },
      FA_PATH(faPath)
    );
  }

  const paths = REGISTRY[name];

  if (!paths) return null;

  return React.createElement(
    "svg",
    {
      className: className || "ika-h-5 ika-w-5",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      role: title ? "img" : "presentation",
      "aria-hidden": title ? undefined : true,
      "aria-label": title,
      focusable: "false",
    },
    ...paths.map((node, index) => React.cloneElement(node, { key: index }))
  );
};

export function hasIcon(name: string): boolean {
  return Object.prototype.hasOwnProperty.call(REGISTRY, name);
}

export function getIconNames(): string[] {
  return Object.keys(REGISTRY);
}

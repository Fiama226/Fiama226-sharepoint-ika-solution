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
  Bell: [S("M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"), S("M10 21h4")],
  gift: [
    R(3, 8, 18, 5, 1),
    S("M5 13v8h14v-8M12 8v13"),
    S("M12 8S10 4 7.5 4 5 6.5 5 8M12 8s2-4 4.5-4S19 6.5 19 8"),
  ],
  target: [C(12, 12, 9), C(12, 12, 5), C(12, 12, 1.4, true)],
  Search: [C(10.5, 10.5, 6.5), S("M16 16l5 5")],
  tag: [S("M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9-9-9Z"), C(8, 8, 1.4, true)],
  ChevronDown: [S("M6 9l6 6 6-6")],
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
  "arrow-right": [S("M5 12h14M13 5l7 7-7 7")]
};

export const Icon: React.FC<IIconProps> = (props) => {
  const { name, className, title } = props;
  const paths = REGISTRY[name];

  if (!paths) return null;

  return React.createElement(
    "svg",
    {
      className: className || "ika-h-5 ika-w-5",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.8,
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

export type DepartementSlug =
  | "comptabilite"
  | "administration"
  | "commerciaux"
  | "techniciens";

export type Scope = "global" | DepartementSlug;

export interface Company {
  name: string;
  tagline: string;
  legalName: string;
  address: string;
  email: string;
  phone: string;
  siret: string;
  currentUser: string;
  currentUserRole: string;
  copyrightYears: string;
}

export interface Departement {
  slug: DepartementSlug;
  name: string;
  tagline: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  accent: "navy" | "cyan";
  icon: string;
}

export interface QuickLink {
  id: string;
  scope: Scope;
  label: string;
  href: string;
  description?: string;
  icon: string;
}

export type NewsCategory =
  | "entreprise"
  | "rh"
  | "projet"
  | "finance"
  | "admin"
  | "commercial"
  | "technique"
  | "evenement";

export interface News {
  id: string;
  scope: Scope;
  title: string;
  excerpt: string;
  category: NewsCategory;
  author: string;
  date: string;
  highlighted?: boolean;
}

export type DocumentType =
  | "pdf"
  | "docx"
  | "xlsx"
  | "pptx"
  | "link"
  | "folder";

export interface DocumentItem {
  id: string;
  scope: Scope;
  title: string;
  type: DocumentType;
  modifiedAt: string;
  modifiedBy: string;
  size?: string;
}

export interface TeamMember {
  id: string;
  scope: Scope;
  name: string;
  role: string;
  email: string;
  phone?: string;
  location?: string;
}

export interface EventItem {
  id: string;
  scope: Scope;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
}

// ─── HOME (page d'accueil) ─────────────────────────────────────
// Types spécifiques à la home. Les données vivent dans data/home.ts ;
// les composants les reçoivent par props (jamais d'import direct de
// data/) — c'est ce qui permet la migration 1:1 vers SPFx.

export interface HomeHeroSlide {
  image: string;
  caption: string;
  sub: string;
}

export interface HomeMission {
  tag: string;
  title: string;
  text: string;
  icon: string;
}

export interface HomeHeroStat {
  label: string;
  value: string;
  icon: string;
}

export interface HomeFeaturedDoc {
  title: string;
  icon: string;
  href: string;
}

export interface HomeQuickAccess {
  title: string;
  icon: string;
  href: string;
}

export interface HomeEvent {
  id: number;
  month: string;
  day: string;
  title: string;
  date: string;
  image: string;
  tag: string;
}

export interface HomeNewsItem {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  href: string;
}

export interface HomeGalleryImage {
  id: number;
  url: string;
  caption: string;
  category: string;
}

export interface HomeAnnouncement {
  id: number;
  type: "mariage" | "anniversaire" | "naissance" | "evenement";
  title: string;
  detail: string;
  date: string;
  emoji: string;
}

export interface HomeCollaborator {
  id: number;
  name: string;
  occupation: string;
  department: string;
  birthdate: string;
  location: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface HomeEmployeeOfMonth {
  name: string;
  role: string;
  department: string;
  quote: string;
  nominatedBy: string;
  avatar: string;
  month: string;
}

export type HomeProjectStatus = "on-track" | "at-risk" | "delayed";

export interface HomeProject {
  id: number;
  name: string;
  lead: string;
  progress: number;
  status: HomeProjectStatus;
  due: string;
  tasks: { done: number; total: number };
}

export interface HomeDepartmentCard {
  name: string;
  desc: string;
  icon: string;
  accent: string;
  badge: string;
  members: number;
  src: string;
}

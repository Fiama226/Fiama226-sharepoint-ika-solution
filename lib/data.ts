import type {
  Departement,
  DepartementSlug,
  DocumentItem,
  EventItem,
  News,
  QuickLink,
  Scope,
  TeamMember,
} from "@/types/intranet";

import { company } from "@/data/company";
import { departements } from "@/data/departements";
import { documents } from "@/data/documents";
import { events } from "@/data/events";
import * as home from "@/data/home";
import { news } from "@/data/news";
import { quickLinks } from "@/data/quick-links";
import { team } from "@/data/team";

export function getCompany() {
  return company;
}

// ─── HOME (page d'accueil) ─────────────────────────────────────
// Getters spécifiques à la home. Le contenu est conservé dans
// data/home.ts (ton marketing distinct des pages département).

export function getHeroSlides() {
  return home.heroSlides;
}

export function getMissions() {
  return home.missions;
}

export function getHeroStats() {
  return home.heroStats;
}

export function getFeaturedDocs() {
  return home.featuredDocs;
}

export function getHomeQuickAccess() {
  return home.quickAccess;
}

export function getHomeEvents() {
  return home.homeEvents;
}

export function getHomeNews() {
  return home.homeNews;
}

export function getGalleryImages() {
  return home.galleryImages;
}

export function getHomeCollaborators() {
  return home.homeCollaborators;
}

export function getEmployeeOfMonth() {
  return home.employeeOfMonth;
}

export function getProjects() {
  return home.projects;
}

export function getHomeDepartments() {
  return home.homeDepartments;
}

export function getHomeAnnouncements() {
  return home.homeAnnouncements;
}

export function getDepartements(): Departement[] {
  return departements;
}

export function getDepartement(slug: DepartementSlug): Departement | undefined {
  return departements.find((d) => d.slug === slug);
}

export function getQuickLinks(scope: Scope): QuickLink[] {
  return quickLinks.filter((q) => q.scope === scope);
}

export function getNews(scope: Scope): News[] {
  return news
    .filter((n) => n.scope === scope)
    .sort(
      (a, b) =>
        Number(b.highlighted ?? false) - Number(a.highlighted ?? false) ||
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
}

export function getDocuments(scope: Scope): DocumentItem[] {
  return documents
    .filter((d) => d.scope === scope)
    .sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime());
}

export function getTeam(scope: Scope): TeamMember[] {
  return team.filter((m) => m.scope === scope);
}

export function getEvents(scope: Scope): EventItem[] {
  return events
    .filter((e) => e.scope === scope)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

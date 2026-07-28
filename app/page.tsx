import type { Metadata } from "next";
import { HeroSlider } from "@/components/intranet/hero-slider";
import News from "@/components/intranet/News";
import FirstSection from "@/components/intranet/firstSection";
import GalleryAndTeam from "@/components/intranet/before_last_home_page_section";
import IntranetSections from "@/components/intranet/last_home_page section";
import AnnouncementMarquee from "@/components/intranet/announcement-marquee";
import {
  getHeroSlides,
  getMissions,
  getHeroStats,
  getCompany,
  getHomeNews,
  getFeaturedDocs,
  getHomeQuickAccess,
  getHomeEvents,
  getGalleryImages,
  getHomeCollaborators,
  getEmployeeOfMonth,
  getProjects,
  getHomeDepartments,
  getHomeAnnouncements,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "IKA Solution — Intranet",
  description:
    "Portail intranet d'IKA Solution — ingénierie digitale, transformation IT et solutions sur mesure.",
  openGraph: {
    title: "IKA Solution — Intranet",
    description:
      "Portail intranet d'IKA Solution — ingénierie digitale, transformation IT et solutions sur mesure.",
    siteName: "IKA Solution",
    type: "website",
  },
};

export default function HomePage() {
  const company = getCompany();
  const slides = getHeroSlides();
  const missions = getMissions();
  const stats = getHeroStats();
  const news = getHomeNews();
  const featuredDocs = getFeaturedDocs();
  const quickAccess = getHomeQuickAccess();
  const events = getHomeEvents();
  const galleryImages = getGalleryImages();
  const collaborators = getHomeCollaborators();
  const employee = getEmployeeOfMonth();
  const projects = getProjects();
  const departments = getHomeDepartments();
  const announcements = getHomeAnnouncements();

  return (
    <>
      <HeroSlider
        slides={slides}
        missions={missions}
        stats={stats}
        currentUser={company.currentUser}
        currentUserRole={company.currentUserRole}
      />

      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <AnnouncementMarquee announcements={announcements} />
        <News items={news} />
        <FirstSection
          featuredDocs={featuredDocs}
          quickAccess={quickAccess}
          events={events}
        />
        <GalleryAndTeam
          galleryImages={galleryImages}
          collaborators={collaborators}
        />
        <IntranetSections
          employee={employee}
          projects={projects}
          departments={departments}
        />
      </div>
    </>
  );
}

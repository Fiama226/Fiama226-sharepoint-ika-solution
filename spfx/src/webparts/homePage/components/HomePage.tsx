import * as React from "react";

import { IHomePageProps } from "./IHomePageProps";

// Sections regroupées — réutilisation des composants unitaires existants,
// à l'identique de la composition de `app/page.tsx` (maquette Next.js).
import { HeroSlider } from "../../heroSlider/components/HeroSlider";
import { AnnouncementMarquee } from "../../announcementMarquee/components/AnnouncementMarquee";
import { NewsCards } from "../../newsCards/components/NewsCards";
import { QuickAccessPanel } from "../../quickAccessPanel/components/QuickAccessPanel";
import { Gallery } from "../../gallery/components/Gallery";
import { TeamHome } from "../../teamHome/components/TeamHome";
import { IntranetSections } from "../../intranetSections/components/IntranetSections";

/**
 * Squelette de chargement unifié : plutôt que d'empiler 7 squelettes
 * indépendants, on affiche une seule trame qui évoque la page finale
 * (hero plein écran + blocs de contenu) le temps du premier rendu.
 */
const HomePageSkeleton: React.FC = () => (
  <div className="ika-root" aria-hidden="true">
    <div className="ika-h-[70vh] ika-w-full ika-animate-pulse ika-bg-slate-200" />
    <div className="ika-mx-auto ika-max-w-7xl ika-px-4 ika-py-12 sm:ika-px-6 lg:ika-px-8">
      <div className="ika-mb-8 ika-h-6 ika-w-64 ika-rounded ika-bg-slate-200" />
      <div className="ika-grid ika-grid-cols-1 ika-gap-6 md:ika-grid-cols-2 lg:ika-grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className="ika-h-44 ika-rounded-2xl ika-bg-slate-100 ika-animate-pulse"
          />
        ))}
      </div>
    </div>
  </div>
);

export const HomePage: React.FC<IHomePageProps> = (props) => {
  if (props.loading) {
    return <HomePageSkeleton />;
  }

  if (props.error) {
    return (
      <div className="ika-root">
        <div className="ika-mx-auto ika-max-w-7xl ika-px-4 ika-py-12 sm:ika-px-6 lg:ika-px-8">
          <div
            role="alert"
            className="ika-rounded-2xl ika-border ika-border-red-200 ika-bg-red-50 ika-p-6"
          >
            <p className="ika-text-sm ika-font-medium ika-text-red-800">
              {props.error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ika-root ika-bg-white">
      {props.showHero ? (
        <HeroSlider
          slides={props.slides}
          missions={props.missions}
          stats={props.stats}
          currentUser={props.currentUser}
          currentUserRole={props.currentUserRole}
          loading={false}
          heightClass={props.heroHeightClass}
          showClock={props.showHeroClock}
          showPanel={props.showHeroPanel}
        />
      ) : null}

      {props.showMarquee ? (
        <div className="ika-mx-auto ika-max-w-7xl ika-px-4 ika-py-2 sm:ika-px-6 lg:ika-px-8">
          <AnnouncementMarquee
            eyebrow="Annonces"
            title="Célébrations & événements"
            announcements={props.announcements}
            loading={false}
          />
        </div>
      ) : null}

      {props.showNews ? (
        <NewsCards
          eyebrow="Vie interne"
          title="Actualités de l'entreprise"
          description=""
          items={props.news}
          loading={false}
          ctaLabel="Voir toutes les actualités"
        />
      ) : null}

      {props.showQuickAccess ? (
        <QuickAccessPanel
          documentsTitle="Documents clés"
          quickLinksTitle="Accès rapide"
          eventsTitle="Événements"
          featuredDocs={props.featuredDocs}
          quickLinks={props.quickLinks}
          events={props.events}
          loading={false}
        />
      ) : null}

      {props.showGallery ? (
        <Gallery
          title="Galerie"
          description=""
          images={props.galleryImages}
          loading={false}
          showFilters
          mosaicLayout
        />
      ) : null}

      {props.showTeam ? (
        <TeamHome
          title="Notre équipe"
          description="Les talents qui font avancer l'ingénierie digitale"
          members={props.collaborators}
          loading={false}
          showSearch
          showBirthdays
        />
      ) : null}

      {props.showEmployee || props.showProjects ? (
        <IntranetSections
          employeeTitle="Collaborateur du mois"
          projectsTitle="Tableau de bord Projets"
          projectsDescription=""
          employee={props.employee}
          employeePhotoUrl={props.employeePhotoUrl}
          projects={props.projects}
          loading={false}
          showEmployee={props.showEmployee}
          showProjects={props.showProjects}
        />
      ) : null}
    </div>
  );
};

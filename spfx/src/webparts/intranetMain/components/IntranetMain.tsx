import "../../../styles/tailwind.css";

import * as React from "react";

import { IIntranetMainProps } from "./IIntranetMainProps";

// Sections unitaires réutilisées (même code que la maquette Next.js, porté SPFx).
import { HeroSlider } from "../../heroSlider/components/HeroSlider";
import { AnnouncementMarquee } from "../../announcementMarquee/components/AnnouncementMarquee";
import { NewsCards } from "../../newsCards/components/NewsCards";
import { QuickAccessPanel } from "../../quickAccessPanel/components/QuickAccessPanel";
import { Gallery } from "../../gallery/components/Gallery";
import { TeamHome } from "../../teamHome/components/TeamHome";
import { IntranetSections } from "../../intranetSections/components/IntranetSections";

// ---------------------------------------------------------------------------
// Hook : fade-in au scroll (IntersectionObserver)
// ---------------------------------------------------------------------------
// Recrée l'animation « reveal au scroll » de la maquette Next.js. Les sections
// s'opacifient et remontent de 16px quand elles entrent dans le viewport.
// Respecte `prefers-reduced-motion` et l'interrupteur `animationsEnabled`.
// ---------------------------------------------------------------------------
function useReveal(enabled: boolean): React.RefObject<HTMLDivElement> {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState<boolean>(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    // Si les animations sont désactivées, tout afficher d'un coup.
    if (!enabled) {
      setVisible(true);
      return undefined;
    }

    // Respect des préférences système.
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled]);

  // On expose aussi `visible` via un attribut data-CSS pour le style.
  React.useEffect(() => {
    if (ref.current) {
      ref.current.dataset.visible = visible ? "true" : "false";
    }
  }, [visible]);

  return ref;
}

// ---------------------------------------------------------------------------
// Wrapper de section animé
// ---------------------------------------------------------------------------
const RevealSection: React.FC<{
  enabled: boolean;
  className?: string;
  children: React.ReactNode;
}> = (props) => {
  const ref = useReveal(props.enabled);
  const base =
    "ika-transition-all ika-duration-700 ika-ease-out";
  const hidden = props.enabled
    ? "ika-opacity-0 ika-translate-y-4"
    : "ika-opacity-100 ika-translate-y-0";
  const shown = "ika-opacity-100 ika-translate-y-0";
  const cls = `${base} ${
    props.enabled
      ? ref.current?.dataset.visible === "true"
        ? shown
        : hidden
      : shown
  } ${props.className ?? ""}`;

  return (
    <div ref={ref} className={cls}>
      {props.children}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Squelette de chargement unifié (identique design maquette)
// ---------------------------------------------------------------------------
const IntranetMainSkeleton: React.FC<{ heroHeightClass: string }> = (props) => (
  <div className="ika-root" aria-hidden="true" aria-busy="true">
    {/* Hero placeholder */}
    <div
      className={`ika-relative ika-w-full ika-overflow-hidden ika-animate-pulse ika-bg-gradient-to-br ika-from-slate-800 ika-to-slate-900 ${props.heroHeightClass}`}
    >
      <div className="ika-absolute ika-inset-0 ika-bg-gradient-to-r ika-from-black/70 ika-to-transparent" />
    </div>

    <div className="ika-mx-auto ika-max-w-7xl ika-px-4 ika-py-12 sm:ika-px-6 lg:ika-px-8">
      {/* Marquee placeholder */}
      <div className="ika-mb-10 ika-h-12 ika-w-full ika-rounded-full ika-bg-slate-100 ika-animate-pulse" />

      {/* Titre actualités */}
      <div className="ika-mb-6 ika-flex ika-items-end ika-justify-between">
        <div className="ika-h-7 ika-w-56 ika-rounded ika-bg-slate-200 ika-animate-pulse" />
        <div className="ika-h-5 ika-w-28 ika-rounded ika-bg-slate-100 ika-animate-pulse" />
      </div>
      <div className="ika-mb-14 ika-grid ika-grid-cols-1 ika-gap-6 md:ika-grid-cols-2 lg:ika-grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="ika-h-64 ika-rounded-2xl ika-bg-slate-100 ika-animate-pulse"
          />
        ))}
      </div>

      {/* Quick access placeholder */}
      <div className="ika-mb-14 ika-grid ika-grid-cols-1 ika-gap-6 lg:ika-grid-cols-3">
        <div className="ika-h-80 ika-rounded-2xl ika-bg-slate-100 ika-animate-pulse lg:ika-col-span-2" />
        <div className="ika-h-80 ika-rounded-2xl ika-bg-slate-100 ika-animate-pulse" />
      </div>

      {/* Gallery placeholder */}
      <div className="ika-mb-14 ika-h-96 ika-w-full ika-rounded-2xl ika-bg-slate-100 ika-animate-pulse" />

      {/* Team placeholder */}
      <div className="ika-mb-14 ika-grid ika-grid-cols-2 ika-gap-6 md:ika-grid-cols-3 lg:ika-grid-cols-5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="ika-h-52 ika-rounded-2xl ika-bg-slate-100 ika-animate-pulse"
          />
        ))}
      </div>

      {/* Employee + projects placeholder */}
      <div className="ika-grid ika-grid-cols-1 ika-gap-6 lg:ika-grid-cols-2">
        <div className="ika-h-64 ika-rounded-2xl ika-bg-slate-100 ika-animate-pulse" />
        <div className="ika-h-64 ika-rounded-2xl ika-bg-slate-100 ika-animate-pulse" />
      </div>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Composant principal
// ---------------------------------------------------------------------------
export const IntranetMain: React.FC<IIntranetMainProps> = (props) => {
  // Pendant le chargement initial : squelette unifié.
  if (props.loading) {
    return <IntranetMainSkeleton heroHeightClass={props.heroHeightClass} />;
  }

  // En cas d'erreur majeure (≥7 listes indisponibles) : écran d'erreur clair.
  if (props.error) {
    return (
      <div className="ika-root ika-bg-white">
        <div className="ika-mx-auto ika-max-w-7xl ika-px-4 ika-py-20 sm:ika-px-6 lg:ika-px-8">
          <div
            role="alert"
            className="ika-rounded-2xl ika-border ika-border-red-200 ika-bg-red-50 ika-p-8"
          >
            <h2 className="ika-text-lg ika-font-bold ika-text-red-800">
              Contenu momentanément indisponible
            </h2>
            <p className="ika-mt-2 ika-text-sm ika-text-red-700">{props.error}</p>
            <p className="ika-mt-4 ika-text-xs ika-text-red-600">
              Vérifiez que les listes du hub IKA sont bien créées
              (voir la documentation « 11-deploiement-intranet-main.md »).
            </p>
          </div>
        </div>
      </div>
    );
  }

  const animate = props.animationsEnabled;

  return (
    <div
      className="ika-root ika-bg-white ika-text-slate-900"
      data-accent={props.accent}
    >
      {/* ────────────────────────────────────────────────────────────
          1. HERO SLIDER (pleine largeur, hors conteneur comme Next.js)
          ──────────────────────────────────────────────────────────── */}
      {props.showHero ? (
        <HeroSlider
          slides={props.slides}
          missions={props.missions}
          stats={props.stats}
          currentUser={props.currentUser}
          currentUserRole={props.currentUserRole}
          loading={false}
          heightClass={props.heroHeightClass}
          showClock={props.showClock}
          showPanel={props.showWelcomePanel}
        />
      ) : null}

      {/* Conteneur central identique à app/page.tsx */}
      <div className="ika-mx-auto ika-max-w-7xl ika-px-4 sm:ika-px-6 lg:ika-px-8">
        {/* ──────────────────────────────────────────────────────────
            2. BANDEAU D'ANNONCES DÉFILANT
            ────────────────────────────────────────────────────────── */}
        {props.showMarquee ? (
          <RevealSection enabled={animate} className="ika-py-3">
            <AnnouncementMarquee
              eyebrow="Annonces"
              title="Célébrations & événements"
              announcements={props.announcements}
              loading={false}
            />
          </RevealSection>
        ) : null}

        {/* ──────────────────────────────────────────────────────────
            3. ACTUALITÉS (cartes grille)
            ────────────────────────────────────────────────────────── */}
        {props.showNews ? (
          <RevealSection enabled={animate} className="ika-py-2">
            <NewsCards
              eyebrow="Vie interne"
              title="Actualités de l'entreprise"
              description=""
              items={props.news}
              loading={false}
              ctaLabel="Voir toutes les actualités"
            />
          </RevealSection>
        ) : null}

        {/* ──────────────────────────────────────────────────────────
            4. ACCÈS RAPIDE (documents clés + liens + événements)
               Correspond à <FirstSection> dans le Next.js
            ────────────────────────────────────────────────────────── */}
        {props.showQuickAccess ? (
          <RevealSection enabled={animate}>
            <QuickAccessPanel
              documentsTitle="Documents clés"
              quickLinksTitle="Accès rapide"
              eventsTitle="Événements à venir"
              featuredDocs={props.featuredDocs}
              quickLinks={props.quickLinks}
              events={props.events}
              loading={false}
            />
          </RevealSection>
        ) : null}

        {/* ──────────────────────────────────────────────────────────
            5. GALERIE PHOTOS + NOTRE ÉQUIPE
               Correspond à <GalleryAndTeam> dans le Next.js
            ────────────────────────────────────────────────────────── */}
        {props.showGallery ? (
          <RevealSection enabled={animate}>
            <Gallery
              title="Galerie"
              description=""
              images={props.galleryImages}
              loading={false}
              showFilters
              mosaicLayout
            />
          </RevealSection>
        ) : null}

        {props.showTeam ? (
          <RevealSection enabled={animate}>
            <TeamHome
              title="Notre équipe"
              description="Les talents qui font avancer l'ingénierie digitale"
              members={props.collaborators}
              loading={false}
              showSearch
              showBirthdays
            />
          </RevealSection>
        ) : null}

        {/* ──────────────────────────────────────────────────────────
            6. COLLABORATEUR DU MOIS + PROJETS + DÉPARTEMENTS
               Correspond à <IntranetSections> dans le Next.js
            ────────────────────────────────────────────────────────── */}
        {props.showEmployee || props.showProjects ? (
          <RevealSection enabled={animate}>
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
          </RevealSection>
        ) : null}
      </div>

      {/* ── Espacement final pour la respiration de page ── */}
      <div className="ika-h-16" aria-hidden="true" />
    </div>
  );
};

import "../../../styles/tailwind.css";

import * as React from "react";

import { IIntranetMainProps } from "./IIntranetMainProps";
import { DataService } from "../../../services/DataService";
import { IOrgNode } from "../../../models/IIkaModels";

// Sub-components (pure React components ported from Next.js)
import { HeroSlider } from "../../heroSlider/components/HeroSlider";
import { AnnouncementMarquee } from "../../announcementMarquee/components/AnnouncementMarquee";
import { NewsCards } from "../../newsCards/components/NewsCards";
import { QuickAccessPanel } from "../../quickAccessPanel/components/QuickAccessPanel";
import { Gallery } from "../../gallery/components/Gallery";
import { TeamHome } from "../../teamHome/components/TeamHome";
import { IntranetSections } from "../../intranetSections/components/IntranetSections";
import { AnnouncementsList } from "../../announcementsList/components/AnnouncementsList";
import { PriceSheet } from "../../priceSheet/components/PriceSheet";
import { Timeline } from "../../timeline/components/Timeline";
import { OrgChart } from "../../orgChart/components/OrgChart";
import { DocumentsList } from "../../documentsList/components/DocumentsList";
import { EventsCalendar } from "../../eventsCalendar/components/EventsCalendar";
import { FaqList } from "../../faqList/components/FaqList";

// Header & Footer
import { IkaHeader } from "../../../extensions/ikaChrome/components/IkaHeader";
import { IkaFooter } from "../../../extensions/ikaChrome/components/IkaFooter";
import { IChromeContext, INavNode } from "../../../models/IChromeModels";
import {
  STATIC_PRIMARY_NAV,
  STATIC_SECONDARY_NAV,
} from "../../../services/NavigationService";

function parseHashRoute(): string {
  if (typeof window === "undefined") return "accueil";
  const hash = window.location.hash || "";
  const cleaned = hash.replace(/^#\/?(page-)?/, "").toLowerCase().trim();
  const routeName = cleaned.split("?")[0].split("/")[0];
  return routeName || "accueil";
}

function useReveal(enabled: boolean): React.RefObject<HTMLDivElement> {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState<boolean>(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (!enabled) {
      setVisible(true);
      return undefined;
    }

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

  React.useEffect(() => {
    if (ref.current) {
      ref.current.dataset.visible = visible ? "true" : "false";
    }
  }, [visible]);

  return ref;
}

const RevealSection: React.FC<{
  enabled: boolean;
  className?: string;
  children: React.ReactNode;
}> = (props) => {
  const ref = useReveal(props.enabled);
  const base = "ika-transition-all ika-duration-700 ika-ease-out";
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

const IntranetMainSkeleton: React.FC<{ heroHeightClass: string }> = (props) => (
  <div className="ika-root" aria-hidden="true" aria-busy="true">
    <div
      className={`ika-relative ika-w-full ika-overflow-hidden ika-animate-pulse ika-bg-gradient-to-br ika-from-slate-800 ika-to-slate-900 ${props.heroHeightClass}`}
    >
      <div className="ika-absolute ika-inset-0 ika-bg-gradient-to-r ika-from-black/70 ika-to-transparent" />
    </div>

    <div className="ika-mx-auto ika-max-w-7xl ika-px-4 ika-py-12 sm:ika-px-6 lg:ika-px-8">
      <div className="ika-mb-10 ika-h-12 ika-w-full ika-rounded-full ika-bg-slate-100 ika-animate-pulse" />

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

      <div className="ika-mb-14 ika-grid ika-grid-cols-1 ika-gap-6 lg:ika-grid-cols-3">
        <div className="ika-h-80 ika-rounded-2xl ika-bg-slate-100 ika-animate-pulse lg:ika-col-span-2" />
        <div className="ika-h-80 ika-rounded-2xl ika-bg-slate-100 ika-animate-pulse" />
      </div>

      <div className="ika-mb-14 ika-h-96 ika-w-full ika-rounded-2xl ika-bg-slate-100 ika-animate-pulse" />

      <div className="ika-mb-14 ika-grid ika-grid-cols-2 ika-gap-6 md:ika-grid-cols-3 lg:ika-grid-cols-5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="ika-h-52 ika-rounded-2xl ika-bg-slate-100 ika-animate-pulse"
          />
        ))}
      </div>

      <div className="ika-grid ika-grid-cols-1 ika-gap-6 lg:ika-grid-cols-2">
        <div className="ika-h-64 ika-rounded-2xl ika-bg-slate-100 ika-animate-pulse" />
        <div className="ika-h-64 ika-rounded-2xl ika-bg-slate-100 ika-animate-pulse" />
      </div>
    </div>
  </div>
);

export const IntranetMain: React.FC<IIntranetMainProps> = (props) => {
  const [currentRoute, setCurrentRoute] = React.useState<string>(() => {
    return parseHashRoute() || props.initialView || "accueil";
  });

  // Écoute des changements de hash dans l'URL pour la navigation SPA (comme Coris)
  React.useEffect(() => {
    const handleHashChange = (): void => {
      const nextRoute = parseHashRoute();
      setCurrentRoute(nextRoute);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleNavigate = (route: string): void => {
    const cleanRoute = route.replace(/^#\/?(page-)?/, "") || "accueil";
    setCurrentRoute(cleanRoute);
    window.location.hash = `#${cleanRoute}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const orgRoots: IOrgNode[] = React.useMemo(() => {
    return DataService.buildTree(props.collaborators);
  }, [props.collaborators]);

  const animate = props.animationsEnabled;

  // Les hooks ci-dessous doivent être appelés INCONDITIONNELLEMENT (avant tout
  // return anticipé). Placer un early-return avant un useMemo change le nombre
  // de hooks entre deux rendus et provoque en React 17 une erreur fatale
  // « Rendered more hooks than during the previous render » → écran blanc.
  const chromeContext = React.useMemo<IChromeContext>(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const sitePath =
      typeof window !== "undefined"
        ? window.location.pathname.split("/").slice(0, 3).join("/")
        : "";
    const hubUrl = `${origin}${sitePath}`;
    const siteUrl = `${origin}${sitePath}`;
    return {
      currentUser: {
        displayName: props.currentUser || "Collaborateur IKA",
        email: "contact@ikasolution.com",
        loginName: "",
        photoUrl: "",
        isSiteAdmin: false,
      },
      currentPath: window.location.pathname,
      hubUrl,
      siteUrl,
      logoUrl: props.logoUrl || `${hubUrl}/SiteAssets/logo.png`,
    };
  }, [props.currentUser, props.logoUrl]);

  const documentsNav: INavNode[] = React.useMemo(() => {
    return props.departments.map((dept, idx) => {
      const iconFallback =
        ["Calculator", "ShieldCheck", "Users", "Wrench", "Building2"][idx] ||
        "FolderOpen";
      return {
        key: `doc-${dept.Id || idx}`,
        label: dept.Title,
        url: `#documents`,
        iconName: dept.IconName || iconFallback,
      };
    });
  }, [props.departments]);

  // Navigation primaire alignée sur la maquette Next.js : les départements
  // pointent vers leur site SharePoint (SiteUrl) si disponible, sinon vers
  // la vue Documents.
  const primaryNav: INavNode[] = React.useMemo(() => {
    const deptNav: INavNode[] = props.departments.map((dept, idx) => {
      const iconFallback =
        ["Calculator", "ShieldCheck", "Users", "Wrench", "Building2"][idx] ||
        "FolderOpen";
      return {
        key: `dept-${dept.Slug || idx}`,
        label: dept.Title,
        url:
          dept.SiteUrl && dept.SiteUrl.Url
            ? dept.SiteUrl.Url
            : "#documents",
        iconName: dept.IconName || iconFallback,
      };
    });
    if (deptNav.length === 0) return STATIC_PRIMARY_NAV;
    return [
      { key: "accueil", label: "Accueil", url: "#accueil", iconName: "Home" },
      ...deptNav,
    ];
  }, [props.departments]);

  // Early-return APRÈS tous les hooks (voir note plus haut) : rendu squelette
  // tant que les données ne sont pas chargées.
  if (props.loading) {
    return <IntranetMainSkeleton heroHeightClass={props.heroHeightClass} />;
  }

  // Rendu de la vue active
  const renderCurrentView = (): React.ReactElement => {
    switch (currentRoute) {
      case "annonces":
        return (
          <div className="ika-mx-auto ika-max-w-7xl ika-px-4 ika-py-8 sm:ika-px-6 lg:ika-px-8">
            <AnnouncementsList
              eyebrow="Annonces"
              title="Toutes les annonces"
              description="Retrouvez ici les événements internes, célébrations et messages d'équipe."
              announcements={props.announcements}
              loading={false}
              showFilters={false}
            />
          </div>
        );

      case "bordereau":
      case "bordereaudesprix":
        return (
          <div className="ika-mx-auto ika-max-w-7xl ika-px-4 ika-py-8 sm:ika-px-6 lg:ika-px-8">
            <PriceSheet
              title="Bordereau des prix & Devis"
              clientName="IKA Solution"
              subject="Ingénierie digitale & Solutions sur mesure"
              vatRate={18}
              currency="XOF"
              initialLines={[
                {
                  key: "line-1",
                  articleNo: "1",
                  description: "Mise en place de la redondance des pare-feu Palo Alto",
                  deliveryDate: "90 jours",
                  quantity: 1,
                  unitPrice: 15000000,
                },
                {
                  key: "line-2",
                  articleNo: "2",
                  description: "Audit d'architecture et sécurisation cloud DevOps",
                  deliveryDate: "30 jours",
                  quantity: 1,
                  unitPrice: 5000000,
                },
              ]}
              loading={false}
              canEdit={true}
            />
          </div>
        );

      case "histoire":
        return (
          <div className="ika-mx-auto ika-max-w-7xl ika-px-4 ika-py-8 sm:ika-px-6 lg:ika-px-8">
            <Timeline
              eyebrow="Depuis 2015"
              title="Notre histoire & nos jalons"
              description="Depuis sa fondation à Ouagadougou, IKA Solution transforme les idées en solutions technologiques à forte valeur ajoutée."
              milestones={props.milestones}
              values={props.missions}
              stats={props.stats}
              loading={false}
              showValues={true}
              showStats={true}
            />
          </div>
        );

      case "organigramme":
        return (
          <div className="ika-mx-auto ika-max-w-7xl ika-px-4 ika-py-8 sm:ika-px-6 lg:ika-px-8">
            <OrgChart
              title="Organigramme d'entreprise"
              subtitle="Structure hiérarchique et directions de l'équipe IKA Solution"
              roots={orgRoots}
              flat={props.collaborators}
              loading={false}
              showSearch={true}
              showControls={true}
              initialZoom={100}
              defaultCollapsedDepth={3}
            />
          </div>
        );

      case "documents":
        return (
          <div className="ika-mx-auto ika-max-w-7xl ika-px-4 ika-py-8 sm:ika-px-6 lg:ika-px-8">
            <DocumentsList
              title="Bibliothèque documentaire"
              documents={props.featuredDocs}
              loading={false}
              showConfidentiality={true}
            />
          </div>
        );

      case "actualites":
      case "news":
        return (
          <div className="ika-mx-auto ika-max-w-7xl ika-px-4 ika-py-8 sm:ika-px-6 lg:ika-px-8">
            <NewsCards
              eyebrow="Toutes les publications"
              title="Actualités de l'entreprise"
              description="Retrouvez toutes les actualités, annonces de projets et innovations d'IKA Solution."
              items={props.news}
              loading={false}
              ctaLabel="Voir toutes les actualités"
            />
          </div>
        );

      case "equipe":
        return (
          <div className="ika-mx-auto ika-max-w-7xl ika-px-4 ika-py-8 sm:ika-px-6 lg:ika-px-8">
            <TeamHome
              title="Annuaire de notre équipe"
              description="Les talents et experts qui composent les pôles d'ingénierie et de management d'IKA Solution."
              members={props.collaborators}
              loading={false}
              showSearch={true}
              showBirthdays={true}
            />
          </div>
        );

      case "evenements":
      case "agenda":
        return (
          <div className="ika-mx-auto ika-max-w-7xl ika-px-4 ika-py-8 sm:ika-px-6 lg:ika-px-8">
            <EventsCalendar
              title="Agenda & Événements"
              events={props.events}
              loading={false}
              showLocation={true}
            />
          </div>
        );

      case "faq":
        return (
          <div className="ika-mx-auto ika-max-w-7xl ika-px-4 ika-py-8 sm:ika-px-6 lg:ika-px-8">
            <FaqList
              title="Foire aux questions (FAQ)"
              items={props.faqItems}
              loading={false}
              columns={2}
              groupByCategory={true}
              allowMultipleOpen={true}
            />
          </div>
        );

      case "accueil":
      default:
        return (
          <>
            {/* 1. HERO SLIDER */}
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

            {/* Conteneur central identique à Next.js app/page.tsx */}
            <div className="ika-mx-auto ika-px-4 sm:ika-px-6 lg:ika-px-8">
              {/* 2. BANDEAU D'ANNONCES DÉFILANT */}
              {props.showMarquee ? (
                <RevealSection enabled={animate}>
                  <AnnouncementMarquee
                    eyebrow="Actualités"
                    title="Célébrations & événements"
                    announcements={props.announcements}
                    loading={false}
                  />
                </RevealSection>
              ) : null}

              {/* 3. ACTUALITÉS (cartes grille) */}
              {props.showNews ? (
                <RevealSection enabled={animate}>
                  <NewsCards
                    eyebrow="Vie interne"
                    title="Actualités de l'entreprise"
                    description="Suivez les dernières annonces internes, les évolutions techniques, les projets stratégiques et les initiatives d'innovation."
                    items={props.news}
                    loading={false}
                    ctaLabel="Voir toutes les actualités"
                  />
                </RevealSection>
              ) : null}

              {/* 4. ACCÈS RAPIDE (documents clés + liens + événements) */}
              {props.showQuickAccess ? (
                <RevealSection enabled={animate}>
                  <QuickAccessPanel
                    documentsTitle="Documents clés"
                    quickLinksTitle="Accès rapide"
                    eventsTitle="Événements"
                    featuredDocs={props.featuredDocs}
                    quickLinks={props.quickLinks}
                    events={props.events}
                    loading={false}
                  />
                </RevealSection>
              ) : null}

              {/* 5. NOTRE ÉQUIPE + GALERIE PHOTOS (côte à côte comme Next.js) */}
              {props.showTeam || props.showGallery ? (
                <RevealSection enabled={animate}>
                  <div className="ika-flex ika-flex-col lg:ika-flex-row">
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
                    {props.showGallery ? (
                      <Gallery
                        title="Galerie"
                        description="Moments forts de la vie de l'entreprise"
                        images={props.galleryImages}
                        loading={false}
                        showFilters
                        mosaicLayout
                      />
                    ) : null}
                  </div>
                </RevealSection>
              ) : null}

              {/* 6. COLLABORATEUR DU MOIS + PROJETS */}
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
          </>
        );
    }
  };

  return (
    <div className="ika-root" data-accent={props.accent}>
      <div className="ika-flex ika-w-full ika-min-h-screen ika-flex-col ika-bg-white ika-text-slate-900">
        {/* HEADER IKA */}
        {props.showHeader ? (
          <IkaHeader
            context={chromeContext}
            primaryNav={primaryNav}
            secondaryNav={STATIC_SECONDARY_NAV}
            showSearch={true}
            showDocumentsMenu={documentsNav.length > 0}
            documentsNav={documentsNav}
            activeRoute={currentRoute}
            onNavigate={handleNavigate}
          />
        ) : null}

        {/* Bandeau d'avertissement : les listes SharePoint sont manquantes
            ou inaccessibles (données de démonstration affichées à la place). */}
        {!props.loading && props.error ? (
          <div
            role="status"
            className="ika-mx-4 ika-mt-4 ika-flex ika-items-start ika-gap-2 ika-rounded-lg ika-border ika-border-amber-300 ika-bg-amber-50 ika-px-4 ika-py-3 ika-text-sm ika-text-amber-800"
          >
            <span aria-hidden="true" className="ika-mt-0.5">⚠️</span>
            <span>
              Certaines données SharePoint n'ont pas pu être chargées.
              {typeof props.error === "string" && props.error.length > 0
                ? ` ${props.error}`
                : ""}{" "}
              Les contenus de démonstration sont affichés temporairement.
            </span>
          </div>
        ) : null}

        {/* VUE ACTIVE DYNAMIQUE */}
        <main className="ika-flex-1">{renderCurrentView()}</main>

        {/* FOOTER IKA */}
        {props.showFooter ? (
          <IkaFooter
            company={undefined}
            description="L'intranet IKA Solution est votre passerelle vers un univers de connaissances, de collaboration et d'innovation. Explorez nos ressources, échangez avec vos collègues et restez informé des dernières actualités."
            logoUrl={chromeContext.logoUrl}
          />
        ) : null}
      </div>
    </div>
  );
};

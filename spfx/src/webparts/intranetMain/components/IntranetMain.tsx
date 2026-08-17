import "../../../styles/tailwind.css";

import * as React from "react";

import { IIntranetMainProps } from "./IIntranetMainProps";
import { DataService } from "../../../services/DataService";
import { IOrgNode } from "../../../models/IIkaModels";
import { buildUserPhotoUrl } from "../../../common/utils/spUtils";

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

const HEADER_ICON_BY_SLUG: Record<string, string> = {
  comptabilite: "Calculator",
  administration: "Shield",
  commerciaux: "Users",
  techniciens: "Wrench",
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
        email: props.currentUserEmail,
        loginName: props.currentUserEmail,
        photoUrl: buildUserPhotoUrl(props.currentUserEmail, "S"),
        isSiteAdmin: false,
      },
      currentPath:
        typeof window !== "undefined" ? window.location.pathname : "",
      hubUrl,
      siteUrl,
      logoUrl: props.logoUrl || `${hubUrl}/SiteAssets/logo.png`,
    };
  }, [props.currentUser, props.currentUserEmail, props.logoUrl]);

  const documentsNav: INavNode[] = React.useMemo(() => {
    return props.departments.map((dept, idx) => ({
      key: `doc-${dept.Id || idx}`,
      label: dept.Title,
      url: "#documents",
      iconName:
        HEADER_ICON_BY_SLUG[dept.Slug] || dept.IconName || "FolderOpen",
    }));
  }, [props.departments]);

  // Navigation primaire alignée sur la maquette Next.js : les départements
  // pointent vers leur site SharePoint (SiteUrl) si disponible, sinon vers
  // la vue Documents.
  const primaryNav: INavNode[] = React.useMemo(() => {
    const deptNav: INavNode[] = props.departments.map((dept, idx) => {
      return {
        key: `dept-${dept.Slug || idx}`,
        label: dept.Title,
        url:
          dept.SiteUrl && dept.SiteUrl.Url
            ? dept.SiteUrl.Url
            : "#documents",
        iconName:
          HEADER_ICON_BY_SLUG[dept.Slug] || dept.IconName || "FolderOpen",
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
          <AnnouncementsList
            eyebrow="Annonces"
            title="Toutes les annonces"
            description="Retrouvez ici les événements internes, célébrations et messages d'équipe."
            announcements={props.announcements}
            loading={false}
            showFilters={false}
          />
        );

      case "bordereau":
      case "bordereaudesprix":
        return (
          <PriceSheet
            title="BORDEREAU DES PRIX POUR LES FOURNITURES"
            clientName=""
            subject=""
            vatRate={18}
            currency="XOF"
            initialLines={[
              {
                key: "line-1",
                articleNo: "1",
                description: "Mise en place de la redondance des pare-feu Palo Alto",
                deliveryDate: "90 jours",
                quantity: 1,
                unitPrice: 0,
              },
            ]}
            loading={false}
            canEdit={true}
          />
        );

      case "histoire":
        return (
          <Timeline
            eyebrow="Depuis 2015"
            title="Notre histoire & nos jalons"
            description="Depuis sa fondation à Ouagadougou, IKA Solution transforme les idées en solutions technologiques à forte valeur ajoutée."
            milestones={props.milestones}
            values={props.missions}
            stats={props.historyStats}
            loading={false}
            showValues={true}
            showStats={true}
          />
        );

      case "organigramme":
        return (
          <OrgChart
            title="Organigramme"
            subtitle="IKA Solution"
            roots={orgRoots}
            flat={props.collaborators}
            loading={false}
            showSearch={true}
            showControls={true}
            initialZoom={100}
            defaultCollapsedDepth={3}
          />
        );

      case "documents":
        return (
          <DocumentsList
            title="Documents du dépôt"
            documents={props.featuredDocs}
            loading={false}
            showConfidentiality={true}
          />
        );

      case "actualites":
      case "news":
        return (
          <NewsCards
            eyebrow="Toutes les publications"
            title="Actualités de l'entreprise"
            description="Retrouvez toutes les actualités, annonces de projets et innovations d'IKA Solution."
            items={props.news}
            loading={false}
            ctaLabel="Voir toutes les actualités"
          />
        );

      case "equipe":
        return (
          <TeamHome
            title="Annuaire de notre équipe"
            description="Les talents et experts qui composent les pôles d'ingénierie et de management d'IKA Solution."
            members={props.collaborators}
            loading={false}
            showSearch={true}
            showBirthdays={true}
          />
        );

      case "evenements":
      case "agenda":
        return (
          <EventsCalendar
            title="Agenda & Événements"
            events={props.events}
            loading={false}
            showLocation={true}
          />
        );

      case "faq":
        return (
          <FaqList
            title="Foire aux questions (FAQ)"
            items={props.faqItems}
            loading={false}
            columns={2}
            groupByCategory={true}
            allowMultipleOpen={true}
          />
        );

      case "accueil":
      default:
        return (
          <>
            {props.showHero ? (
              <HeroSlider
                slides={props.slides}
                missions={props.missions}
                stats={props.stats}
                currentUser={props.currentUser}
                currentUserRole={props.currentUserRole}
                loading={false}
                heightClass={props.heroHeightClass}
                autoPlay={props.animationsEnabled}
                showClock={props.showClock}
                showPanel={props.showWelcomePanel}
              />
            ) : null}

            <div className="ika-mx-auto ika-px-4 sm:ika-px-6 lg:ika-px-8">
              {props.showMarquee ? (
                <AnnouncementMarquee
                  eyebrow="Actualités"
                  title="Célébrations & événements"
                  announcements={props.announcements}
                  loading={false}
                />
              ) : null}

              {props.showNews ? (
                <NewsCards
                  eyebrow="Vie interne"
                  title="Actualités de l'entreprise"
                  description="Suivez les dernières annonces internes, les évolutions techniques, les projets stratégiques et les initiatives d'innovation."
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

              {props.showTeam || props.showGallery ? (
                <div className="ika-flex ika-flex-col lg:ika-flex-row">
                  {props.showTeam ? (
                    <div className="ika-w-full ika-min-w-0">
                      <TeamHome
                        title="Notre équipe"
                        description="Les talents qui font avancer l'ingénierie digitale"
                        members={props.collaborators}
                        loading={false}
                        showSearch={true}
                        showBirthdays={true}
                      />
                    </div>
                  ) : null}
                  {props.showGallery ? (
                    <div className="ika-w-full ika-min-w-0">
                      <Gallery
                        title="Galerie"
                        description="Moments forts de la vie de l'entreprise"
                        images={props.galleryImages}
                        loading={false}
                        showFilters={true}
                        mosaicLayout={true}
                      />
                    </div>
                  ) : null}
                </div>
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
            description="L'intranet « IKA Solution » est votre passerelle vers un univers de connaissances, de collaboration et d'innovation. Explorez nos ressources, échangez avec vos collègues et restez informé."
            logoUrl={chromeContext.logoUrl}
          />
        ) : null}
      </div>
    </div>
  );
};

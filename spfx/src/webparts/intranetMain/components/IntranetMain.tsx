import "../../../styles/tailwind.css";

import * as React from "react";

import { IIntranetMainProps } from "./IIntranetMainProps";
import { DataService } from "../../../services/DataService";
import { IOrgNode } from "../../../models/IIkaModels";
import { cn, resolveUrl } from "../../../common/utils/spUtils";

// Sub-components (pure React components ported from Next.js)
import { HeroSlider } from "../../heroSlider/components/HeroSlider";
import { AnnouncementMarquee } from "../../announcementMarquee/components/AnnouncementMarquee";
import { NewsCards } from "../../newsCards/components/NewsCards";
import { NewsDetail } from "../../newsCards/components/NewsDetail";
import { QuickAccessPanel } from "../../quickAccessPanel/components/QuickAccessPanel";
import { Gallery } from "../../gallery/components/Gallery";
import { TeamHome } from "../../teamHome/components/TeamHome";
import { IntranetSections } from "../../intranetSections/components/IntranetSections";
import { AnnouncementsList } from "../../announcementsList/components/AnnouncementsList";
import { PriceSheet } from "../../priceSheet/components/PriceSheet";
import { Timeline } from "../../timeline/components/Timeline";
import { OrgChart } from "../../orgChart/components/OrgChart";
import { DocumentsList } from "../../documentsList/components/DocumentsList";
import { SearchResults } from "../../searchResults/components/SearchResults";
import { AgendaView } from "../../groupCalendar/components/AgendaView";
import { FaqList } from "../../faqList/components/FaqList";
import { ListTable } from "../../listTable/components/ListTable";
import { HomeHighlights } from "../../homeHighlights/components/HomeHighlights";

// Header & Footer
import { IkaHeader } from "../../../extensions/ikaChrome/components/IkaHeader";
import { IkaFooter } from "../../../extensions/ikaChrome/components/IkaFooter";
import { IChromeContext, INavNode } from "../../../models/IChromeModels";
import {
  STATIC_PRIMARY_NAV,
  STATIC_SECONDARY_NAV,
} from "../../../services/NavigationService";

interface IParsedHashRoute {
  route: string;
  id?: string;
  /** Terme de recherche (`#recherche?q=…`), casse d'origine préservée. */
  query?: string;
}

function parseHashRoute(): IParsedHashRoute {
  if (typeof window === "undefined") return { route: "accueil" };
  const hash = window.location.hash || "";
  const raw = hash.replace(/^#\/?(page-)?/, "").trim();

  // La chaîne de requête est découpée sur le hash BRUT, avant le passage en
  // minuscules appliqué au nom de route : `q` doit conserver sa casse pour
  // être réaffiché tel que l'utilisateur l'a saisi.
  const separator = raw.indexOf("?");
  const routePart = separator === -1 ? raw : raw.substring(0, separator);
  const queryPart = separator === -1 ? "" : raw.substring(separator + 1);

  const [routeName, id] = routePart.toLowerCase().split("/");

  let query: string | undefined;
  if (queryPart) {
    const params = new URLSearchParams(queryPart);
    query = params.get("q") || undefined;
  }

  return { route: routeName || "accueil", id, query };
}

interface IRevealState {
  ref: React.RefObject<HTMLDivElement>;
  visible: boolean;
}

function useReveal(enabled: boolean): IRevealState {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState<boolean>(!enabled);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (!enabled) {
      setVisible(true);
      return undefined;
    }

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches || typeof window.IntersectionObserver === "undefined") {
      setVisible(true);
      return undefined;
    }

    const observer = new window.IntersectionObserver(
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

  return { ref, visible };
}

const RevealSection: React.FC<{
  enabled: boolean;
  className?: string;
  children: React.ReactNode;
}> = (props) => {
  const reveal = useReveal(props.enabled);
  const base = "ika-transition-all ika-duration-700 ika-ease-out";
  const hidden = "ika-opacity-0 ika-translate-y-4";
  const shown = "ika-opacity-100 ika-translate-y-0";
  const cls = `${base} ${reveal.visible ? shown : hidden} ${
    props.className ?? ""
  }`;

  return (
    <div
      ref={reveal.ref}
      className={cls}
      data-visible={reveal.visible ? "true" : "false"}
    >
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
    return parseHashRoute().route || props.initialView || "accueil";
  });
  const [currentNewsId, setCurrentNewsId] = React.useState<string | undefined>(() => {
    return parseHashRoute().id;
  });
  const [searchQuery, setSearchQuery] = React.useState<string | undefined>(() => {
    return parseHashRoute().query;
  });

  // Écoute des changements de hash dans l'URL pour la navigation SPA (comme Coris)
  React.useEffect(() => {
    const handleHashChange = (): void => {
      const parsed = parseHashRoute();
      setCurrentRoute(parsed.route);
      setCurrentNewsId(parsed.id);
      setSearchQuery(parsed.query);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleNavigate = (route: string): void => {
    const cleanRoute = route.replace(/^#\/?(page-)?/, "") || "accueil";

    // `cleanRoute` peut porter une chaîne de requête (`recherche?q=budget`) :
    // on la met dans le hash mais on ne la garde PAS dans `currentRoute`,
    // sinon le `switch` du routeur ne reconnaîtrait plus le nom de la vue.
    const separator = cleanRoute.indexOf("?");
    const routeName =
      separator === -1 ? cleanRoute : cleanRoute.substring(0, separator);
    const queryPart =
      separator === -1 ? "" : cleanRoute.substring(separator + 1);

    setCurrentRoute(routeName.toLowerCase());
    setSearchQuery(
      queryPart ? new URLSearchParams(queryPart).get("q") || undefined : undefined
    );
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
        email: props.currentUserEmail,
        loginName: props.currentUserEmail,
        photoUrl: "",
        isSiteAdmin: false,
      },
      currentPath:
        typeof window !== "undefined" ? window.location.pathname : "",
      hubUrl,
      siteUrl,
      logoUrl: props.logoUrl || `${hubUrl}/SiteAssets/logo.png`,
    };
  }, [props.currentUser, props.currentUserEmail, props.logoUrl]);

  // Chaque département a son propre site (et donc sa propre liste
  // `Documents`) : on lie vers `SiteUrl` + "/Documents", pas vers la vue
  // interne "#documents" (qui n'affiche que la liste du site courant et
  // serait identique pour les 4 départements).
  const documentsNav: INavNode[] = React.useMemo(() => {
    return props.departments
      .map((dept, idx) => {
        const iconFallback =
          ["Calculator", "ShieldCheck", "Users", "Wrench", "Building2"][idx] ||
          "FolderOpen";
        const siteUrl = resolveUrl(dept.SiteUrl).replace(/\/$/, "");
        const usable = siteUrl && !siteUrl.startsWith("#");
        return {
          key: `doc-${dept.Id || idx}`,
          label: dept.Title,
          url: usable ? `${siteUrl}/Documents` : "",
          iconName: dept.IconName || iconFallback,
        };
      })
      .filter((node) => node.url !== "");
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

      case "recherche":
        return props.search ? (
          <SearchResults query={searchQuery || ""} onSearch={props.search} />
        ) : (
          <div className="ika-mx-auto ika-max-w-7xl ika-px-4 ika-py-8 sm:ika-px-6 lg:ika-px-8">
            <div className="ika-rounded-3xl ika-border ika-border-brand-navy/10 ika-bg-white ika-p-10 ika-text-center ika-text-brand-muted">
              La recherche n&apos;est pas disponible dans ce contexte.
            </div>
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
              /* Vue complète : recherche + filtre par catégorie, 6 par page.
                 `ctaLabel=""` retire le bouton « Voir toutes les actualités »
                 qui, sur cette page, pointerait vers elle-même — la
                 pagination prend sa place. */
              showFilters={true}
              pageSize={6}
              ctaLabel=""
            />
          </div>
        );

      case "actualite": {
        const newsId = currentNewsId ? parseInt(currentNewsId, 10) : undefined;
        return (
          <div className="ika-mx-auto ika-max-w-4xl ika-px-4 ika-py-8 sm:ika-px-6 lg:ika-px-8">
            <NewsDetail
              newsId={newsId}
              news={props.news}
              currentUserEmail={props.currentUserEmail}
              getNewsDetail={props.getNewsDetail}
              getComments={props.getComments}
              postComment={props.postComment}
            />
          </div>
        );
      }

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
            <AgendaView
              title="Agenda de l'équipe"
              description="Vos rendez-vous Outlook et les événements d'IKA Solution, réunis jour par jour."
              events={props.events}
              agenda={props.agenda}
              showTeamAvailability={true}
              defaultRangeDays={7}
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

      // Les noms de route restent en ASCII : le navigateur encode « #équipements »
      // en « %C3%A9quipements », que `parseHashRoute` passe en minuscules sans
      // le décoder — aucun `case` ne correspondrait. « Équipements » n'est
      // qu'un libellé d'affichage.
      case "fournisseurs":
      case "fournisseur":
        return (
          <div className="ika-mx-auto ika-max-w-7xl ika-px-4 ika-py-8 sm:ika-px-6 lg:ika-px-8">
            <ListTable
              title="Fournisseurs"
              description="Répertoire des fournisseurs référencés d'IKA Solution."
              listTitle={props.fournisseursListTitle}
              iconName="Briefcase"
              getListTable={props.getListTable}
              showSearch={true}
              showExport={true}
            />
          </div>
        );

      case "equipements":
      case "equipement":
        return (
          <div className="ika-mx-auto ika-max-w-7xl ika-px-4 ika-py-8 sm:ika-px-6 lg:ika-px-8">
            <ListTable
              title="Équipements"
              description="Parc d'équipements de l'entreprise et affectations."
              listTitle={props.equipementsListTitle}
              iconName="Wrench"
              getListTable={props.getListTable}
              showSearch={true}
              showExport={true}
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
                    eyebrow="Annonces"
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
                  {/* Bande « Équipe | Galerie » en deux colonnes égales.
                      - `items-stretch` : les deux colonnes adoptent la hauteur
                        de la plus haute (bord inférieur droit).
                      - `lg:w-1/2` + `lg:min-w-0` : sans `min-w-0`, un item flex
                        garde `min-width:auto` et refuse de descendre sous la
                        largeur intrinsèque de sa grille → le 50/50 sautait.
                      - `lg:h-full` + `lg:min-h-0` : même piège sur l'axe
                        vertical. `min-height:auto` laisse la colonne dépasser la
                        hauteur de bande au lieu de s'y plier, et son contenu
                        sortait alors de la section.
                      - `border-t` porté ici (et non par chaque composant, qui
                        en mode `compact` n'en pose plus) : un seul filet de
                        bande, plus un séparateur vertical entre les colonnes. */}
                  <div
                    className={cn(
                      "ika-flex ika-flex-col ika-items-stretch lg:ika-flex-row",
                      // Filet de bande porté par le conteneur UNIQUEMENT en mode
                      // deux colonnes : si un seul des deux blocs est activé, il
                      // rend en pleine largeur et pose lui-même son `border-t`.
                      props.showTeam &&
                        props.showGallery &&
                        // Hauteur « un écran », à partir de `lg` seulement (en
                        // dessous les deux blocs s'empilent et reprennent leur
                        // hauteur naturelle — sinon la bande ferait 200vh sur
                        // mobile). `100vh` est corrigé de la suite bar
                        // SharePoint (cf. --ika-suitebar dans fullPageChrome)
                        // et des 4rem du header sticky `IkaHeader`.
                        //
                        // PAS d'`overflow-hidden` ici : `RevealSection` pose un
                        // `translate-y-*` (donc un `transform`) sur son
                        // conteneur, ce qui en fait le bloc conteneur des
                        // descendants `position: fixed` — la fiche profil et la
                        // lightbox seraient rognées. Les colonnes se contiennent
                        // déjà seules (`flex-1` + `min-h-0` + grilles en
                        // `overflow-y-auto`).
                        "ika-border-t ika-border-slate-200 lg:ika-h-[calc(100vh-var(--ika-suitebar,0px)-4rem)]"
                    )}
                  >
                    {props.showTeam ? (
                      <div
                        className={cn(
                          "ika-w-full",
                          props.showGallery &&
                            "lg:ika-h-full lg:ika-w-1/2 lg:ika-min-h-0 lg:ika-min-w-0"
                        )}
                      >
                        <TeamHome
                          title="Notre équipe"
                          description="Les talents qui font avancer l'ingénierie digitale"
                          members={props.collaborators}
                          loading={false}
                          showSearch
                          showBirthdays
                          compact={props.showGallery}
                        />
                      </div>
                    ) : null}
                    {props.showGallery ? (
                      <div
                        className={cn(
                          "ika-w-full",
                          props.showTeam &&
                            "ika-border-t ika-border-slate-200 lg:ika-h-full lg:ika-w-1/2 lg:ika-min-h-0 lg:ika-min-w-0 lg:ika-border-l lg:ika-border-t-0"
                        )}
                      >
                        <Gallery
                          title="Galerie"
                          description="Moments forts de la vie de l'entreprise"
                          images={props.galleryImages}
                          loading={false}
                          showFilters
                          mosaicLayout
                          compact={props.showTeam}
                        />
                      </div>
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

              {/* 7. DERNIÈRE BANDE : FAQ · DOCUMENTS RÉCENTS · COMPTE À REBOURS
                  Trois cartes sur une ligne (`lg:grid-cols-3`), alimentées par
                  des données déjà chargées : aucun appel réseau supplémentaire.
                  `featuredDocs` vient de `getDocuments(20)`, requêté en
                  `$orderby=Modified desc` — c'est bien « les plus récents ». */}
              {props.showHighlights ? (
                <RevealSection enabled={animate}>
                  <HomeHighlights
                    faqTitle="Questions fréquentes"
                    documentsTitle="Documents récents"
                    countdownTitle="Prochaine échéance"
                    faqItems={props.faqItems}
                    documents={props.featuredDocs}
                    events={props.events}
                    loading={false}
                    onNavigate={handleNavigate}
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
            onSearch={props.suggest}
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

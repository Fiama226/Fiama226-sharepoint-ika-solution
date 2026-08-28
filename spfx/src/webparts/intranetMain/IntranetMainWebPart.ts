/**
 * IntranetMainWebPart — Composant PRINCIPAL de l'intranet IKA Solution.
 *
 * Architecture Single WebPart (style Coris Meso Finance) :
 * Unique Web Part déployée sur SharePoint qui orchestre l'ensemble du portail
 * (Header, Navigation SPA, Vues dynamiques Accueil/Annonces/Bordereau/Histoire/
 * Organigramme/Documents/Actualités/Équipe/FAQ, et Footer).
 */
import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import {
  IPropertyPaneConfiguration,
  PropertyPaneToggle,
  PropertyPaneDropdown,
  PropertyPaneLabel,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";

import { IntranetMain } from "./components/IntranetMain";
import { IIntranetMainProps } from "./components/IIntranetMainProps";
import {
  ensureFullPageHost,
  exitEditModeIfNeeded,
  installFullPageChrome,
  removeFullPageChrome,
} from "./fullPageChrome";
import { DataService } from "../../services/DataService";
import { SearchService } from "../../services/SearchService";
import { CalendarService } from "../../services/CalendarService";
import {
  IAgendaPayload,
  IAnnouncement,
  ICollaborateur,
  IDepartement,
  IDocumentItem,
  IEmployeeOfMonth,
  IEventItem,
  IFaqItem,
  IGalleryImage,
  IHeroSlide,
  IIndicator,
  IMilestone,
  IMission,
  INewsItem,
  IProject,
  IQuickLink,
  IListTableData,
  ISearchResponse,
  SearchVertical,
} from "../../models/IIkaModels";
import {
  buildImageUrl,
  buildUserPhotoUrl,
} from "../../common/utils/spUtils";

/** Au-delà, la frise de disponibilité devient illisible et l'appel très long. */
const MAX_TEAM_MEMBERS = 12;

export type HeroHeight = "screen" | "large" | "medium";
export type AccentColor = "orange" | "emerald" | "sky" | "indigo" | "rose" | "amber";

export interface IIntranetMainWebPartProps {
  height: HeroHeight;
  accent: AccentColor;
  animationsEnabled: boolean;
  showHero: boolean;
  showClock: boolean;
  showWelcomePanel: boolean;
  showMarquee: boolean;
  showNews: boolean;
  showQuickAccess: boolean;
  showGallery: boolean;
  showTeam: boolean;
  showEmployee: boolean;
  showProjects: boolean;
  showHighlights: boolean;
  defaultView?: string;
  fournisseursListTitle?: string;
  equipementsListTitle?: string;
}

const HEIGHT_CLASSES: Record<HeroHeight, string> = {
  screen: "ika-h-screen",
  large: "ika-h-[70vh]",
  medium: "ika-h-[55vh]",
};

export default class IntranetMainWebPart extends BaseClientSideWebPart<IIntranetMainWebPartProps> {
  private _service!: DataService;
  private _search!: SearchService;
  private _calendar!: CalendarService;

  /**
   * Callbacks de recherche liés UNE SEULE FOIS à l'instance.
   *
   * `render()` est rappelé à chaque chargement de données ; recréer ces
   * fonctions à chaque rendu changerait leur identité, ce qui relancerait le
   * `useEffect` de `useSearchSuggest` (et donc une requête réseau) à chaque
   * re-rendu du web part. Les champs de classe fléchés sont créés une fois.
   */
  private readonly _suggestFn = (term: string): Promise<ISearchResponse> =>
    this._search.suggest(term);

  private readonly _searchFn = (
    term: string,
    vertical: SearchVertical,
    page: number
  ): Promise<ISearchResponse> => this._search.search(term, vertical, page);

  /**
   * Charge l'agenda pour la période demandée. Même raison qu'au-dessus de
   * lier la fonction une seule fois : `AgendaView` la surveille dans un
   * `useEffect`, une nouvelle identité relancerait les appels Graph.
   */
  private readonly _agendaFn = (
    rangeDays: number
  ): Promise<IAgendaPayload> => this._loadAgenda(rangeDays);

  /**
   * Charge une liste générique. Lié une seule fois pour la même raison que
   * les callbacks ci-dessus : `ListTable` surveille cette fonction dans un
   * `useEffect`, une nouvelle identité relancerait la requête à chaque rendu.
   */
  private readonly _listTableFn = (
    listTitle: string
  ): Promise<IListTableData> => this._service.getListTable(listTitle);

  // Données chargées en parallèle avec fallback garanti
  private _slides: IHeroSlide[] = [];
  private _missions: IMission[] = [];
  private _stats: IIndicator[] = [];
  private _announcements: IAnnouncement[] = [];
  private _news: INewsItem[] = [];
  private _docs: IDocumentItem[] = [];
  private _links: IQuickLink[] = [];
  private _events: IEventItem[] = [];
  private _gallery: IGalleryImage[] = [];
  private _collaborators: ICollaborateur[] = [];
  private _employee: IEmployeeOfMonth | undefined = undefined;
  private _employeePhoto: string = "";
  private _projects: IProject[] = [];
  private _departments: IDepartement[] = [];
  private _milestones: IMilestone[] = [];
  private _faqItems: IFaqItem[] = [];

  private _loading: boolean = true;
  private _error: string | undefined = undefined;
  private _loaded: boolean = false;

  protected async onInit(): Promise<void> {
    // Mode « app » façon Coris : si la page est ouverte en édition, on en
    // sort tout de suite (redirection déjà lancée) plutôt que d'initialiser
    // un rendu qui va être immédiatement remplacé.
    if (exitEditModeIfNeeded()) return;

    await super.onInit();
    this._service = new DataService(this.context);
    this._search = new SearchService(this.context);
    this._calendar = new CalendarService(this.context);
  }

  public render(): void {
    if (!this._loaded) {
      this._loaded = true;
      void this._load();
    }

    const pageUser = this.context.pageContext.user;
    const displayName = pageUser.displayName
      ? pageUser.displayName.trim()
      : "";
    const currentUser = displayName || "Collaborateur IKA";

    const element: React.ReactElement<IIntranetMainProps> = React.createElement(
      IntranetMain,
      {
        slides: this._slides,
        missions: this._missions,
        stats: this._stats,
        currentUser,
        currentUserEmail: pageUser.email || "",
        currentUserRole: "",
        heroHeightClass: HEIGHT_CLASSES[this.properties.height] || HEIGHT_CLASSES.large,
        accent: this.properties.accent || "orange",

        announcements: this._announcements,
        news: this._news,
        featuredDocs: this._docs,
        quickLinks: this._links,
        events: this._events,
        galleryImages: this._gallery,
        collaborators: this._collaborators,
        employee: this._employee,
        employeePhotoUrl: this._employeePhoto,
        projects: this._projects,
        departments: this._departments,
        milestones: this._milestones,
        faqItems: this._faqItems,

        loading: this._loading,
        error: this._error,

        animationsEnabled: this.properties.animationsEnabled !== false,
        showHero: this.properties.showHero !== false,
        showClock: this.properties.showClock !== false,
        showWelcomePanel: this.properties.showWelcomePanel !== false,
        showMarquee: this.properties.showMarquee !== false,
        showNews: this.properties.showNews !== false,
        showQuickAccess: this.properties.showQuickAccess !== false,
        showGallery: this.properties.showGallery !== false,
        showTeam: this.properties.showTeam !== false,
        showEmployee: this.properties.showEmployee !== false,
        showProjects: this.properties.showProjects !== false,
        showHighlights: this.properties.showHighlights !== false,
        showHeader: true,
        showFooter: true,
        initialView: this.properties.defaultView || "accueil",

        getNewsDetail: (id: number) => this._service.getNewsById(id),
        getComments: (newsId: number) => this._service.getComments(newsId),
        postComment: (newsId: number, text: string) =>
          this._service.postComment(newsId, text),

        search: this._searchFn,
        suggest: this._suggestFn,
        agenda: this._agendaFn,

        fournisseursListTitle:
          this.properties.fournisseursListTitle || "Fournisseurs",
        equipementsListTitle:
          this.properties.equipementsListTitle || "Equipements",
        getListTable: this._listTableFn,
      }
    );

    // On rend dans un conteneur monté sur <body>, PAS dans `this.domElement` :
    // à l'intérieur du canvas SharePoint, le contenu reste soumis aux
    // contraintes de ses ancêtres (largeur max, overflow, et transform/contain
    // qui piègent un `position: fixed`). Voir fullPageChrome.ts.
    ReactDom.render(element, ensureFullPageHost());

    // Plein écran type « Coris » : occupe tout le viewport, sur une page
    // SharePoint réelle comme dans le Workbench de test (voir
    // fullPageChrome.ts pour le détail de la technique).
    installFullPageChrome(this.domElement);
  }

  /**
   * Charge toutes les données en parallèle avec repli automatique sur les mocks.
   */
  private async _load(): Promise<void> {
    try {
      const [
        slidesRes,
        missionsRes,
        statsRes,
        announcementsRes,
        newsRes,
        docsRes,
        linksRes,
        eventsRes,
        galleryRes,
        collaboratorsRes,
        employeeRes,
        projectsRes,
        departmentsRes,
        milestonesRes,
        faqRes,
      ] = await Promise.all([
        this._service.getHeroSlides(),
        this._service.getMissions(),
        this._service.getIndicators("Hero accueil"),
        this._service.getAnnouncements(),
        this._service.getNews(6),
        this._service.getDocuments(20),
        this._service.getQuickLinks(),
        this._service.getEvents(10),
        this._service.getGalleryImages(12),
        this._service.getCollaborateurs(),
        this._service.getEmployeeOfMonth(),
        this._service.getProjects(true),
        this._service.getDepartements(),
        this._service.getMilestones(),
        this._service.getFaq(),
      ]);

      this._slides = slidesRes || [];
      this._missions = missionsRes || [];
      this._stats = statsRes || [];
      this._announcements = announcementsRes || [];
      this._news = newsRes || [];

      if (docsRes) {
        this._docs = docsRes
          .filter((doc) => doc.IsPinned)
          .concat(docsRes.filter((doc) => !doc.IsPinned))
          .slice(0, 6);
      } else {
        this._docs = [];
      }

      // 12 et non 10 : les 10 places etaient deja saturees, et les liens
      // « Fournisseurs » / « Equipements » (SortOrder 11-12) seraient sinon
      // ecartes en silence. 12 = 6 rangees pleines dans la grille a 2 colonnes.
      this._links = (linksRes || []).slice(0, 12);
      this._events = (eventsRes || []).slice(0, 6);
      this._gallery = galleryRes || [];
      this._collaborators = collaboratorsRes || [];
      this._projects = projectsRes || [];
      this._departments = departmentsRes || [];
      this._milestones = milestonesRes || [];
      this._faqItems = faqRes || [];

      this._employee = employeeRes;
      if (this._employee) {
        this._employeePhoto = await this._resolveEmployeePhoto(this._employee);
      }

      this._error = undefined;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : String(err);
      console.warn("[IntranetMainWebPart] Erreur lors du chargement des données:", err);
      this._error = message
        ? `Erreur d'accès aux listes SharePoint : ${message}`
        : "Erreur d'accès aux listes SharePoint.";
    } finally {
      this._loading = false;
      this.render();
    }
  }

  /**
   * Assemble l'agenda : événements d'entreprise (liste SharePoint) toujours,
   * calendrier Outlook et disponibilité de l'équipe seulement si Graph
   * répond. Aucun échec Graph n'est propagé — la vue doit rester utile même
   * sans le consentement `Calendars.Read.Shared`.
   */
  private async _loadAgenda(rangeDays: number): Promise<IAgendaPayload> {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date(start.getTime());
    end.setDate(end.getDate() + Math.max(rangeDays, 1));

    // La frise de disponibilité ne couvre que la journée en cours : demander
    // trente jours de créneaux à `getSchedule` serait long et inexploitable.
    const dayEnd = new Date(start.getTime());
    dayEnd.setDate(dayEnd.getDate() + 1);

    const startIso = start.toISOString();
    const endIso = end.toISOString();

    const members = await this._resolveTeamMembers();

    const [mine, team] = await Promise.all([
      this._calendar.getMyEvents(startIso, endIso),
      members.length > 0
        ? this._calendar.getTeamSchedule(
            members,
            startIso,
            dayEnd.toISOString()
          )
        : Promise.resolve<undefined>(undefined),
    ]);

    const inRange = this._events.filter((evt) => {
      const when = new Date(evt.EventDate).getTime();
      return when >= start.getTime() && when < end.getTime();
    });

    return {
      entries: CalendarService.merge(inRange, mine),
      team: team || [],
      personalConnected: !!mine,
    };
  }

  /**
   * Membres de l'équipe pour la frise de disponibilité. On privilégie le
   * groupe « Membres » du site (reflet du groupe Microsoft 365) et l'on se
   * rabat sur la liste `Collaborateurs`, car sur un site connecté à un
   * groupe ce groupe SharePoint ne contient souvent qu'un principal de
   * sécurité et non les personnes une à une.
   */
  private async _resolveTeamMembers(): Promise<
    { Email: string; DisplayName: string }[]
  > {
    const me = (this.context.pageContext.user.email || "").toLowerCase();

    let members = await this._calendar.getSiteMembers();

    if (members.length === 0) {
      members = this._collaborators
        .filter((c) => !!c.Email)
        .map((c) => ({ Email: c.Email, DisplayName: c.Title }));
    }

    return members
      .filter((m) => m.Email.toLowerCase() !== me)
      .slice(0, MAX_TEAM_MEMBERS);
  }

  private async _resolveEmployeePhoto(employee: IEmployeeOfMonth): Promise<string> {
    if (employee.Photo) return buildImageUrl(employee.Photo, 600);
    if (!employee.Employee) return "";

    try {
      const all: ICollaborateur[] = await this._service.getCollaborateurs();
      const match = all.filter((p) => p.Id === employee.Employee.Id)[0];
      if (!match) return "";
      return match.Photo
        ? buildImageUrl(match.Photo, 600)
        : buildUserPhotoUrl(match.Email, "L");
    } catch {
      return "";
    }
  }

  protected onDispose(): void {
    // Démonter AVANT `removeFullPageChrome()`, qui retire le host du DOM :
    // l'inverse laisserait l'arbre React monté sur un nœud détaché (fuite).
    ReactDom.unmountComponentAtNode(ensureFullPageHost());
    ReactDom.unmountComponentAtNode(this.domElement);
    removeFullPageChrome();
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description:
              "Composant UNIQUE IKA Solution : portail intranet complet et interactif (Hero, Annonces, Actualités, Documents, Organigramme, Histoire, Bordereau de prix, Équipe, Projets).",
          },
          groups: [
            {
              groupName: "Apparence",
              groupFields: [
                PropertyPaneDropdown("height", {
                  label: "Hauteur du carrousel Hero",
                  options: [
                    { key: "screen", text: "Plein écran (100vh)" },
                    { key: "large", text: "Grande (70vh) — recommandé" },
                    { key: "medium", text: "Moyenne (55vh)" },
                  ],
                }),
                PropertyPaneDropdown("accent", {
                  label: "Couleur d'accent",
                  options: [
                    { key: "orange", text: "Orange IKA (défaut)" },
                    { key: "emerald", text: "Émeraude" },
                    { key: "sky", text: "Bleu ciel" },
                    { key: "indigo", text: "Indigo" },
                    { key: "rose", text: "Rose" },
                    { key: "amber", text: "Ambre" },
                  ],
                }),
                PropertyPaneToggle("animationsEnabled", {
                  label: "Animations (auto-rotation carrousel, reveal au scroll)",
                  onText: "Activées (recommandé)",
                  offText: "Désactivées",
                }),
              ],
            },
            {
              groupName: "Sections — Accueil",
              groupFields: [
                PropertyPaneToggle("showHero", {
                  label: "Carrousel d'accueil (Hero)",
                  onText: "Afficher",
                  offText: "Masquer",
                }),
                PropertyPaneToggle("showClock", {
                  label: "Horloge en direct",
                  onText: "Afficher",
                  offText: "Masquer",
                }),
                PropertyPaneToggle("showWelcomePanel", {
                  label: "Panneau de bienvenue + missions + KPIs",
                  onText: "Afficher",
                  offText: "Masquer",
                }),
                PropertyPaneToggle("showMarquee", {
                  label: "Bandeau d'annonces défilant",
                  onText: "Afficher",
                  offText: "Masquer",
                }),
                PropertyPaneToggle("showNews", {
                  label: "Actualités",
                  onText: "Afficher",
                  offText: "Masquer",
                }),
                PropertyPaneToggle("showQuickAccess", {
                  label: "Accès rapide (documents + liens + événements)",
                  onText: "Afficher",
                  offText: "Masquer",
                }),
                PropertyPaneToggle("showGallery", {
                  label: "Galerie photos",
                  onText: "Afficher",
                  offText: "Masquer",
                }),
                PropertyPaneToggle("showTeam", {
                  label: "Notre équipe",
                  onText: "Afficher",
                  offText: "Masquer",
                }),
                PropertyPaneToggle("showEmployee", {
                  label: "Collaborateur du mois",
                  onText: "Afficher",
                  offText: "Masquer",
                }),
                PropertyPaneToggle("showProjects", {
                  label: "Tableau de bord Projets",
                  onText: "Afficher",
                  offText: "Masquer",
                }),
                PropertyPaneToggle("showHighlights", {
                  label: "FAQ + Documents récents + Compte à rebours",
                  onText: "Afficher",
                  offText: "Masquer",
                }),
              ],
            },
            {
              groupName: "Listes personnalisées",
              groupFields: [
                PropertyPaneLabel("listesHint", {
                  text:
                    "Titres exacts des listes SharePoint affichées par les routes " +
                    "#fournisseurs et #equipements. Les colonnes sont détectées " +
                    "automatiquement depuis la vue par défaut.",
                }),
                PropertyPaneTextField("fournisseursListTitle", {
                  label: "Liste « Fournisseurs »",
                  description: "Laisser vide pour utiliser « Fournisseurs ».",
                }),
                PropertyPaneTextField("equipementsListTitle", {
                  label: "Liste « Équipements »",
                  description: "Laisser vide pour utiliser « Equipements ».",
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}

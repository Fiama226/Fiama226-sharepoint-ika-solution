import {
  IAgendaPayload,
  IAnnouncement,
  ICollaborateur,
  IComment,
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
} from "../../../models/IIkaModels";

/**
 * Propriétés du composant React « IntranetMain ».
 *
 * Ce composant est l'orchestrateur unique de l'intranet (style Coris Meso Finance) :
 * Header + Router SPA + Vues (Accueil, Annonces, Bordereau de prix, Histoire,
 * Organigramme, Documents, Actualités, Équipe, FAQ) + Footer.
 */
export interface IIntranetMainProps {
  // —— Données ——————————————————————————————————————————————
  slides: IHeroSlide[];
  missions: IMission[];
  stats: IIndicator[];
  announcements: IAnnouncement[];
  news: INewsItem[];
  featuredDocs: IDocumentItem[];
  quickLinks: IQuickLink[];
  events: IEventItem[];
  galleryImages: IGalleryImage[];
  collaborators: ICollaborateur[];
  employee: IEmployeeOfMonth | undefined;
  employeePhotoUrl: string;
  projects: IProject[];
  departments: IDepartement[];
  milestones: IMilestone[];
  faqItems: IFaqItem[];

  // —— Chrome (header / footer) intégrés —————————————————
  showHeader: boolean;
  showFooter: boolean;
  logoUrl?: string;

  // —— Contexte utilisateur ————————————————————————————————
  currentUser: string;
  currentUserEmail: string;
  currentUserRole: string;

  // —— Apparence ———————————————————————————————————————————
  heroHeightClass: string;
  accent: "orange" | "emerald" | "sky" | "indigo" | "rose" | "amber";

  // —— Interrupteurs d'affichage ———————————————————————————
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
  /** Dernière bande : FAQ · Documents récents · Compte à rebours. */
  showHighlights: boolean;

  // —— Navigation / Router SPA —————————————————————————————
  initialView?: string;

  // —— États du cycle de vie ———————————————————————————————
  loading: boolean;
  error: string | undefined;

  // —— Callbacks / options d'animation —————————————————————
  animationsEnabled: boolean;

  // —— Actualités : page de détail + commentaires ———————————
  getNewsDetail: (id: number) => Promise<INewsItem | undefined>;
  getComments: (newsId: number) => Promise<IComment[]>;
  postComment: (newsId: number, text: string) => Promise<IComment>;

  // —— Recherche globale ————————————————————————————————————
  /**
   * Exécute une verticale de recherche. Optionnel : sans ce callback, la
   * barre de l'en-tête retombe sur la recherche native SharePoint et la
   * route `recherche` affiche un message d'indisponibilité.
   */
  search?: (
    term: string,
    vertical: SearchVertical,
    page: number
  ) => Promise<ISearchResponse>;
  /** Suggestions du menu déroulant (SharePoint uniquement, temporisées). */
  suggest?: (term: string) => Promise<ISearchResponse>;

  // —— Agenda ———————————————————————————————————————————————
  /**
   * Charge le calendrier Outlook de l'utilisateur et la disponibilité de ses
   * collègues, fusionnés avec les événements d'entreprise. Optionnel : sans
   * ce callback — ou s'il échoue — la route `agenda` affiche les seuls
   * événements de la liste `Evenements`, sans erreur visible.
   */
  agenda?: (rangeDays: number) => Promise<IAgendaPayload>;

  // —— Listes génériques (Fournisseurs, Équipements) —————————
  /** Titres SharePoint exacts, réglables depuis le volet de propriétés. */
  fournisseursListTitle: string;
  equipementsListTitle: string;
  /**
   * Charge une liste quelconque sous forme de tableau, colonnes découvertes à
   * l'exécution. Requis — contrairement à `search`/`agenda`, c'est un simple
   * appel `DataService` qui ne dépend d'aucun consentement Graph. Appelé par la
   * vue elle-même : rien n'est chargé tant que la route n'est pas ouverte.
   */
  getListTable: (listTitle: string) => Promise<IListTableData>;
}

import {
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

  // —— Navigation / Router SPA —————————————————————————————
  initialView?: string;

  // —— États du cycle de vie ———————————————————————————————
  loading: boolean;
  error: string | undefined;

  // —— Callbacks / options d'animation —————————————————————
  animationsEnabled: boolean;
}

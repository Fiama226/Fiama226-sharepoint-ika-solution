import {
  IAnnouncement,
  ICollaborateur,
  IDepartement,
  IDocumentItem,
  IEmployeeOfMonth,
  IEventItem,
  IGalleryImage,
  IHeroSlide,
  IIndicator,
  IMission,
  INewsItem,
  IProject,
  IQuickLink,
} from "../../../models/IIkaModels";

/**
 * Propriétés du composant React « IntranetMain ».
 *
 * Ce composant est le « composant principal » qui rassemble TOUTES les sections
 * de la page d'accueil intranet à l'identique de la maquette Next.js
 * (`app/page.tsx`) : Hero slider, bandeau d'annonces défilant, actualités,
 * accès rapide (documents / liens / événements), galerie, équipe, collaborateur
 * du mois et projets.
 *
 * Les données sont chargées en parallèle par la Web Part hôte
 * (`IntranetMainWebPart.ts`) et transmises en props.
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

  // —— Chrome (header / footer) intégrés —————————————————
  /** Affiche le header IKA en haut de la WP (évite une extension séparée). */
  showHeader: boolean;
  /** Affiche le footer IKA en bas de la WP (évite une extension séparée). */
  showFooter: boolean;
  /** URL du logo affiché dans le header / footer. */
  logoUrl?: string;

  // —— Contexte utilisateur ————————————————————————————————
  currentUser: string;
  currentUserRole: string;

  // —— Apparence ———————————————————————————————————————————
  /** Classe Tailwind préfixée `ika-` pour la hauteur du hero. */
  heroHeightClass: string;
  /** Couleur d'accent dominante (Tailwind sans préfixe). */
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

  // —— États du cycle de vie ———————————————————————————————
  loading: boolean;
  error: string | undefined;

  // —— Callbacks / options d'animation —————————————————————
  /** Active les animations (auto-rotation, défilement, fade-in). */
  animationsEnabled: boolean;
}

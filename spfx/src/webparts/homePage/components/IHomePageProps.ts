import {
  IAnnouncement,
  ICollaborateur,
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
 * Props de la Web Part « Page d'accueil complète ».
 *
 * Cette Web Part est un **assembleur** : elle regroupe en une seule Web Part
 * toutes les sections qui composent la page d'accueil de la maquette Next.js
 * (`app/page.tsx`) : Hero, bandeau d'annonces, actualités, accès rapide,
 * galerie, équipe, collaborateur du mois et tableau de bord projets.
 *
 * Chaque section reçoit ses données déjà résolues (chargées en parallèle par
 * la Web Part) afin d'être rendue à l'identique de sa Web Part unitaire.
 *
 * Les booléens `show*` correspondent aux commutateurs du volet de propriétés :
 * l'éditeur clique pour regrouper / masquer les sections et reconstituer la
 * page qui ressemble au site statique.
 */
export interface IHomePageProps {
  // --- Hero ---
  slides: IHeroSlide[];
  missions: IMission[];
  stats: IIndicator[];
  currentUser: string;
  currentUserRole: string;
  heroHeightClass: string;
  showHeroClock: boolean;
  showHeroPanel: boolean;

  // --- Bandeau d'annonces ---
  announcements: IAnnouncement[];

  // --- Actualités ---
  news: INewsItem[];

  // --- Accès rapide (documents / liens / événements) ---
  featuredDocs: IDocumentItem[];
  quickLinks: IQuickLink[];
  events: IEventItem[];

  // --- Galerie ---
  galleryImages: IGalleryImage[];

  // --- Équipe ---
  collaborators: ICollaborateur[];

  // --- Collaborateur du mois & projets ---
  employee?: IEmployeeOfMonth;
  employeePhotoUrl?: string;
  projects: IProject[];

  // --- État global ---
  loading: boolean;
  error?: string;

  // --- Commutateurs de sections (regroupement au clic) ---
  showHero: boolean;
  showMarquee: boolean;
  showNews: boolean;
  showQuickAccess: boolean;
  showGallery: boolean;
  showTeam: boolean;
  showEmployee: boolean;
  showProjects: boolean;
}

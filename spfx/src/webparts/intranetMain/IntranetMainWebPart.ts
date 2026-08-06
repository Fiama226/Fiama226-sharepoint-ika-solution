/**
 * IntranetMainWebPart — Composant PRINCIPAL de l'intranet IKA.
 *
 * Cette Web Part est un « assembleur » unique qui, ajouté une seule fois sur
 * une page SharePoint, reconstruit à l'identique la page d'accueil de la
 * maquette Next.js (`app/page.tsx`) :
 *
 *   1. Hero slider (carrousel auto-rotatif + panneau de bienvenue + KPIs)
 *   2. Bandeau d'annonces défilant
 *   3. Actualités (grille de cartes)
 *   4. Accès rapide (documents clés + liens rapides + événements)
 *   5. Galerie photos
 *   6. Annuaire équipe
 *   7. Collaborateur du mois + tableau de bord projets
 *
 * Toutes les listes sont chargées en parallèle. Le squelette de chargement
 * unifié s'affiche pendant le premier fetch, puis chaque section s'anime en
 * entrant dans le viewport (fade + translate).
 *
 * Build : HEFT (pas de Gulp). Voir BUILD-INSTRUCTIONS.md et
 * docs/11-deploiement-intranet-main.md pour la procédure complète.
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
} from "@microsoft/sp-property-pane";

import { IntranetMain } from "./components/IntranetMain";
import { IIntranetMainProps } from "./components/IIntranetMainProps";
import { DataService } from "../../services/DataService";
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
} from "../../models/IIkaModels";
import {
  buildImageUrl,
  buildUserPhotoUrl,
} from "../../common/utils/spUtils";

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
}

const HEIGHT_CLASSES: Record<HeroHeight, string> = {
  screen: "ika-h-screen",
  large: "ika-h-[70vh]",
  medium: "ika-h-[55vh]",
};

export default class IntranetMainWebPart extends BaseClientSideWebPart<IIntranetMainWebPartProps> {
  private _service!: DataService;

  // Données chargées en parallèle
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

  private _loading: boolean = true;
  private _error: string | undefined = undefined;
  private _loaded: boolean = false;

  protected async onInit(): Promise<void> {
    await super.onInit();
    this._service = new DataService(this.context);
  }

  public render(): void {
    if (!this._loaded) {
      this._loaded = true;
      // Chargement asynchrone au premier rendu (toutes les listes en parallèle)
      void this._load();
    }

    const element: React.ReactElement<IIntranetMainProps> = React.createElement(
      IntranetMain,
      {
        slides: this._slides,
        missions: this._missions,
        stats: this._stats,
        currentUser: this.context.pageContext.user.displayName,
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
        // Chrome intégré : activé par défaut pour un déploiement
        // en un seul coup (pas besoin d'activer l'Application Customizer).
        showHeader: true,
        showFooter: true,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  /**
   * Charge toutes les données nécessaires en parallèle. Les échecs individuels
   * sont tolérés (catch par liste) : seuls ≥7 échecs critiques font apparaître
   * l'écran d'erreur.
   */
  private async _load(): Promise<void> {
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
    ] = await Promise.all([
      this._service.getHeroSlides().catch(() => undefined),
      this._service.getMissions().catch(() => undefined),
      this._service.getIndicators("Hero accueil").catch(() => undefined),
      this._service.getAnnouncements().catch(() => undefined),
      this._service.getNews(4).catch(() => undefined),
      this._service.getDocuments(20).catch(() => undefined),
      this._service.getQuickLinks().catch(() => undefined),
      this._service.getEvents(10).catch(() => undefined),
      this._service.getGalleryImages(12).catch(() => undefined),
      this._service.getCollaborateurs().catch(() => undefined),
      this._service.getEmployeeOfMonth().catch(() => undefined),
      this._service.getProjects(true).catch(() => undefined),
      this._service.getDepartements().catch(() => undefined),
    ]);

    this._slides = slidesRes || [];
    this._missions = missionsRes || [];
    this._stats = statsRes || [];
    this._announcements = announcementsRes || [];
    this._news = newsRes || [];

    // Documents épinglés d'abord, puis les autres, max 6
    if (docsRes) {
      this._docs = docsRes
        .filter((doc) => doc.IsPinned)
        .concat(docsRes.filter((doc) => !doc.IsPinned))
        .slice(0, 6);
    } else {
      this._docs = [];
    }
    this._links = (linksRes || []).slice(0, 10);
    this._events = (eventsRes || []).slice(0, 4);
    this._gallery = galleryRes || [];
    this._collaborators = collaboratorsRes || [];
    this._projects = projectsRes || [];
    this._departments = departmentsRes || [];

    this._employee = employeeRes;
    if (this._employee) {
      this._employeePhoto = await this._resolveEmployeePhoto(this._employee);
    }

    // Tolérance d'erreur : on n'affiche le message d'erreur que si ≥7 des listes
    // « critiques » sont indisponibles (soit le hub est mal déployé).
    const criticalFailures = [
      slidesRes,
      announcementsRes,
      newsRes,
      linksRes,
      galleryRes,
      collaboratorsRes,
      projectsRes,
    ].filter((v) => v === undefined).length;

    this._error =
      criticalFailures >= 7
        ? "Impossible de charger le contenu de la page d'accueil. Vérifiez que les listes du hub sont déployées (voir documentation « 11-deploiement-intranet-main.md »)."
        : undefined;

    this._loading = false;
    this.render();
  }

  /**
   * Résout la photo du collaborateur du mois : soit depuis la liste
   * CollaborateurDuMois, soit depuis la liste Collaborateurs, soit depuis
   * la photo de profil M365 (repli automatique).
   */
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
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  /**
   * Volet de propriétés : regroupe tous les interrupteurs d'affichage
   * + les options d'apparence (hauteur hero, couleur d'accent, animations).
   */
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description:
              "Composant PRINCIPAL de l'intranet IKA. Ajoutez cette Web Part une seule fois sur une page pour reconstituer à l'identique la page d'accueil du site Next.js (Hero, annonces, actualités, accès rapide, galerie, équipe, projets).",
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
                  offText: "Désactivées (mode statique)",
                }),
              ],
            },
            {
              groupName: "Sections — Hero et bienvenue",
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
                  label: "Panneau « Bienvenue + missions + KPIs »",
                  onText: "Afficher",
                  offText: "Masquer",
                }),
              ],
            },
            {
              groupName: "Sections — Contenu",
              groupFields: [
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
              ],
            },
            {
              groupName: "Sections — Pied de page d'accueil",
              groupFields: [
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
                PropertyPaneLabel("", {
                  text:
                    "Astuce : décochez une section pour la masquer temporairement sans avoir à supprimer la Web Part. Les listes non alimentées sont gérées gracieusement (la section n'apparaît pas vide).",
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}

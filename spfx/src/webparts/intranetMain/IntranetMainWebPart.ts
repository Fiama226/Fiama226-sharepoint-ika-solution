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
} from "@microsoft/sp-property-pane";

import { IntranetMain } from "./components/IntranetMain";
import { IIntranetMainProps } from "./components/IIntranetMainProps";
import { installFullPageChrome, isWorkbench } from "./fullPageChrome";
import { DataService } from "../../services/DataService";
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
  defaultView?: string;
}

const HEIGHT_CLASSES: Record<HeroHeight, string> = {
  screen: "ika-h-screen",
  large: "ika-h-[70vh]",
  medium: "ika-h-[55vh]",
};

export default class IntranetMainWebPart extends BaseClientSideWebPart<IIntranetMainWebPartProps> {
  private _service!: DataService;

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
    await super.onInit();
    this._service = new DataService(this.context);

    // Plein écran type « Coris » sur une page SharePoint (mode lecture)
    if (!isWorkbench()) {
      installFullPageChrome();
    }
  }

  public render(): void {
    if (!this._loaded) {
      this._loaded = true;
      void this._load();
    }

    const element: React.ReactElement<IIntranetMainProps> = React.createElement(
      IntranetMain,
      {
        slides: this._slides,
        missions: this._missions,
        stats: this._stats,
        currentUser: this.context.pageContext.user.displayName || "Collaborateur IKA",
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
        showHeader: true,
        showFooter: true,
      }
    );

    ReactDom.render(element, this.domElement);
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

      this._links = (linksRes || []).slice(0, 10);
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
      console.warn("[IntranetMainWebPart] Erreur lors du chargement des données:", err);
      this._error = undefined;
    } finally {
      this._loading = false;
      this.render();
    }
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
    ReactDom.unmountComponentAtNode(this.domElement);
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
              ],
            },
          ],
        },
      ],
    };
  }
}

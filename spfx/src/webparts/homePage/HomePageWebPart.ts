import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import {
  IPropertyPaneConfiguration,
  PropertyPaneToggle,
  PropertyPaneDropdown,
} from "@microsoft/sp-property-pane";

import { HomePage } from "./components/HomePage";
import { IHomePageProps } from "./components/IHomePageProps";
import { DataService } from "../../services/DataService";
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
} from "../../models/IIkaModels";
import {
  buildImageUrl,
  buildUserPhotoUrl,
} from "../../common/utils/spUtils";

export interface IHomePageWebPartProps {
  height: string;
  showHero: boolean;
  showMarquee: boolean;
  showNews: boolean;
  showQuickAccess: boolean;
  showGallery: boolean;
  showTeam: boolean;
  showEmployee: boolean;
  showProjects: boolean;
}

const HEIGHT_CLASSES: Record<string, string> = {
  screen: "ika-h-screen",
  large: "ika-h-[70vh]",
  medium: "ika-h-[55vh]",
};

/**
 * « Page d'accueil complète » — Web Part assembleuse.
 *
 * Une seule Web Part regroupe toutes les sections de la page d'accueil de la
 * maquette Next.js (`app/page.tsx`) afin de reconstituer, en un clic, la page
 * qui ressemble au site statique. Toutes les sections sont chargées en parallèle
 * et rendues dans le même ordre que la maquette.
 */
export default class HomePageWebPart extends BaseClientSideWebPart<IHomePageWebPartProps> {
  private _service!: DataService;

  // Hero
  private _slides: IHeroSlide[] = [];
  private _missions: IMission[] = [];
  private _stats: IIndicator[] = [];
  // Bandeau
  private _announcements: IAnnouncement[] = [];
  // Actualités
  private _news: INewsItem[] = [];
  // Accès rapide
  private _docs: IDocumentItem[] = [];
  private _links: IQuickLink[] = [];
  private _events: IEventItem[] = [];
  // Galerie
  private _gallery: IGalleryImage[] = [];
  // Équipe
  private _collaborators: ICollaborateur[] = [];
  // Collaborateur du mois & projets
  private _employee: IEmployeeOfMonth | undefined = undefined;
  private _employeePhoto: string = "";
  private _projects: IProject[] = [];

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
      void this._load();
    }

    const element: React.ReactElement<IHomePageProps> = React.createElement(
      HomePage,
      {
        slides: this._slides,
        missions: this._missions,
        stats: this._stats,
        currentUser: this.context.pageContext.user.displayName,
        currentUserRole: "",
        heroHeightClass:
          HEIGHT_CLASSES[this.properties.height] || HEIGHT_CLASSES.large,
        showHeroClock: true,
        showHeroPanel: true,

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

        loading: this._loading,
        error: this._error,

        showHero: this.properties.showHero !== false,
        showMarquee: this.properties.showMarquee !== false,
        showNews: this.properties.showNews !== false,
        showQuickAccess: this.properties.showQuickAccess !== false,
        showGallery: this.properties.showGallery !== false,
        showTeam: this.properties.showTeam !== false,
        showEmployee: this.properties.showEmployee !== false,
        showProjects: this.properties.showProjects !== false,
      }
    );

    ReactDom.render(element, this.domElement);
  }

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
    this._events = (eventsRes || []).slice(0, 4);
    this._gallery = galleryRes || [];
    this._collaborators = collaboratorsRes || [];
    this._projects = projectsRes || [];

    this._employee = employeeRes;
    if (this._employee) {
      this._employeePhoto = await this._resolveEmployeePhoto(this._employee);
    }

    const failures = [
      slidesRes,
      announcementsRes,
      newsRes,
      linksRes,
      galleryRes,
      collaboratorsRes,
      projectsRes,
    ].filter((value) => value === undefined).length;

    this._error =
      failures >= 7
        ? "Impossible de charger le contenu de la page d'accueil. Vérifiez que les listes du hub sont déployées (voir « 10-listes-a-creer.md »)."
        : undefined;

    this._loading = false;
    this.render();
  }

  private async _resolveEmployeePhoto(
    employee: IEmployeeOfMonth
  ): Promise<string> {
    if (employee.Photo) return buildImageUrl(employee.Photo, 600);
    if (!employee.Employee) return "";

    try {
      const all: ICollaborateur[] = await this._service.getCollaborateurs();
      const match = all.filter(
        (person) => person.Id === employee.Employee.Id
      )[0];

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
              "Regroupe en une seule Web Part toutes les sections de la page d'accueil (à l'image du site statique). Cochez / décochez les sections pour les regrouper à votre convenance.",
          },
          groups: [
            {
              groupName: "Sections affichées",
              groupFields: [
                PropertyPaneToggle("showHero", {
                  label: "Carrousel d'accueil (Hero)",
                  onText: "Oui",
                  offText: "Non",
                }),
                PropertyPaneToggle("showMarquee", {
                  label: "Bandeau d'annonces",
                  onText: "Oui",
                  offText: "Non",
                }),
                PropertyPaneToggle("showNews", {
                  label: "Actualités",
                  onText: "Oui",
                  offText: "Non",
                }),
                PropertyPaneToggle("showQuickAccess", {
                  label: "Accès rapide (documents, liens, événements)",
                  onText: "Oui",
                  offText: "Non",
                }),
                PropertyPaneToggle("showGallery", {
                  label: "Galerie photos",
                  onText: "Oui",
                  offText: "Non",
                }),
                PropertyPaneToggle("showTeam", {
                  label: "Notre équipe",
                  onText: "Oui",
                  offText: "Non",
                }),
                PropertyPaneToggle("showEmployee", {
                  label: "Collaborateur du mois",
                  onText: "Oui",
                  offText: "Non",
                }),
                PropertyPaneToggle("showProjects", {
                  label: "Tableau de bord Projets",
                  onText: "Oui",
                  offText: "Non",
                }),
              ],
            },
            {
              groupName: "Apparence",
              groupFields: [
                PropertyPaneDropdown("height", {
                  label: "Hauteur du carrousel",
                  options: [
                    { key: "screen", text: "Plein écran" },
                    { key: "large", text: "Grande (70%)" },
                    { key: "medium", text: "Moyenne (55%)" },
                  ],
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}

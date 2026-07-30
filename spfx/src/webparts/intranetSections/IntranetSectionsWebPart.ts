import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle,
  PropertyPaneSlider,
} from "@microsoft/sp-property-pane";

import { IntranetSections } from "./components/IntranetSections";
import { IIntranetSectionsProps } from "./components/IIntranetSectionsProps";
import { DataService } from "../../services/DataService";
import {
  ICollaborateur,
  IEmployeeOfMonth,
  IProject,
} from "../../models/IIkaModels";
import {
  buildImageUrl,
  buildUserPhotoUrl,
} from "../../common/utils/spUtils";

export interface IIntranetSectionsWebPartProps {
  employeeTitle: string;
  projectsTitle: string;
  projectsDescription: string;
  maxProjects: number;
  showEmployee: boolean;
  showProjects: boolean;
}

export default class IntranetSectionsWebPart extends BaseClientSideWebPart<IIntranetSectionsWebPartProps> {
  private _service!: DataService;
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

    const element: React.ReactElement<IIntranetSectionsProps> =
      React.createElement(IntranetSections, {
        employeeTitle: this.properties.employeeTitle || "Collaborateur du mois",
        projectsTitle:
          this.properties.projectsTitle || "Tableau de bord Projets",
        projectsDescription: this.properties.projectsDescription || "",
        employee: this._employee,
        employeePhotoUrl: this._employeePhoto,
        projects: this._projects.slice(0, this.properties.maxProjects || 4),
        loading: this._loading,
        error: this._error,
        showEmployee: this.properties.showEmployee !== false,
        showProjects: this.properties.showProjects !== false,
      });

    ReactDom.render(element, this.domElement);
  }

  private async _load(): Promise<void> {
    const results = await Promise.all([
      this._service.getEmployeeOfMonth().catch(() => undefined),
      this._service.getProjects(true).catch(() => undefined),
    ]);

    this._employee = results[0];
    this._projects = results[1] || [];

    if (this._employee) {
      this._employeePhoto = await this._resolveEmployeePhoto(this._employee);
    }

    const allFailed = results[0] === undefined && results[1] === undefined;
    this._error = allFailed
      ? "Impossible de charger le contenu. Vérifiez les listes « CollaborateurDuMois » et « Projets »."
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
              "Met à l'honneur le collaborateur du mois et affiche le tableau de bord des projets.",
          },
          groups: [
            {
              groupName: "Collaborateur du mois",
              groupFields: [
                PropertyPaneToggle("showEmployee", {
                  label: "Afficher la section",
                  onText: "Oui",
                  offText: "Non",
                }),
                PropertyPaneTextField("employeeTitle", { label: "Titre" }),
              ],
            },
            {
              groupName: "Projets",
              groupFields: [
                PropertyPaneToggle("showProjects", {
                  label: "Afficher la section",
                  onText: "Oui",
                  offText: "Non",
                }),
                PropertyPaneTextField("projectsTitle", { label: "Titre" }),
                PropertyPaneTextField("projectsDescription", {
                  label: "Description",
                  multiline: true,
                }),
                PropertyPaneSlider("maxProjects", {
                  label: "Nombre de projets",
                  min: 2,
                  max: 12,
                  step: 2,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}

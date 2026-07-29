import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneToggle,
  PropertyPaneDropdown,
} from "@microsoft/sp-property-pane";

import { TeamDirectory } from "./components/TeamDirectory";
import { ITeamDirectoryProps } from "./components/ITeamDirectoryProps";
import { DataService } from "../../services/DataService";
import { ICollaborateur } from "../../models/IIkaModels";

export interface ITeamDirectoryWebPartProps {
  title: string;
  division: string;
  columns: number;
  maxItems: number;
  showPhotos: boolean;
}

export default class TeamDirectoryWebPart extends BaseClientSideWebPart<ITeamDirectoryWebPartProps> {
  private _service!: DataService;
  private _members: ICollaborateur[] = [];
  private _loading: boolean = true;
  private _error: string | undefined = undefined;
  private _loadedFor: string = "";

  protected async onInit(): Promise<void> {
    await super.onInit();
    this._service = new DataService(this.context);
  }

  public render(): void {
    const signature = this.properties.division || "all";

    if (this._loadedFor !== signature) {
      this._loadedFor = signature;
      this._loading = true;
      void this._load();
    }

    const max = this.properties.maxItems || 12;
    const visible = this._members.slice(0, max);

    const element: React.ReactElement<ITeamDirectoryProps> = React.createElement(
      TeamDirectory,
      {
        title: this.properties.title || "Équipe",
        members: visible,
        loading: this._loading,
        error: this._error,
        columns: this.properties.columns || 3,
        showPhotos: this.properties.showPhotos !== false,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private async _load(): Promise<void> {
    try {
      this._members = await this._service.getCollaborateurs(
        this.properties.division || undefined
      );
      this._error = undefined;
    } catch {
      this._members = [];
      this._error =
        "Impossible de charger l'annuaire. Vérifiez que la liste « Collaborateurs » existe sur le hub.";
    } finally {
      this._loading = false;
      this.render();
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
          header: { description: "Paramètres de l'annuaire" },
          groups: [
            {
              groupName: "Contenu",
              groupFields: [
                PropertyPaneTextField("title", {
                  label: "Titre de la section",
                }),
                PropertyPaneDropdown("division", {
                  label: "Direction",
                  options: [
                    { key: "", text: "Toutes les directions" },
                    { key: "Direction Générale", text: "Direction Générale" },
                    { key: "Engineering", text: "Engineering" },
                    { key: "Ventes & Marketing", text: "Ventes & Marketing" },
                    { key: "Comptabilité", text: "Comptabilité" },
                    { key: "Administration", text: "Administration" },
                    { key: "Support Technique", text: "Support Technique" },
                  ],
                }),
                PropertyPaneSlider("maxItems", {
                  label: "Nombre de collaborateurs",
                  min: 3,
                  max: 48,
                  step: 3,
                }),
              ],
            },
            {
              groupName: "Affichage",
              groupFields: [
                PropertyPaneSlider("columns", {
                  label: "Nombre de colonnes",
                  min: 1,
                  max: 4,
                  step: 1,
                }),
                PropertyPaneToggle("showPhotos", {
                  label: "Afficher les photos",
                  onText: "Oui",
                  offText: "Initiales",
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}

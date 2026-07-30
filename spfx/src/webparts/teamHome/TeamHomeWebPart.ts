import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle,
} from "@microsoft/sp-property-pane";

import { TeamHome } from "./components/TeamHome";
import { ITeamHomeProps } from "./components/ITeamHomeProps";
import { DataService } from "../../services/DataService";
import { ICollaborateur } from "../../models/IIkaModels";

export interface ITeamHomeWebPartProps {
  title: string;
  description: string;
  showSearch: boolean;
  showBirthdays: boolean;
}

export default class TeamHomeWebPart extends BaseClientSideWebPart<ITeamHomeWebPartProps> {
  private _service!: DataService;
  private _members: ICollaborateur[] = [];
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

    const element: React.ReactElement<ITeamHomeProps> = React.createElement(
      TeamHome,
      {
        title: this.properties.title || "Notre équipe",
        description: this.properties.description || "",
        members: this._members,
        loading: this._loading,
        error: this._error,
        showSearch: this.properties.showSearch !== false,
        showBirthdays: this.properties.showBirthdays !== false,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private async _load(): Promise<void> {
    try {
      this._members = await this._service.getCollaborateurs();
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
          header: {
            description:
              "Grille des collaborateurs avec recherche, filtre par direction et fiche détaillée.",
          },
          groups: [
            {
              groupName: "Contenu",
              groupFields: [
                PropertyPaneTextField("title", { label: "Titre" }),
                PropertyPaneTextField("description", {
                  label: "Description",
                  multiline: true,
                }),
              ],
            },
            {
              groupName: "Affichage",
              groupFields: [
                PropertyPaneToggle("showSearch", {
                  label: "Recherche et filtres",
                  onText: "Oui",
                  offText: "Non",
                }),
                PropertyPaneToggle("showBirthdays", {
                  label: "Afficher les anniversaires",
                  onText: "Oui",
                  offText: "Non",
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}

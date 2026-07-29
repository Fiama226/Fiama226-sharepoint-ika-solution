import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle,
} from "@microsoft/sp-property-pane";

import { AnnouncementsList } from "./components/AnnouncementsList";
import { IAnnouncementsListProps } from "./components/IAnnouncementsListProps";
import { DataService } from "../../services/DataService";
import { IAnnouncement } from "../../models/IIkaModels";

export interface IAnnouncementsListWebPartProps {
  eyebrow: string;
  title: string;
  description: string;
  showFilters: boolean;
}

export default class AnnouncementsListWebPart extends BaseClientSideWebPart<IAnnouncementsListWebPartProps> {
  private _service!: DataService;
  private _announcements: IAnnouncement[] = [];
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

    const element: React.ReactElement<IAnnouncementsListProps> =
      React.createElement(AnnouncementsList, {
        eyebrow: this.properties.eyebrow || "Annonces",
        title: this.properties.title || "Toutes les annonces",
        description: this.properties.description || "",
        announcements: this._announcements,
        loading: this._loading,
        error: this._error,
        showFilters: this.properties.showFilters !== false,
      });

    ReactDom.render(element, this.domElement);
  }

  private async _load(): Promise<void> {
    try {
      this._announcements = await this._service.getAnnouncements();
      this._error = undefined;
    } catch {
      this._announcements = [];
      this._error =
        "Impossible de charger les annonces. Vérifiez que la liste « Annonces » existe sur le hub.";
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
          header: { description: "Page complète des annonces internes" },
          groups: [
            {
              groupName: "Contenu",
              groupFields: [
                PropertyPaneTextField("eyebrow", {
                  label: "Étiquette",
                }),
                PropertyPaneTextField("title", {
                  label: "Titre",
                }),
                PropertyPaneTextField("description", {
                  label: "Description",
                  multiline: true,
                }),
                PropertyPaneToggle("showFilters", {
                  label: "Afficher les filtres par type",
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

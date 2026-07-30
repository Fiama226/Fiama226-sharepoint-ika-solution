import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";

import { AnnouncementMarquee } from "./components/AnnouncementMarquee";
import { IAnnouncementMarqueeProps } from "./components/IAnnouncementMarqueeProps";
import { DataService } from "../../services/DataService";
import { IAnnouncement } from "../../models/IIkaModels";

export interface IAnnouncementMarqueeWebPartProps {
  eyebrow: string;
  title: string;
  seeAllUrl: string;
}

export default class AnnouncementMarqueeWebPart extends BaseClientSideWebPart<IAnnouncementMarqueeWebPartProps> {
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

    const element: React.ReactElement<IAnnouncementMarqueeProps> =
      React.createElement(AnnouncementMarquee, {
        eyebrow: this.properties.eyebrow || "Annonces",
        title: this.properties.title || "Célébrations & événements",
        announcements: this._announcements,
        loading: this._loading,
        error: this._error,
        seeAllUrl: this.properties.seeAllUrl,
      });

    ReactDom.render(element, this.domElement);
  }

  private async _load(): Promise<void> {
    try {
      this._announcements = await this._service.getAnnouncements();
      this._error = undefined;
    } catch {
      this._announcements = [];
      this._error = "Annonces indisponibles.";
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
              "Bandeau défilant des annonces internes. Le bandeau se masque automatiquement s'il n'y a aucune annonce active.",
          },
          groups: [
            {
              groupName: "Affichage",
              groupFields: [
                PropertyPaneTextField("eyebrow", {
                  label: "Étiquette",
                }),
                PropertyPaneTextField("title", {
                  label: "Titre",
                }),
                PropertyPaneTextField("seeAllUrl", {
                  label: "Lien « Voir toutes les annonces »",
                  description: "Laisser vide pour masquer le bouton",
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}

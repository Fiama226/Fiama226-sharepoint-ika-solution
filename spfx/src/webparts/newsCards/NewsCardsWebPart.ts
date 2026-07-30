import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
} from "@microsoft/sp-property-pane";

import { NewsCards } from "./components/NewsCards";
import { INewsCardsProps } from "./components/INewsCardsProps";
import { DataService } from "../../services/DataService";
import { INewsItem } from "../../models/IIkaModels";

export interface INewsCardsWebPartProps {
  eyebrow: string;
  title: string;
  description: string;
  maxItems: number;
  ctaUrl: string;
  ctaLabel: string;
}

export default class NewsCardsWebPart extends BaseClientSideWebPart<INewsCardsWebPartProps> {
  private _service!: DataService;
  private _items: INewsItem[] = [];
  private _loading: boolean = true;
  private _error: string | undefined = undefined;
  private _loadedFor: string = "";

  protected async onInit(): Promise<void> {
    await super.onInit();
    this._service = new DataService(this.context);
  }

  public render(): void {
    const signature = String(this.properties.maxItems);

    if (this._loadedFor !== signature) {
      this._loadedFor = signature;
      this._loading = true;
      void this._load();
    }

    const element: React.ReactElement<INewsCardsProps> = React.createElement(
      NewsCards,
      {
        eyebrow: this.properties.eyebrow || "Vie interne",
        title: this.properties.title || "Actualités de l'entreprise",
        description: this.properties.description || "",
        items: this._items,
        loading: this._loading,
        error: this._error,
        ctaUrl: this.properties.ctaUrl,
        ctaLabel: this.properties.ctaLabel || "Voir toutes les actualités",
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private async _load(): Promise<void> {
    try {
      this._items = await this._service.getNews(this.properties.maxItems || 4);
      this._error = undefined;
    } catch {
      this._items = [];
      this._error =
        "Impossible de charger les actualités. Vérifiez que la liste « Actualites » existe sur ce site.";
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
          header: { description: "Grille d'actualités de la page d'accueil" },
          groups: [
            {
              groupName: "Contenu",
              groupFields: [
                PropertyPaneTextField("eyebrow", { label: "Étiquette" }),
                PropertyPaneTextField("title", { label: "Titre" }),
                PropertyPaneTextField("description", {
                  label: "Description",
                  multiline: true,
                }),
                PropertyPaneSlider("maxItems", {
                  label: "Nombre d'actualités",
                  min: 2,
                  max: 8,
                  step: 2,
                }),
              ],
            },
            {
              groupName: "Bouton",
              groupFields: [
                PropertyPaneTextField("ctaUrl", {
                  label: "Lien du bouton",
                  description: "Laisser vide pour masquer le bouton",
                }),
                PropertyPaneTextField("ctaLabel", {
                  label: "Texte du bouton",
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}

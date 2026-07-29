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

import { NewsList } from "./components/NewsList";
import { INewsListProps } from "./components/INewsListProps";
import { DataService } from "../../services/DataService";
import { INewsItem } from "../../models/IIkaModels";

export interface INewsListWebPartProps {
  title: string;
  maxItems: number;
  showImages: boolean;
  layout: "list" | "cards";
  seeAllUrl: string;
}

export default class NewsListWebPart extends BaseClientSideWebPart<INewsListWebPartProps> {
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
    const signature = `${this.properties.maxItems}`;

    if (this._loadedFor !== signature) {
      this._loadedFor = signature;
      this._loading = true;
      this._error = undefined;
      void this._load();
    }

    const element: React.ReactElement<INewsListProps> = React.createElement(
      NewsList,
      {
        title: this.properties.title || "Actualités",
        items: this._items,
        loading: this._loading,
        error: this._error,
        showImages: this.properties.showImages !== false,
        layout: this.properties.layout || "cards",
        seeAllUrl: this.properties.seeAllUrl,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private async _load(): Promise<void> {
    try {
      this._items = await this._service.getNews(this.properties.maxItems || 4);
      this._error = undefined;
    } catch (error) {
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
          header: { description: "Paramètres du web part Actualités" },
          groups: [
            {
              groupName: "Affichage",
              groupFields: [
                PropertyPaneTextField("title", {
                  label: "Titre de la section",
                }),
                PropertyPaneDropdown("layout", {
                  label: "Disposition",
                  options: [
                    { key: "cards", text: "Cartes" },
                    { key: "list", text: "Liste" },
                  ],
                }),
                PropertyPaneSlider("maxItems", {
                  label: "Nombre d'actualités",
                  min: 1,
                  max: 12,
                  step: 1,
                }),
                PropertyPaneToggle("showImages", {
                  label: "Afficher les images",
                  onText: "Oui",
                  offText: "Non",
                }),
                PropertyPaneTextField("seeAllUrl", {
                  label: "Lien « Tout voir »",
                  description: "Laisser vide pour masquer le lien",
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}

import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneToggle,
} from "@microsoft/sp-property-pane";

import { DocumentsList } from "./components/DocumentsList";
import { IDocumentsListProps } from "./components/IDocumentsListProps";
import { DataService } from "../../services/DataService";
import { IDocumentItem } from "../../models/IIkaModels";

export interface IDocumentsListWebPartProps {
  title: string;
  maxItems: number;
  pinnedFirst: boolean;
  showConfidentiality: boolean;
  showAllUrl: string;
}

export default class DocumentsListWebPart extends BaseClientSideWebPart<IDocumentsListWebPartProps> {
  private _service!: DataService;
  private _documents: IDocumentItem[] = [];
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

    const items = this.properties.pinnedFirst
      ? this._sortPinnedFirst(this._documents)
      : this._documents;

    const element: React.ReactElement<IDocumentsListProps> = React.createElement(
      DocumentsList,
      {
        title: this.properties.title || "Documents récents",
        documents: items,
        loading: this._loading,
        error: this._error,
        showAllUrl: this.properties.showAllUrl,
        showConfidentiality: this.properties.showConfidentiality !== false,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private _sortPinnedFirst(items: IDocumentItem[]): IDocumentItem[] {
    return items.slice().sort((a, b) => {
      const pa = a.IsPinned ? 1 : 0;
      const pb = b.IsPinned ? 1 : 0;
      if (pa !== pb) return pb - pa;
      return new Date(b.Modified).getTime() - new Date(a.Modified).getTime();
    });
  }

  private async _load(): Promise<void> {
    try {
      this._documents = await this._service.getDocuments(
        this.properties.maxItems || 6
      );
      this._error = undefined;
    } catch {
      this._documents = [];
      this._error =
        "Impossible de charger les documents. Vérifiez que la bibliothèque « Documents » existe sur ce site.";
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
          header: { description: "Paramètres de la liste de documents" },
          groups: [
            {
              groupName: "Affichage",
              groupFields: [
                PropertyPaneTextField("title", {
                  label: "Titre de la section",
                }),
                PropertyPaneSlider("maxItems", {
                  label: "Nombre de documents",
                  min: 1,
                  max: 20,
                  step: 1,
                }),
                PropertyPaneToggle("pinnedFirst", {
                  label: "Documents épinglés en premier",
                  onText: "Oui",
                  offText: "Non",
                }),
                PropertyPaneToggle("showConfidentiality", {
                  label: "Afficher la confidentialité",
                  onText: "Oui",
                  offText: "Non",
                }),
                PropertyPaneTextField("showAllUrl", {
                  label: "Lien « Tous les documents »",
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

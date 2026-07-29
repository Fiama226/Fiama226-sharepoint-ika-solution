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

import { FaqList } from "./components/FaqList";
import { IFaqListProps } from "./components/IFaqListProps";
import { DataService } from "../../services/DataService";
import { IFaqItem } from "../../models/IIkaModels";

export interface IFaqListWebPartProps {
  title: string;
  category: string;
  columns: number;
  groupByCategory: boolean;
  allowMultipleOpen: boolean;
}

export default class FaqListWebPart extends BaseClientSideWebPart<IFaqListWebPartProps> {
  private _service!: DataService;
  private _items: IFaqItem[] = [];
  private _loading: boolean = true;
  private _error: string | undefined = undefined;
  private _loadedFor: string = "";

  protected async onInit(): Promise<void> {
    await super.onInit();
    this._service = new DataService(this.context);
  }

  public render(): void {
    const signature = this.properties.category || "all";

    if (this._loadedFor !== signature) {
      this._loadedFor = signature;
      this._loading = true;
      void this._load();
    }

    const element: React.ReactElement<IFaqListProps> = React.createElement(
      FaqList,
      {
        title: this.properties.title || "Questions fréquentes",
        items: this._items,
        loading: this._loading,
        error: this._error,
        columns: this.properties.columns || 2,
        groupByCategory: this.properties.groupByCategory === true,
        allowMultipleOpen: this.properties.allowMultipleOpen !== false,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private async _load(): Promise<void> {
    try {
      this._items = await this._service.getFaq(
        this.properties.category || undefined
      );
      this._error = undefined;
    } catch {
      this._items = [];
      this._error =
        "Impossible de charger la FAQ. Vérifiez que la liste « FAQ » existe sur le hub.";
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
          header: { description: "Paramètres de la FAQ" },
          groups: [
            {
              groupName: "Contenu",
              groupFields: [
                PropertyPaneTextField("title", {
                  label: "Titre de la section",
                }),
                PropertyPaneDropdown("category", {
                  label: "Catégorie",
                  options: [
                    { key: "", text: "Toutes les catégories" },
                    { key: "RH", text: "RH" },
                    { key: "IT", text: "IT" },
                    { key: "Comptabilité", text: "Comptabilité" },
                    { key: "Général", text: "Général" },
                    { key: "Sécurité", text: "Sécurité" },
                  ],
                }),
              ],
            },
            {
              groupName: "Affichage",
              groupFields: [
                PropertyPaneSlider("columns", {
                  label: "Nombre de colonnes",
                  min: 1,
                  max: 2,
                  step: 1,
                }),
                PropertyPaneToggle("groupByCategory", {
                  label: "Grouper par catégorie",
                  onText: "Oui",
                  offText: "Non",
                }),
                PropertyPaneToggle("allowMultipleOpen", {
                  label: "Plusieurs réponses ouvertes",
                  onText: "Autorisé",
                  offText: "Une seule",
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}

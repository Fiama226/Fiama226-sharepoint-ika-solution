import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneDropdown,
} from "@microsoft/sp-property-pane";

import { QuickLinks } from "./components/QuickLinks";
import { IQuickLinksProps } from "./components/IQuickLinksProps";
import { DataService } from "../../services/DataService";
import { IQuickLink } from "../../models/IIkaModels";

export interface IQuickLinksWebPartProps {
  title: string;
  columns: number;
  filterGroup: string;
}

export default class QuickLinksWebPart extends BaseClientSideWebPart<IQuickLinksWebPartProps> {
  private _service!: DataService;
  private _links: IQuickLink[] = [];
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

    const group = this.properties.filterGroup;
    const visible = group
      ? this._links.filter((link) => link.LinkGroup === group)
      : this._links;

    const element: React.ReactElement<IQuickLinksProps> = React.createElement(
      QuickLinks,
      {
        title: this.properties.title || "Accès rapide",
        links: visible,
        loading: this._loading,
        error: this._error,
        columns: this.properties.columns || 3,
        filterGroup: group,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private async _load(): Promise<void> {
    try {
      this._links = await this._service.getQuickLinks();
      this._error = undefined;
    } catch {
      this._links = [];
      this._error =
        "Impossible de charger les liens rapides. Vérifiez que la liste « LiensRapides » existe sur ce site.";
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
          header: { description: "Paramètres des liens rapides" },
          groups: [
            {
              groupName: "Affichage",
              groupFields: [
                PropertyPaneTextField("title", {
                  label: "Titre de la section",
                }),
                PropertyPaneSlider("columns", {
                  label: "Nombre de colonnes",
                  min: 1,
                  max: 4,
                  step: 1,
                }),
                PropertyPaneDropdown("filterGroup", {
                  label: "Filtrer par groupe",
                  options: [
                    { key: "", text: "Tous les groupes" },
                    { key: "Outils", text: "Outils" },
                    { key: "RH", text: "RH" },
                    { key: "Métier", text: "Métier" },
                    { key: "Support", text: "Support" },
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

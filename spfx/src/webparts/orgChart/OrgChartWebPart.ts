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

import { OrgChart } from "./components/OrgChart";
import { IOrgChartProps } from "./components/IOrgChartProps";
import { DataService } from "../../services/DataService";
import { ICollaborateur, IOrgNode } from "../../models/IIkaModels";

export interface IOrgChartWebPartProps {
  title: string;
  subtitle: string;
  showSearch: boolean;
  showControls: boolean;
  initialZoom: number;
  defaultCollapsedDepth: number;
}

export default class OrgChartWebPart extends BaseClientSideWebPart<IOrgChartWebPartProps> {
  private _service!: DataService;
  private _roots: IOrgNode[] = [];
  private _flat: ICollaborateur[] = [];
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

    const element: React.ReactElement<IOrgChartProps> = React.createElement(
      OrgChart,
      {
        title: this.properties.title || "Organigramme",
        subtitle: this.properties.subtitle || "IKA Solution",
        roots: this._roots,
        flat: this._flat,
        loading: this._loading,
        error: this._error,
        showSearch: this.properties.showSearch !== false,
        showControls: this.properties.showControls !== false,
        initialZoom: this.properties.initialZoom || 100,
        defaultCollapsedDepth:
          typeof this.properties.defaultCollapsedDepth === "number"
            ? this.properties.defaultCollapsedDepth
            : 2,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private async _load(): Promise<void> {
    try {
      this._flat = await this._service.getCollaborateurs();
      this._roots = DataService.buildTree(this._flat);
      this._error = undefined;
    } catch {
      this._flat = [];
      this._roots = [];
      this._error =
        "Impossible de charger l'organigramme. Vérifiez que la liste « Collaborateurs » existe sur le hub.";
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
              "Organigramme construit automatiquement à partir de la colonne « Responsable » de la liste Collaborateurs.",
          },
          groups: [
            {
              groupName: "Contenu",
              groupFields: [
                PropertyPaneTextField("title", { label: "Titre" }),
                PropertyPaneTextField("subtitle", { label: "Sous-titre" }),
              ],
            },
            {
              groupName: "Affichage",
              groupFields: [
                PropertyPaneToggle("showSearch", {
                  label: "Barre de recherche",
                  onText: "Oui",
                  offText: "Non",
                }),
                PropertyPaneToggle("showControls", {
                  label: "Zoom et plein écran",
                  onText: "Oui",
                  offText: "Non",
                }),
                PropertyPaneSlider("initialZoom", {
                  label: "Zoom initial (%)",
                  min: 40,
                  max: 150,
                  step: 10,
                }),
                PropertyPaneSlider("defaultCollapsedDepth", {
                  label: "Replier à partir du niveau",
                  min: 1,
                  max: 5,
                  step: 1,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}

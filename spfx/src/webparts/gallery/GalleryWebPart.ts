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

import { Gallery } from "./components/Gallery";
import { IGalleryProps } from "./components/IGalleryProps";
import { DataService } from "../../services/DataService";
import { IGalleryImage } from "../../models/IIkaModels";

export interface IGalleryWebPartProps {
  title: string;
  description: string;
  maxItems: number;
  showFilters: boolean;
  mosaicLayout: boolean;
}

export default class GalleryWebPart extends BaseClientSideWebPart<IGalleryWebPartProps> {
  private _service!: DataService;
  private _images: IGalleryImage[] = [];
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

    const element: React.ReactElement<IGalleryProps> = React.createElement(
      Gallery,
      {
        title: this.properties.title || "Galerie",
        description: this.properties.description || "",
        images: this._images,
        loading: this._loading,
        error: this._error,
        showFilters: this.properties.showFilters !== false,
        mosaicLayout: this.properties.mosaicLayout !== false,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private async _load(): Promise<void> {
    try {
      this._images = await this._service.getGalleryImages(
        this.properties.maxItems || 12
      );
      this._error = undefined;
    } catch {
      this._images = [];
      this._error =
        "Impossible de charger la galerie. Vérifiez que la bibliothèque « Galerie » existe sur le hub.";
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
          header: { description: "Photothèque avec visionneuse plein écran" },
          groups: [
            {
              groupName: "Contenu",
              groupFields: [
                PropertyPaneTextField("title", { label: "Titre" }),
                PropertyPaneTextField("description", {
                  label: "Description",
                  multiline: true,
                }),
                PropertyPaneSlider("maxItems", {
                  label: "Nombre de photos",
                  min: 4,
                  max: 40,
                  step: 4,
                }),
              ],
            },
            {
              groupName: "Affichage",
              groupFields: [
                PropertyPaneToggle("showFilters", {
                  label: "Filtres par catégorie",
                  onText: "Oui",
                  offText: "Non",
                }),
                PropertyPaneToggle("mosaicLayout", {
                  label: "Disposition mosaïque",
                  onText: "Mosaïque",
                  offText: "Grille régulière",
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}

import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import {
  IPropertyPaneConfiguration,
  PropertyPaneToggle,
  PropertyPaneDropdown,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";

import { HeroSlider } from "./components/HeroSlider";
import { IHeroSliderProps } from "./components/IHeroSliderProps";
import { DataService } from "../../services/DataService";
import {
  IHeroSlide,
  IIndicator,
  IMission,
} from "../../models/IIkaModels";

export interface IHeroSliderWebPartProps {
  height: string;
  showClock: boolean;
  showPanel: boolean;
  userRoleOverride: string;
}

const HEIGHT_CLASSES: Record<string, string> = {
  screen: "ika-h-screen",
  large: "ika-h-[70vh]",
  medium: "ika-h-[55vh]",
};

export default class HeroSliderWebPart extends BaseClientSideWebPart<IHeroSliderWebPartProps> {
  private _service!: DataService;
  private _slides: IHeroSlide[] = [];
  private _missions: IMission[] = [];
  private _stats: IIndicator[] = [];
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

    const element: React.ReactElement<IHeroSliderProps> = React.createElement(
      HeroSlider,
      {
        slides: this._slides,
        missions: this._missions,
        stats: this._stats,
        currentUser: this.context.pageContext.user.displayName,
        currentUserRole: this.properties.userRoleOverride || "",
        loading: this._loading,
        error: this._error,
        heightClass:
          HEIGHT_CLASSES[this.properties.height] || HEIGHT_CLASSES.large,
        showClock: this.properties.showClock !== false,
        showPanel: this.properties.showPanel !== false,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private async _load(): Promise<void> {
    const results = await Promise.all([
      this._service.getHeroSlides().catch(() => undefined),
      this._service.getMissions().catch(() => undefined),
      this._service.getIndicators("Hero accueil").catch(() => undefined),
    ]);

    this._slides = results[0] || [];
    this._missions = results[1] || [];
    this._stats = results[2] || [];

    this._error =
      results[0] === undefined
        ? "Impossible de charger les visuels d'accueil."
        : undefined;

    this._loading = false;
    this.render();
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
              "Carrousel d'accueil. Le contenu provient des listes « HeroSlides », « Missions » et « Indicateurs » du hub.",
          },
          groups: [
            {
              groupName: "Apparence",
              groupFields: [
                PropertyPaneDropdown("height", {
                  label: "Hauteur",
                  options: [
                    { key: "screen", text: "Plein écran" },
                    { key: "large", text: "Grande (70%)" },
                    { key: "medium", text: "Moyenne (55%)" },
                  ],
                }),
                PropertyPaneToggle("showClock", {
                  label: "Afficher l'horloge",
                  onText: "Oui",
                  offText: "Non",
                }),
                PropertyPaneToggle("showPanel", {
                  label: "Afficher le panneau latéral",
                  onText: "Oui",
                  offText: "Non",
                }),
                PropertyPaneTextField("userRoleOverride", {
                  label: "Fonction affichée sous le nom",
                  description:
                    "Laisser vide pour n'afficher que le nom de l'utilisateur",
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}

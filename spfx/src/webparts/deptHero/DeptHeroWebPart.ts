import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle,
  PropertyPaneDropdown,
} from "@microsoft/sp-property-pane";

import { DeptHero } from "./components/DeptHero";
import { IDeptHeroProps } from "./components/IDeptHeroProps";
import { DataService } from "../../services/DataService";
import { IDepartement } from "../../models/IIkaModels";

export interface IDeptHeroWebPartProps {
  departementSlug: string;
  titleOverride: string;
  subtitleOverride: string;
  backgroundUrl: string;
  eyebrow: string;
  showClock: boolean;
}

export default class DeptHeroWebPart extends BaseClientSideWebPart<IDeptHeroWebPartProps> {
  private _service!: DataService;
  private _departement: IDepartement | undefined = undefined;
  private _loading: boolean = true;
  private _loadedFor: string = "";

  protected async onInit(): Promise<void> {
    await super.onInit();
    this._service = new DataService(this.context);
  }

  private get _defaultBackground(): string {
    const origin = window.location.origin;
    const sitePath = this.context.pageContext.web.serverRelativeUrl || "/sites/ikareview";
    return `${origin}${sitePath}/SiteAssets/hero-background.png`;
  }

  public render(): void {
    const slug = this.properties.departementSlug || this._guessSlug();

    if (this._loadedFor !== slug) {
      this._loadedFor = slug;
      this._loading = true;
      void this._load(slug);
    }

    const dept = this._departement;
    const user = this.context.pageContext.user;

    const element: React.ReactElement<IDeptHeroProps> = React.createElement(
      DeptHero,
      {
        title:
          this.properties.titleOverride ||
          (dept ? dept.HeroTitle : "") ||
          this.context.pageContext.web.title,
        subtitle:
          this.properties.subtitleOverride || (dept ? dept.HeroSubtitle : ""),
        userName: user.displayName,
        userRole: dept ? dept.Tagline : "",
        backgroundUrl: this.properties.backgroundUrl || this._defaultBackground,
        eyebrow: this.properties.eyebrow || "Espace département",
        showClock: this.properties.showClock !== false,
        loading: this._loading && !this.properties.titleOverride,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private _guessSlug(): string {
    const path = this.context.pageContext.web.serverRelativeUrl.toLowerCase();
    const known = [
      "comptabilite",
      "administration",
      "commerciaux",
      "techniciens",
    ];
    for (let i = 0; i < known.length; i++) {
      if (path.indexOf(known[i]) !== -1) return known[i];
    }
    return "";
  }

  private async _load(slug: string): Promise<void> {
    if (!slug) {
      this._loading = false;
      this.render();
      return;
    }

    try {
      const all = await this._service.getDepartements();
      this._departement = all.filter((d) => d.Slug === slug)[0];
    } catch {
      this._departement = undefined;
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
              "Bannière du site département. Laissez les champs vides pour utiliser les valeurs de la liste « Departements ».",
          },
          groups: [
            {
              groupName: "Contenu",
              groupFields: [
                PropertyPaneDropdown("departementSlug", {
                  label: "Département",
                  options: [
                    { key: "", text: "Détection automatique" },
                    { key: "comptabilite", text: "Comptabilité" },
                    { key: "administration", text: "Administration" },
                    { key: "commerciaux", text: "Commerciaux" },
                    { key: "techniciens", text: "Techniciens" },
                  ],
                }),
                PropertyPaneTextField("titleOverride", {
                  label: "Titre personnalisé",
                }),
                PropertyPaneTextField("subtitleOverride", {
                  label: "Sous-titre personnalisé",
                  multiline: true,
                }),
                PropertyPaneTextField("eyebrow", {
                  label: "Étiquette",
                }),
              ],
            },
            {
              groupName: "Apparence",
              groupFields: [
                PropertyPaneTextField("backgroundUrl", {
                  label: "Image de fond (URL)",
                }),
                PropertyPaneToggle("showClock", {
                  label: "Afficher l'horloge",
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

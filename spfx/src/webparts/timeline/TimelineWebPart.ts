import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle,
} from "@microsoft/sp-property-pane";

import { Timeline } from "./components/Timeline";
import { ITimelineProps } from "./components/ITimelineProps";
import { DataService } from "../../services/DataService";
import {
  IIndicator,
  IMilestone,
  IMission,
} from "../../models/IIkaModels";

export interface ITimelineWebPartProps {
  eyebrow: string;
  title: string;
  description: string;
  foundedYear: string;
  heroImageUrl: string;
  statsImageUrl: string;
  founderName: string;
  founderRole: string;
  founderQuote: string;
  founderPhotoUrl: string;
  showValues: boolean;
  showStats: boolean;
}

/** Visuels attendus dans `SiteAssets` si la propriété est laissée vide. */
const DEFAULT_HERO_ASSET = "SiteAssets/histoire-hero.jpg";
const DEFAULT_STATS_ASSET = "SiteAssets/histoire-chiffres.jpg";
const DEFAULT_FOUNDER_ASSET = "SiteAssets/team/DG.jpg";

const DEFAULT_FOUNDED_YEAR = 2014;

export default class TimelineWebPart extends BaseClientSideWebPart<ITimelineWebPartProps> {
  private _service!: DataService;
  private _milestones: IMilestone[] = [];
  private _values: IMission[] = [];
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

    const founderName = (this.properties.founderName || "").trim();

    const element: React.ReactElement<ITimelineProps> = React.createElement(
      Timeline,
      {
        eyebrow: this.properties.eyebrow || "Notre histoire",
        title: this.properties.title || "Les grandes étapes",
        description: this.properties.description || "",
        foundedYear: this._foundedYear(),
        heroImageUrl: this._assetUrl(
          this.properties.heroImageUrl,
          DEFAULT_HERO_ASSET
        ),
        statsImageUrl: this._assetUrl(
          this.properties.statsImageUrl,
          DEFAULT_STATS_ASSET
        ),
        founder: founderName
          ? {
              name: founderName,
              role: this.properties.founderRole || "",
              quote: this.properties.founderQuote || "",
              photoUrl: this._assetUrl(
                this.properties.founderPhotoUrl,
                DEFAULT_FOUNDER_ASSET
              ),
            }
          : undefined,
        milestones: this._milestones,
        values: this._values,
        stats: this._stats,
        loading: this._loading,
        error: this._error,
        showValues: this.properties.showValues !== false,
        showStats: this.properties.showStats !== false,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  /**
   * Résout un visuel en URL absolue.
   *
   * Les chemins sont TOUJOURS rattachés à l'URL du site : un chemin
   * racine-relatif (« /SiteAssets/… ») viserait la collection de sites
   * racine du tenant et non l'intranet, ce qui produisait jusqu'ici un 404
   * silencieux sur la photo du fondateur.
   */
  private _assetUrl(configured: string | undefined, fallback: string): string {
    const site = this.context.pageContext.web.absoluteUrl.replace(/\/+$/, "");
    const value = (configured || "").trim();

    if (!value) return `${site}/${fallback}`;
    if (/^https?:\/\//i.test(value)) return value;
    return `${site}/${value.replace(/^\/+/, "")}`;
  }

  private _foundedYear(): number {
    const parsed = parseInt(this.properties.foundedYear || "", 10);
    return isNaN(parsed) ? DEFAULT_FOUNDED_YEAR : parsed;
  }

  private async _load(): Promise<void> {
    const results = await Promise.all([
      this._service.getMilestones().catch(() => undefined),
      this._service.getMissions().catch(() => undefined),
      this._service.getIndicators("Page histoire").catch(() => undefined),
    ]);

    this._milestones = results[0] || [];
    this._values = (results[1] || []).filter(
      (mission) => mission.MissionType === "Valeur"
    );
    this._stats = results[2] || [];

    this._error =
      results[0] === undefined
        ? "Impossible de charger l'historique. Vérifiez que la liste « Histoire » existe sur le hub."
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
              "Frise chronologique alimentée par les listes « Histoire », « Missions » et « Indicateurs ».",
          },
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
                PropertyPaneTextField("foundedYear", {
                  label: "Année de création",
                  description:
                    "Sert à calculer l'ancienneté affichée — ne jamais l'écrire dans le texte.",
                }),
              ],
            },
            {
              groupName: "Visuels",
              groupFields: [
                PropertyPaneTextField("heroImageUrl", {
                  label: "Image de bannière",
                  description: `Chemin relatif au site (ex. ${DEFAULT_HERO_ASSET}) ou URL complète. Vide : bannière typographique sans photo.`,
                }),
                PropertyPaneTextField("statsImageUrl", {
                  label: "Image de la section chiffres",
                  description: `Chemin relatif au site (ex. ${DEFAULT_STATS_ASSET}) ou URL complète.`,
                }),
              ],
            },
            {
              groupName: "Fondateur",
              groupFields: [
                PropertyPaneTextField("founderName", {
                  label: "Nom",
                  description: "Vide : la section fondateur n'est pas affichée.",
                }),
                PropertyPaneTextField("founderRole", { label: "Fonction" }),
                PropertyPaneTextField("founderQuote", {
                  label: "Citation",
                  multiline: true,
                }),
                PropertyPaneTextField("founderPhotoUrl", {
                  label: "Photo",
                  description: `Chemin relatif au site (ex. ${DEFAULT_FOUNDER_ASSET}). Vide ou introuvable : initiales.`,
                }),
              ],
            },
            {
              groupName: "Sections",
              groupFields: [
                PropertyPaneToggle("showStats", {
                  label: "Afficher les indicateurs",
                  onText: "Oui",
                  offText: "Non",
                }),
                PropertyPaneToggle("showValues", {
                  label: "Afficher les valeurs",
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

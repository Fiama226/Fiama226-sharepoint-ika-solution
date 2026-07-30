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
  showValues: boolean;
  showStats: boolean;
}

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

    const element: React.ReactElement<ITimelineProps> = React.createElement(
      Timeline,
      {
        eyebrow: this.properties.eyebrow || "Notre histoire",
        title: this.properties.title || "Les grandes étapes",
        description: this.properties.description || "",
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

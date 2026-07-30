import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
} from "@microsoft/sp-property-pane";

import { QuickAccessPanel } from "./components/QuickAccessPanel";
import { IQuickAccessPanelProps } from "./components/IQuickAccessPanelProps";
import { DataService } from "../../services/DataService";
import {
  IDocumentItem,
  IEventItem,
  IQuickLink,
} from "../../models/IIkaModels";

export interface IQuickAccessPanelWebPartProps {
  documentsTitle: string;
  quickLinksTitle: string;
  eventsTitle: string;
  maxDocs: number;
  maxLinks: number;
  maxEvents: number;
  eventsSeeAllUrl: string;
}

export default class QuickAccessPanelWebPart extends BaseClientSideWebPart<IQuickAccessPanelWebPartProps> {
  private _service!: DataService;
  private _docs: IDocumentItem[] = [];
  private _links: IQuickLink[] = [];
  private _events: IEventItem[] = [];
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

    const element: React.ReactElement<IQuickAccessPanelProps> =
      React.createElement(QuickAccessPanel, {
        documentsTitle: this.properties.documentsTitle || "Documents clés",
        quickLinksTitle: this.properties.quickLinksTitle || "Accès rapide",
        eventsTitle: this.properties.eventsTitle || "Événements",
        featuredDocs: this._docs.slice(0, this.properties.maxDocs || 6),
        quickLinks: this._links.slice(0, this.properties.maxLinks || 10),
        events: this._events.slice(0, this.properties.maxEvents || 4),
        loading: this._loading,
        error: this._error,
        eventsSeeAllUrl: this.properties.eventsSeeAllUrl,
      });

    ReactDom.render(element, this.domElement);
  }

  private async _load(): Promise<void> {
    const results = await Promise.all([
      this._service.getDocuments(20).catch(() => undefined),
      this._service.getQuickLinks().catch(() => undefined),
      this._service.getEvents(10).catch(() => undefined),
    ]);

    const docs = results[0];
    this._docs = docs
      ? docs.filter((doc) => doc.IsPinned).concat(docs.filter((d) => !d.IsPinned))
      : [];
    this._links = results[1] || [];
    this._events = results[2] || [];

    const allFailed =
      results[0] === undefined &&
      results[1] === undefined &&
      results[2] === undefined;

    this._error = allFailed
      ? "Impossible de charger le contenu. Vérifiez que les listes du site existent."
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
              "Trois colonnes : documents épinglés, liens rapides et prochains événements.",
          },
          groups: [
            {
              groupName: "Titres",
              groupFields: [
                PropertyPaneTextField("documentsTitle", {
                  label: "Titre — documents",
                }),
                PropertyPaneTextField("quickLinksTitle", {
                  label: "Titre — accès rapide",
                }),
                PropertyPaneTextField("eventsTitle", {
                  label: "Titre — événements",
                }),
              ],
            },
            {
              groupName: "Volumes",
              groupFields: [
                PropertyPaneSlider("maxDocs", {
                  label: "Documents affichés",
                  min: 2,
                  max: 10,
                  step: 2,
                }),
                PropertyPaneSlider("maxLinks", {
                  label: "Liens affichés",
                  min: 2,
                  max: 12,
                  step: 2,
                }),
                PropertyPaneSlider("maxEvents", {
                  label: "Événements affichés",
                  min: 1,
                  max: 8,
                  step: 1,
                }),
                PropertyPaneTextField("eventsSeeAllUrl", {
                  label: "Lien « Voir tout » des événements",
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}

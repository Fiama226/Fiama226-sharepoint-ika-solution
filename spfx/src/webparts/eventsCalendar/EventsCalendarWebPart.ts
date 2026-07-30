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

import { EventsCalendar } from "./components/EventsCalendar";
import { IEventsCalendarProps } from "./components/IEventsCalendarProps";
import { DataService } from "../../services/DataService";
import { IEventItem } from "../../models/IIkaModels";

export interface IEventsCalendarWebPartProps {
  title: string;
  maxItems: number;
  showLocation: boolean;
}

export default class EventsCalendarWebPart extends BaseClientSideWebPart<IEventsCalendarWebPartProps> {
  private _service!: DataService;
  private _events: IEventItem[] = [];
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

    const element: React.ReactElement<IEventsCalendarProps> =
      React.createElement(EventsCalendar, {
        title: this.properties.title || "Prochains événements",
        events: this._events,
        loading: this._loading,
        error: this._error,
        showLocation: this.properties.showLocation !== false,
      });

    ReactDom.render(element, this.domElement);
  }

  private async _load(): Promise<void> {
    try {
      this._events = await this._service.getEvents(
        this.properties.maxItems || 5
      );
      this._error = undefined;
    } catch {
      this._events = [];
      this._error =
        "Impossible de charger les événements. Vérifiez que la liste « Evenements » existe sur ce site.";
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
          header: { description: "Paramètres du calendrier d'événements" },
          groups: [
            {
              groupName: "Affichage",
              groupFields: [
                PropertyPaneTextField("title", {
                  label: "Titre de la section",
                }),
                PropertyPaneSlider("maxItems", {
                  label: "Nombre d'événements",
                  min: 1,
                  max: 15,
                  step: 1,
                }),
                PropertyPaneToggle("showLocation", {
                  label: "Afficher le lieu",
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

import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";

import { FinanceCharts } from "./components/FinanceCharts";
import { IFinanceChartsProps } from "./components/IFinanceChartsProps";
import { DataService } from "../../services/DataService";
import { IFinanceData } from "../../models/IIkaModels";

export interface IFinanceChartsWebPartProps {
  title: string;
  description: string;
}

export default class FinanceChartsWebPart extends BaseClientSideWebPart<IFinanceChartsWebPartProps> {
  private _service!: DataService;
  private _all: IFinanceData[] = [];
  private _year: number = 0;
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

    const years: number[] = [];
    this._all.forEach((row) => {
      if (years.indexOf(row.FiscalYear) === -1) years.push(row.FiscalYear);
    });
    years.sort((a, b) => b - a);

    const activeYear = this._year || years[0] || new Date().getFullYear();

    const element: React.ReactElement<IFinanceChartsProps> =
      React.createElement(FinanceCharts, {
        title: this.properties.title || "Tableau de bord financier",
        description: this.properties.description || "",
        data: this._all.filter((row) => row.FiscalYear === activeYear),
        fiscalYear: activeYear,
        availableYears: years,
        loading: this._loading,
        error: this._error,
        onYearChange: (year: number) => {
          this._year = year;
          this.render();
        },
      });

    ReactDom.render(element, this.domElement);
  }

  private async _load(): Promise<void> {
    try {
      this._all = await this._service.getFinanceData();
      this._error = undefined;
    } catch {
      this._all = [];
      this._error =
        "Impossible de charger les données financières. Vérifiez que la liste « DonneesFinancieres » existe sur ce site.";
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
              "Graphiques financiers alimentés par la liste « DonneesFinancieres » du site.",
          },
          groups: [
            {
              groupName: "Contenu",
              groupFields: [
                PropertyPaneTextField("title", { label: "Titre" }),
                PropertyPaneTextField("description", {
                  label: "Description",
                  multiline: true,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}

import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneDropdown,
  PropertyPaneToggle,
} from "@microsoft/sp-property-pane";

import { PriceSheet } from "./components/PriceSheet";
import {
  IPriceSheetLineDraft,
  IPriceSheetProps,
} from "./components/IPriceSheetProps";

export interface IPriceSheetWebPartProps {
  title: string;
  clientName: string;
  subject: string;
  vatRate: number;
  currency: string;
  canEdit: boolean;
}

const DEFAULT_LINE: IPriceSheetLineDraft = {
  key: "seed-1",
  articleNo: "1",
  description: "",
  deliveryDate: "",
  quantity: 1,
  unitPrice: 0,
};

export default class PriceSheetWebPart extends BaseClientSideWebPart<IPriceSheetWebPartProps> {
  public render(): void {
    const element: React.ReactElement<IPriceSheetProps> = React.createElement(
      PriceSheet,
      {
        title: this.properties.title || "Bordereau des prix",
        clientName: this.properties.clientName || "",
        subject: this.properties.subject || "",
        vatRate:
          typeof this.properties.vatRate === "number"
            ? this.properties.vatRate
            : 18,
        currency: this.properties.currency || "XOF",
        initialLines: [DEFAULT_LINE],
        loading: false,
        error: undefined,
        canEdit: this.properties.canEdit !== false,
      }
    );

    ReactDom.render(element, this.domElement);
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
              "Outil de calcul de bordereau de prix. Les lignes sont saisies dans la page et exportables en CSV.",
          },
          groups: [
            {
              groupName: "En-tête",
              groupFields: [
                PropertyPaneTextField("title", { label: "Titre" }),
                PropertyPaneTextField("clientName", { label: "Client" }),
                PropertyPaneTextField("subject", {
                  label: "Objet",
                  multiline: true,
                }),
              ],
            },
            {
              groupName: "Calcul",
              groupFields: [
                PropertyPaneSlider("vatRate", {
                  label: "Taux de TVA (%)",
                  min: 0,
                  max: 30,
                  step: 1,
                }),
                PropertyPaneDropdown("currency", {
                  label: "Devise",
                  options: [
                    { key: "XOF", text: "Franc CFA (XOF)" },
                    { key: "EUR", text: "Euro (EUR)" },
                    { key: "USD", text: "Dollar (USD)" },
                  ],
                }),
                PropertyPaneToggle("canEdit", {
                  label: "Saisie autorisée",
                  onText: "Oui",
                  offText: "Lecture seule",
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}

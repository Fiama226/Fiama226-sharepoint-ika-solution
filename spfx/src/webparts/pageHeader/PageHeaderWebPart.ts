import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle,
} from "@microsoft/sp-property-pane";

import { PageHeader } from "./components/PageHeader";
import {
  IBreadcrumbItem,
  IPageHeaderProps,
} from "./components/IPageHeaderProps";

export interface IPageHeaderWebPartProps {
  title: string;
  description: string;
  autoBreadcrumb: boolean;
  breadcrumbJson: string;
}

export default class PageHeaderWebPart extends BaseClientSideWebPart<IPageHeaderWebPartProps> {
  public render(): void {
    const element: React.ReactElement<IPageHeaderProps> = React.createElement(
      PageHeader,
      {
        title: this.properties.title || this.context.pageContext.web.title,
        description: this.properties.description,
        breadcrumb: this._buildBreadcrumb(),
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private _buildBreadcrumb(): IBreadcrumbItem[] {
    if (!this.properties.autoBreadcrumb) {
      return this._parseManualBreadcrumb();
    }

    const origin = window.location.origin;
    const web = this.context.pageContext.web;
    const items: IBreadcrumbItem[] = [
      { label: "Accueil", url: `${origin}/sites/ika-intranet` },
    ];

    if (web.serverRelativeUrl.indexOf("/sites/ika-intranet") !== 0) {
      items.push({ label: web.title, url: web.absoluteUrl });
    }

    const pageTitle = this.properties.title;
    if (pageTitle) items.push({ label: pageTitle });

    return items;
  }

  private _parseManualBreadcrumb(): IBreadcrumbItem[] {
    const raw = this.properties.breadcrumbJson;
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw) as IBreadcrumbItem[];
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((item) => !!item && !!item.label);
    } catch {
      return [];
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
          header: { description: "En-tête de page avec fil d'Ariane" },
          groups: [
            {
              groupName: "Contenu",
              groupFields: [
                PropertyPaneTextField("title", {
                  label: "Titre de la page",
                }),
                PropertyPaneTextField("description", {
                  label: "Description",
                  multiline: true,
                }),
              ],
            },
            {
              groupName: "Fil d'Ariane",
              groupFields: [
                PropertyPaneToggle("autoBreadcrumb", {
                  label: "Fil d'Ariane automatique",
                  onText: "Automatique",
                  offText: "Manuel",
                }),
                PropertyPaneTextField("breadcrumbJson", {
                  label: "Fil d'Ariane manuel (JSON)",
                  description:
                    'Exemple : [{"label":"Accueil","url":"/"},{"label":"Documents"}]',
                  multiline: true,
                  disabled: this.properties.autoBreadcrumb,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}

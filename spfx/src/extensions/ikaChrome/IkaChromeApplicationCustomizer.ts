import { override } from "@microsoft/decorators";
import { Log } from "@microsoft/sp-core-library";
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName,
} from "@microsoft/sp-application-base";
import * as React from "react";
import * as ReactDom from "react-dom";

import { IkaHeader } from "./components/IkaHeader";
import { IkaFooter } from "./components/IkaFooter";
import {
  IChromeContext,
  IIkaChromeProperties,
  INavNode,
} from "../../models/IChromeModels";
import { ICompanyInfo } from "../../models/IIkaModels";
import {
  NavigationService,
  STATIC_PRIMARY_NAV,
  STATIC_SECONDARY_NAV,
} from "../../services/NavigationService";
import { DataService } from "../../services/DataService";
import { buildUserPhotoUrl } from "../../common/utils/spUtils";

const LOG_SOURCE = "IkaChrome";

const DEFAULT_FOOTER_TEXT =
  "L'intranet IKA Solution est votre passerelle vers un univers de " +
  "connaissances, de collaboration et d'innovation. Explorez nos ressources, " +
  "échangez avec vos collègues et restez informé des dernières actualités.";

export default class IkaChromeApplicationCustomizer extends BaseApplicationCustomizer<IIkaChromeProperties> {
  private _topPlaceholder?: PlaceholderContent;
  private _bottomPlaceholder?: PlaceholderContent;

  private _primaryNav: INavNode[] = STATIC_PRIMARY_NAV;
  private _company: ICompanyInfo | undefined = undefined;
  private _hydrated: boolean = false;

  @override
  public onInit(): Promise<void> {
    this._hideDefaultHeader();

    this.context.placeholderProvider.changedEvent.add(this, this._renderChrome);
    this._renderChrome();

    void this._hydrate();

    return Promise.resolve();
  }

  private _hideDefaultHeader(): void {
    const app = this.context.application as unknown as {
      hideDefaultHeader?: () => void;
    };
    if (app && typeof app.hideDefaultHeader === "function") {
      try {
        app.hideDefaultHeader();
      } catch (error) {
        Log.warn(LOG_SOURCE, "hideDefaultHeader indisponible");
      }
    }
  }

  private get _hubUrl(): string {
    const origin = window.location.origin;
    return `${origin}/sites/ika-intranet`;
  }

  private _buildContext(): IChromeContext {
    const page = this.context.pageContext;
    const email = page.user.email || page.user.loginName;

    return {
      currentUser: {
        displayName: page.user.displayName,
        email,
        loginName: page.user.loginName,
        photoUrl: buildUserPhotoUrl(email, "M"),
        isSiteAdmin: page.legacyPageContext
          ? !!(page.legacyPageContext as { isSiteAdmin?: boolean }).isSiteAdmin
          : false,
      },
      currentPath: page.web.serverRelativeUrl,
      hubUrl: this._hubUrl,
      siteUrl: page.web.absoluteUrl,
      logoUrl: `${this._hubUrl}/SiteAssets/logo.png`,
    };
  }

  private _documentsNav(): INavNode[] {
    return this._primaryNav
      .filter((node) => node.url.indexOf("ika-intranet") === -1)
      .map((node) => ({
        key: `${node.key}-docs`,
        label: node.label,
        url: `${node.url}/Documents%20partages`,
        iconName: node.iconName,
      }));
  }

  private async _hydrate(): Promise<void> {
    if (this._hydrated) return;
    this._hydrated = true;

    const tasks: Promise<void>[] = [];

    if (this.properties.navigationSource !== "static") {
      const navService = new NavigationService(this.context);
      tasks.push(
        navService
          .getHubNavigation()
          .then((nodes) => {
            if (nodes && nodes.length > 0) this._primaryNav = nodes;
          })
          .catch(() => undefined)
      );
    }

    if (this.properties.showFooter !== false) {
      const dataService = new DataService(this.context, this._hubUrl);
      tasks.push(
        dataService
          .getCompanyInfo()
          .then((info) => {
            this._company = info;
          })
          .catch(() => undefined)
      );
    }

    await Promise.all(tasks);
    this._renderChrome();
  }

  private _renderChrome(): void {
    this._renderHeader();
    this._renderFooter();
  }

  private _renderHeader(): void {
    if (!this._topPlaceholder) {
      this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top,
        { onDispose: this._onDispose }
      );
    }

    if (!this._topPlaceholder || !this._topPlaceholder.domElement) return;

    ReactDom.render(
      React.createElement(IkaHeader, {
        context: this._buildContext(),
        primaryNav: this._primaryNav,
        secondaryNav: STATIC_SECONDARY_NAV,
        showSearch: this.properties.showSearch !== false,
        showDocumentsMenu: this.properties.showDocumentsMenu !== false,
        documentsNav: this._documentsNav(),
      }),
      this._topPlaceholder.domElement
    );
  }

  private _renderFooter(): void {
    if (this.properties.showFooter === false) return;

    if (!this._bottomPlaceholder) {
      this._bottomPlaceholder =
        this.context.placeholderProvider.tryCreateContent(
          PlaceholderName.Bottom,
          { onDispose: this._onDispose }
        );
    }

    if (!this._bottomPlaceholder || !this._bottomPlaceholder.domElement) return;

    ReactDom.render(
      React.createElement(IkaFooter, {
        company: this._company,
        description:
          this.properties.footerDescription || DEFAULT_FOOTER_TEXT,
        logoUrl: `${this._hubUrl}/SiteAssets/logo.png`,
      }),
      this._bottomPlaceholder.domElement
    );
  }

  private _onDispose = (): void => {
    if (this._topPlaceholder && this._topPlaceholder.domElement) {
      ReactDom.unmountComponentAtNode(this._topPlaceholder.domElement);
    }
    if (this._bottomPlaceholder && this._bottomPlaceholder.domElement) {
      ReactDom.unmountComponentAtNode(this._bottomPlaceholder.domElement);
    }
  };

  protected onDispose(): void {
    this.context.placeholderProvider.changedEvent.remove(
      this,
      this._renderChrome
    );
    this._onDispose();
  }
}

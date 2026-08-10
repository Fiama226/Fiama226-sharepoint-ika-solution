import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

import { INavNode } from "../models/IChromeModels";

const CACHE_KEY = "ika.nav.hub";
const CACHE_TTL_MS = 30 * 60 * 1000;

interface IMenuNode {
  Key: string;
  Title: string;
  SimpleUrl: string;
  Nodes?: { _Child_Items_?: IMenuNode[] };
  _Child_Items_?: IMenuNode[];
}

interface IMenuState {
  Nodes?: IMenuNode[];
  _Child_Items_?: IMenuNode[];
}

interface ICacheEntry {
  expires: number;
  nodes: INavNode[];
}

const ICON_BY_SLUG: Record<string, string> = {
  "accueil": "Home",
  "home": "Home",
  "actualites": "newspaper",
  "news": "newspaper",
  "annonces": "megaphone",
  "documents": "FolderOpen",
  "comptabilite": "Calculator",
  "administration": "ShieldCheck",
  "commerciaux": "Users",
  "techniciens": "Settings",
  "organigramme": "GitBranch",
  "histoire": "book",
  "bordereau": "xlsx",
  "equipe": "Users",
  "evenements": "calendar",
  "agenda": "calendar",
  "faq": "help",
};

export const STATIC_PRIMARY_NAV: INavNode[] = [
  { key: "home", label: "Accueil", url: "#accueil", iconName: "Home" },
  { key: "annonces", label: "Annonces", url: "#annonces", iconName: "megaphone" },
  { key: "documents", label: "Documents", url: "#documents", iconName: "FolderOpen" },
  { key: "organigramme", label: "Organigramme", url: "#organigramme", iconName: "GitBranch" },
  { key: "bordereau", label: "Bordereau des prix", url: "#bordereau", iconName: "xlsx" },
];

export const STATIC_SECONDARY_NAV: INavNode[] = [
  { key: "histoire", label: "Notre Histoire", url: "#histoire", iconName: "book" },
  { key: "equipe", label: "Équipe", url: "#equipe", iconName: "Users" },
  { key: "evenements", label: "Agenda & Événements", url: "#evenements", iconName: "calendar" },
  { key: "faq", label: "FAQ", url: "#faq", iconName: "help" },
];

export class NavigationService {
  private readonly _context: ApplicationCustomizerContext;
  private readonly _siteUrl: string;

  public constructor(context: ApplicationCustomizerContext) {
    this._context = context;
    this._siteUrl = context.pageContext.web.absoluteUrl;
  }

  private _readCache(): INavNode[] | undefined {
    try {
      const raw = window.sessionStorage.getItem(CACHE_KEY);
      if (!raw) return undefined;
      const entry = JSON.parse(raw) as ICacheEntry;
      if (Date.now() > entry.expires) {
        window.sessionStorage.removeItem(CACHE_KEY);
        return undefined;
      }
      return entry.nodes;
    } catch {
      return undefined;
    }
  }

  private _writeCache(nodes: INavNode[]): void {
    try {
      const entry: ICacheEntry = {
        expires: Date.now() + CACHE_TTL_MS,
        nodes,
      };
      window.sessionStorage.setItem(CACHE_KEY, JSON.stringify(entry));
    } catch {
      return;
    }
  }

  private static _iconFor(url: string): string {
    const lower = (url || "").toLowerCase();
    const keys = Object.keys(ICON_BY_SLUG);
    for (let i = 0; i < keys.length; i++) {
      if (lower.indexOf(keys[i]) !== -1) return ICON_BY_SLUG[keys[i]];
    }
    return "tag";
  }

  private static _mapNodes(nodes: IMenuNode[] | undefined): INavNode[] {
    if (!nodes || nodes.length === 0) return [];

    return nodes.map((node) => {
      const childItems =
        (node.Nodes && node.Nodes._Child_Items_) || node._Child_Items_;
      const children = NavigationService._mapNodes(childItems);

      return {
        key: node.Key,
        label: node.Title,
        url: node.SimpleUrl,
        iconName: NavigationService._iconFor(node.SimpleUrl),
        children: children.length > 0 ? children : undefined,
      };
    });
  }

  public async getHubNavigation(): Promise<INavNode[]> {
    const cached = this._readCache();
    if (cached) return cached;

    const url =
      `${this._siteUrl}/_api/navigation/MenuState` +
      `?menuNodeKey=null&mapProviderName='SPHubNavigationProvider'`;

    try {
      const response: SPHttpClientResponse =
        await this._context.spHttpClient.get(
          url,
          SPHttpClient.configurations.v1,
          { headers: { Accept: "application/json;odata=nometadata" } }
        );

      if (!response.ok) return STATIC_PRIMARY_NAV;

      const json = (await response.json()) as IMenuState;
      const raw = json.Nodes || json._Child_Items_;
      const nodes = NavigationService._mapNodes(raw);

      if (nodes.length === 0) return STATIC_PRIMARY_NAV;

      this._writeCache(nodes);
      return nodes;
    } catch {
      return STATIC_PRIMARY_NAV;
    }
  }

  public static clearCache(): void {
    try {
      window.sessionStorage.removeItem(CACHE_KEY);
    } catch {
      return;
    }
  }
}

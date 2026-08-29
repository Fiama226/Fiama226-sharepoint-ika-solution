import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

import {
  ISearchResponse,
  ISearchResult,
  SearchResultKind,
  SearchVertical,
} from "../models/IIkaModels";
import { sanitizeHtml } from "../common/utils/spUtils";
import { ISPRequestContext } from "./DataService";
import { MOCK_SEARCH_RESULTS } from "./MockData";

const CACHE_PREFIX = "ika.search.";
const CACHE_TTL_MS = 2 * 60 * 1000;

/** Result source « Local People Results » — identique sur tous les tenants. */
const PEOPLE_SOURCE_ID = "b09a7990-05ea-4af9-81ef-edfab16c4e31";

/** Graph plafonne `size` à 25 pour `message` (et `from` doit valoir 0 au 1er appel). */
const GRAPH_PAGE_SIZE = 25;
const SP_PAGE_SIZE = 20;
const SUGGEST_SIZE = 5;

const SP_SELECT = [
  "Title",
  "Path",
  "FileType",
  "FileExtension",
  "HitHighlightedSummary",
  "LastModifiedTime",
  "Author",
  "SiteTitle",
  "contentclass",
  "IsDocument",
  "IsContainer",
  "Size",
];

const PEOPLE_SELECT = [
  "PreferredName",
  "WorkEmail",
  "JobTitle",
  "Department",
  "Path",
  "PictureURL",
];

interface ICacheEntry {
  expires: number;
  payload: ISearchResponse;
}

interface ISearchCell {
  Key: string;
  Value: string | undefined;
}

/**
 * SharePoint renvoie les collections sous deux formes selon l'en-tête `Accept`
 * négocié : tableau nu (`odata=nometadata`) ou `{ results: [...] }` (verbose).
 * On accepte les deux plutôt que de parier sur la négociation.
 */
type SPCollection<T> = T[] | { results?: T[] } | undefined;

interface ISearchRow {
  Cells: SPCollection<ISearchCell>;
}

interface IRelevantResults {
  TotalRows?: number;
  RowCount?: number;
  Table?: { Rows: SPCollection<ISearchRow> };
}

interface ISearchPayload {
  PrimaryQueryResult?: { RelevantResults?: IRelevantResults };
  d?: { postquery?: { PrimaryQueryResult?: { RelevantResults?: IRelevantResults } } };
}

interface IGraphHit {
  hitId?: string;
  summary?: string;
  resource?: Record<string, unknown>;
}

interface IGraphResponse {
  value?: Array<{
    hitsContainers?: Array<{
      hits?: IGraphHit[];
      total?: number;
      moreResultsAvailable?: boolean;
    }>;
  }>;
}

function unwrap<T>(collection: SPCollection<T>): T[] {
  if (!collection) return [];
  if (Array.isArray(collection)) return collection;
  return collection.results || [];
}

/**
 * Convertit le surlignage propriétaire (`<c0>…</c0>`, `<ddd/>`) — produit aussi
 * bien par la recherche SharePoint que par Graph — en HTML standard, PUIS
 * assainit. L'ordre importe : assainir d'abord supprimerait les `<c0>` avant
 * qu'on ait pu les traduire, et on perdrait le surlignage.
 */
function highlight(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const withMarks = raw
    .replace(/<c\d+>/g, "<mark>")
    .replace(/<\/c\d+>/g, "</mark>")
    .replace(/<ddd\s*\/?>/g, "…");
  return sanitizeHtml(withMarks);
}

function isPermissionError(error: unknown): boolean {
  const err = error as { statusCode?: number; code?: string; message?: string };
  if (err?.statusCode === 403 || err?.statusCode === 401) return true;
  const haystack = `${err?.code || ""} ${err?.message || ""}`.toLowerCase();
  return (
    haystack.indexOf("accessdenied") !== -1 ||
    haystack.indexOf("access denied") !== -1 ||
    haystack.indexOf("authorization_requestdenied") !== -1 ||
    haystack.indexOf("insufficient privileges") !== -1 ||
    haystack.indexOf("aadsts65001") !== -1
  );
}

export class SearchService {
  private readonly _context: ISPRequestContext;
  private readonly _siteUrl: string;
  private readonly _isLocal: boolean;
  private readonly _useMocks: boolean;

  public constructor(context: ISPRequestContext, hubUrl?: string) {
    this._context = context;
    this._siteUrl = hubUrl || context.pageContext.web.absoluteUrl;

    // Même règle que DataService : le Workbench (localhost) et `?useMocks=1`
    // servent des données factices, sinon la recherche serait morte en
    // développement — le Workbench est une cible de test à part entière.
    this._isLocal =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1");

    let forceMocks = false;
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search || "");
      forceMocks =
        params.get("useMocks") === "1" ||
        params.get("useMocks")?.toLowerCase() === "true";
    }

    this._useMocks = forceMocks || this._isLocal;
  }

  /* ---------------------------------------------------------------------- */
  /* Cache                                                                   */
  /* ---------------------------------------------------------------------- */

  private _readCache(key: string): ISearchResponse | undefined {
    if (this._isLocal) return undefined;
    try {
      const raw = window.sessionStorage.getItem(CACHE_PREFIX + key);
      if (!raw) return undefined;
      const entry = JSON.parse(raw) as ICacheEntry;
      if (Date.now() > entry.expires) {
        window.sessionStorage.removeItem(CACHE_PREFIX + key);
        return undefined;
      }
      return entry.payload;
    } catch {
      return undefined;
    }
  }

  private _writeCache(key: string, payload: ISearchResponse): void {
    if (this._isLocal) return;
    try {
      const entry: ICacheEntry = {
        expires: Date.now() + CACHE_TTL_MS,
        payload,
      };
      window.sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
    } catch {
      return;
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Mocks                                                                   */
  /* ---------------------------------------------------------------------- */

  private static _mockFor(
    query: string,
    vertical: SearchVertical,
    size: number
  ): ISearchResponse {
    const needle = query.trim().toLowerCase();
    const kinds = SearchService._kindsFor(vertical);

    const matched = MOCK_SEARCH_RESULTS.filter((item) => {
      if (kinds.length > 0 && kinds.indexOf(item.kind) === -1) return false;
      if (!needle) return true;
      const hay = `${item.title} ${item.summary || ""} ${item.author || ""}`;
      return hay.toLowerCase().indexOf(needle) !== -1;
    });

    return {
      results: matched.slice(0, size),
      total: matched.length,
      moreAvailable: matched.length > size,
      vertical,
    };
  }

  /**
   * Types attendus par verticale — utilisé UNIQUEMENT par le filtre des mocks.
   *
   * `tout` n'est pas un fourre-tout : en production c'est une requête
   * SharePoint pure, qui ne peut structurellement pas renvoyer d'e-mails ni de
   * messages Teams (Graph interdit de les combiner avec les types SharePoint),
   * et les personnes viennent d'une autre source de résultats. Le mock doit
   * refléter cette contrainte, sinon le Workbench afficherait un onglet
   * « Tout » que la production ne saurait jamais reproduire.
   */
  private static _kindsFor(vertical: SearchVertical): SearchResultKind[] {
    switch (vertical) {
      case "fichiers":
        return ["file", "folder"];
      case "personnes":
        return ["person"];
      case "emails":
        return ["email"];
      case "messages":
        return ["chat"];
      default:
        return ["file", "folder", "page", "news", "listItem", "site"];
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Recherche SharePoint (fichiers, dossiers, pages, actualités, personnes)  */
  /* ---------------------------------------------------------------------- */

  private static _kindFromRow(cells: Record<string, string>): SearchResultKind {
    const contentClass = (cells.contentclass || "").toLowerCase();
    const ext = (cells.FileExtension || cells.FileType || "").toLowerCase();

    if (contentClass.indexOf("sts_site") !== -1) return "site";
    if (contentClass.indexOf("sts_web") !== -1) return "site";
    if (cells.IsContainer === "true") return "folder";
    if (ext === "aspx") return "page";
    if (cells.IsDocument === "true") return "file";
    if (contentClass.indexOf("sts_listitem") !== -1) return "listItem";
    return "listItem";
  }

  private static _mapSPRow(row: ISearchRow): ISearchResult | undefined {
    const cells: Record<string, string> = {};
    unwrap(row.Cells).forEach((cell) => {
      if (cell && cell.Key) cells[cell.Key] = cell.Value || "";
    });

    const path = cells.Path;
    if (!path) return undefined;

    const size = parseInt(cells.Size, 10);

    return {
      id: path,
      kind: SearchService._kindFromRow(cells),
      title: cells.Title || cells.FileExtension || path,
      url: path,
      summary: highlight(cells.HitHighlightedSummary),
      author: cells.Author || undefined,
      modified: cells.LastModifiedTime || undefined,
      siteTitle: cells.SiteTitle || undefined,
      fileExtension: (cells.FileExtension || cells.FileType || "").toLowerCase() || undefined,
      sizeBytes: isNaN(size) ? undefined : size,
    };
  }

  private static _mapPeopleRow(row: ISearchRow): ISearchResult | undefined {
    const cells: Record<string, string> = {};
    unwrap(row.Cells).forEach((cell) => {
      if (cell && cell.Key) cells[cell.Key] = cell.Value || "";
    });

    const email = cells.WorkEmail;
    const name = cells.PreferredName;
    if (!name) return undefined;

    return {
      id: email || cells.Path || name,
      kind: "person",
      title: name,
      // Ouvre la carte de profil Delve/Viva plutôt que le chemin d'index brut.
      url: email
        ? `https://eur.delve.office.com/?u=${encodeURIComponent(email)}`
        : cells.Path || "#",
      summary: undefined,
      author: [cells.JobTitle, cells.Department].filter(Boolean).join(" · ") || undefined,
      siteTitle: email || undefined,
    };
  }

  private async _searchSharePoint(
    query: string,
    vertical: SearchVertical,
    page: number,
    size: number
  ): Promise<ISearchResponse> {
    const isPeople = vertical === "personnes";

    // La contrainte « fichiers » passe par le KQL plutôt que par un
    // RefinementFilter : `IsDocument:1` fonctionne sans dépendre du schéma de
    // recherche du tenant (un refiner exige une propriété affinable).
    const kql = vertical === "fichiers" ? `${query} IsDocument:1` : query;

    const request: Record<string, unknown> = {
      __metadata: { type: "Microsoft.Office.Server.Search.REST.SearchRequest" },
      Querytext: isPeople ? query : kql,
      RowLimit: size,
      StartRow: page * size,
      TrimDuplicates: !isPeople,
      ClientType: "ika-intranet",
      SelectProperties: { results: isPeople ? PEOPLE_SELECT : SP_SELECT },
    };

    if (isPeople) {
      request.SourceId = PEOPLE_SOURCE_ID;
    } else {
      request.HitHighlightedProperties = { results: ["Title", "Body"] };
    }

    const response: SPHttpClientResponse = await this._context.spHttpClient.post(
      `${this._siteUrl}/_api/search/postquery`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          Accept: "application/json;odata=nometadata",
          "Content-Type": "application/json;odata=verbose",
        },
        body: JSON.stringify({ request }),
      }
    );

    if (!response.ok) {
      throw new Error(`Recherche SharePoint échouée (${response.status})`);
    }

    const json = (await response.json()) as ISearchPayload;
    const relevant =
      json.PrimaryQueryResult?.RelevantResults ||
      json.d?.postquery?.PrimaryQueryResult?.RelevantResults;

    const rows = unwrap(relevant?.Table?.Rows);
    const mapper = isPeople
      ? SearchService._mapPeopleRow
      : SearchService._mapSPRow;

    const results: ISearchResult[] = [];
    rows.forEach((row) => {
      const mapped = mapper(row);
      if (mapped) results.push(mapped);
    });

    const total = relevant?.TotalRows || results.length;

    return {
      results,
      total,
      moreAvailable: page * size + results.length < total,
      vertical,
    };
  }

  /* ---------------------------------------------------------------------- */
  /* Recherche Graph (e-mails, messages Teams)                               */
  /* ---------------------------------------------------------------------- */

  private static _mapGraphHit(
    hit: IGraphHit,
    kind: "email" | "chat",
    index: number
  ): ISearchResult {
    const resource = hit.resource || {};

    const from = resource.from as
      | {
          emailAddress?: { name?: string; address?: string };
          user?: { displayName?: string };
        }
      | undefined;

    const author =
      from?.emailAddress?.name ||
      from?.emailAddress?.address ||
      from?.user?.displayName;

    const title =
      (resource.subject as string) ||
      (kind === "chat" ? "Message Teams" : "(sans objet)");

    return {
      id: hit.hitId || `${kind}-${index}`,
      kind,
      title,
      url:
        (resource.webLink as string) ||
        (resource.webUrl as string) ||
        "#",
      // On rend le `summary` fourni par Graph (déjà tronqué et surligné) et
      // JAMAIS `body.content` : ce dernier est du HTML d'e-mail arbitraire.
      summary: highlight(hit.summary),
      author: author || undefined,
      modified:
        (resource.receivedDateTime as string) ||
        (resource.createdDateTime as string) ||
        (resource.lastModifiedDateTime as string) ||
        undefined,
    };
  }

  private async _searchGraph(
    query: string,
    vertical: "emails" | "messages",
    page: number
  ): Promise<ISearchResponse> {
    const factory = this._context.msGraphClientFactory;
    const kind: "email" | "chat" = vertical === "emails" ? "email" : "chat";
    const entityType = vertical === "emails" ? "message" : "chatMessage";
    const scope = vertical === "emails" ? "Mail.Read" : "Chat.Read";

    const unavailable = (reason: string): ISearchResponse => ({
      results: [],
      total: 0,
      moreAvailable: false,
      vertical,
      degraded: reason,
    });

    if (!factory) {
      return unavailable(
        "Client Microsoft Graph indisponible dans ce contexte d'hébergement."
      );
    }

    try {
      const client = await factory.getClient("3");

      const payload = (await client.api("/search/query").post({
        requests: [
          {
            entityTypes: [entityType],
            query: { queryString: query },
            // `from` DOIT valoir 0 au premier appel pour message/chatMessage,
            // et `size` est plafonné à 25 : dépasser renvoie un HTTP 400.
            from: page * GRAPH_PAGE_SIZE,
            size: GRAPH_PAGE_SIZE,
          },
        ],
      })) as IGraphResponse;

      const container = payload.value?.[0]?.hitsContainers?.[0];
      const hits = container?.hits || [];

      return {
        results: hits.map((hit, i) =>
          SearchService._mapGraphHit(hit, kind, i)
        ),
        total: container?.total || hits.length,
        moreAvailable: container?.moreResultsAvailable === true,
        vertical,
      };
    } catch (error) {
      // Microsoft est explicite : une solution ne doit JAMAIS supposer que la
      // permission demandée a été accordée — le paquet se déploie et
      // s'installe que l'administrateur approuve ou refuse. On dégrade donc
      // la verticale (onglet masqué) au lieu de casser toute la recherche.
      if (isPermissionError(error)) {
        return unavailable(
          `Permission « ${scope} » non accordée par l'administrateur du tenant.`
        );
      }
      return unavailable(
        `Recherche indisponible pour cette source (${
          (error as Error)?.message || "erreur inconnue"
        }).`
      );
    }
  }

  /* ---------------------------------------------------------------------- */
  /* API publique                                                            */
  /* ---------------------------------------------------------------------- */

  /**
   * Suggestions du menu déroulant de l'en-tête : des FICHIERS, à l'échelle de
   * tout SharePoint.
   *
   * Deux choix de portée à ne pas défaire :
   *
   * 1. Verticale « fichiers » plutôt que « tout » — le KQL ajoute
   *    `IsDocument:1`, ce qui écarte les éléments de liste et les sites. Le
   *    menu déroulant est un sélecteur de documents ; la page de recherche
   *    native prend le relais pour le reste.
   * 2. Aucun filtre `Path:` n'est ajouté — `postquery` interroge la source
   *    « Local SharePoint Results », donc l'index du tenant entier (élagué
   *    selon les droits de l'utilisateur), et pas la seule collection de
   *    sites qui héberge l'appel.
   *
   * Volontairement limitée à SharePoint : appeler Graph à chaque frappe
   * ajouterait deux allers-retours réseau par caractère pour des sources que
   * l'utilisateur n'a pas encore demandées.
   */
  public async suggest(query: string): Promise<ISearchResponse> {
    const term = query.trim();
    if (term.length < 2) {
      return {
        results: [],
        total: 0,
        moreAvailable: false,
        vertical: "fichiers",
      };
    }

    if (this._useMocks) {
      return SearchService._mockFor(term, "fichiers", SUGGEST_SIZE);
    }

    const cacheKey = `suggest.${term.toLowerCase()}`;
    const cached = this._readCache(cacheKey);
    if (cached) return cached;

    try {
      const payload = await this._searchSharePoint(
        term,
        "fichiers",
        0,
        SUGGEST_SIZE
      );
      this._writeCache(cacheKey, payload);
      return payload;
    } catch {
      // Une suggestion qui échoue ne doit pas produire d'erreur visible :
      // l'utilisateur est en train de taper, il peut toujours valider.
      return {
        results: [],
        total: 0,
        moreAvailable: false,
        vertical: "fichiers",
      };
    }
  }

  /** Recherche complète d'une verticale, pour la page de résultats. */
  public async search(
    query: string,
    vertical: SearchVertical = "tout",
    page: number = 0
  ): Promise<ISearchResponse> {
    const term = query.trim();
    if (!term) {
      return { results: [], total: 0, moreAvailable: false, vertical };
    }

    const isGraph = vertical === "emails" || vertical === "messages";
    const size = isGraph ? GRAPH_PAGE_SIZE : SP_PAGE_SIZE;

    if (this._useMocks) {
      return SearchService._mockFor(term, vertical, size);
    }

    const cacheKey = `${vertical}.${page}.${term.toLowerCase()}`;
    const cached = this._readCache(cacheKey);
    if (cached) return cached;

    try {
      const payload = isGraph
        ? await this._searchGraph(term, vertical, page)
        : await this._searchSharePoint(term, vertical, page, size);

      this._writeCache(cacheKey, payload);
      return payload;
    } catch (error) {
      return {
        results: [],
        total: 0,
        moreAvailable: false,
        vertical,
        degraded: `Recherche indisponible : ${
          (error as Error)?.message || "erreur inconnue"
        }`,
      };
    }
  }

  public static clearCache(): void {
    try {
      const doomed: string[] = [];
      for (let i = 0; i < window.sessionStorage.length; i++) {
        const key = window.sessionStorage.key(i);
        if (key && key.indexOf(CACHE_PREFIX) === 0) doomed.push(key);
      }
      doomed.forEach((key) => window.sessionStorage.removeItem(key));
    } catch {
      return;
    }
  }
}

import {
  MSGraphClientV3,
  SPHttpClient,
  SPHttpClientResponse,
} from "@microsoft/sp-http";

import {
  IAnnouncement,
  AnnouncementType,
  ICollaborateur,
  ICompanyInfo,
  IDepartement,
  IComment,
  IDocumentItem,
  IEmployeeOfMonth,
  IEventItem,
  IFaqItem,
  IFinanceData,
  IGalleryImage,
  IMilestone,
  IHeroSlide,
  IIndicator,
  IMission,
  INewsItem,
  IOrgNode,
  IProject,
  IQuickLink,
  ISiteSetting,
  IListColumn,
  IListRow,
  IListTableData,
  ISPFieldSchema,
} from "../models/IIkaModels";

import * as Mocks from "./MockData";

const CACHE_PREFIX = "ika.cache.";
const DEFAULT_TTL_MS = 5 * 60 * 1000;

interface ICacheEntry<T> {
  expires: number;
  payload: T;
}

/**
 * Erreur de requête SharePoint portant le code HTTP. Le message reste identique
 * à celui d'avant pour ne rien casser côté journalisation ; seul `status`
 * s'ajoute, indispensable pour distinguer « liste absente » (404) de « droits
 * insuffisants » (403) dans un message utilisateur.
 */
export class SPRequestError extends Error {
  public readonly status: number;

  public constructor(status: number, endpoint: string) {
    super(`Requête SharePoint échouée (${status}) sur ${endpoint}`);
    this.status = status;
    // Chaîne de prototype à restaurer : TypeScript cible ES5, où `extends Error`
    // casse `instanceof` sans cette ligne.
    Object.setPrototypeOf(this, SPRequestError.prototype);
  }
}

export interface ISPRequestContext {
  spHttpClient: SPHttpClient;
  pageContext: {
    web: { absoluteUrl: string; serverRelativeUrl: string };
    user: { displayName: string; email: string };
    legacyPageContext?: unknown;
  };
  host?: { hostType?: string };
  /**
   * OPTIONNEL à dessein. `WebPartContext` et `ApplicationCustomizerContext`
   * l'exposent tous les deux, mais le rendre obligatoire casserait les 19
   * points de construction existants ainsi que le stub de typecheck rapide.
   * Seul `SearchService` s'en sert (verticales e-mails / messages Teams).
   */
  msGraphClientFactory?: {
    getClient(version: "3"): Promise<MSGraphClientV3>;
  };
}

export class DataService {
  private readonly _context: ISPRequestContext;
  private readonly _webUrl: string;
  private readonly _hubUrl: string;
  private readonly _isLocal: boolean;
  private readonly _useMocks: boolean;

  public constructor(context: ISPRequestContext, hubUrl?: string) {
    this._context = context;
    this._webUrl = context.pageContext.web.absoluteUrl;
    this._hubUrl = hubUrl || this._resolveHubUrl();
    this._isLocal =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1");

    const isWorkbench = this._isLocal;

    let forceMocks = false;
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search || "");
      forceMocks =
        params.get("useMocks") === "1" ||
        params.get("useMocks")?.toLowerCase() === "true";
    }

    this._useMocks = forceMocks || isWorkbench;
  }

  private _resolveHubUrl(): string {
    const legacy = this._context.pageContext.legacyPageContext as
      | { hubSiteId?: string; hubUrl?: string }
      | undefined;

    if (!legacy || !legacy.hubSiteId) {
      return this._webUrl;
    }

    if (legacy.hubUrl) {
      return legacy.hubUrl;
    }

    // Pas d'URL de hub explicitement fournie : on replie sur le site courant
    // (un site non rattaché à un hub ne doit PAS être redirigé vers un chemin
    // codé en dur comme /sites/ikareview, sinon toutes les lectures de listes
    // « hub » échoueraient silencieusement).
    return this._webUrl;
  }

  private _readCache<T>(key: string): T | undefined {
    if (this._isLocal) return undefined;
    try {
      const raw = window.sessionStorage.getItem(CACHE_PREFIX + key);
      if (!raw) return undefined;
      const entry = JSON.parse(raw) as ICacheEntry<T>;
      if (Date.now() > entry.expires) {
        window.sessionStorage.removeItem(CACHE_PREFIX + key);
        return undefined;
      }
      return entry.payload;
    } catch {
      return undefined;
    }
  }

  private _writeCache<T>(key: string, payload: T, ttl: number): void {
    if (this._isLocal) return;
    try {
      const entry: ICacheEntry<T> = { expires: Date.now() + ttl, payload };
      window.sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
    } catch {
      return;
    }
  }

  private async _get<T>(
    siteUrl: string,
    endpoint: string,
    cacheKey?: string,
    ttl: number = DEFAULT_TTL_MS
  ): Promise<T[]> {
    if (cacheKey) {
      const cached = this._readCache<T[]>(cacheKey);
      if (cached) return cached;
    }

    const url = `${siteUrl}/_api/web/${endpoint}`;
    const response: SPHttpClientResponse =
      await this._context.spHttpClient.get(url, SPHttpClient.configurations.v1, {
        headers: { Accept: "application/json;odata=nometadata" },
      });

    if (!response.ok) {
      throw new SPRequestError(response.status, endpoint);
    }

    const json = (await response.json()) as { value: T[] };
    const value = json.value || [];

    if (cacheKey) this._writeCache(cacheKey, value, ttl);
    return value;
  }

  /** Comme `_get`, mais pour un endpoint qui renvoie UN item (`items(id)`),
   * dont la forme de réponse est l'objet lui-même, pas `{ value: T[] }`. */
  private async _getOne<T>(siteUrl: string, endpoint: string): Promise<T | undefined> {
    const url = `${siteUrl}/_api/web/${endpoint}`;
    const response: SPHttpClientResponse =
      await this._context.spHttpClient.get(url, SPHttpClient.configurations.v1, {
        headers: { Accept: "application/json;odata=nometadata" },
      });

    if (!response.ok) {
      throw new SPRequestError(response.status, endpoint);
    }

    return (await response.json()) as T;
  }

  private static _getFirstAttachmentUrl(item: any): string | undefined {
    const attachment = item?.AttachmentFiles?.[0];
    return attachment?.ServerRelativeUrl || attachment?.ServerUrl;
  }

  private static _parseImageField(value: unknown): unknown {
    if (!value) return undefined;
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (parsed && typeof parsed === "object") {
          return parsed;
        }
      } catch {
        return value;
      }
      return value;
    }
    return value;
  }

  private static _getAttachmentUrlForImageField(
    item: any,
    fieldValue: unknown
  ): string | undefined {
    const attachments: Array<{
      FileName?: string;
      ServerRelativeUrl?: string;
      ServerUrl?: string;
    }> = item?.AttachmentFiles || [];
    if (attachments.length === 0) return undefined;

    const parsed = DataService._parseImageField(fieldValue);
    if (parsed && typeof parsed === "object" && "fileName" in parsed) {
      const candidate = attachments.find(
        (attachment) => attachment.FileName === (parsed as any).fileName
      );
      if (candidate) {
        return candidate.ServerRelativeUrl || candidate.ServerUrl;
      }
    }

    const first = attachments[0];
    return first?.ServerRelativeUrl || first?.ServerUrl;
  }

  private static _buildImageFieldUrlFromFileName(
    item: any,
    fieldValue: unknown,
    listName: string,
    webServerRelativeUrl: string
  ): string | undefined {
    const parsed = DataService._parseImageField(fieldValue);
    if (!parsed || typeof parsed !== "object" || !("fileName" in parsed)) {
      return undefined;
    }
    const fileName = String((parsed as any).fileName || "");
    const itemId = item?.Id ?? item?.ID;
    if (!fileName || itemId === undefined || itemId === null) {
      return undefined;
    }

    const siteUrl = webServerRelativeUrl.endsWith("/")
      ? webServerRelativeUrl.slice(0, -1)
      : webServerRelativeUrl;
    const listPath = listName.startsWith("/") ? listName : `/Lists/${listName}`;
    return `${siteUrl}${listPath}/Attachments/${itemId}/${encodeURIComponent(fileName)}`;
  }

  private static _isValidImageField(value: unknown): boolean {
    const parsed = DataService._parseImageField(value);
    if (!parsed) return false;
    if (typeof parsed === "string") {
      return (
        parsed.startsWith("/") ||
        /^https?:\/\//i.test(parsed) ||
        parsed.startsWith("_api/") ||
        parsed.startsWith("sites/")
      );
    }
    if (typeof parsed === "object") {
      return Boolean(
        (parsed as Record<string, unknown>).serverRelativeUrl ||
        (parsed as Record<string, unknown>).serverUrl
      );
    }
    return false;
  }

  private static _normalizeAttachmentImageField<T extends object>(
    item: T,
    imageField: string,
    listName: string,
    webServerRelativeUrl: string
  ): T {
    const normalized = { ...(item as Record<string, unknown>) } as Record<string, unknown>;
    const currentValue = normalized[imageField];

    if (!DataService._isValidImageField(currentValue)) {
      let attachmentUrl = DataService._getAttachmentUrlForImageField(
        item,
        currentValue
      );
      if (!attachmentUrl) {
        attachmentUrl = DataService._buildImageFieldUrlFromFileName(
          item,
          currentValue,
          listName,
          webServerRelativeUrl
        );
      }
      if (attachmentUrl) {
        normalized[imageField] = {
          serverRelativeUrl: attachmentUrl,
          serverUrl: attachmentUrl,
        };
      }
    }

    return normalized as T;
  }

  private static _shouldReplaceFileRef(fileRef: string | undefined): boolean {
    if (!fileRef) return true;
    const extensionRegex = /\.(jpg|jpeg|png|gif|svg|webp|bmp|tiff|avif)(\?|$)/i;
    return !extensionRegex.test(fileRef) && /\/Lists\//i.test(fileRef);
  }

  private static _replaceFileRefWithAttachment<T extends Record<string, any>>(item: T): T {
    const attachmentUrl = DataService._getFirstAttachmentUrl(item);
    if (!attachmentUrl) return item;

    const fileRef = item?.FileRef;
    if (typeof fileRef === "string" && DataService._shouldReplaceFileRef(fileRef)) {
      return { ...item, FileRef: attachmentUrl };
    }
    return item;
  }

  public async getNews(top: number = 4, scope: string = "global"): Promise<INewsItem[]> {
    if (this._useMocks) return Mocks.MOCK_NEWS.slice(0, top);

    try {
      const select = [
        "Id",
        "Title",
        "Excerpt",
        "Category",
        "PublishDate",
        "Highlighted",
        "HeaderImage",
        "Created",
        "Modified",
        "NewsAuthor/Title",
        "NewsAuthor/EMail",
      ].join(",");

      const scopeFilter = scope ? `Scope eq '${scope}'` : "Scope eq 'global'";
      const endpoint =
        `lists/getByTitle('Actualites')/items` +
        `?$select=${select}&$expand=NewsAuthor,AttachmentFiles` +
        `&$filter=${scopeFilter}` +
        `&$orderby=Highlighted desc,PublishDate desc&$top=${top}`;

      const items = await this._get<INewsItem>(this._webUrl, endpoint, `news.${scope}.${top}`);
      const normalized = (items || []).map((item) =>
        DataService._normalizeAttachmentImageField(
          item,
          "HeaderImage",
          "Actualites",
          this._context.pageContext.web.serverRelativeUrl
        )
      );
      return normalized && normalized.length > 0 ? normalized : Mocks.MOCK_NEWS.slice(0, top);
    } catch (e) {
      console.warn("[DataService] Fallback mock pour actualités:", e);
      return Mocks.MOCK_NEWS.slice(0, top);
    }
  }

  /** Article complet (avec `Body`, absent du $select de `getNews`, réservé à la page de détail). */
  public async getNewsById(id: number): Promise<INewsItem | undefined> {
    if (this._useMocks) return Mocks.MOCK_NEWS.find((n) => n.Id === id);

    try {
      const select = [
        "Id",
        "Title",
        "Excerpt",
        "Body",
        "Category",
        "PublishDate",
        "Highlighted",
        "HeaderImage",
        "ExternalLink",
        "SortOrder",
        "Created",
        "Modified",
        "NewsAuthor/Title",
        "NewsAuthor/EMail",
      ].join(",");

      const endpoint =
        `lists/getByTitle('Actualites')/items(${id})` +
        `?$select=${select}&$expand=NewsAuthor,AttachmentFiles`;

      const item = await this._getOne<INewsItem>(this._webUrl, endpoint);
      if (!item) return Mocks.MOCK_NEWS.find((n) => n.Id === id);

      return DataService._normalizeAttachmentImageField(
        item,
        "HeaderImage",
        "Actualites",
        this._context.pageContext.web.serverRelativeUrl
      );
    } catch (e) {
      console.warn("[DataService] Fallback mock pour l'article :", e);
      return Mocks.MOCK_NEWS.find((n) => n.Id === id);
    }
  }

  /** Commentaires d'un article, du plus ancien au plus récent. */
  public async getComments(newsId: number): Promise<IComment[]> {
    if (this._useMocks) {
      return Mocks.MOCK_COMMENTS.filter((c) => c.NewsItem.Id === newsId);
    }

    try {
      const select = [
        "Id",
        "Title",
        "CommentText",
        "Created",
        "Modified",
        "Author/Id",
        "Author/Title",
        "Author/EMail",
        "NewsItem/Id",
      ].join(",");

      const endpoint =
        `lists/getByTitle('Commentaires')/items` +
        `?$select=${select}&$expand=Author,NewsItem` +
        `&$filter=NewsItemId eq ${newsId}` +
        `&$orderby=Created asc`;

      // Pas de cacheKey : un commentaire qui vient d'être posté doit
      // apparaître immédiatement, jamais lu depuis un cache obsolète.
      return await this._get<IComment>(this._webUrl, endpoint);
    } catch (e) {
      // Volontairement PAS de repli sur des commentaires factices ici :
      // afficher de faux commentaires attribués à de faux collègues sur une
      // vraie erreur serait trompeur, contrairement au repli habituel sur
      // des données de démonstration pour du contenu éditorial.
      console.warn("[DataService] Erreur chargement des commentaires :", e);
      return [];
    }
  }

  /** Poste un commentaire sur un article. Auteur + date sont posés par
   * SharePoint lui-même (champs système Author/Created), aucune saisie
   * manuelle nécessaire côté appelant. */
  public async postComment(newsId: number, text: string): Promise<IComment> {
    if (this._useMocks) {
      const fake: IComment = {
        Id: Date.now(),
        Title: text.slice(0, 80),
        Created: new Date().toISOString(),
        Modified: new Date().toISOString(),
        CommentText: text,
        NewsItem: { Id: newsId, Title: "" },
        Author: {
          Id: 0,
          Title: this._context.pageContext.user.displayName || "Vous",
          EMail: this._context.pageContext.user.email,
        },
      };
      return fake;
    }

    const listTitle = "Commentaires";
    const url = `${this._webUrl}/_api/web/lists/getByTitle('${listTitle}')/items`;
    const body = {
      __metadata: { type: "SP.Data.CommentairesListItem" },
      Title: text.slice(0, 80),
      CommentText: text,
      NewsItemId: newsId,
    };

    const response: SPHttpClientResponse = await this._context.spHttpClient.post(
      url,
      SPHttpClient.configurations.v1,
      {
        headers: {
          Accept: "application/json;odata=nometadata",
          "Content-Type": "application/json;odata=verbose",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error(`Échec de l'envoi du commentaire (${response.status})`);
    }

    return (await response.json()) as IComment;
  }

  public async getDocuments(top: number = 10, listTitle: string = "Documents"): Promise<IDocumentItem[]> {
    if (this._useMocks) return Mocks.MOCK_DOCUMENTS.slice(0, top);

    try {
      const select = [
        "Id",
        "Title",
        "FileLeafRef",
        "FileRef",
        "FSObjType",
        "DocCategory",
        "Confidentiality",
        "IsPinned",
        "Modified",
        "Created",
        "Editor/Title",
      ].join(",");

      // Pas de filtre sur FSObjType : on veut tout le contenu (fichiers ET
      // dossiers), pas seulement les fichiers (FSObjType eq 0 les excluait).
      const endpoint =
        `lists/getByTitle('${listTitle}')/items` +
        `?$select=${select}&$expand=Editor` +
        `&$orderby=Modified desc&$top=${top}`;

      const items = await this._get<IDocumentItem>(this._webUrl, endpoint, `docs.${listTitle}.${top}`);
      // "Forms" est le dossier système SharePoint qui héberge les formulaires
      // d'affichage/édition de la bibliothèque : jamais pertinent à afficher.
      const filtered = (items || []).filter((item) => item.FileLeafRef !== "Forms");
      return filtered.length > 0 ? filtered : Mocks.MOCK_DOCUMENTS.slice(0, top);
    } catch (e) {
      console.warn("[DataService] Fallback mock pour documents:", e);
      return Mocks.MOCK_DOCUMENTS.slice(0, top);
    }
  }

  public async getEvents(top: number = 5, scope: string = "global"): Promise<IEventItem[]> {
    if (this._useMocks) return Mocks.MOCK_EVENTS.slice(0, top);

    try {
      const today = new Date().toISOString();
      const select = [
        "Id",
        "Title",
        "EventDate",
        "EndDate",
        "Location",
        "EventCategory",
        "fAllDayEvent",
        "EventImage",
        "Created",
        "Modified",
      ].join(",");

      const endpoint =
        `lists/getByTitle('Evenements')/items` +
        `?$select=${select}&$expand=AttachmentFiles&$filter=EventDate ge datetime'${today}'` +
        `&$orderby=EventDate asc&$top=${top}`;

      const items = await this._get<IEventItem>(this._webUrl, endpoint, `events.${top}`);
      const normalized = (items || []).map((item) =>
        DataService._normalizeAttachmentImageField(
          item,
          "EventImage",
          "Evenements",
          this._context.pageContext.web.serverRelativeUrl
        )
      );
      return normalized && normalized.length > 0 ? normalized : Mocks.MOCK_EVENTS.slice(0, top);
    } catch (e) {
      console.warn("[DataService] Fallback mock pour événements:", e);
      return Mocks.MOCK_EVENTS.slice(0, top);
    }
  }

  public async getQuickLinks(scope: string = "global"): Promise<IQuickLink[]> {
    if (this._useMocks) return Mocks.MOCK_QUICKLINKS;

    try {
      const endpoint =
        `lists/getByTitle('LiensRapides')/items` +
        `?$select=Id,Title,LinkUrl,LinkDescription,IconName,SortOrder,OpenInNewTab,LinkGroup,IsActive,Created,Modified` +
        `&$filter=IsActive eq 1&$orderby=SortOrder asc&$top=50`;

      const items = await this._get<IQuickLink>(this._webUrl, endpoint, "quicklinks");
      return items && items.length > 0 ? items : Mocks.MOCK_QUICKLINKS;
    } catch (e) {
      console.warn("[DataService] Fallback mock pour liens rapides:", e);
      return Mocks.MOCK_QUICKLINKS;
    }
  }

  public async getDepartements(): Promise<IDepartement[]> {
    if (this._useMocks) return Mocks.MOCK_DEPARTEMENTS;

    try {
      const endpoint =
        `lists/getByTitle('Departements')/items` +
        `?$select=Id,Title,Slug,Tagline,DeptDescription,HeroTitle,HeroSubtitle,Accent,IconName,SiteUrl,AccentClasses,BadgeClasses,MemberCount,SortOrder,Created,Modified` +
        `&$orderby=SortOrder asc&$top=20`;

      const items = await this._get<IDepartement>(
        this._hubUrl,
        endpoint,
        "departements",
        30 * 60 * 1000
      );
      return items && items.length > 0 ? items : Mocks.MOCK_DEPARTEMENTS;
    } catch (e) {
      console.warn("[DataService] Fallback mock pour départements:", e);
      return Mocks.MOCK_DEPARTEMENTS;
    }
  }

  /**
   * Normalise une ligne brute de la liste `Annonces`.
   *
   * La liste d'un site réel n'a pas forcément les colonnes du modèle de
   * démonstration (`Detail`, `AnnouncementDate`, `AnnouncementType`…). On
   * accepte donc les noms usuels d'une liste SharePoint générique, et on
   * retombe en dernier ressort sur les colonnes système (`Title`, `Created`),
   * toujours présentes quel que soit le schéma.
   */
  private static _normalizeAnnouncement(
    raw: Record<string, unknown>
  ): IAnnouncement {
    const pick = (...keys: string[]): string => {
      for (let i = 0; i < keys.length; i++) {
        const value = raw[keys[i]];
        if (typeof value === "string" && value.trim() !== "") return value;
      }
      return "";
    };

    const detail = pick("Detail", "Description", "Body", "Comments", "Resume");
    const priority = pick("Priority");

    return {
      Id: typeof raw.Id === "number" ? raw.Id : 0,
      Title: pick("Title", "LinkTitle") || "Sans titre",
      AnnouncementType: (pick("AnnouncementType", "Category", "Type") ||
        "Événement") as AnnouncementType,
      // Le champ « Détail » peut être une colonne texte enrichi : on retire le
      // balisage, le bandeau l'affiche en texte brut.
      Detail: detail.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim(),
      Emoji: pick("Emoji") || undefined,
      AnnouncementDate: pick(
        "AnnouncementDate",
        "EventDate",
        "PublishDate",
        "Created"
      ),
      DisplayUntil: pick("DisplayUntil"),
      Priority: priority === "Haute" ? "Haute" : "Normale",
      Created: pick("Created"),
      Modified: pick("Modified"),
    };
  }

  /**
   * Annonces de la liste `Annonces` du site (bandeau d'accueil + vue
   * `#annonces`).
   *
   * Deux tentatives, de la plus précise à la plus tolérante. Auparavant une
   * seule requête stricte était émise : il suffisait qu'UNE colonne du modèle
   * de démonstration manque dans la liste réelle pour que SharePoint réponde
   * 400 et que tout le bandeau bascule silencieusement sur des annonces
   * fictives. Même chose quand la liste répondait correctement mais que le
   * filtre `DisplayUntil` écartait toutes les lignes.
   */
  public async getAnnouncements(): Promise<IAnnouncement[]> {
    if (this._useMocks) return Mocks.MOCK_ANNOUNCEMENTS;

    const today = new Date().toISOString();
    const strict =
      `lists/getByTitle('Annonces')/items` +
      `?$select=Id,Title,AnnouncementType,Detail,Emoji,AnnouncementDate,DisplayUntil,Priority,Created,Modified` +
      `&$filter=DisplayUntil ge datetime'${today}'` +
      `&$orderby=Priority desc,AnnouncementDate asc&$top=20`;

    // Ni `$select` ni `$filter` : SharePoint renvoie les colonnes par défaut
    // de la liste, quel que soit son schéma. C'est le filet qui garantit que
    // les vraies annonces s'affichent même sur une liste générique.
    const permissive =
      `lists/getByTitle('Annonces')/items?$orderby=Modified desc&$top=20`;

    // Une fois la requête stricte connue comme inopérante, inutile de la
    // rejouer à chaque navigation : on mémorise le verdict pour la session.
    const strictKnownBad = this._readCache<boolean>("announcements.strictKO");

    if (!strictKnownBad) {
      try {
        const items = await this._get<IAnnouncement>(
          this._hubUrl,
          strict,
          "announcements"
        );
        if (items && items.length > 0) return items;
      } catch (e) {
        console.warn(
          "[DataService] Requête stricte 'Annonces' refusée, repli sur les colonnes par défaut:",
          e
        );
        this._writeCache("announcements.strictKO", true, 30 * 60 * 1000);
      }
    }

    try {
      const rows = await this._get<Record<string, unknown>>(
        this._hubUrl,
        permissive,
        "announcements.raw"
      );
      // Liste réellement vide : on renvoie une liste vide, PAS les données de
      // démonstration. Le bandeau sait afficher un état vide, et afficher de
      // fausses annonces serait plus trompeur que de n'en afficher aucune.
      return (rows || []).map(DataService._normalizeAnnouncement);
    } catch (e) {
      console.warn("[DataService] Fallback mock pour annonces:", e);
      return Mocks.MOCK_ANNOUNCEMENTS;
    }
  }

  public async getProjects(onHomeOnly: boolean = true): Promise<IProject[]> {
    if (this._useMocks) return Mocks.MOCK_PROJECTS;

    try {
      const filter = onHomeOnly ? "&$filter=ShowOnHome eq 1" : "";
      const endpoint =
        `lists/getByTitle('Projets')/items` +
        `?$select=Id,Title,ProjectLead,Progress,ProjectStatus,DueDate,TasksDone,TasksTotal,ShowOnHome,SortOrder,Created,Modified` +
        `${filter}&$orderby=SortOrder asc&$top=20`;

      const items = await this._get<IProject>(this._hubUrl, endpoint, `projects.${onHomeOnly}`);
      return items && items.length > 0 ? items : Mocks.MOCK_PROJECTS;
    } catch (e) {
      console.warn("[DataService] Fallback mock pour projets:", e);
      return Mocks.MOCK_PROJECTS;
    }
  }

  public async getHeroSlides(): Promise<IHeroSlide[]> {
    if (this._useMocks) return Mocks.MOCK_SLIDES;

    try {
      const endpoint =
        `lists/getByTitle('HeroSlides')/items` +
        `?$select=Id,Title,FileRef,Caption,SubCaption,SlideLink,CtaLabel,SortOrder,IsActive,AltText,Created,Modified,AttachmentFiles/ServerRelativeUrl,AttachmentFiles/FileName` +
        `&$expand=AttachmentFiles` +
        `&$filter=IsActive eq 1&$orderby=SortOrder asc&$top=10`;

      const items = await this._get<IHeroSlide>(this._hubUrl, endpoint, "heroslides");
      const normalizedSlides = (items || []).map((item) => {
        const attachment = item.AttachmentFiles?.[0];
        const attachmentUrl = attachment?.ServerRelativeUrl || attachment?.ServerUrl;
        if (attachmentUrl) {
          return {
            ...item,
            FileRef: attachmentUrl,
          };
        }
        return item;
      });

      return normalizedSlides.length > 0 ? normalizedSlides : Mocks.MOCK_SLIDES;
    } catch (e) {
      console.warn("[DataService] Fallback mock pour slides hero:", e);
      return Mocks.MOCK_SLIDES;
    }
  }

  public async getMissions(): Promise<IMission[]> {
    if (this._useMocks) return Mocks.MOCK_MISSIONS;

    try {
      const endpoint =
        `lists/getByTitle('Missions')/items` +
        `?$select=Id,Title,Tag,MissionText,IconName,MissionType,ColorClass,BgClass,SortOrder,Created,Modified` +
        `&$orderby=SortOrder asc&$top=20`;

      const items = await this._get<IMission>(this._hubUrl, endpoint, "missions", 30 * 60 * 1000);
      return items && items.length > 0 ? items : Mocks.MOCK_MISSIONS;
    } catch (e) {
      console.warn("[DataService] Fallback mock pour missions:", e);
      return Mocks.MOCK_MISSIONS;
    }
  }

  public async getIndicators(
    placement: "Hero accueil" | "Page histoire" = "Hero accueil"
  ): Promise<IIndicator[]> {
    if (this._useMocks) {
      return Mocks.MOCK_STATS.filter(
        (s) => s.Placement === placement || s.Placement === "Les deux"
      );
    }

    try {
      const endpoint =
        `lists/getByTitle('Indicateurs')/items` +
        `?$select=Id,Title,StatValue,IconName,Placement,SortOrder,IsActive,Created,Modified` +
        `&$filter=IsActive eq 1 and (Placement eq '${placement}' or Placement eq 'Les deux')` +
        `&$orderby=SortOrder asc&$top=20`;

      const items = await this._get<IIndicator>(this._hubUrl, endpoint, `indicators.${placement}`);
      return items && items.length > 0
        ? items
        : Mocks.MOCK_STATS.filter(
            (s) => s.Placement === placement || s.Placement === "Les deux"
          );
    } catch (e) {
      console.warn("[DataService] Fallback mock pour indicateurs:", e);
      return Mocks.MOCK_STATS.filter(
        (s) => s.Placement === placement || s.Placement === "Les deux"
      );
    }
  }

  public async getCollaborateurs(division?: string): Promise<ICollaborateur[]> {
    if (this._useMocks) {
      return division
        ? Mocks.MOCK_COLLABORATORS.filter((c) => c.Division === division)
        : Mocks.MOCK_COLLABORATORS;
    }

    try {
      const select = [
        "Id",
        "Title",
        "JobTitle",
        "Email",
        "Phone",
        "OfficeLocation",
        "Birthdate",
        "Photo",
        "HierarchyLevel",
        "Division",
        "IsActive",
        "SortOrder",
        "Created",
        "Modified",
        "Manager/Id",
        "Manager/Title",
        "Department/Id",
        "Department/Title",
      ].join(",");

      const divisionFilter = division ? ` and Division eq '${division}'` : "";
      const endpoint =
        `lists/getByTitle('Collaborateurs')/items` +
        `?$select=${select}&$expand=Manager,Department,AttachmentFiles` +
        `&$filter=IsActive eq 1${divisionFilter}` +
        `&$orderby=HierarchyLevel asc,SortOrder asc&$top=500`;

      const items = await this._get<ICollaborateur>(
        this._hubUrl,
        endpoint,
        `collaborateurs.${division || "all"}`
      );
      const normalized = (items || []).map((item) =>
        DataService._normalizeAttachmentImageField(
          item,
          "Photo",
          "Collaborateurs",
          this._context.pageContext.web.serverRelativeUrl
        )
      );
      return normalized && normalized.length > 0 ? normalized : Mocks.MOCK_COLLABORATORS;
    } catch (e) {
      console.warn("[DataService] Fallback mock pour collaborateurs:", e);
      return division
        ? Mocks.MOCK_COLLABORATORS.filter((c) => c.Division === division)
        : Mocks.MOCK_COLLABORATORS;
    }
  }

  public async getOrgChart(): Promise<IOrgNode[]> {
    const flat = await this.getCollaborateurs();
    return DataService.buildTree(flat);
  }

  public static buildTree(items: ICollaborateur[]): IOrgNode[] {
    const byId = new Map<number, IOrgNode>();
    items.forEach((item) => byId.set(item.Id, { ...item, children: [] }));

    const roots: IOrgNode[] = [];

    byId.forEach((node) => {
      const parentId = node.Manager ? node.Manager.Id : undefined;
      if (parentId !== undefined && byId.has(parentId) && parentId !== node.Id) {
        const parent = byId.get(parentId);
        if (parent) parent.children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }

  public async getBirthdaysThisMonth(): Promise<ICollaborateur[]> {
    const all = await this.getCollaborateurs();
    const month = new Date().getMonth();
    return all
      .filter((c) => !!c.Birthdate)
      .filter((c) => new Date(c.Birthdate as string).getMonth() === month)
      .sort(
        (a, b) =>
          new Date(a.Birthdate as string).getDate() -
          new Date(b.Birthdate as string).getDate()
      );
  }

  public async getGalleryImages(top: number = 12): Promise<IGalleryImage[]> {
    if (this._useMocks) return Mocks.MOCK_GALLERY.slice(0, top);

    const endpoint =
      `lists/getByTitle('Galerie')/items` +
      `?$select=Id,Title,FileLeafRef,FileRef,Caption,GalleryCategory,PhotoDate,IsFeatured,AltText,SortOrder,Created,Modified` +
      `&$filter=FSObjType eq 0` +
      `&$orderby=IsFeatured desc,SortOrder asc,PhotoDate desc&$top=${top}`;

    try {
      const items = await this._get<IGalleryImage>(this._hubUrl, endpoint, `gallery.${top}`);
      let normalized = (items || []).map((item) => item);
      if (normalized && normalized.length > 0) {
        return normalized;
      }
    } catch (firstError) {
      console.warn("[DataService] Galerie hub failed, retrying site:", firstError);
    }

    if (this._webUrl !== this._hubUrl) {
      try {
        const fallbackItems = await this._get<IGalleryImage>(
          this._webUrl,
          endpoint,
          `gallery.web.${top}`
        );
        const normalized = (fallbackItems || []).map((item) => item);
        if (normalized && normalized.length > 0) {
          return normalized;
        }
      } catch (fallbackError) {
        console.warn("[DataService] Galerie site fallback failed:", fallbackError);
      }
    }

    return Mocks.MOCK_GALLERY.slice(0, top);
  }

  public async getEmployeeOfMonth(): Promise<IEmployeeOfMonth | undefined> {
    if (this._useMocks) return Mocks.MOCK_EMPLOYEE;

    try {
      const select = [
        "Id",
        "Title",
        "DisplayRole",
        "Quote",
        "NominatedBy",
        "Photo",
        "PeriodStart",
        "IsCurrent",
        "Created",
        "Modified",
        "Employee/Id",
        "Employee/Title",
        "Department/Id",
        "Department/Title",
      ].join(",");

      const endpoint =
        `lists/getByTitle('CollaborateurDuMois')/items` +
        `?$select=${select}&$expand=Employee,Department,AttachmentFiles` +
        `&$filter=IsCurrent eq 1&$orderby=PeriodStart desc&$top=1`;

      const items = await this._get<IEmployeeOfMonth>(
        this._hubUrl,
        endpoint,
        "employeeOfMonth"
      );
      const normalized = (items || []).map((item) =>
        DataService._normalizeAttachmentImageField(
          item,
          "Photo",
          "CollaborateurDuMois",
          this._context.pageContext.web.serverRelativeUrl
        )
      );

      return normalized && normalized.length > 0 ? normalized[0] : Mocks.MOCK_EMPLOYEE;
    } catch (e) {
      console.warn("[DataService] Fallback mock pour collaborateur du mois:", e);
      return Mocks.MOCK_EMPLOYEE;
    }
  }

  public async getFinanceData(fiscalYear?: number): Promise<IFinanceData[]> {
    if (this._useMocks) return [];

    try {
      const yearFilter = fiscalYear ? `&$filter=FiscalYear eq ${fiscalYear}` : "";
      const endpoint =
        `lists/getByTitle('DonneesFinancieres')/items` +
        `?$select=Id,Title,SeriesType,Amount,FiscalYear,FiscalMonth,FiscalQuarter,CurrencyCode,SortOrder,Created,Modified` +
        `${yearFilter}&$orderby=FiscalYear desc,FiscalMonth asc,SortOrder asc&$top=500`;

      return await this._get<IFinanceData>(
        this._webUrl,
        endpoint,
        `finance.${fiscalYear || "all"}`
      );
    } catch {
      return [];
    }
  }

  public async getMilestones(): Promise<IMilestone[]> {
    if (this._useMocks) return Mocks.MOCK_MILESTONES;

    try {
      const endpoint =
        `lists/getByTitle('Histoire')/items` +
        `?$select=Id,Title,Year,Quarter,MilestoneDescription,MilestoneImage,IconName,Tag,TagColorClass,Side,Stat1Label,Stat1Value,Stat2Label,Stat2Value,SortOrder,Created,Modified` +
        `&$expand=AttachmentFiles` +
        `&$orderby=SortOrder asc&$top=50`;

      const items = await this._get<IMilestone>(this._hubUrl, endpoint, "milestones", 30 * 60 * 1000);
      const normalized = (items || []).map((item) =>
        DataService._normalizeAttachmentImageField(
          item,
          "MilestoneImage",
          "Histoire",
          this._context.pageContext.web.serverRelativeUrl
        )
      );
      return normalized && normalized.length > 0 ? normalized : Mocks.MOCK_MILESTONES;
    } catch (e) {
      console.warn("[DataService] Fallback mock pour histoire:", e);
      return Mocks.MOCK_MILESTONES;
    }
  }

  public async getFaq(category?: string): Promise<IFaqItem[]> {
    if (this._useMocks) {
      return category
        ? Mocks.MOCK_FAQ.filter((f) => f.FaqCategory === category)
        : Mocks.MOCK_FAQ;
    }

    try {
      const categoryFilter = category
        ? ` and FaqCategory eq '${category.replace(/'/g, "''")}'`
        : "";

      const endpoint =
        `lists/getByTitle('FAQ')/items` +
        `?$select=Id,Title,Answer,FaqCategory,SortOrder,IsActive,ViewCount,Created,Modified` +
        `&$filter=IsActive eq 1${categoryFilter}` +
        `&$orderby=SortOrder asc&$top=100`;

      const items = await this._get<IFaqItem>(
        this._hubUrl,
        endpoint,
        `faq.${category || "all"}`
      );
      return items && items.length > 0 ? items : Mocks.MOCK_FAQ;
    } catch (e) {
      console.warn("[DataService] Fallback mock pour FAQ:", e);
      return Mocks.MOCK_FAQ;
    }
  }

  public async getCompanyInfo(): Promise<ICompanyInfo> {
    if (this._useMocks) return Mocks.MOCK_COMPANY;

    try {
      const endpoint =
        `lists/getByTitle('ParametresSite')/items` +
        `?$select=Id,Title,SettingValue,SettingCategory,Created,Modified&$top=100`;

      const items = await this._get<ISiteSetting>(
        this._hubUrl,
        endpoint,
        "settings",
        30 * 60 * 1000
      );

      if (!items || items.length === 0) return Mocks.MOCK_COMPANY;

      const map: Record<string, string> = {};
      items.forEach((item) => {
        map[item.Title] = item.SettingValue;
      });

      return {
        name: map["company.name"] || "IKA Solution",
        tagline: map["company.tagline"] || "",
        legalName: map["company.legalName"] || "",
        address: map["company.address"] || "",
        email: map["company.email"] || "",
        phone: map["company.phone"] || "",
        copyrightYears: map["company.copyrightYears"] || "2015–2026",
        social: {
          facebook: map["social.facebook"] || "#",
          linkedin: map["social.linkedin"] || "#",
          twitter: map["social.twitter"] || "#",
          instagram: map["social.instagram"] || "#",
          whatsapp: map["social.whatsapp"] || "#",
        },
      };
    } catch {
      return Mocks.MOCK_COMPANY;
    }
  }

  /* ─────────────────────────────────────────────────────────────────────────
   * Vue tableau générique (Fournisseurs, Équipements)
   *
   * Aucun modèle métier n'est figé ici : les colonnes sont découvertes à
   * l'exécution depuis la vue par défaut de la liste, puis complétées par le
   * catalogue de champs. Ajouter une colonne dans SharePoint suffit donc à la
   * voir apparaître, sans recompiler ni redéployer le paquet.
   * ──────────────────────────────────────────────────────────────────────── */

  /** Au-delà, l'URL du `$select` approche la limite de longueur des proxys. */
  private static readonly MAX_COLUMNS = 20;
  /** SharePoint refuse au-delà de 12 lookups projetés ; on garde de la marge. */
  private static readonly MAX_EXPANDS = 8;

  /**
   * Noms « calculés » de la vue par défaut à rediriger vers la vraie colonne.
   * `LinkTitle` est le libellé cliquable, pas un champ stockable.
   */
  private static readonly VIEW_FIELD_ALIASES: { [key: string]: string } = {
    LinkTitle: "Title",
    LinkTitleNoMenu: "Title",
    LinkTitle2: "Title",
    LinkFilename: "FileLeafRef",
    LinkFilenameNoMenu: "FileLeafRef",
  };

  /**
   * Champs à ne jamais projeter : soit ils ne sont pas sélectionnables et font
   * échouer TOUTE la requête en 400, soit ils n'ont pas de rendu tabulaire utile.
   */
  private static readonly EXCLUDED_FIELDS: { [key: string]: true } = {
    ID: true,
    Id: true,
    DocIcon: true,
    Edit: true,
    SelectTitle: true,
    ItemChildCount: true,
    FolderChildCount: true,
    Attachments: true,
    ContentType: true,
    ContentTypeId: true,
    File: true,
    FileDirRef: true,
    Recurrence: true,
    Geolocation: true,
    WorkflowStatus: true,
    CrossProjectLink: true,
    AppAuthor: true,
    AppEditor: true,
    Invalid: true,
    Error: true,
    GUID: true,
    Order: true,
    PermMask: true,
  };

  private static readonly CURRENCY_BY_LCID: { [lcid: number]: string } = {
    1033: "USD",
    2057: "GBP",
    1036: "EUR",
    3084: "CAD",
  };

  /**
   * Échappement d'un titre de liste pour `getByTitle('…')`.
   * L'ordre compte : échappement OData d'abord (une apostrophe se double),
   * encodage URL ensuite — `encodeURIComponent` ne touche pas à l'apostrophe,
   * donc les délimiteurs survivent, et un titre accentué passe en `%C3%89`.
   */
  private static _escapeListTitle(listTitle: string): string {
    return encodeURIComponent(listTitle.replace(/'/g, "''"));
  }

  /**
   * Traduit un champ SharePoint en descripteur de colonne, ou `undefined` si la
   * colonne doit être ignorée.
   */
  private static _mapFieldToColumn(
    field: ISPFieldSchema
  ): IListColumn | undefined {
    const name = field.InternalName;
    if (!name) return undefined;
    if (name.charAt(0) === "_") return undefined;
    if (DataService.EXCLUDED_FIELDS[name]) return undefined;

    const type = field.TypeAsString || "Text";
    const multiple = field.AllowMultipleValues === true;

    let kind: IListColumn["kind"];
    let numeric = false;
    let currencyCode: string | undefined;

    switch (type) {
      case "Text":
        kind = "text";
        break;
      case "Note":
        kind = "note";
        break;
      case "Number":
        kind = field.ShowAsPercentage === true ? "percent" : "number";
        numeric = true;
        break;
      case "Currency":
        kind = "currency";
        numeric = true;
        currencyCode =
          DataService.CURRENCY_BY_LCID[field.CurrencyLocaleId || 0] || "XOF";
        break;
      case "DateTime":
        kind = field.DisplayFormat === 1 ? "datetime" : "date";
        break;
      case "Boolean":
        kind = "boolean";
        break;
      case "Choice":
        kind = "choice";
        break;
      case "MultiChoice":
        kind = "multichoice";
        break;
      case "Lookup":
        kind = multiple ? "lookupmulti" : "lookup";
        break;
      case "LookupMulti":
        kind = "lookupmulti";
        break;
      case "User":
        kind = multiple ? "usermulti" : "user";
        break;
      case "UserMulti":
        kind = "usermulti";
        break;
      case "URL":
        kind = "url";
        break;
      case "Thumbnail":
      case "Image":
        kind = "image";
        break;
      case "TaxonomyFieldType":
      case "TaxonomyFieldTypeMulti":
        kind = "taxonomy";
        break;
      case "Calculated":
        kind = "calculated";
        break;
      case "Counter":
      case "Computed":
      case "Attachments":
      case "ContentTypeId":
        // Non projetables : les inclure ferait échouer toute la requête.
        return undefined;
      default:
        kind = "text";
        break;
    }

    return {
      internalName: name,
      displayName: field.Title || name,
      kind,
      spType: type,
      lookupField: field.LookupField || undefined,
      numeric,
      currencyCode,
    };
  }

  /**
   * Construit `$select` et `$expand`. Les lookups et les personnes ne peuvent
   * pas être sélectionnés directement : il faut projeter une sous-propriété
   * (`Contact/Title`) ET expandre le champ, sinon SharePoint répond 400.
   */
  private static _buildQueryParts(columns: IListColumn[]): {
    select: string;
    expand: string;
  } {
    const select: string[] = ["Id"];
    const expand: string[] = [];

    columns.forEach((column) => {
      const name = column.internalName;
      switch (column.kind) {
        case "lookup":
        case "lookupmulti": {
          if (expand.length >= DataService.MAX_EXPANDS) return;
          const projected = column.lookupField || "Title";
          select.push(name + "/Id", name + "/" + projected);
          expand.push(name);
          break;
        }
        case "user":
        case "usermulti": {
          if (expand.length >= DataService.MAX_EXPANDS) return;
          select.push(name + "/Id", name + "/Title", name + "/EMail");
          expand.push(name);
          break;
        }
        default:
          select.push(name);
          break;
      }
    });

    return { select: select.join(","), expand: expand.join(",") };
  }

  /**
   * Découvre les colonnes : catalogue de champs + ordre de la vue par défaut.
   *
   * L'appel `/fields` est volontairement SANS `$select` — la collection est
   * hétérogène (`SP.FieldLookup`, `SP.FieldCurrency`…) et demander une propriété
   * de sous-type y répond 400. On filtre sur `Hidden` seul : ajouter
   * `ReadOnlyField eq false` écarterait les colonnes calculées, qu'on veut.
   */
  private async _getListSchema(
    listTitle: string
  ): Promise<{ columns: IListColumn[]; totalColumns: number }> {
    const cacheKey = "listtable.schema." + listTitle;
    const cached = this._readCache<{
      columns: IListColumn[];
      totalColumns: number;
    }>(cacheKey);
    if (cached) return cached;

    const esc = DataService._escapeListTitle(listTitle);

    const fieldsPromise = this._get<ISPFieldSchema>(
      this._webUrl,
      "lists/getByTitle('" + esc + "')/fields?$filter=Hidden eq false&$top=500"
    );

    // Une vue inaccessible (403) ou sans champs exploitables ne doit pas faire
    // échouer la vue entière : on retombe alors sur l'ordre du catalogue.
    const viewPromise = this._getOne<{
      Items?: string[] | { results?: string[] };
    }>(
      this._webUrl,
      "lists/getByTitle('" + esc + "')/DefaultView/ViewFields"
    ).catch(() => undefined);

    const [fields, view] = await Promise.all([fieldsPromise, viewPromise]);

    const byName: { [name: string]: IListColumn } = {};
    const catalogue: IListColumn[] = [];
    (fields || []).forEach((field) => {
      const column = DataService._mapFieldToColumn(field);
      if (!column) return;
      byName[column.internalName] = column;
      catalogue.push(column);
    });

    // `Items` est une collection de primitives : `nometadata` l'aplatit en
    // tableau, les formes héritées de `verbose` l'enveloppent dans `results`.
    const rawItems = view ? view.Items : undefined;
    const viewFields: string[] = Array.isArray(rawItems)
      ? rawItems
      : (rawItems && rawItems.results) || [];

    let ordered: IListColumn[] = [];
    const seen: { [name: string]: true } = {};

    viewFields.forEach((raw) => {
      const name = DataService.VIEW_FIELD_ALIASES[raw] || raw;
      const column = byName[name];
      if (!column || seen[name]) return;
      seen[name] = true;
      ordered.push(column);
    });

    if (ordered.length === 0) ordered = catalogue;

    const result = {
      columns: ordered.slice(0, DataService.MAX_COLUMNS),
      totalColumns: ordered.length,
    };

    this._writeCache(cacheKey, result, 30 * 60 * 1000);
    return result;
  }

  /**
   * Charge une liste SharePoint quelconque sous forme de tableau.
   *
   * Contrairement aux autres accesseurs, aucun repli sur des données factices
   * en cas d'erreur : des fournisseurs, des contacts et des montants inventés
   * seraient trompeurs (même raisonnement que `getComments` et
   * `getFinanceData`), et le schéma factice ne pourrait de toute façon pas
   * correspondre au vrai — on afficherait des colonnes inexistantes. Le mode
   * démonstration reste possible, mais il s'annonce via `isDemo`.
   */
  public async getListTable(
    listTitle: string,
    top: number = 200
  ): Promise<IListTableData> {
    if (this._useMocks) return Mocks.mockListTable(listTitle);

    let select = "";
    let expand = "";

    try {
      const schema = await this._getListSchema(listTitle);

      if (schema.columns.length === 0) {
        return {
          listTitle,
          columns: [],
          rows: [],
          isDemo: false,
          truncated: false,
          totalColumns: 0,
          error:
            "Aucune colonne exploitable n'a été trouvée dans la liste « " +
            listTitle +
            " ».",
        };
      }

      const parts = DataService._buildQueryParts(schema.columns);
      select = parts.select;
      expand = parts.expand;

      const esc = DataService._escapeListTitle(listTitle);
      // Pas de `$orderby` : un tri non indexé dépasse le seuil d'affichage au-delà
      // de 5 000 éléments. On charge une page et on trie côté client.
      const endpoint =
        "lists/getByTitle('" +
        esc +
        "')/items?$select=" +
        encodeURIComponent(select) +
        (expand ? "&$expand=" + encodeURIComponent(expand) : "") +
        "&$top=" +
        String(top);

      const rows = await this._get<IListRow>(
        this._webUrl,
        endpoint,
        "listtable.items." + listTitle + "." + String(top)
      );

      return {
        listTitle,
        columns: schema.columns,
        rows: rows || [],
        isDemo: false,
        truncated: (rows || []).length >= top,
        totalColumns: schema.totalColumns,
      };
    } catch (e) {
      // Sans cette trace, un 400 dû à une colonne mal projetée est indébuggable
      // en production : le `$select` généré est la seule piste utile.
      console.warn(
        "[DataService] Échec du chargement de la liste « " + listTitle + " ».",
        { select, expand },
        e
      );

      const status = e instanceof SPRequestError ? e.status : 0;
      let message: string;
      if (status === 404) {
        message =
          "La liste « " +
          listTitle +
          " » est introuvable sur ce site. Vérifiez son nom exact dans Contenus du site.";
      } else if (status === 401 || status === 403) {
        message =
          "Vous n'avez pas l'autorisation de consulter la liste « " +
          listTitle +
          " ».";
      } else if (status > 0) {
        message =
          "Impossible de charger la liste « " +
          listTitle +
          " » (erreur " +
          String(status) +
          ").";
      } else {
        message = "Impossible de charger la liste « " + listTitle + " ».";
      }

      return {
        listTitle,
        columns: [],
        rows: [],
        isDemo: false,
        truncated: false,
        totalColumns: 0,
        error: message,
      };
    }
  }

  public static clearCache(): void {
    try {
      const keys: string[] = [];
      for (let i = 0; i < window.sessionStorage.length; i++) {
        const key = window.sessionStorage.key(i);
        if (key && key.indexOf(CACHE_PREFIX) === 0) keys.push(key);
      }
      keys.forEach((key) => window.sessionStorage.removeItem(key));
    } catch {
      return;
    }
  }
}

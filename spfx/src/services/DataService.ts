import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

import {
  IAnnouncement,
  ICollaborateur,
  ICompanyInfo,
  IDepartement,
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
} from "../models/IIkaModels";

import * as Mocks from "./MockData";

const CACHE_PREFIX = "ika.cache.";
const DEFAULT_TTL_MS = 5 * 60 * 1000;

interface ICacheEntry<T> {
  expires: number;
  payload: T;
}

export interface ISPRequestContext {
  spHttpClient: SPHttpClient;
  pageContext: {
    web: { absoluteUrl: string; serverRelativeUrl: string };
    user: { displayName: string; email: string };
    legacyPageContext?: unknown;
  };
  host?: { hostType?: string };
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
      throw new Error(
        `Requête SharePoint échouée (${response.status}) sur ${endpoint}`
      );
    }

    const json = (await response.json()) as { value: T[] };
    const value = json.value || [];

    if (cacheKey) this._writeCache(cacheKey, value, ttl);
    return value;
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
        `&$orderby=PublishDate desc&$top=${top}`;

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

  public async getDocuments(top: number = 10, listTitle: string = "Documents"): Promise<IDocumentItem[]> {
    if (this._useMocks) return Mocks.MOCK_DOCUMENTS.slice(0, top);

    try {
      const select = [
        "Id",
        "Title",
        "FileLeafRef",
        "FileRef",
        "DocCategory",
        "Confidentiality",
        "IsPinned",
        "Modified",
        "Created",
        "Editor/Title",
      ].join(",");

      const endpoint =
        `lists/getByTitle('${listTitle}')/items` +
        `?$select=${select}&$expand=Editor` +
        `&$filter=FSObjType eq 0&$orderby=Modified desc&$top=${top}`;

      const items = await this._get<IDocumentItem>(this._webUrl, endpoint, `docs.${listTitle}.${top}`);
      return items && items.length > 0 ? items : Mocks.MOCK_DOCUMENTS.slice(0, top);
    } catch (e) {
      console.warn("[DataService] Fallback mock pour documents:", e);
      return Mocks.MOCK_DOCUMENTS.slice(0, top);
    }
  }

  public async getEvents(top: number = 5, scope: string = "global"): Promise<IEventItem[]> {
    if (this._useMocks) return Mocks.MOCK_EVENTS.slice(0, top);

    try {
      const select = [
        "Id",
        "Title",
        "EventDate",
        "EndDate",
        "DisplayDate",
        "DisplayMonth",
        "DisplayDay",
        "Location",
        "EventCategory",
        "fAllDayEvent",
        "EventImage",
        "Created",
        "Modified",
      ].join(",");

      const endpoint =
        `lists/getByTitle('Evenements')/items` +
        `?$select=${select}&$expand=AttachmentFiles` +
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
      const safeScope = scope.replace(/'/g, "''");
      const endpoint =
        `lists/getByTitle('LiensRapides')/items` +
        `?$select=Id,Title,Scope,LinkUrl,LinkDescription,IconName,SortOrder,OpenInNewTab,LinkGroup,IsActive,Created,Modified` +
        `&$filter=IsActive eq 1 and Scope eq '${safeScope}'&$orderby=SortOrder asc&$top=50`;

      const items = await this._get<IQuickLink>(this._webUrl, endpoint, `quicklinks.${scope}`);
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

  public async getAnnouncements(): Promise<IAnnouncement[]> {
    if (this._useMocks) return Mocks.MOCK_ANNOUNCEMENTS;

    try {
      const endpoint =
        `lists/getByTitle('Annonces')/items` +
        `?$select=Id,Title,AnnouncementType,Detail,Emoji,AnnouncementDate,DisplayUntil,Priority,SortOrder,Created,Modified` +
        `&$orderby=SortOrder asc&$top=20`;

      const items = await this._get<IAnnouncement>(this._hubUrl, endpoint, "announcements");
      return items && items.length > 0 ? items : Mocks.MOCK_ANNOUNCEMENTS;
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
      const mockCollaborators = division
        ? Mocks.MOCK_COLLABORATORS.filter((c) => c.Division === division)
        : Mocks.MOCK_COLLABORATORS;
      return [...mockCollaborators].sort(
        (a, b) => (a.SortOrder ?? 999) - (b.SortOrder ?? 999)
      );
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
        `&$orderby=SortOrder asc,Title asc&$top=500`;

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

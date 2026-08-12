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
import { shouldUseMockDataByDefault } from "../common/utils/imageUrl";

export { shouldUseMockDataByDefault };

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

export interface IDataServiceOptions {
  /**
   * Force les données de démonstration. Par défaut : uniquement sur
   * localhost (workbench local). Le workbench **hébergé**
   * (`/_layouts/15/workbench.aspx`) interroge les listes du site.
   */
  useMocks?: boolean;
}

export class DataService {
  private readonly _context: ISPRequestContext;
  private readonly _webUrl: string;
  private readonly _hubUrl: string;
  private readonly _isLocal: boolean;
  private _useMocks: boolean;

  public constructor(
    context: ISPRequestContext,
    hubUrl?: string,
    options?: IDataServiceOptions
  ) {
    this._context = context;
    this._webUrl = context.pageContext.web.absoluteUrl;
    this._hubUrl = hubUrl || this._resolveHubUrl();
    this._isLocal =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1");

    // Hosted workbench = page SharePoint → REST disponible.
    // Mocks uniquement si on est vraiment hors SharePoint, ou si demandé.
    const hostname =
      typeof window !== "undefined" && window.location
        ? window.location.hostname
        : "";
    this._useMocks = shouldUseMockDataByDefault(
      hostname,
      options ? options.useMocks : undefined
    );
  }

  public setUseMocks(value: boolean): void {
    this._useMocks = value;
  }

  public get useMocks(): boolean {
    return this._useMocks;
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

  /**
   * Relance la requête sans $filter si SharePoint renvoie 400
   * (colonne de filtre absente, ex. Scope sur Actualites).
   */
  private async _getWithFallback<T>(
    siteUrl: string,
    endpoint: string,
    cacheKey?: string,
    ttl: number = DEFAULT_TTL_MS
  ): Promise<T[]> {
    try {
      return await this._get<T>(siteUrl, endpoint, cacheKey, ttl);
    } catch (error) {
      const withoutFilter = endpoint
        .replace(/([?&])\$filter=[^&]*/i, "$1")
        .replace(/\?&/, "?")
        .replace(/&&+/g, "&")
        .replace(/\?$/, "")
        .replace(/&$/, "");
      if (withoutFilter === endpoint) throw error;
      console.warn(
        "[DataService] Requête relancée sans $filter:",
        endpoint
      );
      return await this._get<T>(siteUrl, withoutFilter, undefined, ttl);
    }
  }

  private _onListError<T>(label: string, error: unknown, mock: T): T {
    console.warn(`[DataService] ${label}:`, error);
    return this._useMocks ? mock : (Array.isArray(mock) ? ([] as unknown as T) : (undefined as T));
  }

  public async getNews(top: number = 4, _scope: string = "global"): Promise<INewsItem[]> {
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

      // Pas de filtre Scope : la colonne n'existe pas sur Actualites
      // (voir docs/10-listes-a-creer.md) et ferait échouer la requête.
      const endpoint =
        `lists/getByTitle('Actualites')/items` +
        `?$select=${select}&$expand=NewsAuthor` +
        `&$orderby=Highlighted desc,PublishDate desc&$top=${top}`;

      return await this._getWithFallback<INewsItem>(
        this._webUrl,
        endpoint,
        `news.all.${top}`
      );
    } catch (e) {
      return this._onListError("actualités", e, Mocks.MOCK_NEWS.slice(0, top));
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

      return await this._getWithFallback<IDocumentItem>(
        this._webUrl,
        endpoint,
        `docs.${listTitle}.${top}`
      );
    } catch (e) {
      return this._onListError("documents", e, Mocks.MOCK_DOCUMENTS.slice(0, top));
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
        `?$select=${select}&$filter=EventDate ge datetime'${today}'` +
        `&$orderby=EventDate asc&$top=${top}`;

      return await this._getWithFallback<IEventItem>(
        this._webUrl,
        endpoint,
        `events.${top}`
      );
    } catch (e) {
      return this._onListError("événements", e, Mocks.MOCK_EVENTS.slice(0, top));
    }
  }

  public async getQuickLinks(scope: string = "global"): Promise<IQuickLink[]> {
    if (this._useMocks) return Mocks.MOCK_QUICKLINKS;

    try {
      const endpoint =
        `lists/getByTitle('LiensRapides')/items` +
        `?$select=Id,Title,LinkUrl,LinkDescription,IconName,SortOrder,OpenInNewTab,LinkGroup,IsActive,Created,Modified` +
        `&$filter=IsActive eq 1&$orderby=SortOrder asc&$top=50`;

      return await this._getWithFallback<IQuickLink>(
        this._webUrl,
        endpoint,
        "quicklinks"
      );
    } catch (e) {
      return this._onListError("liens rapides", e, Mocks.MOCK_QUICKLINKS);
    }
  }

  public async getDepartements(): Promise<IDepartement[]> {
    if (this._useMocks) return Mocks.MOCK_DEPARTEMENTS;

    try {
      const endpoint =
        `lists/getByTitle('Departements')/items` +
        `?$select=Id,Title,Slug,Tagline,DeptDescription,HeroTitle,HeroSubtitle,Accent,IconName,SiteUrl,AccentClasses,BadgeClasses,MemberCount,SortOrder,Created,Modified` +
        `&$orderby=SortOrder asc&$top=20`;

      return await this._getWithFallback<IDepartement>(
        this._hubUrl,
        endpoint,
        "departements",
        30 * 60 * 1000
      );
    } catch (e) {
      return this._onListError("départements", e, Mocks.MOCK_DEPARTEMENTS);
    }
  }

  public async getAnnouncements(): Promise<IAnnouncement[]> {
    if (this._useMocks) return Mocks.MOCK_ANNOUNCEMENTS;

    try {
      const today = new Date().toISOString();
      const endpoint =
        `lists/getByTitle('Annonces')/items` +
        `?$select=Id,Title,AnnouncementType,Detail,Emoji,AnnouncementDate,DisplayUntil,Priority,Created,Modified` +
        `&$filter=DisplayUntil ge datetime'${today}'` +
        `&$orderby=Priority desc,AnnouncementDate asc&$top=20`;

      return await this._getWithFallback<IAnnouncement>(
        this._hubUrl,
        endpoint,
        "announcements"
      );
    } catch (e) {
      return this._onListError("annonces", e, Mocks.MOCK_ANNOUNCEMENTS);
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

      return await this._getWithFallback<IProject>(
        this._hubUrl,
        endpoint,
        `projects.${onHomeOnly}`
      );
    } catch (e) {
      return this._onListError("projets", e, Mocks.MOCK_PROJECTS);
    }
  }

  public async getHeroSlides(): Promise<IHeroSlide[]> {
    if (this._useMocks) return Mocks.MOCK_SLIDES;

    try {
      const endpoint =
        `lists/getByTitle('HeroSlides')/items` +
        `?$select=Id,Title,FileLeafRef,FileRef,EncodedAbsUrl,Caption,SubCaption,SlideLink,CtaLabel,SortOrder,IsActive,AltText,Created,Modified` +
        `&$filter=IsActive eq 1&$orderby=SortOrder asc&$top=10`;

      return await this._getWithFallback<IHeroSlide>(
        this._hubUrl,
        endpoint,
        "heroslides"
      );
    } catch (e) {
      return this._onListError("slides hero", e, Mocks.MOCK_SLIDES);
    }
  }

  public async getMissions(): Promise<IMission[]> {
    if (this._useMocks) return Mocks.MOCK_MISSIONS;

    try {
      const endpoint =
        `lists/getByTitle('Missions')/items` +
        `?$select=Id,Title,Tag,MissionText,IconName,MissionType,ColorClass,BgClass,SortOrder,Created,Modified` +
        `&$orderby=SortOrder asc&$top=20`;

      return await this._getWithFallback<IMission>(
        this._hubUrl,
        endpoint,
        "missions",
        30 * 60 * 1000
      );
    } catch (e) {
      return this._onListError("missions", e, Mocks.MOCK_MISSIONS);
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

      return await this._getWithFallback<IIndicator>(
        this._hubUrl,
        endpoint,
        `indicators.${placement}`
      );
    } catch (e) {
      return this._onListError(
        "indicateurs",
        e,
        Mocks.MOCK_STATS.filter(
          (s) => s.Placement === placement || s.Placement === "Les deux"
        )
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
        `?$select=${select}&$expand=Manager,Department` +
        `&$filter=IsActive eq 1${divisionFilter}` +
        `&$orderby=HierarchyLevel asc,SortOrder asc&$top=500`;

      return await this._getWithFallback<ICollaborateur>(
        this._hubUrl,
        endpoint,
        `collaborateurs.${division || "all"}`
      );
    } catch (e) {
      return this._onListError(
        "collaborateurs",
        e,
        division
          ? Mocks.MOCK_COLLABORATORS.filter((c) => c.Division === division)
          : Mocks.MOCK_COLLABORATORS
      );
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

    try {
      const endpoint =
        `lists/getByTitle('Galerie')/items` +
        `?$select=Id,Title,FileLeafRef,FileRef,EncodedAbsUrl,Caption,GalleryCategory,PhotoDate,IsFeatured,AltText,SortOrder,Created,Modified` +
        `&$filter=FSObjType eq 0` +
        `&$orderby=IsFeatured desc,SortOrder asc,PhotoDate desc&$top=${top}`;

      try {
        return await this._getWithFallback<IGalleryImage>(
          this._hubUrl,
          endpoint,
          `gallery.${top}`
        );
      } catch (_first) {
        const withoutAbs = endpoint.replace(/,?EncodedAbsUrl,?/, ",");
        return await this._getWithFallback<IGalleryImage>(
          this._hubUrl,
          withoutAbs,
          `gallery.${top}`
        );
      }
    } catch (e) {
      return this._onListError("galerie", e, Mocks.MOCK_GALLERY.slice(0, top));
    }
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
        `?$select=${select}&$expand=Employee,Department` +
        `&$filter=IsCurrent eq 1&$orderby=PeriodStart desc&$top=1`;

      const items = await this._getWithFallback<IEmployeeOfMonth>(
        this._hubUrl,
        endpoint,
        "employeeOfMonth"
      );

      return items && items.length > 0 ? items[0] : undefined;
    } catch (e) {
      console.warn("[DataService] collaborateur du mois:", e);
      return this._useMocks ? Mocks.MOCK_EMPLOYEE : undefined;
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
        `&$orderby=SortOrder asc&$top=50`;

      return await this._getWithFallback<IMilestone>(
        this._hubUrl,
        endpoint,
        "milestones",
        30 * 60 * 1000
      );
    } catch (e) {
      return this._onListError("histoire", e, Mocks.MOCK_MILESTONES);
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

      return await this._getWithFallback<IFaqItem>(
        this._hubUrl,
        endpoint,
        `faq.${category || "all"}`
      );
    } catch (e) {
      return this._onListError("FAQ", e, Mocks.MOCK_FAQ);
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

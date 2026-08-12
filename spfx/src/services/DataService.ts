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
  ISPImageField,
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
  private readonly _webServerRelativeUrl: string;
  private readonly _hubUrl: string;
  private readonly _isLocal: boolean;
  private readonly _useMocks: boolean;

  public constructor(context: ISPRequestContext, hubUrl?: string) {
    this._context = context;
    this._webUrl = context.pageContext.web.absoluteUrl;
    this._webServerRelativeUrl =
      context.pageContext.web.serverRelativeUrl || "/";
    this._hubUrl = hubUrl || this._resolveHubUrl();
    this._isLocal =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1");

    const isWorkbench =
      this._isLocal ||
      (typeof window !== "undefined" &&
        /workbench/i.test(window.location.pathname)) ||
      context.host?.hostType === "Workbench";

    this._useMocks = isWorkbench;
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

  private _toServerRelativeUrl(url: string): string {
    try {
      return new URL(url).pathname.replace(/\/+$/, "") || "/";
    } catch {
      return this._webServerRelativeUrl;
    }
  }

  /**
   * Normalise une colonne « Image » moderne SharePoint Online.
   *
   * Avec `odata=nometadata`, l'API REST renvoie la colonne sous forme de
   * **JSON string** (ex. `{"fileName":"Reserved_ImageAttachment_[5]_[Photo]
   * [32]_[guid]_[1]_[2].jpg","originalImageName":"DG"}`) et, quand la liste a
   * les pièces jointes activées (défaut), le fichier est stocké dans
   * `/Lists/<Liste>/Attachments/<Id>/` **sans `serverRelativeUrl` exploitable**.
   * On reconstruit alors l'URL d'accès au fichier.
   */
  private _normalizeImageField(
    field: ISPImageField | string | undefined,
    itemId: number,
    listTitle: string,
    siteUrl: string
  ): ISPImageField | undefined {
    if (!field) return undefined;

    if (typeof field !== "string") return field;

    const trimmed = field.trim();

    if (!trimmed.startsWith("{")) {
      return /^https?:\/\//i.test(trimmed)
        ? { serverUrl: trimmed }
        : { serverRelativeUrl: trimmed };
    }

    try {
      const parsed = JSON.parse(trimmed) as {
        fileName?: string;
        originalImageName?: string;
        serverRelativeUrl?: string;
        serverUrl?: string;
      };

      const isAbsoluteFile =
        !!parsed.fileName && /^https?:\/\//i.test(parsed.fileName);
      const siteRelative = this._toServerRelativeUrl(siteUrl);
      let siteOrigin = siteUrl;
      try {
        siteOrigin = new URL(siteUrl).origin;
      } catch {
        // siteUrl non-URL : on conserve la valeur brute en secours
      }

      const serverRelativeUrl = isAbsoluteFile
        ? undefined
        : parsed.serverRelativeUrl ||
          (parsed.fileName
            ? `${siteRelative}/Lists/${listTitle}/Attachments/${itemId}/${parsed.fileName}`
            : undefined);

      const serverUrl =
        parsed.serverUrl ||
        (isAbsoluteFile && parsed.fileName) ||
        (serverRelativeUrl
          ? `${siteOrigin}${serverRelativeUrl}`
          : undefined);

      return {
        serverRelativeUrl,
        serverUrl,
        fileName: parsed.fileName,
      };
    } catch {
      return { serverRelativeUrl: trimmed };
    }
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
        `?$select=${select}&$expand=NewsAuthor` +
        `&$filter=${scopeFilter}` +
        `&$orderby=Highlighted desc,PublishDate desc&$top=${top}`;

      const items = await this._get<INewsItem>(this._webUrl, endpoint, `news.${scope}.${top}`);
      const normalized = (items || []).map((item) => ({
        ...item,
        HeaderImage: item.HeaderImage
          ? this._normalizeImageField(item.HeaderImage, item.Id, "Actualites", this._webUrl)
          : undefined,
      }));
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

      const items = await this._get<IEventItem>(this._webUrl, endpoint, `events.${top}`);
      const normalized = (items || []).map((item) => ({
        ...item,
        EventImage: item.EventImage
          ? this._normalizeImageField(item.EventImage, item.Id, "Evenements", this._webUrl)
          : undefined,
      }));
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

  public async getAnnouncements(): Promise<IAnnouncement[]> {
    if (this._useMocks) return Mocks.MOCK_ANNOUNCEMENTS;

    try {
      const today = new Date().toISOString();
      const endpoint =
        `lists/getByTitle('Annonces')/items` +
        `?$select=Id,Title,AnnouncementType,Detail,Emoji,AnnouncementDate,DisplayUntil,Priority,Created,Modified` +
        `&$filter=DisplayUntil ge datetime'${today}'` +
        `&$orderby=Priority desc,AnnouncementDate asc&$top=20`;

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
        `?$select=Id,Title,FileRef,Caption,SubCaption,SlideLink,CtaLabel,SortOrder,IsActive,AltText,Created,Modified` +
        `&$filter=IsActive eq 1&$orderby=SortOrder asc&$top=10`;

      const items = await this._get<IHeroSlide>(this._hubUrl, endpoint, "heroslides");
      return items && items.length > 0 ? items : Mocks.MOCK_SLIDES;
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
        `?$select=${select}&$expand=Manager,Department` +
        `&$filter=IsActive eq 1${divisionFilter}` +
        `&$orderby=HierarchyLevel asc,SortOrder asc&$top=500`;

      const items = await this._get<ICollaborateur>(
        this._hubUrl,
        endpoint,
        `collaborateurs.${division || "all"}`
      );
      const normalized = (items || []).map((item) => ({
        ...item,
        Photo: item.Photo
          ? this._normalizeImageField(item.Photo, item.Id, "Collaborateurs", this._hubUrl)
          : undefined,
      }));
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

    try {
      const endpoint =
        `lists/getByTitle('Galerie')/items` +
        `?$select=Id,Title,FileLeafRef,FileRef,Caption,GalleryCategory,PhotoDate,IsFeatured,AltText,SortOrder,Created,Modified` +
        `&$filter=FSObjType eq 0` +
        `&$orderby=IsFeatured desc,SortOrder asc,PhotoDate desc&$top=${top}`;

      const items = await this._get<IGalleryImage>(this._hubUrl, endpoint, `gallery.${top}`);
      return items && items.length > 0 ? items : Mocks.MOCK_GALLERY.slice(0, top);
    } catch (e) {
      console.warn("[DataService] Fallback mock pour galerie:", e);
      return Mocks.MOCK_GALLERY.slice(0, top);
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

      const items = await this._get<IEmployeeOfMonth>(
        this._hubUrl,
        endpoint,
        "employeeOfMonth"
      );

      if (!items || items.length === 0) return Mocks.MOCK_EMPLOYEE;
      const first = items[0];
      return {
        ...first,
        Photo: first.Photo
          ? this._normalizeImageField(first.Photo, first.Id, "CollaborateurDuMois", this._hubUrl)
          : undefined,
      };
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
        `&$orderby=SortOrder asc&$top=50`;

      const items = await this._get<IMilestone>(this._hubUrl, endpoint, "milestones", 30 * 60 * 1000);
      const normalized = (items || []).map((item) => ({
        ...item,
        MilestoneImage: item.MilestoneImage
          ? this._normalizeImageField(item.MilestoneImage, item.Id, "Histoire", this._hubUrl)
          : undefined,
      }));
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

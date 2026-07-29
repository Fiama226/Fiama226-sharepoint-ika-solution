import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

import {
  IAnnouncement,
  ICollaborateur,
  ICompanyInfo,
  IDepartement,
  IDocumentItem,
  IEventItem,
  IFaqItem,
  IHeroSlide,
  IIndicator,
  IMission,
  INewsItem,
  IOrgNode,
  IProject,
  IQuickLink,
  ISiteSetting,
} from "../models/IIkaModels";

const CACHE_PREFIX = "ika.cache.";
const DEFAULT_TTL_MS = 5 * 60 * 1000;

interface ICacheEntry<T> {
  expires: number;
  payload: T;
}

export interface ISPRequestContext {
  spHttpClient: SPHttpClient;
  pageContext: {
    web: { absoluteUrl: string };
    legacyPageContext?: unknown;
  };
}

export class DataService {
  private readonly _context: ISPRequestContext;
  private readonly _webUrl: string;
  private readonly _hubUrl: string;

  public constructor(context: ISPRequestContext, hubUrl?: string) {
    this._context = context;
    this._webUrl = context.pageContext.web.absoluteUrl;
    this._hubUrl = hubUrl || this._resolveHubUrl();
  }

  private _resolveHubUrl(): string {
    const legacy = this._context.pageContext.legacyPageContext as
      | { hubSiteId?: string }
      | undefined;

    if (!legacy || !legacy.hubSiteId) {
      return this._webUrl;
    }

    const origin = new URL(this._webUrl).origin;
    return `${origin}/sites/ika-intranet`;
  }

  private _readCache<T>(key: string): T | undefined {
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

  public async getNews(top: number = 4): Promise<INewsItem[]> {
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

    const endpoint =
      `lists/getByTitle('Actualites')/items` +
      `?$select=${select}&$expand=NewsAuthor` +
      `&$orderby=Highlighted desc,PublishDate desc&$top=${top}`;

    return this._get<INewsItem>(this._webUrl, endpoint, `news.${top}`);
  }

  public async getDocuments(top: number = 10): Promise<IDocumentItem[]> {
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
      `lists/getByTitle('Documents')/items` +
      `?$select=${select}&$expand=Editor` +
      `&$filter=FSObjType eq 0&$orderby=Modified desc&$top=${top}`;

    return this._get<IDocumentItem>(this._webUrl, endpoint, `docs.${top}`);
  }

  public async getEvents(top: number = 5): Promise<IEventItem[]> {
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

    return this._get<IEventItem>(this._webUrl, endpoint, `events.${top}`);
  }

  public async getQuickLinks(): Promise<IQuickLink[]> {
    const endpoint =
      `lists/getByTitle('LiensRapides')/items` +
      `?$select=Id,Title,LinkUrl,LinkDescription,IconName,SortOrder,OpenInNewTab,LinkGroup,IsActive,Created,Modified` +
      `&$filter=IsActive eq 1&$orderby=SortOrder asc&$top=50`;

    return this._get<IQuickLink>(this._webUrl, endpoint, "quicklinks");
  }

  public async getDepartements(): Promise<IDepartement[]> {
    const endpoint =
      `lists/getByTitle('Departements')/items` +
      `?$select=Id,Title,Slug,Tagline,DeptDescription,HeroTitle,HeroSubtitle,Accent,IconName,SiteUrl,AccentClasses,BadgeClasses,MemberCount,SortOrder,Created,Modified` +
      `&$orderby=SortOrder asc&$top=20`;

    return this._get<IDepartement>(
      this._hubUrl,
      endpoint,
      "departements",
      30 * 60 * 1000
    );
  }

  public async getAnnouncements(): Promise<IAnnouncement[]> {
    const today = new Date().toISOString();
    const endpoint =
      `lists/getByTitle('Annonces')/items` +
      `?$select=Id,Title,AnnouncementType,Detail,Emoji,AnnouncementDate,DisplayUntil,Priority,Created,Modified` +
      `&$filter=DisplayUntil ge datetime'${today}'` +
      `&$orderby=Priority desc,AnnouncementDate asc&$top=20`;

    return this._get<IAnnouncement>(this._hubUrl, endpoint, "announcements");
  }

  public async getProjects(onHomeOnly: boolean = true): Promise<IProject[]> {
    const filter = onHomeOnly ? "&$filter=ShowOnHome eq 1" : "";
    const endpoint =
      `lists/getByTitle('Projets')/items` +
      `?$select=Id,Title,ProjectLead,Progress,ProjectStatus,DueDate,TasksDone,TasksTotal,ShowOnHome,SortOrder,Created,Modified` +
      `${filter}&$orderby=SortOrder asc&$top=20`;

    return this._get<IProject>(this._hubUrl, endpoint, `projects.${onHomeOnly}`);
  }

  public async getHeroSlides(): Promise<IHeroSlide[]> {
    const endpoint =
      `lists/getByTitle('HeroSlides')/items` +
      `?$select=Id,Title,FileRef,Caption,SubCaption,SlideLink,CtaLabel,SortOrder,IsActive,AltText,Created,Modified` +
      `&$filter=IsActive eq 1&$orderby=SortOrder asc&$top=10`;

    return this._get<IHeroSlide>(this._hubUrl, endpoint, "heroslides");
  }

  public async getMissions(): Promise<IMission[]> {
    const endpoint =
      `lists/getByTitle('Missions')/items` +
      `?$select=Id,Title,Tag,MissionText,IconName,MissionType,ColorClass,BgClass,SortOrder,Created,Modified` +
      `&$orderby=SortOrder asc&$top=20`;

    return this._get<IMission>(this._hubUrl, endpoint, "missions", 30 * 60 * 1000);
  }

  public async getIndicators(
    placement: "Hero accueil" | "Page histoire"
  ): Promise<IIndicator[]> {
    const endpoint =
      `lists/getByTitle('Indicateurs')/items` +
      `?$select=Id,Title,StatValue,IconName,Placement,SortOrder,IsActive,Created,Modified` +
      `&$filter=IsActive eq 1 and (Placement eq '${placement}' or Placement eq 'Les deux')` +
      `&$orderby=SortOrder asc&$top=20`;

    return this._get<IIndicator>(this._hubUrl, endpoint, `indicators.${placement}`);
  }

  public async getCollaborateurs(
    division?: string
  ): Promise<ICollaborateur[]> {
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

    return this._get<ICollaborateur>(
      this._hubUrl,
      endpoint,
      `collaborateurs.${division || "all"}`
    );
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

  public async getFaq(category?: string): Promise<IFaqItem[]> {
    const categoryFilter = category
      ? ` and FaqCategory eq '${category.replace(/'/g, "''")}'`
      : "";

    const endpoint =
      `lists/getByTitle('FAQ')/items` +
      `?$select=Id,Title,Answer,FaqCategory,SortOrder,IsActive,ViewCount,Created,Modified` +
      `&$filter=IsActive eq 1${categoryFilter}` +
      `&$orderby=SortOrder asc&$top=100`;

    return this._get<IFaqItem>(
      this._hubUrl,
      endpoint,
      `faq.${category || "all"}`
    );
  }

  public async getCompanyInfo(): Promise<ICompanyInfo> {
    const endpoint =
      `lists/getByTitle('ParametresSite')/items` +
      `?$select=Id,Title,SettingValue,SettingCategory,Created,Modified&$top=100`;

    const items = await this._get<ISiteSetting>(
      this._hubUrl,
      endpoint,
      "settings",
      30 * 60 * 1000
    );

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
      copyrightYears: map["company.copyrightYears"] || "",
      social: {
        facebook: map["social.facebook"],
        linkedin: map["social.linkedin"],
        twitter: map["social.twitter"],
        instagram: map["social.instagram"],
        whatsapp: map["social.whatsapp"],
      },
    };
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

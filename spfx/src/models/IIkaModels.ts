export type DepartementSlug =
  | "comptabilite"
  | "administration"
  | "commerciaux"
  | "techniciens"
  | "direction";

export type Scope = "global" | DepartementSlug;

export interface ISPImageField {
  serverUrl?: string;
  serverRelativeUrl?: string;
  fileName?: string;
}

export interface ISPUrlField {
  Url: string;
  Description?: string;
}

export interface ISPUserField {
  Id: number;
  Title: string;
  EMail?: string;
}

export interface ISPLookupField {
  Id: number;
  Title: string;
}

export interface IListItemBase {
  Id: number;
  Title: string;
  Created: string;
  Modified: string;
}

export type NewsCategory =
  | "Entreprise"
  | "RH"
  | "Projet"
  | "Finance"
  | "Administration"
  | "Commercial"
  | "Technique"
  | "Événement"
  | "DevOps"
  | "Formation"
  | "Cybersécurité"
  | "Innovation";

export interface INewsItem extends IListItemBase {
  Excerpt: string;
  Body?: string;
  Category: NewsCategory;
  NewsAuthor?: ISPUserField;
  PublishDate: string;
  HeaderImage?: ISPImageField;
  Highlighted: boolean;
  ExternalLink?: ISPUrlField;
  SortOrder?: number;
}

export type DocConfidentiality = "Public" | "Interne" | "Confidentiel";

export interface IDocumentItem extends IListItemBase {
  FileLeafRef: string;
  FileRef: string;
  FileSizeDisplay?: string;
  DocIcon?: string;
  DocCategory: string;
  DocDescription?: string;
  Confidentiality: DocConfidentiality;
  ExpiryDate?: string;
  DocOwner?: ISPUserField;
  IsPinned: boolean;
  BusinessVersion?: string;
  Editor?: ISPUserField;
}

export interface IEventItem extends IListItemBase {
  EventDate: string;
  EndDate: string;
  fAllDayEvent: boolean;
  Location?: string;
  EventCategory: string;
  EventDescription?: string;
  EventImage?: ISPImageField;
  RegistrationLink?: ISPUrlField;
  Organizer?: ISPUserField;
  IsMandatory: boolean;
}

export interface IQuickLink extends IListItemBase {
  LinkUrl: ISPUrlField;
  LinkDescription?: string;
  IconName: string;
  SortOrder: number;
  OpenInNewTab: boolean;
  LinkGroup?: string;
  IsActive: boolean;
}

export interface IDepartement extends IListItemBase {
  Slug: DepartementSlug;
  Tagline: string;
  DeptDescription: string;
  HeroTitle: string;
  HeroSubtitle: string;
  Accent: "navy" | "cyan";
  IconName: string;
  SiteUrl: ISPUrlField;
  AccentClasses?: string;
  BadgeClasses?: string;
  MemberCount?: number;
  SortOrder: number;
}

export type Division =
  | "Direction Générale"
  | "Engineering"
  | "Ventes & Marketing"
  | "Comptabilité"
  | "Administration"
  | "Support Technique";

export interface ICollaborateur extends IListItemBase {
  UserAccount?: ISPUserField;
  JobTitle: string;
  Department?: ISPLookupField;
  Email: string;
  Phone?: string;
  OfficeLocation?: string;
  Birthdate?: string;
  Photo?: ISPImageField;
  Manager?: ISPLookupField;
  HierarchyLevel: number;
  Division: Division;
  LinkedInUrl?: ISPUrlField;
  HireDate?: string;
  IsActive: boolean;
  SortOrder?: number;
}

export interface IOrgNode extends ICollaborateur {
  children: IOrgNode[];
}

export type AnnouncementType =
  | "Mariage"
  | "Anniversaire"
  | "Naissance"
  | "Événement"
  | "Départ"
  | "Arrivée"
  | "Promotion";

export interface IAnnouncement extends IListItemBase {
  AnnouncementType: AnnouncementType;
  Detail: string;
  Emoji?: string;
  AnnouncementDate: string;
  DisplayUntil: string;
  RelatedPerson?: ISPLookupField;
  Priority?: "Normale" | "Haute";
}

export type ProjectStatus = "À l'heure" | "À risque" | "En retard" | "Terminé";

export interface IProject extends IListItemBase {
  ProjectLead: string;
  ProjectManager?: ISPUserField;
  Progress: number;
  ProjectStatus: ProjectStatus;
  DueDate: string;
  TasksDone: number;
  TasksTotal: number;
  Department?: ISPLookupField;
  ShowOnHome: boolean;
  SortOrder?: number;
}

export interface IGalleryImage extends IListItemBase {
  FileLeafRef: string;
  FileRef: string;
  Caption: string;
  GalleryCategory: string;
  PhotoDate?: string;
  IsFeatured: boolean;
  AltText: string;
  SortOrder?: number;
}

export interface IEmployeeOfMonth extends IListItemBase {
  Employee: ISPLookupField;
  DisplayRole: string;
  Department: ISPLookupField;
  Quote: string;
  NominatedBy: string;
  Photo?: ISPImageField;
  PeriodStart: string;
  IsCurrent: boolean;
}

export interface IHeroSlide extends IListItemBase {
  FileRef: string;
  Caption: string;
  SubCaption: string;
  SlideLink?: ISPUrlField;
  CtaLabel?: string;
  SortOrder: number;
  IsActive: boolean;
  StartDate?: string;
  EndDate?: string;
  AltText: string;  AttachmentFiles?: Array<{ FileName?: string; ServerRelativeUrl?: string; ServerUrl?: string }>;}

export interface IMission extends IListItemBase {
  Tag: string;
  MissionText: string;
  IconName: string;
  MissionType: "Mission" | "Vision" | "Valeur";
  ColorClass?: string;
  BgClass?: string;
  SortOrder: number;
}

export interface IIndicator extends IListItemBase {
  StatValue: string;
  IconName: string;
  Placement: "Hero accueil" | "Page histoire" | "Les deux";
  SortOrder: number;
  IsActive: boolean;
}

export interface IMilestone extends IListItemBase {
  Year: string;
  Quarter?: "T1" | "T2" | "T3" | "T4";
  MilestoneDescription: string;
  MilestoneImage?: ISPImageField;
  IconName: string;
  Tag: string;
  TagColorClass?: string;
  Side: "left" | "right";
  Stat1Label?: string;
  Stat1Value?: string;
  Stat2Label?: string;
  Stat2Value?: string;
  SortOrder: number;
}

export interface IOrgDirection extends IListItemBase {
  IconName: string;
  ColorClass?: string;
  BgColorClass?: string;
  BorderColorClass?: string;
  GradientFrom?: string;
  GradientTo?: string;
  Department?: ISPLookupField;
  SortOrder: number;
}

export type QuoteStatus =
  | "Brouillon"
  | "Envoyé"
  | "Accepté"
  | "Refusé"
  | "Expiré";

export interface IPriceSheet extends IListItemBase {
  ClientName: string;
  Subject: string;
  IssueDate: string;
  ValidUntil?: string;
  QuoteStatus: QuoteStatus;
  SubmissionAmount?: number;
  TotalHT?: number;
  VatRate: number;
  VatAmount?: number;
  TotalTTC?: number;
  CurrencyCode: "XOF" | "EUR" | "USD";
  SalesRep?: ISPUserField;
}

export interface IPriceSheetLine extends IListItemBase {
  Quote: ISPLookupField;
  LineDescription: string;
  DeliveryDate?: string;
  Quantity: number;
  UnitPrice: number;
  LineTotal?: number;
  SortOrder: number;
}

export interface ISiteSetting extends IListItemBase {
  SettingValue: string;
  SettingDescription?: string;
  SettingCategory: string;
}

export interface IFaqItem extends IListItemBase {
  Answer: string;
  FaqCategory: string;
  Department?: ISPLookupField;
  SortOrder: number;
  IsActive: boolean;
  ViewCount?: number;
}

export interface IFinanceData extends IListItemBase {
  SeriesType: string;
  Amount: number;
  FiscalYear: number;
  FiscalMonth?: number;
  FiscalQuarter?: "T1" | "T2" | "T3" | "T4";
  CurrencyCode: string;
  SortOrder: number;
}

export interface ICompanyInfo {
  name: string;
  tagline: string;
  legalName: string;
  address: string;
  email: string;
  phone: string;
  copyrightYears: string;
  social: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    whatsapp?: string;
  };
}

export interface IDataState<T> {
  loading: boolean;
  error?: string;
  data: T;
}

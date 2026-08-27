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

export interface IComment extends IListItemBase {
  CommentText: string;
  NewsItem: ISPLookupField;
  /** Champ système SharePoint (créateur de l'élément), rempli automatiquement. */
  Author?: ISPUserField;
}

export type DocConfidentiality = "Public" | "Interne" | "Confidentiel";

export interface IDocumentItem extends IListItemBase {
  FileLeafRef: string;
  FileRef: string;
  FileSizeDisplay?: string;
  DocIcon?: string;
  /** 0 = fichier, 1 = dossier (champ standard SharePoint FSObjType). */
  FSObjType?: number;
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

/**
 * Entrée unifiée de l'agenda. Une même liste mélange les événements
 * d'entreprise (liste SharePoint `Evenements`) et les rendez-vous Outlook
 * personnels remontés par Microsoft Graph, d'où le discriminant `Source`.
 */
export interface ICalendarEntry {
  Id: string;
  Title: string;
  /** ISO 8601. Pour une journée entière, l'heure est ignorée à l'affichage. */
  Start: string;
  End: string;
  IsAllDay: boolean;
  Location?: string;
  Organizer?: string;
  Category?: string;
  IsMandatory?: boolean;
  WebLink?: string;
  Source: "outlook" | "sharepoint";
}

export type BusyStatus =
  | "free"
  | "tentative"
  | "busy"
  | "oof"
  | "workingElsewhere"
  | "unknown";

export interface IBusySlot {
  Start: string;
  End: string;
  Status: BusyStatus;
}

/**
 * Disponibilité d'un collègue sur la fenêtre interrogée. `Slots` est vide
 * lorsque la personne n'a rien partagé : c'est un cas normal, pas une erreur.
 */
export interface ITeamMemberBusy {
  Email: string;
  DisplayName: string;
  Slots: IBusySlot[];
  /** Vrai quand Graph a refusé de renvoyer la disponibilité de cette personne. */
  Denied?: boolean;
}

/** Charge utile renvoyée par le chargement de l'agenda. */
export interface IAgendaPayload {
  entries: ICalendarEntry[];
  team: ITeamMemberBusy[];
  /**
   * Faux quand le calendrier Outlook n'a pas pu être lu : `entries` ne
   * contient alors que les événements d'entreprise. Ce n'est pas une erreur
   * à afficher, seulement un mode dégradé silencieux.
   */
  personalConnected: boolean;
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

/* ------------------------------------------------------------------------ */
/* Recherche globale                                                         */
/* ------------------------------------------------------------------------ */

/**
 * Onglets de la page de résultats. `tout` n'est PAS un appel distinct : c'est
 * la vue SharePoint (fichiers/dossiers/pages/actualités/sites), qui est la
 * seule à pouvoir mélanger plusieurs types dans une même requête.
 *
 * `emails` et `messages` passent par Microsoft Graph, qui interdit de combiner
 * `message` / `chatMessage` avec les types SharePoint : ce sont donc forcément
 * deux appels séparés, d'où deux onglets séparés.
 */
export type SearchVertical =
  | "tout"
  | "fichiers"
  | "personnes"
  | "emails"
  | "messages";

export type SearchResultKind =
  | "file"
  | "folder"
  | "page"
  | "news"
  | "listItem"
  | "site"
  | "person"
  | "email"
  | "chat";

export interface ISearchResult {
  /** Clé de rendu React. Path SharePoint ou hitId Graph : unique par source. */
  id: string;
  kind: SearchResultKind;
  title: string;
  url: string;
  /**
   * Extrait avec surlignage, DÉJÀ assaini (`sanitizeHtml`) et dont les balises
   * propriétaires `<c0>` / `<ddd/>` ont été converties en `<mark>` / `…`.
   * Destiné à `dangerouslySetInnerHTML` — ne jamais y réinjecter de brut.
   */
  summary?: string;
  author?: string;
  /** ISO 8601. */
  modified?: string;
  siteTitle?: string;
  fileExtension?: string;
  sizeBytes?: number;
}

export interface ISearchResponse {
  results: ISearchResult[];
  total: number;
  moreAvailable: boolean;
  vertical: SearchVertical;
  /**
   * Renseigné quand la verticale est indisponible plutôt qu'en erreur — cas
   * nominal tant que l'administrateur n'a pas approuvé `Mail.Read` / `Chat.Read`.
   * L'UI masque alors l'onglet au lieu d'afficher une erreur.
   */
  degraded?: string;
}

/* ───────────────────────────────────────────────────────────────────────────
 * Vue générique « liste SharePoint en tableau »
 *
 * Contrairement à toutes les autres listes du portail, `Fournisseurs` et
 * `Equipements` n'ont pas de modèle métier figé : leurs colonnes sont
 * découvertes à l'exécution depuis le schéma de la liste. Ajouter ou retirer
 * une colonne dans SharePoint ne demande donc aucune recompilation.
 * ────────────────────────────────────────────────────────────────────────── */

export type ListColumnKind =
  | "text"
  | "note"
  | "number"
  | "currency"
  | "percent"
  | "date"
  | "datetime"
  | "boolean"
  | "choice"
  | "multichoice"
  | "lookup"
  | "lookupmulti"
  | "user"
  | "usermulti"
  | "url"
  | "image"
  | "taxonomy"
  | "calculated";

export interface IListColumn {
  /** Nom interne SharePoint : clé d'accès dans `IListRow`. */
  internalName: string;
  /** `SP.Field.Title`, déjà dans la langue du site. */
  displayName: string;
  kind: ListColumnKind;
  /** `TypeAsString` d'origine, conservé pour le diagnostic. */
  spType: string;
  /** `SP.FieldLookup.LookupField` : la colonne projetée n'est pas toujours `Title`. */
  lookupField?: string;
  /** Aligne à droite et active `tabular-nums`. */
  numeric: boolean;
  /** Code ISO déduit de `CurrencyLocaleId` (défaut `XOF`). */
  currencyCode?: string;
}

/**
 * Une ligne de liste. Les clés sont les noms internes des colonnes découvertes,
 * d'où l'index signature : le typage fort est impossible par construction.
 */
export interface IListRow {
  Id: number;
  [internalName: string]: unknown;
}

export interface IListTableData {
  listTitle: string;
  columns: IListColumn[];
  rows: IListRow[];
  /** Contenu de démonstration (Workbench ou `?useMocks=1`), jamais un repli d'erreur. */
  isDemo: boolean;
  /** Message utilisateur en français ; `undefined` quand tout s'est bien passé. */
  error?: string;
  /** `$top` a coupé le résultat. */
  truncated: boolean;
  /** Nombre de colonnes avant plafonnement à `MAX_COLUMNS`. */
  totalColumns: number;
}

/**
 * Sous-ensemble de `SP.Field`, plus les propriétés portées par ses sous-types
 * (`SP.FieldLookup`, `SP.FieldCurrency`, `SP.FieldNumber`...). Toutes optionnelles :
 * `/fields` renvoie une collection hétérogène, et un `$select` sur une propriété
 * absente du type de base y répond 400.
 */
export interface ISPFieldSchema {
  InternalName: string;
  Title: string;
  TypeAsString: string;
  Hidden: boolean;
  ReadOnlyField: boolean;
  Required?: boolean;
  /** `SP.FieldLookup` */
  LookupField?: string;
  AllowMultipleValues?: boolean;
  /** `SP.FieldCurrency` */
  CurrencyLocaleId?: number;
  /** `SP.FieldNumber` */
  ShowAsPercentage?: boolean;
  /** `SP.FieldDateTime` : 0 = date seule, 1 = date et heure. */
  DisplayFormat?: number;
  /** `SP.FieldMultiLineText` */
  RichText?: boolean;
  /** `SP.FieldCalculated` */
  OutputType?: number;
}

import { ICompanyInfo, ISearchResponse } from "./IIkaModels";

export interface INavNode {
  key: string;
  label: string;
  url: string;
  iconName: string;
  children?: INavNode[];
}

export interface ICurrentUser {
  displayName: string;
  email: string;
  loginName: string;
  photoUrl: string;
  isSiteAdmin: boolean;
}

export interface IChromeContext {
  currentUser: ICurrentUser;
  currentPath: string;
  hubUrl: string;
  siteUrl: string;
  logoUrl: string;
}

export interface IIkaHeaderProps {
  context: IChromeContext;
  primaryNav: INavNode[];
  secondaryNav: INavNode[];
  showSearch: boolean;
  showDocumentsMenu: boolean;
  documentsNav: INavNode[];
  /**
   * Fournit les suggestions du menu déroulant de recherche.
   *
   * OPTIONNEL : sans ce callback l'en-tête conserve son comportement
   * historique — soumettre redirige vers la recherche native SharePoint.
   * C'est ce qui permet de brancher le menu déroulant sur le portail sans
   * toucher aux pages où l'en-tête est injecté par l'extension.
   */
  onSearch?: (term: string) => Promise<ISearchResponse>;
}

export interface IIkaFooterProps {
  company?: ICompanyInfo;
  description: string;
  logoUrl: string;
}

export type ChromeNavigationSource = "hub" | "list" | "static";

export interface IIkaChromeProperties {
  navigationSource: ChromeNavigationSource;
  showFooter: boolean;
  showSearch: boolean;
  showDocumentsMenu: boolean;
  footerDescription: string;
}

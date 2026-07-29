import { SPHttpClient } from "@microsoft/sp-http";
import { Version } from "@microsoft/sp-core-library";
import { IPropertyPaneConfiguration } from "@microsoft/sp-property-pane";
export interface WebPartContext {
  spHttpClient: SPHttpClient;
  pageContext: {
    web: { absoluteUrl: string; serverRelativeUrl: string };
    user: { displayName: string; email: string; loginName: string };
    legacyPageContext?: unknown;
  };
}
export declare abstract class BaseClientSideWebPart<TProps> {
  protected context: WebPartContext;
  protected properties: TProps;
  protected domElement: HTMLElement;
  protected onInit(): Promise<void>;
  protected onDispose(): void;
  protected get dataVersion(): Version;
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
  abstract render(): void;
}

import { SPHttpClient } from "@microsoft/sp-http";
export declare enum PlaceholderName { Top = 0, Bottom = 1 }
export interface PlaceholderContent { domElement: HTMLElement; dispose(): void; }
export interface ApplicationCustomizerContext {
  spHttpClient: SPHttpClient;
  application: unknown;
  pageContext: {
    web: { absoluteUrl: string; serverRelativeUrl: string };
    user: { displayName: string; email: string; loginName: string };
    legacyPageContext?: unknown;
  };
  placeholderProvider: {
    tryCreateContent(n: PlaceholderName, o?: { onDispose?: () => void }): PlaceholderContent | undefined;
    changedEvent: {
      add(scope: unknown, handler: () => void): void;
      remove(scope: unknown, handler: () => void): void;
    };
  };
}
export declare abstract class BaseApplicationCustomizer<TProps> {
  protected context: ApplicationCustomizerContext;
  protected properties: TProps;
  protected onDispose(): void;
  onInit(): Promise<void>;
}

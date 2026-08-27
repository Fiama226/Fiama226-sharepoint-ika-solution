export interface SPHttpClientResponse {
  ok: boolean; status: number; json(): Promise<unknown>;
}
export declare class SPHttpClient {
  static configurations: { v1: unknown };
  get(url: string, cfg: unknown, opts?: unknown): Promise<SPHttpClientResponse>;
  post(url: string, cfg: unknown, opts?: unknown): Promise<SPHttpClientResponse>;
}

/** Sous-ensemble de l'API fluent Graph réellement utilisé par SearchService. */
export interface GraphRequest {
  post(content: unknown): Promise<unknown>;
  get(): Promise<unknown>;
  /** Chaînables, comme dans @microsoft/microsoft-graph-client. */
  header(headerKey: string, headerValue: string): GraphRequest;
  query(
    queryDictionaryOrString: string | { [key: string]: string | number }
  ): GraphRequest;
}
export declare class MSGraphClientV3 {
  api(path: string): GraphRequest;
}
export declare class MSGraphClientFactory {
  getClient(version: "3"): Promise<MSGraphClientV3>;
}

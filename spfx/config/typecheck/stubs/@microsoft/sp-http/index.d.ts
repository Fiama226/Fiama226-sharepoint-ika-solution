export interface SPHttpClientResponse {
  ok: boolean; status: number; json(): Promise<unknown>;
}
export declare class SPHttpClient {
  static configurations: { v1: unknown };
  get(url: string, cfg: unknown, opts?: unknown): Promise<SPHttpClientResponse>;
  post(url: string, cfg: unknown, opts?: unknown): Promise<SPHttpClientResponse>;
}

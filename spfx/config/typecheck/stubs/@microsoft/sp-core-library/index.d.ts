export declare class Version { static parse(v: string): Version; }
export declare class Log {
  static warn(source: string, message: string): void;
  static error(source: string, error: Error): void;
  static info(source: string, message: string): void;
}

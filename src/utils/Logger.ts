/**
 * src/utils/Logger.ts
 * ────────────────────
 * Lightweight structured logger.
 * Swap to Winston/Pino by replacing this file only.
 */

export enum LogLevel {
  DEBUG = "DEBUG",
  INFO  = "INFO",
  WARN  = "WARN",
  ERROR = "ERROR",
}

export class Logger {
  constructor(private readonly context: string) {}

  private fmt(level: LogLevel, msg: string): string {
    return `[${new Date().toISOString()}] [${level}] [${this.context}] ${msg}`;
  }

  debug(msg: string): void {
    if (process.env.LOG_LEVEL === "debug") console.debug(this.fmt(LogLevel.DEBUG, msg));
  }

  info(msg: string): void {
    console.info(this.fmt(LogLevel.INFO, msg));
  }

  warn(msg: string): void {
    console.warn(this.fmt(LogLevel.WARN, msg));
  }

  error(msg: string): void {
    console.error(this.fmt(LogLevel.ERROR, msg));
  }

  async action<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.debug(`→ ${name}`);
    const result = await fn();
    this.debug(`✓ ${name}`);
    return result;
  }
}

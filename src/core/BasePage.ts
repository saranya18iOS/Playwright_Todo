/**
 * src/core/BasePage.ts
 * ─────────────────────
 * Abstract base every Page Object extends.
 * Enforces:
 *  - pageUrl  : canonical URL for the page
 *  - waitForLoad() : each page defines its own readiness signal
 * Provides:
 *  - navigate(), reload() shared helpers
 *  - Logger scoped to the concrete class name
 */

import { Logger } from "../utils/Logger";
import { type Driver } from "./Driver";

export abstract class BasePage {
  protected readonly log: Logger;

  constructor(protected readonly driver: Driver) {
    this.log = new Logger(this.constructor.name);
  }

  /** Canonical URL — used by navigate() */
  protected abstract readonly pageUrl: string;

  /** Concrete page defines when it is ready to interact with */
  abstract waitForLoad(): Promise<void>;

  async navigate(): Promise<void> {
    this.log.info(`Navigating to ${this.pageUrl}`);
    await this.driver.navigateTo(this.pageUrl);
    await this.waitForLoad();
    this.log.info("Page ready");
  }

  async reload(): Promise<void> {
    this.log.info("Reloading");
    await this.driver.reload();
    await this.waitForLoad();
  }

  async currentUrl(): Promise<string> {
    return this.driver.page.url();
  }

  async title(): Promise<string> {
    return this.driver.page.title();
  }
}

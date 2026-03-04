/**
 * src/core/Driver.ts
 * ───────────────────
 * Thin wrapper around Playwright's Page.
 *
 * Why a Driver layer?
 *  1. Single place for waitFor, logging, and timeout handling
 *  2. Pages and components depend on Driver — never on raw Page directly
 *  3. Swap underlying engine (e.g. WebDriver) by changing this file only
 */

import { type Page, type Locator } from "@playwright/test";
import { Logger } from "../utils/Logger";
import { type DriverOptions } from "../types/Todo";

export class Driver {
  private readonly log = new Logger("Driver");
  readonly page: Page;

  constructor(page: Page, options: DriverOptions = {}) {
    this.page = page;
    if (options.actionTimeout)     page.setDefaultTimeout(options.actionTimeout);
    if (options.navigationTimeout) page.setDefaultNavigationTimeout(options.navigationTimeout);
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  async navigateTo(url: string): Promise<void> {
    await this.log.action(`navigateTo(${url})`, async () => {
      await this.page.goto(url);
      await this.page.waitForLoadState("networkidle");
    });
  }

  async reload(): Promise<void> {
    await this.log.action("reload", async () => {
      await this.page.reload();
      await this.page.waitForLoadState("networkidle");
    });
  }

  // ── Interactions ───────────────────────────────────────────────────────────

  async fill(locator: Locator, text: string): Promise<void> {
    await this.log.action(`fill("${text}")`, async () => {
      await locator.fill(text);
    });
  }

  async press(locator: Locator, key: string): Promise<void> {
    await this.log.action(`press(${key})`, async () => {
      await locator.press(key);
    });
  }

  async click(locator: Locator): Promise<void> {
    await this.log.action("click", async () => {
      await locator.click();
    });
  }

  async doubleClick(locator: Locator): Promise<void> {
    await this.log.action("doubleClick", async () => {
      await locator.dblclick();
    });
  }

  async hover(locator: Locator): Promise<void> {
    await this.log.action("hover", async () => {
      await locator.hover();
    });
  }

  /** fill + Enter in one call */
  async typeAndConfirm(locator: Locator, text: string): Promise<void> {
    await this.fill(locator, text);
    await this.press(locator, "Enter");
  }

  // ── Queries ────────────────────────────────────────────────────────────────

  async getText(locator: Locator): Promise<string> {
    return locator.innerText();
  }

  async getAllTexts(locator: Locator): Promise<string[]> {
    return locator.allInnerTexts();
  }

  async count(locator: Locator): Promise<number> {
    return locator.count();
  }

  async getAttribute(locator: Locator, attr: string): Promise<string | null> {
    return locator.getAttribute(attr);
  }

  async hasClass(locator: Locator, className: string): Promise<boolean> {
    const cls = (await locator.getAttribute("class")) ?? "";
    return cls.includes(className);
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  // ── Locator factories ──────────────────────────────────────────────────────

  locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  getByPlaceholder(text: string): Locator {
    return this.page.getByPlaceholder(text);
  }

  getByRole(
    role: Parameters<Page["getByRole"]>[0],
    options?: Parameters<Page["getByRole"]>[1]
  ): Locator {
    return this.page.getByRole(role, options);
  }

  getByText(text: string, options?: { exact?: boolean }): Locator {
    return this.page.getByText(text, options);
  }
}

/**
 * src/core/DriverFactory.ts
 * ──────────────────────────
 * Creates Driver instances using environment-driven configuration.
 * Tests and fixtures call DriverFactory.create(page) — never new Driver() directly.
 */

import { type Page } from "@playwright/test";
import { Driver } from "./Driver";
import { type DriverOptions } from "../types/Todo";
import { currentEnv } from "../../config/environments";
import { Logger } from "../utils/Logger";

const log = new Logger("DriverFactory");

export class DriverFactory {
  static create(page: Page, overrides: DriverOptions = {}): Driver {
    const options: DriverOptions = {
      actionTimeout:     currentEnv.actionTimeout,
      navigationTimeout: currentEnv.navigationTimeout,
      slowMo:            Number(process.env.SLOW_MO) || 0,
      ...overrides,
    };

    log.debug(
      `Creating Driver [env=${currentEnv.name}, ` +
      `actionTimeout=${options.actionTimeout}ms, ` +
      `navTimeout=${options.navigationTimeout}ms]`
    );

    return new Driver(page, options);
  }
}

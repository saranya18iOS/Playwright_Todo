import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";
import { currentEnv } from "./config/environments";

dotenv.config();

export default defineConfig({
  testDir:       "./tests/specs",
  testMatch:     "**/*.spec.ts",
  testIgnore:    "**/todo-filter.spec.ts",
  fullyParallel: false,
  workers:       1,
  retries:       process.env.CI ? 2 : 0,
  timeout:       60_000,

  // ── Reporters ─────────────────────────────────────────────────────────────
  reporter: [
    ["list"],
    ["html",  { outputFolder: "reports/html",         open: "never" }],
    ["json",  { outputFile:   "reports/results.json"               }],
  ],

  // ── Global settings (driven by environment config) ─────────────────────────
  use: {
    baseURL:           currentEnv.baseUrl,
    headless:          process.env.HEADLESS == "true",
    screenshot:        "only-on-failure",
    video:             "retain-on-failure",
    trace:             "on-first-retry",
    actionTimeout:     currentEnv.actionTimeout,
    navigationTimeout: currentEnv.navigationTimeout,
  },

  // ── Projects ───────────────────────────────────────────────────────────────
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"]  } },
    // { name: "firefox",  use: { ...devices["Desktop Firefox"] } },
    // { name: "webkit",   use: { ...devices["Desktop Safari"]  } },
  ],

  outputDir: "test-results",
});

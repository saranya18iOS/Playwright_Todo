/**
 * config/environments.ts
 * ───────────────────────
 * Environment configuration.
 * Set BASE_URL env var to switch environments without touching test code.
 *
 * Usage:
 *   BASE_URL=https://staging.example.com npx playwright test
 *   npm run test:staging
 */

export interface Environment {
  name:              string;
  baseUrl:           string;
  actionTimeout:     number;
  navigationTimeout: number;
}

const environments: Record<string, Environment> = {
  dev: {
    name:              "development",
    baseUrl:           "https://demo.playwright.dev/todomvc",
    actionTimeout:     10_000,
    navigationTimeout: 30_000,
  },
  staging: {
    name:              "staging",
    baseUrl:           "https://staging.demo.playwright.dev/todomvc",
    actionTimeout:     15_000,
    navigationTimeout: 45_000,
  },
  prod: {
    name:              "production",
    baseUrl:           "https://demo.playwright.dev/todomvc",
    actionTimeout:     20_000,
    navigationTimeout: 60_000,
  },
};

function resolveEnvironment(): Environment {
  // Allow full URL override via BASE_URL, or pick named env via ENV
  const baseUrlOverride = process.env.BASE_URL;
  const envName         = process.env.ENV ?? "dev";

  const env = environments[envName] ?? environments.dev;

  if (baseUrlOverride) {
    return { ...env, baseUrl: baseUrlOverride };
  }

  return env;
}

export const currentEnv: Environment = resolveEnvironment();

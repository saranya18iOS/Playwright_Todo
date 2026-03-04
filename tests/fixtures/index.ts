/**
 * tests/fixtures/index.ts
 * ────────────────────────
 * Custom Playwright fixtures.  Import { test, expect } from this file in all specs.
 *
 * Fixture design decisions:
 *  - driver    : test-scoped  (fresh Driver per test via DriverFactory)
 *  - todoPage  : test-scoped  (fresh navigated page per test)
 *  - *Todos    : worker-scoped (MCP called once per worker, not per test)
 *
 * Data isolation: each spec receives its own copy of the MCP data array via
 * spread ([...workTodos]) so mutations in one test cannot affect another.
 */

import { test as base, expect } from "@playwright/test";
import { DriverFactory }        from "../../src/core/DriverFactory";
import { TodoPage }             from "../../src/pages/TodoPage";
import { getWorkTodos, getPersonalTodos, getMixedTodos }
  from "../../src/utils/McpDataGenerator";
import type { Driver } from "../../src/core/Driver";

type AppFixtures = {
  driver:        Driver;
  todoPage:      TodoPage;
  workTodos:     string[];
  personalTodos: string[];
  mixedTodos:    string[];
};

export const test = base.extend<AppFixtures>({

  // Test-scoped: new Driver for every test
  driver: async ({ page }, use) => {
    await use(DriverFactory.create(page));
  },

  // Test-scoped: fresh navigated TodoPage per test, depends on driver
  todoPage: async ({ driver }, use) => {
    const tp = new TodoPage(driver);
    await tp.navigate();
    await use(tp);
  },

  // Test-scoped: MCP data generated for each test
  workTodos: async ({}, use) => {
    await use([...await getWorkTodos(3)]);
  },

  personalTodos: async ({}, use) => {
    await use([...await getPersonalTodos(3)]);
  },

  mixedTodos: async ({}, use) => {
    await use([...await getMixedTodos(5)]);
  },
});

export { expect };

# TodoMVC — Enterprise Playwright TypeScript Suite

> Author: **Saranya Manoharan** | Xoriant Assignment  
> Stack: Playwright · TypeScript · Driver + POM + Component Architecture · MCP  
> App under test: https://demo.playwright.dev/todomvc

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     TEST LAYER                           │
│  tests/specs/*.spec.ts   — one file per feature domain  │
│  tests/fixtures/index.ts — custom Playwright fixtures   │
└─────────────────────┬────────────────────────────────────┘
                      │ uses
┌─────────────────────▼────────────────────────────────────┐
│                     PAGE LAYER  (POM)                    │
│  src/pages/TodoPage.ts                                   │
│       ├── src/components/TodoItemComponent.ts            │
│       └── src/components/FilterComponent.ts             │
└─────────────────────┬────────────────────────────────────┘
                      │ uses
┌─────────────────────▼────────────────────────────────────┐
│                    DRIVER LAYER                          │
│  src/core/Driver.ts         — Playwright Page wrapper   │
│  src/core/DriverFactory.ts  — env-aware Driver factory  │
│  src/core/BasePage.ts       — abstract POM base class   │
└─────────────────────┬────────────────────────────────────┘
                      │ wraps
┌─────────────────────▼────────────────────────────────────┐
│               PLAYWRIGHT ENGINE                          │
│  @playwright/test  (Page, Locator, expect …)             │
└──────────────────────────────────────────────────────────┘

Horizontal concerns:
  config/environments.ts         — dev / staging / prod config
  src/types/Todo.ts              — domain interfaces
  src/constants/Selectors.ts     — all selectors in one place
  src/utils/Logger.ts            — structured contextual logger
  src/utils/McpDataGenerator.ts  — Anthropic tool-use test data
```

---

## Project Structure

```
playwright-todo-arch/
├── config/
│   └── environments.ts          # Multi-env config (dev/staging/prod)
├── src/
│   ├── core/
│   │   ├── BasePage.ts          # Abstract POM base
│   │   ├── Driver.ts            # Playwright Page wrapper
│   │   └── DriverFactory.ts     # Driver creation factory
│   ├── pages/
│   │   └── TodoPage.ts          # Page Object Model
│   ├── components/
│   │   ├── TodoItemComponent.ts # Single <li> interactions
│   │   └── FilterComponent.ts   # Footer filter bar
│   ├── constants/
│   │   └── Selectors.ts         # All CSS/ARIA selectors
│   ├── types/
│   │   └── Todo.ts              # Domain interfaces & types
│   └── utils/
│       ├── Logger.ts            # Structured logger
│       └── McpDataGenerator.ts  # MCP / Anthropic test data
├── tests/
│   ├── fixtures/
│   │   └── index.ts             # Custom Playwright fixtures
│   └── specs/
│       ├── todo-add.spec.ts     # TC-01 to TC-03
│       ├── todo-complete.spec.ts# TC-04 to TC-06
│       ├── todo-delete.spec.ts  # TC-07 to TC-08
│       ├── todo-edit.spec.ts    # TC-09 to TC-10
│       └── todo-filter.spec.ts  # TC-11 to TC-15
├── .github/workflows/
│   └── playwright.yml           # Smoke → Regression pipeline
├── playwright.config.ts
├── tsconfig.json
├── package.json
└── .env.example
```

---

## Test Cases (15 total)

| TC    | Spec            | Title                                        | Tags        |
|-------|-----------------|----------------------------------------------|-------------|
| TC-01 | todo-add        | Add single todo appears in list              | @smoke      |
| TC-02 | todo-add        | Add multiple todos — all appear              | @regression |
| TC-03 | todo-add        | Items-left counter reflects added todos      | @regression |
| TC-04 | todo-complete   | Mark todo complete applies styling           | @smoke      |
| TC-05 | todo-complete   | Completing decrements items-left counter     | @regression |
| TC-06 | todo-complete   | Completing all shows zero items left         | @regression |
| TC-07 | todo-delete     | Delete todo removes it from list             | @smoke      |
| TC-08 | todo-delete     | Delete middle item leaves others intact      | @regression |
| TC-09 | todo-edit       | Double-click edit replaces todo text         | @regression |
| TC-10 | todo-edit       | Editing completed todo retains state         | @regression |
| TC-11 | todo-filter     | Active filter shows only incomplete          | @smoke      |
| TC-12 | todo-filter     | Completed filter shows only done             | @smoke      |
| TC-13 | todo-filter     | All filter shows every todo                  | @regression |
| TC-14 | todo-filter     | Clear completed removes done items           | @regression |
| TC-15 | todo-filter     | Active filter link visually selected         | @regression |

---

## Setup & Run

```bash
# 1. Clone and create feature branch
git clone https://github.com/<your-username>/playwright-todo-arch.git
cd playwright-todo-arch
git checkout -b feature/playwright-tests

# 2. Install
npm install
npx playwright install chromium

# 3. Configure (optional)
cp .env.example .env
# edit .env → set ANTHROPIC_API_KEY, ENV, HEADLESS, SLOW_MO

# 4. Run
npm test                     # all tests
npm run test:smoke           # @smoke only
npm run test:regression      # @regression only
npm run test:headed          # watch the browser
SLOW_MO=500 npm test         # slow demo mode

# 5. View report
npm run test:report

# 6. Merge
git add .
git commit -m "feat: enterprise Playwright suite"
git push origin feature/playwright-tests
# open PR → merge into main
```

---

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **Driver wraps Page** | Single place for waitFor, logging, timeouts. Swap engine without touching pages. |
| **DriverFactory** | Reads env config — tests never own configuration logic. |
| **BasePage abstract class** | Enforces `pageUrl` + `waitForLoad()` contract on every POM. |
| **Component Objects** | Decomposes large page into `TodoItemComponent` + `FilterComponent`. Avoids god-object POM. |
| **No `this` in beforeEach** | Playwright tests use arrow functions; `this` is undefined. Setup extracted to plain async helper. |
| **Worker-scoped MCP data** | API called once per run, not once per test. Shallow copy given to each test prevents mutation leaks. |
| **constants/Selectors.ts** | All selectors in one file. UI change = one-file update. |
| **config/environments.ts** | dev / staging / prod switching via `ENV=staging npm test`. |
| **@smoke / @regression tags** | CI runs smoke first; regression only if smoke passes. |

---

*Saranya Manoharan · Xoriant · Playwright + TypeScript + MCP*

/**
 * src/constants/Selectors.ts
 * ───────────────────────────
 * Every CSS selector and ARIA label used by the framework lives here.
 * Changing a selector requires a change in exactly one place.
 */
export const Selectors = {
  // Input
  NEW_TODO_PLACEHOLDER: "What needs to be done?",

  // List
  TODO_LIST:  ".todo-list",
  TODO_ITEM:  ".todo-list li",
  TOGGLE:     ".toggle",
  LABEL:      "label",
  DESTROY:    ".destroy",
  EDIT_INPUT: ".edit",

  // Footer
  ITEMS_LEFT_COUNTER: ".todo-count strong",
  CLEAR_COMPLETED:    "Clear completed",

  // Filters
  FILTER_ALL:       "All",
  FILTER_ACTIVE:    "Active",
  FILTER_COMPLETED: "Completed",

  // Toggle all
  TOGGLE_ALL: ".toggle-all",
} as const;

export const Urls = {
  TODO_MVC: "https://demo.playwright.dev/todomvc",
} as const;

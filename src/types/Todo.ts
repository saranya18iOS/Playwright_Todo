/**
 * src/types/Todo.ts
 * ──────────────────
 * Single source of truth for all domain types used across the framework.
 */

export type FilterType    = "All" | "Active" | "Completed";
export type TodoCategory  = "work" | "personal" | "shopping" | "health" | "mixed";

export interface TodoItem {
  text:      string;
  completed: boolean;
}

export interface TodoState {
  items:       TodoItem[];
  activeCount: number;
  filter:      FilterType;
}

export interface GenerateTodoInput {
  count:     number;
  category?: TodoCategory;
}

export interface DriverOptions {
  actionTimeout?:     number;
  navigationTimeout?: number;
  slowMo?:            number;
  headless?:          boolean;
}

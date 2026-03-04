/**
 * src/pages/TodoPage.ts
 * ──────────────────────
 * Page Object Model for the TodoMVC application.
 *
 * Layer hierarchy:
 *   Driver → BasePage → TodoPage → { TodoItemComponent, FilterComponent }
 *
 * Public API is intention-revealing.  Tests contain zero raw selectors.
 */

import { type Locator } from "@playwright/test";
import { BasePage }          from "../core/BasePage";
import { type Driver }       from "../core/Driver";
import { TodoItemComponent } from "../components/TodoItemComponent";
import { FilterComponent }   from "../components/FilterComponent";
import { Selectors, Urls }   from "../constants/Selectors";
import { type FilterType, type TodoItem } from "../types/Todo";

export class TodoPage extends BasePage {
  protected readonly pageUrl = Urls.TODO_MVC;

  /** Expose the filter sub-component for direct use in tests when needed */
  readonly filter: FilterComponent;

  constructor(driver: Driver) {
    super(driver);
    this.filter = new FilterComponent(driver);
  }

  // ── Locators ───────────────────────────────────────────────────────────────

  private get newTodoInput(): Locator {
    return this.driver.getByPlaceholder(Selectors.NEW_TODO_PLACEHOLDER);
  }

  private get todoItems(): Locator {
    return this.driver.locator(Selectors.TODO_ITEM);
  }

  private get toggleAllCheckbox(): Locator {
    return this.driver.locator(Selectors.TOGGLE_ALL);
  }

  // ── Page readiness contract ────────────────────────────────────────────────

  async waitForLoad(): Promise<void> {
    await this.newTodoInput.isVisible();
    this.log.debug("TodoPage ready");
  }

  // ── Private: item component factory ───────────────────────────────────────

  /**
   * Returns a TodoItemComponent scoped to the <li> that contains `text`.
   *
   * Strategy: locate by the CSS class `.todo-list li` filtered by the label
   * text, then navigate up to the <li> root.  Using `.locator("..")` on a
   * label locator reliably gives the parent <li> regardless of completion state.
   */
  private itemFor(text: string): TodoItemComponent {
    const root: Locator = this.driver
      .locator(Selectors.TODO_LIST)
      .locator(`li:has(label:text-is("${text}"))`);
    return new TodoItemComponent(this.driver, root);
  }

  // ── Add ────────────────────────────────────────────────────────────────────

  async addTodo(text: string): Promise<void> {
    this.log.debug(`addTodo: "${text}"`);
    await this.driver.typeAndConfirm(this.newTodoInput, text);
  }

  async addTodos(texts: string[]): Promise<void> {
    for (const text of texts) {
      await this.addTodo(text);
    }
  }

  // ── Complete ───────────────────────────────────────────────────────────────

  async completeTodo(text: string): Promise<void> {
    this.log.debug(`completeTodo: "${text}"`);
    await this.itemFor(text).toggle();
  }

  // ── Delete ─────────────────────────────────────────────────────────────────

  async deleteTodo(text: string): Promise<void> {
    this.log.debug(`deleteTodo: "${text}"`);
    await this.itemFor(text).delete();
  }

  // ── Edit ───────────────────────────────────────────────────────────────────

  async editTodo(oldText: string, newText: string): Promise<void> {
    this.log.debug(`editTodo: "${oldText}" → "${newText}"`);
    await this.itemFor(oldText).edit(newText);
  }

  // ── Bulk actions ───────────────────────────────────────────────────────────

  async toggleAll(): Promise<void> {
    this.log.debug("toggleAll");
    await this.driver.click(this.toggleAllCheckbox);
  }

  // ── Filter delegation ──────────────────────────────────────────────────────

  async selectFilter(filter: FilterType): Promise<void> {
    await this.filter.selectFilter(filter);
  }

  async clearCompleted(): Promise<void> {
    await this.filter.clearCompleted();
  }

  // ── Queries ────────────────────────────────────────────────────────────────

  async getTodoCount(): Promise<number> {
    return this.driver.count(this.todoItems);
  }

  async getTodoTexts(): Promise<string[]> {
    return this.driver.getAllTexts(this.todoItems);
  }

  async getItemsLeftCount(): Promise<number> {
    return this.filter.getItemsLeftCount();
  }

  async isTodoCompleted(text: string): Promise<boolean> {
    return this.itemFor(text).isCompleted();
  }

  async getAllTodoStates(): Promise<TodoItem[]> {
    const count = await this.getTodoCount();
    const states: TodoItem[] = [];
    for (let i = 0; i < count; i++) {
      const component = new TodoItemComponent(this.driver, this.todoItems.nth(i));
      states.push(await component.toState());
    }
    return states;
  }
}

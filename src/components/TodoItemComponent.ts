/**
 * src/components/TodoItemComponent.ts
 * ─────────────────────────────────────
 * Component Object for a single <li> todo item.
 *
 * Accepts the root <li> Locator from TodoPage so this component
 * never needs to know how items are found — that is the page's concern.
 */

import { type Locator } from "@playwright/test";
import { type Driver } from "../core/Driver";
import { Selectors } from "../constants/Selectors";
import { Logger } from "../utils/Logger";
import { type TodoItem } from "../types/Todo";

export class TodoItemComponent {
  private readonly log = new Logger("TodoItemComponent");

  constructor(
    private readonly driver: Driver,
    private readonly root: Locator
  ) {}

  // ── Private locators (relative to root <li>) ───────────────────────────────

  private get toggleCheckbox(): Locator   { return this.root.locator(Selectors.TOGGLE);     }
  private get label(): Locator    { return this.root.locator(Selectors.LABEL);      }
  private get destroy(): Locator  { return this.root.locator(Selectors.DESTROY);    }
  private get editInput(): Locator { return this.root.locator(Selectors.EDIT_INPUT); }

  // ── Queries ────────────────────────────────────────────────────────────────

  async getText(): Promise<string> {
    // Read directly from the label, trimming whitespace
    return (await this.driver.getText(this.label)).trim();
  }

  async isCompleted(): Promise<boolean> {
    return this.driver.hasClass(this.root, "completed");
  }

  async toState(): Promise<TodoItem> {
    return {
      text:      await this.getText(),
      completed: await this.isCompleted(),
    };
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async toggle(): Promise<void> {
    const text = await this.getText();
    this.log.debug(`toggle: "${text}"`);
    await this.driver.click(this.toggleCheckbox);
  }

  async delete(): Promise<void> {
    const text = await this.getText();
    this.log.debug(`delete: "${text}"`);
    await this.driver.hover(this.root);
    await this.driver.click(this.destroy);
  }

  /**
   * Edit the item text.
   * Works regardless of whether the item is completed or not —
   * we target the root <li> for dblclick, not the label text.
   */
  async edit(newText: string): Promise<void> {
    this.log.debug(`edit → "${newText}"`);
    await this.driver.doubleClick(this.label);
    // Clear existing value then type new text
    await this.driver.fill(this.editInput, newText);
    await this.driver.press(this.editInput, "Enter");
  }

  async cancelEdit(): Promise<void> {
    this.log.debug("cancelEdit");
    await this.driver.press(this.editInput, "Escape");
  }
}

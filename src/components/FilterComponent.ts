/**
 * src/components/FilterComponent.ts
 * ────────────────────────────────────
 * Component Object for the footer: filter links + items-left counter + clear button.
 */

import { type Locator } from "@playwright/test";
import { type Driver } from "../core/Driver";
import { Selectors } from "../constants/Selectors";
import { type FilterType } from "../types/Todo";
import { Logger } from "../utils/Logger";

export class FilterComponent {
  private readonly log = new Logger("FilterComponent");

  constructor(private readonly driver: Driver) {}

  // ── Locators ───────────────────────────────────────────────────────────────

  private get filterAll(): Locator {
    return this.driver.getByRole("link", { name: Selectors.FILTER_ALL });
  }

  private get filterActive(): Locator {
    return this.driver.getByRole("link", { name: Selectors.FILTER_ACTIVE });
  }

  private get filterCompleted(): Locator {
    return this.driver.getByRole("link", { name: Selectors.FILTER_COMPLETED });
  }

  private get clearCompletedBtn(): Locator {
    return this.driver.getByRole("button", { name: Selectors.CLEAR_COMPLETED });
  }

  private get itemsLeftCounter(): Locator {
    return this.driver.locator(Selectors.ITEMS_LEFT_COUNTER);
  }

  // ── Private helper ─────────────────────────────────────────────────────────

  private filterLocator(filter: FilterType): Locator {
    const map: Record<FilterType, Locator> = {
      All:       this.filterAll,
      Active:    this.filterActive,
      Completed: this.filterCompleted,
    };
    return map[filter];
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async selectFilter(filter: FilterType): Promise<void> {
    this.log.debug(`selectFilter: ${filter}`);
    await this.driver.click(this.filterLocator(filter));
  }

  async clearCompleted(): Promise<void> {
    this.log.debug("clearCompleted");
    await this.driver.click(this.clearCompletedBtn);
  }

  // ── Queries ────────────────────────────────────────────────────────────────

  async getItemsLeftCount(): Promise<number> {
    const text = await this.driver.getText(this.itemsLeftCounter);
    return parseInt(text, 10);
  }

  async isFilterSelected(filter: FilterType): Promise<boolean> {
    return this.driver.hasClass(this.filterLocator(filter), "selected");
  }

  async isClearCompletedVisible(): Promise<boolean> {
    return this.driver.isVisible(this.clearCompletedBtn);
  }
}

/**
 * tests/specs/todo-delete.spec.ts
 * Tags: @smoke  @regression
 */
import { test, expect } from "../fixtures";

test.describe("Delete Todo", () => {

  test("TC-05 | @smoke | delete a todo removes it from the list",
    async ({ todoPage, mixedTodos }) => {
      await todoPage.addTodos(mixedTodos);
      const target      = mixedTodos[0];
      const countBefore = await todoPage.getTodoCount();

      await todoPage.deleteTodo(target);

      expect(await todoPage.getTodoCount()).toBe(countBefore - 1);
      const texts = await todoPage.getTodoTexts();
      expect(texts.some((t) => t.includes(target))).toBeFalsy();
    }
  );

});

/**
 * tests/specs/todo-edit.spec.ts
 * Tags: @regression
 */
import { test, expect } from "../fixtures";

test.describe("Edit Todo", () => {

  test("TC-06 | @regression | double-click edit replaces the todo text",
    async ({ todoPage, workTodos }) => {
      await todoPage.addTodos(workTodos);
      const original = workTodos[0];
      const updated  = original + " [UPDATED]";

      await todoPage.editTodo(original, updated);

      const texts = await todoPage.getTodoTexts();
      expect(texts.some((t) => t.includes(updated))).toBeTruthy();
      expect(texts.every((t) => t.trim() !== original)).toBeTruthy();
    }
  );

});

/**
 * tests/specs/todo-add.spec.ts
 * Tags: @smoke  @regression
 */
import { test, expect } from "../fixtures";

test.describe("Add Todo", () => {

  test("TC-01 | @smoke | add a single todo item appears in the list",
    async ({ todoPage, workTodos }) => {
      const task = workTodos[0];

      await todoPage.addTodo(task);

      expect(await todoPage.getTodoCount()).toBe(1);
      const texts = await todoPage.getTodoTexts();
      expect(texts[0]).toContain(task);
    }
  );

  test("TC-02 | @regression | add multiple todos — all appear in the list",
    async ({ todoPage, workTodos }) => {
      await todoPage.addTodos(workTodos);

      expect(await todoPage.getTodoCount()).toBe(workTodos.length);
      const texts = await todoPage.getTodoTexts();
      for (const task of workTodos) {
        expect(texts.some((t) => t.includes(task))).toBeTruthy();
      }
    }
  );

  test("TC-03 | @regression | items-left counter reflects number of added todos",
    async ({ todoPage, workTodos }) => {
      await todoPage.addTodos(workTodos);

      expect(await todoPage.getItemsLeftCount()).toBe(workTodos.length);
    }
  );

});

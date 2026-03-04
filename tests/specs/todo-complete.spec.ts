/**
 * tests/specs/todo-complete.spec.ts
 * Tags: @smoke  @regression
 */
import { test, expect } from "../fixtures";

test.describe("Complete Todo", () => {

  test("TC-04 | @smoke | mark a todo as complete applies completed styling",
    async ({ todoPage, personalTodos }) => {
      await todoPage.addTodos(personalTodos);
      const target = personalTodos[0];

      await todoPage.completeTodo(target);

      expect(await todoPage.isTodoCompleted(target)).toBe(true);
    }
  );

});

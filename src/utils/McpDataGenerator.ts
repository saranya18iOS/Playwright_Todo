/**
 * src/utils/McpDataGenerator.ts
 * ──────────────────────────────
 * Generates test data via the Anthropic Claude API using MCP tool-use pattern.
 *
 * MCP loop:
 *  1. Send user prompt + tool schema → Claude replies with tool_use block
 *  2. Execute the tool locally
 *  3. Return tool_result to Claude → Claude confirms
 *  4. Return items to caller
 *
 * Falls back to static data if ANTHROPIC_API_KEY is absent or call fails.
 */

import * as dotenv from "dotenv";
import { type TodoCategory, type GenerateTodoInput } from "../types/Todo";
import { Logger } from "./Logger";

dotenv.config();

const log = new Logger("McpDataGenerator");

// ── MCP tool schema ────────────────────────────────────────────────────────

const GENERATE_TOOL = {
  name: "generate_todo_items",
  description:
    "Generate a list of realistic, varied todo task descriptions " +
    "for a task-management application test suite.",
  input_schema: {
    type: "object" as const,
    properties: {
      count:    { type: "integer", description: "Number of items (1–20)." },
      category: {
        type: "string",
        description: "Category: work | personal | shopping | health | mixed.",
        enum: ["work", "personal", "shopping", "health", "mixed"],
      },
    },
    required: ["count"],
  },
};

// ── Static fallback pool ───────────────────────────────────────────────────

const STATIC: Record<string, string[]> = {
  work: [
    "Complete sprint planning document",
    "Review pull request from Arjun",
    "Update API documentation",
    "Fix login page bug #1234",
    "Schedule team retrospective",
    "Write unit tests for auth module",
    "Deploy staging environment",
    "Prepare stakeholder demo",
  ],
  personal: [
    "Call mom on Sunday",
    "Renew vehicle insurance",
    "Book dentist appointment",
    "Read two chapters of current book",
    "Organise home office desk",
    "Plan weekend trip",
  ],
  shopping: [
    "Buy groceries – milk, eggs, bread",
    "Order replacement laptop charger",
    "Pick up birthday gift for Priya",
    "Restock coffee beans",
  ],
  health: [
    "30-minute morning walk",
    "Drink 8 glasses of water today",
    "Yoga session at 7 PM",
    "Meal prep for the week",
  ],
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function localGenerate(count: number, category: TodoCategory = "mixed"): string[] {
  let pool =
    category === "mixed"
      ? Object.values(STATIC).flat()
      : [...(STATIC[category] ?? STATIC.work)];

  pool = shuffle(pool);
  while (pool.length < count) pool.push(`Task ${pool.length + 1} [${category}]`);
  return pool.slice(0, count);
}

// ── Public API ─────────────────────────────────────────────────────────────

export async function generateTodoItems(
  count: number = 5,
  category: TodoCategory = "mixed"
): Promise<string[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    log.warn("ANTHROPIC_API_KEY not set — using local fallback data.");
    return localGenerate(count, category);
  }

  try {
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client    = new Anthropic({ apiKey });

    // Step 1 — prompt Claude with tool schema
    const response = await client.messages.create({
      model:      "claude-sonnet-4-20250514",
      max_tokens: 1024,
      tools:      [GENERATE_TOOL],
      messages: [{
        role:    "user",
        content: `Generate ${count} realistic todo items for the '${category}' category using the generate_todo_items tool.`,
      }],
    });

    // Step 2 — extract tool_use block
    const toolUse = response.content.find((b) => b.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") throw new Error("No tool_use block");

    const input = toolUse.input as GenerateTodoInput;

    // Step 3 — execute locally
    const items = localGenerate(input.count, (input.category as TodoCategory) ?? category);

    // Step 4 — return tool_result to close the MCP loop
    await client.messages.create({
      model:      "claude-sonnet-4-20250514",
      max_tokens: 256,
      tools:      [GENERATE_TOOL],
      messages: [
        { role: "user",      content: `Generate ${count} todos for '${category}'.` },
        { role: "assistant", content: response.content },
        {
          role: "user",
          content: [{
            type:        "tool_result",
            tool_use_id: toolUse.id,
            content:     JSON.stringify({ items }),
          }],
        },
      ],
    });

    log.info(`[MCP] Generated ${items.length} '${category}' todos via Anthropic API ✓`);
    return items;

  } catch (err) {
    log.warn(`MCP call failed (${err}) — using local fallback.`);
    return localGenerate(count, category);
  }
}

export const getWorkTodos     = (n = 3) => generateTodoItems(n, "work");
export const getPersonalTodos = (n = 3) => generateTodoItems(n, "personal");
export const getMixedTodos    = (n = 5) => generateTodoItems(n, "mixed");

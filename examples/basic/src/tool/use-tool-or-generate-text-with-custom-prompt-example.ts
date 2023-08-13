import {
  OpenAIChatFunctionPrompt,
  OpenAIChatMessage,
  OpenAIChatModel,
  Tool,
  useToolOrGenerateText,
} from "modelfusion";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

(async () => {
  const calculator = new Tool({
    name: "calculator",
    description: "Execute a calculation",

    inputSchema: z.object({
      a: z.number().describe("The first number."),
      b: z.number().describe("The second number."),
      operator: z.enum(["+", "-", "*", "/"]).describe("The operator."),
    }),

    execute: async ({ a, b, operator }) => {
      switch (operator) {
        case "+":
          return a + b;
        case "-":
          return a - b;
        case "*":
          return a * b;
        case "/":
          return a / b;
        default:
          throw new Error(`Unknown operator: ${operator}`);
      }
    },
  });

  const { tool, parameters, result, text } = await useToolOrGenerateText(
    new OpenAIChatModel({ model: "gpt-3.5-turbo" }),
    [calculator /* ... */],
    // Instead of using a curried function,
    // you can also work with the tools directly:
    (tools) =>
      OpenAIChatFunctionPrompt.forTools({
        tools,
        messages: [
          OpenAIChatMessage.system(
            // Here the available tools are used to create
            // a more precise prompt that reduces errors:
            `You have ${tools.length} tools available (${tools
              .map((tool) => tool.name)
              .join(", ")}).`
          ),
          OpenAIChatMessage.user("What's fourteen times twelve?"),
          // OpenAIChatMessage.user("What's twelwe plus 1234?"),
          // OpenAIChatMessage.user("Tell me about Berlin"),
        ],
      })
  );

  console.log(tool != null ? `TOOL: ${tool}` : "TEXT");
  console.log(`PARAMETERS: ${JSON.stringify(parameters)}`);
  console.log(`TEXT: ${text}`);
  console.log(`RESULT: ${JSON.stringify(result)}`);
})();

import dotenv from "dotenv";
import { executeTool } from "modelfusion";
import { calculator } from "../../tool/calculator-tool";
import { customObserver } from "./custom-observer";

dotenv.config();

(async () => {
  const result = await executeTool(
    calculator,
    {
      a: 14,
      b: 12,
      operator: "*" as const,
    },
    {
      observers: [customObserver],
    }
  );
})();
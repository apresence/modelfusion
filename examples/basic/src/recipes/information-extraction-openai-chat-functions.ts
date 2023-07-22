import {
  OpenAIChatMessage,
  OpenAIChatModel,
  OpenAIChatSingleFunctionPrompt,
  generateJson,
} from "ai-utils.js";
import dotenv from "dotenv";
import fs from "node:fs";
import { z } from "zod";

dotenv.config();

(async () => {
  const extractNameAndPopulation = async (text: string) =>
    generateJson(
      new OpenAIChatModel({
        model: "gpt-4",
        temperature: 0, // remove randomness as much as possible
        maxTokens: 200, // only a few tokens needed for the response
      }),
      new OpenAIChatSingleFunctionPrompt({
        messages: [
          OpenAIChatMessage.system(
            [
              "Extract the name and the population of the city.",
              // escape hatch to limit extractions to city information:
              "The text might not be about a city.",
              "If it is not, set city to null.",
            ].join("\n")
          ),
          OpenAIChatMessage.user(text),
        ],
        fn: {
          name: "storeCity",
          description: "Save information about the city",
          // structure supports escape hatch:
          parameters: z.object({
            city: z
              .object({
                name: z.string().describe("name of the city"),
                population: z.number().describe("population of the city"),
              })
              .nullable()
              .describe("information about the city"),
          }),
        },
      })
    );

  const sanFranciscoWikipedia = JSON.parse(
    fs.readFileSync("data/san-francisco-wikipedia.json", "utf8")
  ).content;

  const extractedInformation1 = await extractNameAndPopulation(
    sanFranciscoWikipedia.slice(0, 2000)
  );

  console.log(extractedInformation1);

  const extractedInformation2 = await extractNameAndPopulation(
    "Carl was a friendly robot."
  );

  console.log(extractedInformation2);
})();
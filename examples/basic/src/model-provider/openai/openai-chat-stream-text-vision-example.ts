import dotenv from "dotenv";
import { OpenAIChatModel, streamText } from "modelfusion";
import fs from "node:fs";
import path from "node:path";

dotenv.config();

async function main() {
  const image = fs.readFileSync(path.join("data", "example-image.png"), {
    encoding: "base64",
  });

  const textStream = await streamText(
    new OpenAIChatModel({
      model: "gpt-4-vision-preview",
      maxCompletionTokens: 1000,
    }),
    [
      {
        role: "user",
        content: [
          { type: "text", text: `Describe the image in detail:` },
          { type: "image_url", image_url: `data:image/png;base64,${image}` },
        ],
      },
    ]
  );

  for await (const textPart of textStream) {
    process.stdout.write(textPart);
  }
}

main().catch(console.error);

import { LlamaCppTextGenerationModel, streamText } from "modelfusion";
import fs from "node:fs";
import path from "node:path";

async function main() {
  const image = fs.readFileSync(path.join("data", "example-image.png"), {
    encoding: "base64",
  });

  const textStream = await streamText(
    new LlamaCppTextGenerationModel({
      maxCompletionTokens: 1024,
      temperature: 0.7,
    }).withVisionInstructionPrompt(),
    {
      instruction: "Describe the image in detail:\n\n",
      image,
    }
  );

  for await (const textPart of textStream) {
    process.stdout.write(textPart);
  }
}

main().catch(console.error);

---
sidebar_position: 2
---

# Library Functions

`ai-utils.js` offers a variety of high-level functions, e.g. generate text, that are built on top of model interfaces. They can be used directly or in functional composition. The library functions are run-aware and add prompts, retry management, error handling, and call logging. They also support swapping out models for other compatible models.

### Example Usage

```ts
// create provider model:
const model = createOpenAITextGenerationModel({
  apiKey: OPENAI_API_KEY,
  model: "text-davinci-003",
  settings: { temperature: 0.7, maxCompletionTokens: 500 },
});

// create semantically meaningful function 'generateStory'
// by using a prompt and `generateText.asFunction`:
const generateStory = generateText.asFunction({
  model,
  prompt: async ({ character }: { character: string }) =>
    `Write a short story about ${character} learning to love:\n\n`,
});

// Later in the code:
const text = await generateStory({ character: "a robot" });

console.log(text);
```

## Library Functions (List)

### Text

- [generateText](/api/modules/text#generatetext)
- [generateText.safe](/api/namespaces/text.generateText#safe)
- [generateText.asFunction](/api/namespaces/text.generateText#asfunction)
- [generateText.asSafeFunction](/api/namespaces/text.generateText#assafefunction)
import Anthropic from "@anthropic-ai/sdk";
import config from "../config";

const anthropic = new Anthropic({
  apiKey: config.anthropicApiKey,
});

export async function enhanceTaskDescription(
  description: string,
): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `Rewrite this task description to be clearer and more actionable. Add 2-3 specific acceptance criteria. Keep it concise.\n\nOriginal description: "${description}"`,
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  return textBlock?.type === "text" ? textBlock.text : description;
}

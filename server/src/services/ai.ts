import OpenAI from "openai";
import config from "../config";

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

export async function enhanceTaskDescription(
  description: string,
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `Rewrite this task description to be clearer and more actionable. Add 2-3 specific acceptance criteria. No longer than 60 words. No markdown formatting. Plain text only.\n\nOriginal description: "${description}"`,
      },
    ],
  });

  return response.choices[0]?.message?.content ?? description;
}

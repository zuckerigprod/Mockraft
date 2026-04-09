import type { ParsedSchema } from "../parser/types.js";
import type { GeneratorOptions, GeneratedData } from "./types.js";
import { OpenRouterClient } from "../ai/openrouter-client.js";
import { buildGeneratePrompt } from "../ai/prompt-builder.js";
import { parseAiResponse } from "../ai/response-parser.js";
import { generateFallbackData, generateFallbackValue } from "./fallback-generator.js";
import { logger } from "../utils/logger.js";

export async function generateMockData(
  schema: ParsedSchema,
  options: GeneratorOptions = {},
): Promise<GeneratedData> {
  const count = options.count ?? 3;
  const locale = options.locale ?? "en";

  if (options.aiApiKey) {
    try {
      const client = new OpenRouterClient({ apiKey: options.aiApiKey });
      const prompt = buildGeneratePrompt(schema, count, locale, options.naturalLangHint);
      const response = await client.generate(prompt, { model: options.aiModel });
      const data = parseAiResponse(response.content);

      return {
        data,
        source: "ai",
        model: response.model,
      };
    } catch (err) {
      logger.warn("AI generation failed, using fallback:", err instanceof Error ? err.message : err);
    }
  }

  const data = schema.type === "array" && schema.items
    ? generateFallbackData(schema.items, count, locale)
    : generateFallbackData(schema, count, locale);

  return {
    data,
    source: "fallback",
  };
}

export async function generateSingleItem(
  schema: ParsedSchema,
  options: GeneratorOptions = {},
): Promise<GeneratedData> {
  const result = await generateMockData(schema, { ...options, count: 1 });
  const data = Array.isArray(result.data) ? result.data[0] : result.data;
  return { ...result, data };
}

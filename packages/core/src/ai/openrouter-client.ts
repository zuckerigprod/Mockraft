import type { OpenRouterConfig, GenerateOptions, AiResponse } from "./types.js";
import { DEFAULT_FREE_MODEL } from "./models.js";
import { logger } from "../utils/logger.js";

const OPENROUTER_BASE = "https://openrouter.ai/api/v1";

export class OpenRouterClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: OpenRouterConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || OPENROUTER_BASE;
  }

  async generate(prompt: string, options: GenerateOptions = {}): Promise<AiResponse> {
    const model = options.model || DEFAULT_FREE_MODEL;
    const temperature = options.temperature ?? 0.7;
    const maxTokens = options.maxTokens ?? 2048;

    logger.debug(`Requesting ${model} via OpenRouter`);

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com/mockraft/mockraft",
        "X-Title": "Mockraft",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "You are a data generation assistant. You generate realistic, contextually appropriate mock data for APIs. Always respond with valid JSON only, no markdown formatting, no explanations.",
          },
          { role: "user", content: prompt },
        ],
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error (${response.status}): ${error}`);
    }

    const data = await response.json() as {
      choices: { message: { content: string } }[];
      model: string;
      usage?: { prompt_tokens: number; completion_tokens: number };
    };

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Empty response from OpenRouter");
    }

    return {
      content,
      model: data.model || model,
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
      } : undefined,
    };
  }
}

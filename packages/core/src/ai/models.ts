import type { ModelInfo } from "./types.js";

export const FREE_MODELS: ModelInfo[] = [
  { id: "meta-llama/llama-4-scout:free", name: "Llama 4 Scout", tier: "free", maxTokens: 4096 },
  { id: "mistralai/mistral-small-3.1-24b-instruct:free", name: "Mistral Small 3.1", tier: "free", maxTokens: 4096 },
  { id: "google/gemma-3-27b-it:free", name: "Gemma 3 27B", tier: "free", maxTokens: 4096 },
  { id: "qwen/qwen-2.5-72b-instruct:free", name: "Qwen 2.5 72B", tier: "free", maxTokens: 4096 },
];

export const PAID_MODELS: ModelInfo[] = [
  { id: "anthropic/claude-sonnet-4", name: "Claude Sonnet 4", tier: "paid", maxTokens: 8192 },
  { id: "openai/gpt-4o", name: "GPT-4o", tier: "paid", maxTokens: 8192 },
  { id: "google/gemini-2.5-flash", name: "Gemini 2.5 Flash", tier: "paid", maxTokens: 8192 },
  { id: "anthropic/claude-haiku-4", name: "Claude Haiku 4", tier: "paid", maxTokens: 4096 },
];

export const ALL_MODELS: ModelInfo[] = [...FREE_MODELS, ...PAID_MODELS];

export const DEFAULT_FREE_MODEL = FREE_MODELS[0].id;
export const DEFAULT_PAID_MODEL = PAID_MODELS[0].id;

export function getModelInfo(modelId: string): ModelInfo | undefined {
  return ALL_MODELS.find(m => m.id === modelId);
}

export function getModelsByTier(tier: "free" | "paid"): ModelInfo[] {
  return ALL_MODELS.filter(m => m.tier === tier);
}

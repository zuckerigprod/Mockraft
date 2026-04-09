import type { ModelInfo } from "./types.js";

export const FREE_MODELS: ModelInfo[] = [
  { id: "google/gemma-4-31b-it:free", name: "Gemma 4 31B", tier: "free", maxTokens: 4096 },
  { id: "google/gemma-4-26b-a4b-it:free", name: "Gemma 4 26B", tier: "free", maxTokens: 4096 },
  { id: "nvidia/nemotron-3-super-120b-a12b:free", name: "Nemotron 3 Super 120B", tier: "free", maxTokens: 4096 },
  { id: "nvidia/nemotron-3-nano-30b-a3b:free", name: "Nemotron 3 Nano 30B", tier: "free", maxTokens: 4096 },
  { id: "minimax/minimax-m2.5:free", name: "MiniMax M2.5", tier: "free", maxTokens: 4096 },
  { id: "arcee-ai/trinity-large-preview:free", name: "Trinity Large", tier: "free", maxTokens: 4096 },
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

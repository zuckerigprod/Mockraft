export interface ModelInfo {
  id: string;
  name: string;
  tier: "free" | "paid";
  maxTokens: number;
}

export interface GenerateOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface OpenRouterConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface AiResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
  };
}

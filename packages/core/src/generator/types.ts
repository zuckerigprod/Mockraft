export interface GeneratorOptions {
  count?: number;
  locale?: string;
  aiApiKey?: string;
  aiModel?: string;
  naturalLangHint?: string;
}

export interface GeneratedData {
  data: unknown;
  source: "ai" | "fallback";
  model?: string;
}

import { OpenRouterClient } from "../ai/openrouter-client.js";
import { parseAiResponse } from "../ai/response-parser.js";
import type { ScenarioConfig } from "../server/types.js";
import { logger } from "../utils/logger.js";

interface NlpResult {
  type: "scenario" | "data_hint" | "unknown";
  scenario?: ScenarioConfig;
  dataHint?: string;
  raw: string;
}

const SCENARIO_PATTERNS: [RegExp, (match: RegExpMatchArray) => Partial<ScenarioConfig>][] = [
  [/delay\s+(\d+)\s*ms/i, (m) => ({ delayMs: parseInt(m[1]) })],
  [/(\d+)\s*ms\s+delay/i, (m) => ({ delayMs: parseInt(m[1]) })],
  [/error\s+rate\s+(\d+)%/i, (m) => ({ errorRate: parseInt(m[1]) })],
  [/(\d+)%\s+errors?/i, (m) => ({ errorRate: parseInt(m[1]) })],
  [/rate\s+limit\s+(\d+)/i, (m) => ({ rateLimit: parseInt(m[1]) })],
  [/(\d+)\s+req(uests?)?\s*\/\s*min/i, (m) => ({ rateLimit: parseInt(m[1]) })],
  [/status\s+(\d{3})/i, (m) => ({ errorStatus: parseInt(m[1]) })],
  [/return\s+(\d{3})/i, (m) => ({ errorStatus: parseInt(m[1]), errorRate: 100 })],
  [/slow/i, () => ({ delayMs: 2000 })],
  [/very\s+slow/i, () => ({ delayMs: 5000 })],
  [/timeout/i, () => ({ delayMs: 30000 })],
  [/flaky/i, () => ({ errorRate: 30, errorStatus: 500 })],
  [/unreliable/i, () => ({ errorRate: 50, errorStatus: 503 })],
  [/broken/i, () => ({ errorRate: 100, errorStatus: 500 })],
  [/down/i, () => ({ errorRate: 100, errorStatus: 503 })],
];

function tryParseLocally(input: string): NlpResult | null {
  const scenario: ScenarioConfig = {};
  let matched = false;

  for (const [pattern, extractor] of SCENARIO_PATTERNS) {
    const match = input.match(pattern);
    if (match) {
      Object.assign(scenario, extractor(match));
      matched = true;
    }
  }

  if (matched) {
    return { type: "scenario", scenario, raw: input };
  }

  return null;
}

export async function parseNaturalLanguage(
  input: string,
  options: { aiApiKey?: string; aiModel?: string } = {},
): Promise<NlpResult> {
  const local = tryParseLocally(input);
  if (local) return local;

  if (options.aiApiKey) {
    try {
      const client = new OpenRouterClient({ apiKey: options.aiApiKey });
      const response = await client.generate(
        `Parse this API mock configuration request and return JSON with the structure:
{ "type": "scenario" | "data_hint", "scenario": { "delayMs": number, "errorRate": number, "errorStatus": number, "rateLimit": number }, "dataHint": "string" }

Only include fields that are relevant. User request: "${input}"`,
        { model: options.aiModel },
      );

      const parsed = parseAiResponse<NlpResult>(response.content);
      return { ...parsed, raw: input };
    } catch (err) {
      logger.warn("NLP parsing via AI failed:", err instanceof Error ? err.message : err);
    }
  }

  return { type: "data_hint", dataHint: input, raw: input };
}

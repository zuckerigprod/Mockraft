import { logger } from "../utils/logger.js";

function extractJsonFromMarkdown(text: string): string {
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
  if (codeBlockMatch) return codeBlockMatch[1].trim();
  return text;
}

function findJsonBoundaries(text: string): string {
  const arrayStart = text.indexOf("[");
  const objectStart = text.indexOf("{");

  let start: number;
  let end: number;

  if (arrayStart === -1 && objectStart === -1) return text;

  if (arrayStart === -1) {
    start = objectStart;
  } else if (objectStart === -1) {
    start = arrayStart;
  } else {
    start = Math.min(arrayStart, objectStart);
  }

  const isArray = text[start] === "[";
  const closeChar = isArray ? "]" : "}";

  end = text.lastIndexOf(closeChar);
  if (end === -1) return text;

  return text.substring(start, end + 1);
}

function repairJson(text: string): string {
  let result = text;
  result = result.replace(/,\s*([}\]])/g, "$1");
  result = result.replace(/'/g, '"');
  result = result.replace(/(\w+)\s*:/g, '"$1":');
  result = result.replace(/""/g, '"');
  return result;
}

export function parseAiResponse<T = unknown>(raw: string): T {
  let text = extractJsonFromMarkdown(raw);
  text = findJsonBoundaries(text);

  try {
    return JSON.parse(text);
  } catch {
    logger.debug("First parse attempt failed, trying repair");
  }

  try {
    const repaired = repairJson(text);
    return JSON.parse(repaired);
  } catch (e) {
    logger.error("Failed to parse AI response as JSON", e);
    throw new Error(`Could not parse AI response as JSON: ${text.substring(0, 200)}`);
  }
}

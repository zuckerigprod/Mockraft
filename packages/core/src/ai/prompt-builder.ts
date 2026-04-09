import type { ParsedSchema } from "../parser/types.js";

function schemaToDescription(schema: ParsedSchema, depth: number = 0): string {
  const indent = "  ".repeat(depth);

  if (schema.type === "array" && schema.items) {
    return `${indent}array of:\n${schemaToDescription(schema.items, depth + 1)}`;
  }

  if (schema.type === "object" && schema.properties) {
    const fields = Object.entries(schema.properties).map(([key, val]) => {
      const parts = [`${indent}  - ${key}: ${val.type}`];
      if (val.format) parts.push(`(format: ${val.format})`);
      if (val.enum) parts.push(`(one of: ${val.enum.join(", ")})`);
      if (val.minimum !== undefined) parts.push(`(min: ${val.minimum})`);
      if (val.maximum !== undefined) parts.push(`(max: ${val.maximum})`);
      if (val.description) parts.push(`(${val.description})`);
      return parts.join(" ");
    });
    return fields.join("\n");
  }

  const parts = [`${indent}${schema.type}`];
  if (schema.format) parts.push(`(format: ${schema.format})`);
  if (schema.enum) parts.push(`(one of: ${schema.enum.join(", ")})`);
  return parts.join(" ");
}

export function buildGeneratePrompt(
  schema: ParsedSchema,
  count: number = 3,
  locale: string = "en",
  naturalLangHint?: string,
): string {
  const schemaDesc = schemaToDescription(schema);
  const localeHint = locale === "ru"
    ? "Use Russian names, addresses, and culturally appropriate data."
    : "Use English names, addresses, and culturally appropriate data.";

  let prompt = `Generate ${count} realistic mock data items matching this schema:\n\n${schemaDesc}\n\n${localeHint}`;

  if (naturalLangHint) {
    prompt += `\n\nAdditional requirements: ${naturalLangHint}`;
  }

  prompt += `\n\nRespond with a JSON array of ${count} objects. Only valid JSON, no explanations.`;

  return prompt;
}

export function buildSingleItemPrompt(
  schema: ParsedSchema,
  locale: string = "en",
  naturalLangHint?: string,
): string {
  return buildGeneratePrompt(schema, 1, locale, naturalLangHint);
}

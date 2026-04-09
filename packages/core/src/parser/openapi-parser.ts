import SwaggerParser from "@apidevtools/swagger-parser";
import YAML from "yaml";
import type { ParsedSpec, ParsedEndpoint, ParsedResponse, ParsedParameter, ParsedSchema } from "./types.js";

function toSchema(raw: Record<string, unknown> | undefined): ParsedSchema | undefined {
  if (!raw) return undefined;
  const schema: ParsedSchema = { type: (raw.type as string) || "object" };

  if (raw.properties) {
    schema.properties = {};
    for (const [key, val] of Object.entries(raw.properties as Record<string, Record<string, unknown>>)) {
      const parsed = toSchema(val);
      if (parsed) schema.properties[key] = parsed;
    }
  }

  if (raw.items) schema.items = toSchema(raw.items as Record<string, unknown>);
  if (raw.required) schema.required = raw.required as string[];
  if (raw.enum) schema.enum = raw.enum as unknown[];
  if (raw.format) schema.format = raw.format as string;
  if (raw.example !== undefined) schema.example = raw.example;
  if (raw.description) schema.description = raw.description as string;
  if (raw.minimum !== undefined) schema.minimum = raw.minimum as number;
  if (raw.maximum !== undefined) schema.maximum = raw.maximum as number;
  if (raw.nullable) schema.nullable = raw.nullable as boolean;
  if (raw.oneOf) schema.oneOf = (raw.oneOf as Record<string, unknown>[]).map(s => toSchema(s)!);
  if (raw.anyOf) schema.anyOf = (raw.anyOf as Record<string, unknown>[]).map(s => toSchema(s)!);
  if (raw.allOf) schema.allOf = (raw.allOf as Record<string, unknown>[]).map(s => toSchema(s)!);
  if (raw.default !== undefined) schema.default = raw.default;

  return schema;
}

function extractParameters(params: Record<string, unknown>[] | undefined): ParsedParameter[] {
  if (!params) return [];
  return params.map(p => ({
    name: p.name as string,
    in: p.in as ParsedParameter["in"],
    required: (p.required as boolean) || false,
    schema: toSchema(p.schema as Record<string, unknown>) || { type: "string" },
  }));
}

function extractResponses(responses: Record<string, Record<string, unknown>> | undefined): ParsedResponse[] {
  if (!responses) return [];
  const result: ParsedResponse[] = [];

  for (const [code, resp] of Object.entries(responses)) {
    const content = resp.content as Record<string, Record<string, unknown>> | undefined;
    let schema: ParsedSchema | undefined;
    let contentType: string | undefined;

    if (content) {
      const jsonContent = content["application/json"];
      if (jsonContent) {
        schema = toSchema(jsonContent.schema as Record<string, unknown>);
        contentType = "application/json";
      }
    }

    result.push({
      statusCode: code,
      description: (resp.description as string) || "",
      schema,
      contentType,
    });
  }

  return result;
}

function extractRequestBody(body: Record<string, unknown> | undefined): ParsedSchema | undefined {
  if (!body) return undefined;
  const content = body.content as Record<string, Record<string, unknown>> | undefined;
  if (!content) return undefined;
  const jsonContent = content["application/json"];
  if (!jsonContent) return undefined;
  return toSchema(jsonContent.schema as Record<string, unknown>);
}

export async function parseSpec(input: string): Promise<ParsedSpec> {
  let raw: Record<string, unknown>;

  try {
    raw = JSON.parse(input);
  } catch {
    raw = YAML.parse(input);
  }

  const api = await SwaggerParser.dereference(raw as never) as Record<string, unknown>;

  const info = api.info as Record<string, unknown>;
  const paths = api.paths as Record<string, Record<string, Record<string, unknown>>> || {};
  const servers = api.servers as { url: string }[] | undefined;

  const endpoints: ParsedEndpoint[] = [];
  const methods = ["get", "post", "put", "patch", "delete", "head", "options"];

  for (const [path, pathItem] of Object.entries(paths)) {
    for (const method of methods) {
      const operation = pathItem[method];
      if (!operation) continue;

      endpoints.push({
        method: method.toUpperCase(),
        path,
        operationId: operation.operationId as string | undefined,
        summary: operation.summary as string | undefined,
        tags: operation.tags as string[] | undefined,
        parameters: extractParameters(operation.parameters as Record<string, unknown>[] | undefined),
        requestBody: extractRequestBody(operation.requestBody as Record<string, unknown> | undefined),
        responses: extractResponses(operation.responses as Record<string, Record<string, unknown>> | undefined),
      });
    }
  }

  const rawSchemas = (api.components as Record<string, unknown>)?.schemas as Record<string, Record<string, unknown>> | undefined;
  const schemas: Record<string, ParsedSchema> = {};
  if (rawSchemas) {
    for (const [name, s] of Object.entries(rawSchemas)) {
      const parsed = toSchema(s);
      if (parsed) schemas[name] = parsed;
    }
  }

  return {
    title: (info.title as string) || "Untitled API",
    version: (info.version as string) || "1.0.0",
    baseUrl: servers?.[0]?.url,
    endpoints,
    schemas,
  };
}

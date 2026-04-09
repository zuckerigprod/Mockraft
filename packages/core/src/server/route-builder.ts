import type { ParsedSpec, ParsedEndpoint, ParsedSchema } from "../parser/types.js";
import type { RouteConfig } from "./types.js";
import { generateMockData } from "../generator/mock-generator.js";

function openApiPathToExpress(path: string): string {
  return path.replace(/\{(\w+)\}/g, ":$1");
}

function findResponseSchema(endpoint: ParsedEndpoint): { schema: ParsedSchema | undefined; statusCode: number } {
  const successResponse = endpoint.responses.find(r =>
    r.statusCode.startsWith("2") && r.schema
  );

  if (successResponse) {
    return {
      schema: successResponse.schema,
      statusCode: parseInt(successResponse.statusCode, 10),
    };
  }

  const firstWithSchema = endpoint.responses.find(r => r.schema);
  if (firstWithSchema) {
    return {
      schema: firstWithSchema.schema,
      statusCode: parseInt(firstWithSchema.statusCode, 10),
    };
  }

  return {
    schema: undefined,
    statusCode: endpoint.method === "POST" ? 201 : endpoint.method === "DELETE" ? 204 : 200,
  };
}

export function buildRoutes(
  spec: ParsedSpec,
  options: { aiApiKey?: string; aiModel?: string; locale?: string } = {},
): RouteConfig[] {
  return spec.endpoints.map(endpoint => {
    const { schema, statusCode } = findResponseSchema(endpoint);
    const expressPath = openApiPathToExpress(endpoint.path);

    return {
      method: endpoint.method.toLowerCase(),
      path: expressPath,
      statusCode,
      generateData: async () => {
        if (!schema) return null;

        const isArray = schema.type === "array";
        const result = await generateMockData(
          isArray ? schema.items || schema : schema,
          {
            count: isArray ? 5 : 1,
            locale: options.locale,
            aiApiKey: options.aiApiKey,
            aiModel: options.aiModel,
          },
        );

        if (isArray) return result.data;
        return Array.isArray(result.data) ? result.data[0] : result.data;
      },
    };
  });
}

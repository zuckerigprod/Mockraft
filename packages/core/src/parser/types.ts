export interface ParsedSchema {
  type: string;
  properties?: Record<string, ParsedSchema>;
  items?: ParsedSchema;
  required?: string[];
  enum?: unknown[];
  format?: string;
  example?: unknown;
  description?: string;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  default?: unknown;
  nullable?: boolean;
  oneOf?: ParsedSchema[];
  anyOf?: ParsedSchema[];
  allOf?: ParsedSchema[];
}

export interface ParsedParameter {
  name: string;
  in: "query" | "path" | "header" | "cookie";
  required: boolean;
  schema: ParsedSchema;
}

export interface ParsedResponse {
  statusCode: string;
  description: string;
  schema?: ParsedSchema;
  contentType?: string;
}

export interface ParsedEndpoint {
  method: string;
  path: string;
  operationId?: string;
  summary?: string;
  tags?: string[];
  parameters: ParsedParameter[];
  requestBody?: ParsedSchema;
  responses: ParsedResponse[];
}

export interface ParsedSpec {
  title: string;
  version: string;
  baseUrl?: string;
  endpoints: ParsedEndpoint[];
  schemas: Record<string, ParsedSchema>;
}

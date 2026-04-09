export interface MockServerOptions {
  port?: number;
  aiApiKey?: string;
  aiModel?: string;
  locale?: string;
  corsEnabled?: boolean;
  logRequests?: boolean;
}

export interface ScenarioConfig {
  delayMs?: number;
  errorRate?: number;
  errorStatus?: number;
  rateLimit?: number;
  rateLimitWindow?: number;
}

export interface ProxyConfig {
  target: string;
  paths?: string[];
  changeOrigin?: boolean;
}

export interface EndpointScenario {
  method: string;
  path: string;
  scenario: ScenarioConfig;
}

export interface RouteConfig {
  method: string;
  path: string;
  statusCode: number;
  generateData: () => Promise<unknown>;
  scenario?: ScenarioConfig;
}

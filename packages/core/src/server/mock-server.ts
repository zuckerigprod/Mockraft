import express from "express";
import cors from "cors";
import type { Express } from "express";
import type { ParsedSpec } from "../parser/types.js";
import type { MockServerOptions, ScenarioConfig, EndpointScenario, ProxyConfig } from "./types.js";
import { buildRoutes } from "./route-builder.js";
import { createScenarioMiddleware } from "./scenario-engine.js";
import { setupProxy } from "./proxy-handler.js";
import { logger } from "../utils/logger.js";

export interface MockServer {
  app: Express;
  start: () => Promise<{ port: number; url: string }>;
  stop: () => Promise<void>;
  setScenario: (method: string, path: string, scenario: ScenarioConfig) => void;
  clearScenarios: () => void;
  setProxy: (config: ProxyConfig) => void;
  getEndpoints: () => { method: string; path: string }[];
}

export function createMockServer(spec: ParsedSpec, options: MockServerOptions = {}): MockServer {
  const app = express();
  const port = options.port || 3456;
  const scenarios = new Map<string, ScenarioConfig>();
  let server: ReturnType<typeof app.listen> | null = null;

  if (options.corsEnabled !== false) {
    app.use(cors());
  }

  app.use(express.json());

  if (options.logRequests !== false) {
    app.use((req, _res, next) => {
      logger.debug(`${req.method} ${req.path}`);
      next();
    });
  }

  const scenarioMiddleware = createScenarioMiddleware((method, path) => {
    const key = `${method.toUpperCase()}:${path}`;
    for (const [pattern, scenario] of scenarios) {
      if (key === pattern) return scenario;
      const regex = new RegExp("^" + pattern.replace(/:[^/]+/g, "[^/]+") + "$");
      if (regex.test(key)) return scenario;
    }
    return undefined;
  });

  app.use(scenarioMiddleware);

  const routes = buildRoutes(spec, {
    aiApiKey: options.aiApiKey,
    aiModel: options.aiModel,
    locale: options.locale,
  });

  const dataCache = new Map<string, unknown>();

  for (const route of routes) {
    const handler = async (_req: express.Request, res: express.Response) => {
      try {
        const cacheKey = `${route.method}:${route.path}`;
        let data = dataCache.get(cacheKey);

        if (!data) {
          data = await route.generateData();
          if (data) dataCache.set(cacheKey, data);
        }

        if (route.statusCode === 204 || !data) {
          res.status(route.statusCode).end();
          return;
        }

        res.status(route.statusCode).json(data);
      } catch (err) {
        logger.error(`Error handling ${route.method} ${route.path}:`, err);
        res.status(500).json({ error: "Internal mock server error" });
      }
    };

    const method = route.method as "get" | "post" | "put" | "patch" | "delete" | "head" | "options";
    app[method](route.path, handler);
  }

  app.get("/__mockraft/endpoints", (_req, res) => {
    res.json(routes.map(r => ({ method: r.method.toUpperCase(), path: r.path })));
  });

  app.post("/__mockraft/scenarios", (req, res) => {
    const { method, path, scenario } = req.body as EndpointScenario;
    scenarios.set(`${method.toUpperCase()}:${path}`, scenario);
    res.json({ ok: true });
  });

  app.delete("/__mockraft/scenarios", (_req, res) => {
    scenarios.clear();
    res.json({ ok: true });
  });

  app.post("/__mockraft/cache/clear", (_req, res) => {
    dataCache.clear();
    res.json({ ok: true });
  });

  return {
    app,

    start: () => new Promise((resolve, reject) => {
      try {
        server = app.listen(port, () => {
          const url = `http://localhost:${port}`;
          logger.info(`Mock server running at ${url}`);
          resolve({ port, url });
        });
        server.on("error", reject);
      } catch (err) {
        reject(err);
      }
    }),

    stop: () => new Promise((resolve) => {
      if (server) {
        server.close(() => {
          logger.info("Mock server stopped");
          resolve();
        });
      } else {
        resolve();
      }
    }),

    setScenario: (method, path, scenario) => {
      scenarios.set(`${method.toUpperCase()}:${path}`, scenario);
    },

    clearScenarios: () => {
      scenarios.clear();
    },

    setProxy: (config) => {
      setupProxy(app, config);
    },

    getEndpoints: () => routes.map(r => ({
      method: r.method.toUpperCase(),
      path: r.path,
    })),
  };
}

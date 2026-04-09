import type { Request, Response, NextFunction } from "express";
import type { ScenarioConfig } from "./types.js";

const requestCounts = new Map<string, { count: number; resetAt: number }>();

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function createScenarioMiddleware(getScenario: (method: string, path: string) => ScenarioConfig | undefined) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const scenario = getScenario(req.method, req.path);
    if (!scenario) return next();

    if (scenario.rateLimit) {
      const key = `${req.method}:${req.path}`;
      const window = (scenario.rateLimitWindow || 60) * 1000;
      const now = Date.now();

      let entry = requestCounts.get(key);
      if (!entry || now > entry.resetAt) {
        entry = { count: 0, resetAt: now + window };
        requestCounts.set(key, entry);
      }

      entry.count++;
      if (entry.count > scenario.rateLimit) {
        res.status(429).json({ error: "Rate limit exceeded" });
        return;
      }
    }

    if (scenario.errorRate && Math.random() * 100 < scenario.errorRate) {
      const status = scenario.errorStatus || 500;
      if (scenario.delayMs) await delay(scenario.delayMs);
      res.status(status).json({ error: "Simulated error", statusCode: status });
      return;
    }

    if (scenario.delayMs) {
      await delay(scenario.delayMs);
    }

    next();
  };
}

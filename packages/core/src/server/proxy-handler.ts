import { createProxyMiddleware } from "http-proxy-middleware";
import type { Express } from "express";
import type { ProxyConfig } from "./types.js";
import { logger } from "../utils/logger.js";

export function setupProxy(app: Express, config: ProxyConfig) {
  const paths = config.paths || ["/"];

  for (const path of paths) {
    logger.info(`Proxying ${path} -> ${config.target}`);

    app.use(path, createProxyMiddleware({
      target: config.target,
      changeOrigin: config.changeOrigin ?? true,
      pathRewrite: undefined,
      on: {
        error: (err) => {
          logger.error(`Proxy error for ${path}:`, err.message);
        },
      },
    }));
  }
}

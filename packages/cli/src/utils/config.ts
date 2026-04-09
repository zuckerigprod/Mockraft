import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const CONFIG_PATH = join(homedir(), ".mockraftrc");

interface MockraftConfig {
  apiKey?: string;
  model?: string;
  locale?: string;
  port?: number;
}

export function loadConfig(): MockraftConfig {
  if (!existsSync(CONFIG_PATH)) return {};

  try {
    return JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
  } catch {
    return {};
  }
}

export function saveConfig(config: MockraftConfig) {
  const existing = loadConfig();
  const merged = { ...existing, ...config };
  writeFileSync(CONFIG_PATH, JSON.stringify(merged, null, 2), "utf-8");
}

export function getConfigPath(): string {
  return CONFIG_PATH;
}

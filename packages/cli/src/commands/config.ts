import { initI18n, t } from "@mockraft/core";
import { saveConfig, loadConfig, getConfigPath } from "../utils/config.js";
import { ui } from "../ui/terminal-ui.js";

interface ConfigOptions {
  key?: string;
  model?: string;
  lang?: string;
  port?: string;
  show?: boolean;
}

export async function configCommand(options: ConfigOptions) {
  await initI18n(options.lang || loadConfig().locale || "en");

  ui.logo();

  if (options.show) {
    const config = loadConfig();
    ui.info(`Config: ${getConfigPath()}`);
    console.log("");
    ui.table([
      ["API Key", config.apiKey ? `${config.apiKey.substring(0, 8)}...` : "not set"],
      ["Model", config.model || "auto"],
      ["Language", config.locale || "en"],
      ["Port", String(config.port || 3456)],
    ]);
    console.log("");
    return;
  }

  const updates: Record<string, unknown> = {};

  if (options.key) updates.apiKey = options.key;
  if (options.model) updates.model = options.model;
  if (options.lang) updates.locale = options.lang;
  if (options.port) updates.port = parseInt(options.port, 10);

  if (Object.keys(updates).length === 0) {
    ui.warn("No options provided. Use --show to view current config.");
    return;
  }

  saveConfig(updates);
  ui.success(t("cli.configSaved"));

  const config = loadConfig();
  console.log("");
  ui.table([
    ["API Key", config.apiKey ? `${config.apiKey.substring(0, 8)}...` : "not set"],
    ["Model", config.model || "auto"],
    ["Language", config.locale || "en"],
    ["Port", String(config.port || 3456)],
  ]);
  console.log("");
}

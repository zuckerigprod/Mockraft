import { writeFileSync } from "node:fs";
import { parseSpec, generateMockData, initI18n, t } from "@mockraft/core";
import type { ParsedEndpoint } from "@mockraft/core";
import { loadSpec } from "../utils/file-loader.js";
import { loadConfig } from "../utils/config.js";
import { ui } from "../ui/terminal-ui.js";

interface GenerateOptions {
  output?: string;
  count?: string;
  endpoint?: string;
  key?: string;
  model?: string;
  lang?: string;
}

export async function generateCommand(specPath: string, options: GenerateOptions) {
  const config = loadConfig();
  const locale = options.lang || config.locale || "en";
  await initI18n(locale);

  ui.logo();

  const spinner = ui.spinner(t("spec.parsing"));
  spinner.start();

  const specContent = await loadSpec(specPath);
  const spec = await parseSpec(specContent);
  spinner.succeed(t("cli.specLoaded", { title: spec.title, version: spec.version }));

  const apiKey = options.key || config.apiKey;
  const count = parseInt(options.count || "3", 10);

  let endpoints: ParsedEndpoint[] = spec.endpoints;
  if (options.endpoint) {
    endpoints = endpoints.filter(ep =>
      `${ep.method} ${ep.path}`.toLowerCase().includes(options.endpoint!.toLowerCase()) ||
      ep.operationId?.toLowerCase().includes(options.endpoint!.toLowerCase())
    );
  }

  const genSpinner = ui.spinner(t("cli.generating"));
  genSpinner.start();

  const result: Record<string, unknown> = {};

  for (const ep of endpoints) {
    const response = ep.responses.find(r => r.statusCode.startsWith("2") && r.schema);
    if (!response?.schema) continue;

    const key = `${ep.method} ${ep.path}`;
    const isArray = response.schema.type === "array";
    const schema = isArray ? response.schema.items || response.schema : response.schema;

    const generated = await generateMockData(schema, {
      count: isArray ? count : 1,
      locale,
      aiApiKey: apiKey,
      aiModel: options.model || config.model,
    });

    result[key] = generated.data;
  }

  genSpinner.succeed(t("ai.generated", { model: apiKey ? "AI" : "fallback" }));

  const json = JSON.stringify(result, null, 2);

  if (options.output) {
    writeFileSync(options.output, json, "utf-8");
    ui.success(`Saved to ${options.output}`);
  } else {
    console.log(json);
  }
}

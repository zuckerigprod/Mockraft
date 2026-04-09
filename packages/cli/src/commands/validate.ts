import { parseSpec, initI18n, t } from "@mockraft/core";
import { loadSpec } from "../utils/file-loader.js";
import { ui } from "../ui/terminal-ui.js";

interface ValidateOptions {
  lang?: string;
}

export async function validateCommand(specPath: string, options: ValidateOptions) {
  await initI18n(options.lang || "en");

  ui.logo();

  const spinner = ui.spinner(t("spec.parsing"));
  spinner.start();

  try {
    const content = await loadSpec(specPath);
    const spec = await parseSpec(content);
    spinner.succeed(t("cli.specLoaded", { title: spec.title, version: spec.version }));

    console.log("");
    ui.table([
      ["Title", spec.title],
      ["Version", spec.version],
      ["Base URL", spec.baseUrl || "N/A"],
      ["Endpoints", String(spec.endpoints.length)],
      ["Schemas", String(Object.keys(spec.schemas).length)],
    ]);
    console.log("");

    ui.info(t("cli.endpointsFound", { count: spec.endpoints.length }));
    console.log("");

    for (const ep of spec.endpoints) {
      ui.endpoint(ep.method, ep.path);
    }

    console.log("");
  } catch (err) {
    spinner.fail(t("spec.invalid"));
    ui.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

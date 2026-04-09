import { parseSpec, createMockServer, initI18n, t } from "@mockraft/core";
import { loadSpec } from "../utils/file-loader.js";
import { loadConfig } from "../utils/config.js";
import { ui } from "../ui/terminal-ui.js";

interface StartOptions {
  port?: string;
  key?: string;
  model?: string;
  lang?: string;
  proxy?: string;
}

export async function startCommand(specPath: string, options: StartOptions) {
  const config = loadConfig();
  const locale = options.lang || config.locale || "en";
  await initI18n(locale);

  ui.logo();

  const spinner = ui.spinner(t("spec.parsing"));
  spinner.start();

  let specContent: string;
  try {
    specContent = await loadSpec(specPath);
  } catch (err) {
    spinner.fail(t("spec.invalid"));
    ui.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }

  let spec;
  try {
    spec = await parseSpec(specContent);
  } catch (err) {
    spinner.fail(t("spec.invalid"));
    ui.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }

  spinner.succeed(t("cli.specLoaded", { title: spec.title, version: spec.version }));
  ui.info(t("cli.endpointsFound", { count: spec.endpoints.length }));

  const apiKey = options.key || config.apiKey;
  const model = options.model || config.model;
  const port = parseInt(options.port || String(config.port || 3456), 10);

  if (!apiKey) {
    ui.warn(t("ai.noKey"));
  } else {
    ui.info(t("ai.model", { model: model || "auto" }));
  }

  const server = createMockServer(spec, {
    port,
    aiApiKey: apiKey,
    aiModel: model,
    locale,
  });

  if (options.proxy) {
    server.setProxy({ target: options.proxy });
    ui.info(t("scenario.proxy", { target: options.proxy }));
  }

  try {
    const { url } = await server.start();
    ui.divider();
    ui.success(t("server.running", { url }));
    ui.divider();
    console.log("");
    ui.info(t("cli.serverReady"));
    console.log("");

    for (const ep of server.getEndpoints()) {
      ui.endpoint(ep.method, `${url}${ep.path}`);
    }

    console.log("");
    ui.dim("Press Ctrl+C to stop");
    console.log("");

    process.on("SIGINT", async () => {
      console.log("");
      await server.stop();
      ui.success(t("server.stopped"));
      process.exit(0);
    });
  } catch (err) {
    ui.error(t("server.error", { message: err instanceof Error ? err.message : String(err) }));
    process.exit(1);
  }
}

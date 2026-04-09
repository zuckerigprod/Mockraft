#!/usr/bin/env node

import { Command } from "commander";
import { startCommand } from "./commands/start.js";
import { generateCommand } from "./commands/generate.js";
import { validateCommand } from "./commands/validate.js";
import { configCommand } from "./commands/config.js";

const program = new Command();

program
  .name("mockraft")
  .description("AI-Powered API Mocking Tool")
  .version("1.0.0");

program
  .command("start")
  .description("Start a mock server from an OpenAPI spec")
  .argument("<spec>", "Path or URL to OpenAPI spec file")
  .option("-p, --port <port>", "Server port", "3456")
  .option("-k, --key <key>", "OpenRouter API key")
  .option("-m, --model <model>", "AI model to use")
  .option("-l, --lang <lang>", "Language (en/ru)", "en")
  .option("--proxy <url>", "Proxy unmatched requests to URL")
  .action(startCommand);

program
  .command("generate")
  .description("Generate mock data from an OpenAPI spec")
  .argument("<spec>", "Path or URL to OpenAPI spec file")
  .option("-o, --output <file>", "Output file path")
  .option("-c, --count <count>", "Number of items to generate", "3")
  .option("-e, --endpoint <filter>", "Filter endpoints")
  .option("-k, --key <key>", "OpenRouter API key")
  .option("-m, --model <model>", "AI model to use")
  .option("-l, --lang <lang>", "Language (en/ru)", "en")
  .action(generateCommand);

program
  .command("validate")
  .description("Validate an OpenAPI spec file")
  .argument("<spec>", "Path or URL to OpenAPI spec file")
  .option("-l, --lang <lang>", "Language (en/ru)", "en")
  .action(validateCommand);

program
  .command("config")
  .description("Manage Mockraft configuration")
  .option("-k, --key <key>", "Set OpenRouter API key")
  .option("-m, --model <model>", "Set default AI model")
  .option("-l, --lang <lang>", "Set default language")
  .option("-p, --port <port>", "Set default port")
  .option("-s, --show", "Show current configuration")
  .action(configCommand);

program.parse();

import chalk from "chalk";
import ora from "ora";

export const ui = {
  logo: () => {
    console.log("");
    console.log(chalk.bold.hex("#6C5CE7")("  { Mockraft }"));
    console.log(chalk.gray("  AI-Powered API Mocking"));
    console.log("");
  },

  success: (msg: string) => console.log(chalk.green("  ✓ ") + msg),
  error: (msg: string) => console.log(chalk.red("  ✗ ") + msg),
  info: (msg: string) => console.log(chalk.blue("  ℹ ") + msg),
  warn: (msg: string) => console.log(chalk.yellow("  ⚠ ") + msg),
  dim: (msg: string) => console.log(chalk.gray("    " + msg)),

  spinner: (text: string) => ora({ text, color: "magenta", spinner: "dots" }),

  endpoint: (method: string, path: string) => {
    const colors: Record<string, typeof chalk> = {
      GET: chalk.green,
      POST: chalk.yellow,
      PUT: chalk.blue,
      PATCH: chalk.cyan,
      DELETE: chalk.red,
    };
    const colorFn = colors[method] || chalk.white;
    console.log(`    ${colorFn(method.padEnd(7))} ${path}`);
  },

  divider: () => console.log(chalk.gray("  " + "─".repeat(40))),

  table: (rows: [string, string][]) => {
    const maxKey = Math.max(...rows.map(([k]) => k.length));
    for (const [key, value] of rows) {
      console.log(`    ${chalk.gray(key.padEnd(maxKey))}  ${value}`);
    }
  },
};

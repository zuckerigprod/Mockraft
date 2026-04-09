export type LogLevel = "debug" | "info" | "warn" | "error";

let currentLevel: LogLevel = "info";

const levels: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

export function setLogLevel(level: LogLevel) {
  currentLevel = level;
}

function shouldLog(level: LogLevel): boolean {
  return levels[level] >= levels[currentLevel];
}

export const logger = {
  debug: (...args: unknown[]) => shouldLog("debug") && console.debug("[mockraft]", ...args),
  info: (...args: unknown[]) => shouldLog("info") && console.log("[mockraft]", ...args),
  warn: (...args: unknown[]) => shouldLog("warn") && console.warn("[mockraft]", ...args),
  error: (...args: unknown[]) => shouldLog("error") && console.error("[mockraft]", ...args),
};

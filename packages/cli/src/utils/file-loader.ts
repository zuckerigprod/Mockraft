import { readFileSync } from "node:fs";

export function loadSpecFromFile(path: string): string {
  return readFileSync(path, "utf-8");
}

export async function loadSpecFromUrl(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch spec from ${url}: ${response.status}`);
  }
  return response.text();
}

export async function loadSpec(source: string): Promise<string> {
  if (source.startsWith("http://") || source.startsWith("https://")) {
    return loadSpecFromUrl(source);
  }
  return loadSpecFromFile(source);
}

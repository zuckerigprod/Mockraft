const API_BASE = "/api";

export async function parseSpecApi(content: string) {
  const res = await fetch(`${API_BASE}/parse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function startServerApi(options: {
  specContent: string;
  port?: number;
  apiKey?: string;
  model?: string;
  locale?: string;
}) {
  const res = await fetch(`${API_BASE}/server/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function stopServerApi() {
  const res = await fetch(`${API_BASE}/server/stop`, { method: "POST" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function generateDataApi(options: {
  specContent: string;
  endpoint?: string;
  count?: number;
  apiKey?: string;
  model?: string;
  locale?: string;
  naturalLangHint?: string;
}) {
  const res = await fetch(`${API_BASE}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function setScenarioApi(method: string, path: string, scenario: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/scenarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ method, path, scenario }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

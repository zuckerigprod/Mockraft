import express from "express";
import cors from "cors";
import { parseSpec, createMockServer, generateMockData } from "@mockraft/core";
import type { MockServer } from "@mockraft/core";

const app = express();
const PORT = parseInt(process.env.PORT || "4000");

app.use(cors());
app.use(express.json({ limit: "10mb" }));

let activeMockServer: MockServer | null = null;

app.post("/api/parse", async (req, res) => {
  try {
    const { content } = req.body;
    const spec = await parseSpec(content);
    res.json(spec);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : "Parse error" });
  }
});

app.post("/api/server/start", async (req, res) => {
  try {
    if (activeMockServer) {
      await activeMockServer.stop();
    }

    const { specContent, port = 3456, apiKey, model, locale } = req.body;
    const spec = await parseSpec(specContent);

    activeMockServer = createMockServer(spec, {
      port,
      aiApiKey: apiKey,
      aiModel: model,
      locale,
    });

    const result = await activeMockServer.start();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Server start error" });
  }
});

app.post("/api/server/stop", async (_req, res) => {
  try {
    if (activeMockServer) {
      await activeMockServer.stop();
      activeMockServer = null;
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Server stop error" });
  }
});

app.post("/api/generate", async (req, res) => {
  try {
    const { specContent, endpoint, count = 3, apiKey, model, locale, naturalLangHint } = req.body;
    const spec = await parseSpec(specContent);

    const results: Record<string, unknown> = {};

    for (const ep of spec.endpoints) {
      const key = `${ep.method} ${ep.path}`;
      if (endpoint && !key.toLowerCase().includes(endpoint.toLowerCase())) continue;

      const response = ep.responses.find(r => r.statusCode.startsWith("2") && r.schema);
      if (!response?.schema) continue;

      const isArray = response.schema.type === "array";
      const schema = isArray ? response.schema.items || response.schema : response.schema;

      const generated = await generateMockData(schema, {
        count: isArray ? count : 1,
        locale,
        aiApiKey: apiKey,
        aiModel: model,
        naturalLangHint,
      });

      results[key] = generated.data;
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Generation error" });
  }
});

app.post("/api/scenarios", async (req, res) => {
  try {
    if (!activeMockServer) {
      res.status(400).json({ error: "No active mock server" });
      return;
    }
    const { method, path, scenario } = req.body;
    activeMockServer.setScenario(method, path, scenario);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Scenario error" });
  }
});

app.listen(PORT, () => {
  console.log(`Mockraft API server running at http://localhost:${PORT}`);
});

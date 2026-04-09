import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Play, Zap, Clock, AlertTriangle } from "lucide-react";
import type { ParsedEndpoint, ScenarioConfig } from "@mockraft/core/browser";
import { Button } from "../shared/Button.js";
import { CodeBlock } from "../shared/CodeBlock.js";
import { Input } from "../shared/Input.js";
import { useStore } from "../../store/index.js";
import { generateDataApi } from "../../api/backend.js";

interface EndpointDetailProps {
  endpoint: ParsedEndpoint;
}

export function EndpointDetail({ endpoint }: EndpointDetailProps) {
  const { t } = useTranslation();
  const { specRaw, apiKey, aiModel, locale, generatedData, setGeneratedData, scenarios, setScenario } = useStore();
  const [loading, setLoading] = useState(false);
  const [nlHint, setNlHint] = useState("");
  const [delayMs, setDelayMs] = useState("");
  const [errorRate, setErrorRate] = useState("");

  const key = `${endpoint.method} ${endpoint.path}`;
  const data = generatedData[key];
  const scenario = scenarios[key];

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateDataApi({
        specContent: specRaw,
        endpoint: key,
        count: 5,
        apiKey,
        model: aiModel,
        locale,
        naturalLangHint: nlHint || undefined,
      });
      setGeneratedData(key, result);
    } catch {
      setGeneratedData(key, { error: "Generation failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleScenario = () => {
    const config: ScenarioConfig = {};
    if (delayMs) config.delayMs = parseInt(delayMs);
    if (errorRate) config.errorRate = parseInt(errorRate);
    setScenario(key, config);
  };

  const response = endpoint.responses.find(r => r.statusCode.startsWith("2"));

  return (
    <div className="bg-surface-900 border border-surface-800 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <span className="px-2.5 py-1 rounded text-sm font-bold bg-primary-600/20 text-primary-400 border border-primary-600/30">
          {endpoint.method}
        </span>
        <span className="font-mono text-surface-200">{endpoint.path}</span>
      </div>

      {endpoint.summary && (
        <p className="text-sm text-surface-400 mb-4">{endpoint.summary}</p>
      )}

      {endpoint.parameters.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-surface-300 mb-2">Parameters</h4>
          <div className="space-y-1">
            {endpoint.parameters.map((p) => (
              <div key={p.name} className="flex items-center gap-2 text-sm">
                <span className="text-surface-400 font-mono">{p.name}</span>
                <span className="text-surface-600">({p.in})</span>
                {p.required && <span className="text-red-400 text-xs">required</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {response && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-surface-300 mb-2">{t("endpoint.responses")} ({response.statusCode})</h4>
        </div>
      )}

      <div className="mb-4">
        <textarea
          className="w-full bg-surface-800 border border-surface-700 rounded-lg p-3 text-sm text-surface-200
            font-mono placeholder:text-surface-500 focus:outline-none focus:border-primary-500 transition-colors resize-none h-20"
          placeholder={t("nlp.placeholder")}
          value={nlHint}
          onChange={(e) => setNlHint(e.target.value)}
        />
        <p className="text-xs text-surface-500 mt-1">{t("nlp.example")}</p>
      </div>

      <div className="flex gap-2 mb-4">
        <Button onClick={handleGenerate} disabled={loading} icon={<Play size={16} />}>
          {loading ? t("ai.generating") : t("endpoint.generate")}
        </Button>
      </div>

      {data !== undefined && (
        <div className="mb-4">
          <CodeBlock code={JSON.stringify(data, null, 2)} />
        </div>
      )}

      <div className="border-t border-surface-800 pt-4 mt-4">
        <h4 className="text-sm font-medium text-surface-300 mb-3 flex items-center gap-2">
          <Zap size={14} />
          Scenarios
        </h4>
        <div className="flex gap-3 items-end">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-surface-500" />
            <Input
              placeholder="ms"
              value={delayMs}
              onChange={(e) => setDelayMs(e.target.value)}
              className="w-24"
            />
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-surface-500" />
            <Input
              placeholder="%"
              value={errorRate}
              onChange={(e) => setErrorRate(e.target.value)}
              className="w-24"
            />
          </div>
          <Button variant="secondary" size="sm" onClick={handleScenario}>Apply</Button>
        </div>
        {scenario && (
          <div className="mt-2 text-xs text-surface-500">
            {scenario.delayMs && <span>{t("scenario.delay", { ms: scenario.delayMs })} </span>}
            {scenario.errorRate && <span>{t("scenario.error", { percent: scenario.errorRate })}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

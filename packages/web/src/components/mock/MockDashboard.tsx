import { useTranslation } from "react-i18next";
import { Play, Square, RefreshCw } from "lucide-react";
import { Button } from "../shared/Button.js";
import { SpecPreview } from "../spec/SpecPreview.js";
import { EndpointDetail } from "./EndpointDetail.js";
import { useStore } from "../../store/index.js";
import { startServerApi, stopServerApi } from "../../api/backend.js";
import { useState } from "react";

export function MockDashboard() {
  const { t } = useTranslation();
  const {
    spec, specRaw, selectedEndpoint, setSelectedEndpoint,
    serverRunning, setServerRunning, serverUrl, setServerUrl,
    serverPort, apiKey, aiModel, locale, setError,
  } = useStore();
  const [starting, setStarting] = useState(false);

  if (!spec) return null;

  const handleStart = async () => {
    setStarting(true);
    try {
      const result = await startServerApi({
        specContent: specRaw,
        port: serverPort,
        apiKey,
        model: aiModel,
        locale,
      });
      setServerUrl(result.url);
      setServerRunning(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start server");
    } finally {
      setStarting(false);
    }
  };

  const handleStop = async () => {
    try {
      await stopServerApi();
      setServerRunning(false);
      setServerUrl("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to stop server");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-surface-100">{spec.title}</h2>
          <p className="text-sm text-surface-500">v{spec.version} &middot; {spec.endpoints.length} endpoints</p>
        </div>
        <div className="flex items-center gap-3">
          {serverRunning && (
            <span className="flex items-center gap-2 text-sm text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {serverUrl}
            </span>
          )}
          {serverRunning ? (
            <Button variant="danger" onClick={handleStop} icon={<Square size={16} />}>
              {t("action.stop")}
            </Button>
          ) : (
            <Button onClick={handleStart} disabled={starting} icon={starting ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}>
              {starting ? "..." : t("action.start")}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SpecPreview spec={spec} onSelect={setSelectedEndpoint} selected={selectedEndpoint} />
        </div>
        <div className="lg:col-span-2">
          {selectedEndpoint ? (
            <EndpointDetail endpoint={selectedEndpoint} />
          ) : (
            <div className="bg-surface-900 border border-surface-800 rounded-xl p-12 text-center">
              <p className="text-surface-500">{t("endpoint.configure")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

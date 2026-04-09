import { useTranslation } from "react-i18next";
import type { ParsedSpec, ParsedEndpoint } from "@mockraft/core/browser";

interface SpecPreviewProps {
  spec: ParsedSpec;
  onSelect: (endpoint: ParsedEndpoint) => void;
  selected?: ParsedEndpoint | null;
}

const methodColors: Record<string, string> = {
  GET: "bg-green-600/20 text-green-400 border-green-600/30",
  POST: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
  PUT: "bg-blue-600/20 text-blue-400 border-blue-600/30",
  PATCH: "bg-cyan-600/20 text-cyan-400 border-cyan-600/30",
  DELETE: "bg-red-600/20 text-red-400 border-red-600/30",
  HEAD: "bg-purple-600/20 text-purple-400 border-purple-600/30",
  OPTIONS: "bg-gray-600/20 text-gray-400 border-gray-600/30",
};

export function SpecPreview({ spec, onSelect, selected }: SpecPreviewProps) {
  const { t } = useTranslation();

  const grouped = spec.endpoints.reduce<Record<string, ParsedEndpoint[]>>((acc, ep) => {
    const tag = ep.tags?.[0] || "default";
    if (!acc[tag]) acc[tag] = [];
    acc[tag].push(ep);
    return acc;
  }, {});

  return (
    <div className="bg-surface-900 border border-surface-800 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-surface-800">
        <h3 className="font-semibold text-surface-200">{spec.title} <span className="text-surface-500">v{spec.version}</span></h3>
        <p className="text-xs text-surface-500 mt-1">{t("spec.parsed", { count: spec.endpoints.length })}</p>
      </div>
      <div className="divide-y divide-surface-800/50">
        {Object.entries(grouped).map(([tag, endpoints]) => (
          <div key={tag}>
            <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-surface-500 bg-surface-800/30">
              {tag}
            </div>
            {endpoints.map((ep, i) => {
              const isSelected = selected?.method === ep.method && selected?.path === ep.path;
              return (
                <button
                  key={`${ep.method}-${ep.path}-${i}`}
                  onClick={() => onSelect(ep)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer ${
                    isSelected ? "bg-primary-600/10 border-l-2 border-primary-500" : "hover:bg-surface-800/50 border-l-2 border-transparent"
                  }`}
                >
                  <span className={`px-2 py-0.5 rounded text-xs font-bold border ${methodColors[ep.method] || methodColors.GET}`}>
                    {ep.method}
                  </span>
                  <span className="text-sm text-surface-300 font-mono truncate">{ep.path}</span>
                  {ep.summary && (
                    <span className="text-xs text-surface-500 truncate ml-auto">{ep.summary}</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

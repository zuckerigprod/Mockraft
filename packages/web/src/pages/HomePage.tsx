import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Braces, Zap, Globe, Terminal, Cpu, Shield } from "lucide-react";
import { Button } from "../components/shared/Button.js";

const features = [
  { icon: Cpu, titleKey: "feature.ai.title", descKey: "feature.ai.desc" },
  { icon: Zap, titleKey: "feature.server.title", descKey: "feature.server.desc" },
  { icon: Terminal, titleKey: "feature.cli.title", descKey: "feature.cli.desc" },
  { icon: Globe, titleKey: "feature.openapi.title", descKey: "feature.openapi.desc" },
  { icon: Shield, titleKey: "feature.scenarios.title", descKey: "feature.scenarios.desc" },
  { icon: Braces, titleKey: "feature.fallback.title", descKey: "feature.fallback.desc" },
];

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Braces size={48} className="text-primary-500" />
        </div>
        <h1 className="text-5xl font-bold text-white mb-4">Mockraft</h1>
        <p className="text-xl text-surface-400 mb-8">{t("app.tagline")}</p>
        <p className="text-surface-500 max-w-2xl mx-auto mb-10">{t("app.description")}</p>
        <div className="flex items-center justify-center gap-4">
          <Button size="lg" onClick={() => navigate("/editor")}>
            {t("spec.upload")}
          </Button>
          <Button variant="secondary" size="lg" onClick={() => navigate("/editor")}>
            {t("nav.editor")}
          </Button>
        </div>
      </div>

      <div className="mb-16">
        <div className="bg-surface-900 border border-surface-800 rounded-xl p-6">
          <p className="text-sm text-surface-500 mb-2">{t("home.quickstart")}</p>
          <div className="flex items-center gap-3">
            <code className="flex-1 bg-surface-950 rounded-lg px-4 py-3 text-sm text-primary-400 font-mono">
              npx @mockraft/cli start ./api-spec.yaml
            </code>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f) => (
          <div key={f.titleKey} className="bg-surface-900 border border-surface-800 rounded-xl p-5 hover:border-surface-700 transition-colors">
            <f.icon size={24} className="text-primary-500 mb-3" />
            <h3 className="font-semibold text-surface-200 mb-1">{t(f.titleKey)}</h3>
            <p className="text-sm text-surface-500">{t(f.descKey)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

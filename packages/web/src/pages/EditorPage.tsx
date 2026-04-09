import { useTranslation } from "react-i18next";
import { useStore } from "../store/index.js";
import { SpecUploader } from "../components/spec/SpecUploader.js";
import { MockDashboard } from "../components/mock/MockDashboard.js";
import { parseSpecApi } from "../api/backend.js";
import { Toast } from "../components/shared/Toast.js";

export function EditorPage() {
  const { t } = useTranslation();
  const { spec, setSpec, setSpecRaw, error, setError, setLoading } = useStore();

  const handleSpecLoad = async (content: string) => {
    setLoading(true);
    setError(null);
    try {
      const parsed = await parseSpecApi(content);
      setSpec(parsed);
      setSpecRaw(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("spec.invalid"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {!spec ? (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-surface-100 mb-2">{t("nav.editor")}</h2>
          <p className="text-surface-500 mb-6">{t("app.description")}</p>
          <SpecUploader onLoad={handleSpecLoad} />
        </div>
      ) : (
        <MockDashboard />
      )}
      {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
    </div>
  );
}

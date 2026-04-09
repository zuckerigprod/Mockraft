import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import { useStore } from "../../store/index.js";

export function LangSwitcher() {
  const { i18n } = useTranslation();
  const setLocale = useStore((s) => s.setLocale);

  const toggle = () => {
    const next = i18n.language === "en" ? "ru" : "en";
    i18n.changeLanguage(next);
    setLocale(next);
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-surface-400
        hover:text-surface-200 hover:bg-surface-800 transition-colors cursor-pointer"
      title={i18n.language === "en" ? "Switch to Russian" : "Переключить на English"}
    >
      <Languages size={16} />
      <span className="uppercase font-medium">{i18n.language}</span>
    </button>
  );
}

import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Braces, Settings } from "lucide-react";
import { LangSwitcher } from "./LangSwitcher.js";
import { useState } from "react";
import { SettingsModal } from "../settings/SettingsModal.js";

export function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const navItems = [
    { path: "/", label: t("nav.home") },
    { path: "/editor", label: t("nav.editor") },
  ];

  return (
    <>
      <header className="border-b border-surface-800 bg-surface-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 text-surface-100 hover:text-white transition-colors">
              <Braces size={24} className="text-primary-500" />
              <span className="font-bold text-lg">Mockraft</span>
            </Link>
            <nav className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    location.pathname === item.path
                      ? "bg-surface-800 text-surface-100"
                      : "text-surface-400 hover:text-surface-200 hover:bg-surface-800/50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <LangSwitcher />
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-colors cursor-pointer"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>
      </header>
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}

import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Upload, Link as LinkIcon, FileText } from "lucide-react";
import { Button } from "../shared/Button.js";
import { Input } from "../shared/Input.js";

interface SpecUploaderProps {
  onLoad: (content: string) => void;
}

export function SpecUploader({ onLoad }: SpecUploaderProps) {
  const { t } = useTranslation();
  const [dragOver, setDragOver] = useState(false);
  const [url, setUrl] = useState("");
  const [tab, setTab] = useState<"file" | "url" | "paste">("file");

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) onLoad(content);
    };
    reader.readAsText(file);
  }, [onLoad]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleUrlLoad = async () => {
    if (!url) return;
    const res = await fetch(url);
    const content = await res.text();
    onLoad(content);
  };

  const handlePaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    if (content.trim()) onLoad(content);
  };

  const tabs = [
    { id: "file" as const, label: t("spec.upload"), icon: <Upload size={16} /> },
    { id: "url" as const, label: t("spec.fromUrl"), icon: <LinkIcon size={16} /> },
    { id: "paste" as const, label: t("spec.paste"), icon: <FileText size={16} /> },
  ];

  return (
    <div className="bg-surface-900 border border-surface-800 rounded-xl p-6">
      <div className="flex gap-2 mb-6">
        {tabs.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
              tab === item.id
                ? "bg-primary-600 text-white"
                : "bg-surface-800 text-surface-400 hover:text-surface-200"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {tab === "file" && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
            dragOver
              ? "border-primary-500 bg-primary-500/10"
              : "border-surface-700 hover:border-surface-600"
          }`}
        >
          <Upload size={40} className="mx-auto mb-4 text-surface-500" />
          <p className="text-surface-300 mb-2">{t("spec.upload")}</p>
          <p className="text-sm text-surface-500">JSON / YAML</p>
          <input
            type="file"
            accept=".json,.yaml,.yml"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="absolute inset-0 opacity-0 cursor-pointer"
            style={{ position: "relative" }}
          />
        </div>
      )}

      {tab === "url" && (
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="https://petstore.swagger.io/v2/swagger.json"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <Button onClick={handleUrlLoad}>{t("spec.fromUrl")}</Button>
        </div>
      )}

      {tab === "paste" && (
        <textarea
          className="w-full h-48 bg-surface-800 border border-surface-700 rounded-lg p-4 text-sm text-surface-200
            font-mono placeholder:text-surface-500 focus:outline-none focus:border-primary-500 transition-colors resize-none"
          placeholder={t("spec.paste")}
          onChange={handlePaste}
        />
      )}
    </div>
  );
}

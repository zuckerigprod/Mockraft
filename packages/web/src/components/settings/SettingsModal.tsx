import { useTranslation } from "react-i18next";
import { Modal } from "../shared/Modal.js";
import { Input } from "../shared/Input.js";
import { Button } from "../shared/Button.js";
import { useStore } from "../../store/index.js";
import { ALL_MODELS } from "@mockraft/core/browser";
import { useState } from "react";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { t } = useTranslation();
  const { apiKey, aiModel, setApiKey, setAiModel } = useStore();
  const [key, setKey] = useState(apiKey);
  const [model, setModel] = useState(aiModel);

  const handleSave = () => {
    setApiKey(key);
    setAiModel(model);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={t("settings.apiKey")}>
      <div className="flex flex-col gap-4">
        <Input
          label={t("settings.apiKey")}
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="sk-or-v1-..."
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-surface-400">{t("settings.model")}</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="bg-surface-800 border border-surface-700 rounded-lg px-3 py-2 text-sm text-surface-100
              focus:outline-none focus:border-primary-500 transition-colors"
          >
            <option value="">Auto (Free)</option>
            {ALL_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.tier})
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <Button variant="secondary" onClick={onClose}>{t("action.cancel")}</Button>
          <Button onClick={handleSave}>{t("action.save")}</Button>
        </div>
      </div>
    </Modal>
  );
}

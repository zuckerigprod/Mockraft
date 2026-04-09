import { create } from "zustand";
import type { ParsedSpec, ParsedEndpoint, ScenarioConfig } from "@mockraft/core/browser";

interface AppState {
  spec: ParsedSpec | null;
  specRaw: string;
  selectedEndpoint: ParsedEndpoint | null;
  serverRunning: boolean;
  serverUrl: string;
  serverPort: number;
  apiKey: string;
  aiModel: string;
  locale: string;
  generatedData: Record<string, unknown>;
  scenarios: Record<string, ScenarioConfig>;
  loading: boolean;
  error: string | null;

  setSpec: (spec: ParsedSpec | null) => void;
  setSpecRaw: (raw: string) => void;
  setSelectedEndpoint: (ep: ParsedEndpoint | null) => void;
  setServerRunning: (running: boolean) => void;
  setServerUrl: (url: string) => void;
  setServerPort: (port: number) => void;
  setApiKey: (key: string) => void;
  setAiModel: (model: string) => void;
  setLocale: (locale: string) => void;
  setGeneratedData: (key: string, data: unknown) => void;
  setScenario: (key: string, scenario: ScenarioConfig) => void;
  removeScenario: (key: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  spec: null,
  specRaw: "",
  selectedEndpoint: null,
  serverRunning: false,
  serverUrl: "",
  serverPort: 3456,
  apiKey: localStorage.getItem("mockraft-api-key") || "",
  aiModel: localStorage.getItem("mockraft-model") || "",
  locale: localStorage.getItem("mockraft-lang") || "en",
  generatedData: {},
  scenarios: {},
  loading: false,
  error: null,
};

export const useStore = create<AppState>((set) => ({
  ...initialState,

  setSpec: (spec) => set({ spec, error: null }),
  setSpecRaw: (specRaw) => set({ specRaw }),
  setSelectedEndpoint: (selectedEndpoint) => set({ selectedEndpoint }),
  setServerRunning: (serverRunning) => set({ serverRunning }),
  setServerUrl: (serverUrl) => set({ serverUrl }),
  setServerPort: (serverPort) => set({ serverPort }),
  setApiKey: (apiKey) => {
    localStorage.setItem("mockraft-api-key", apiKey);
    set({ apiKey });
  },
  setAiModel: (aiModel) => {
    localStorage.setItem("mockraft-model", aiModel);
    set({ aiModel });
  },
  setLocale: (locale) => {
    localStorage.setItem("mockraft-lang", locale);
    set({ locale });
  },
  setGeneratedData: (key, data) => set((s) => ({
    generatedData: { ...s.generatedData, [key]: data },
  })),
  setScenario: (key, scenario) => set((s) => ({
    scenarios: { ...s.scenarios, [key]: scenario },
  })),
  removeScenario: (key) => set((s) => {
    const scenarios = { ...s.scenarios };
    delete scenarios[key];
    return { scenarios };
  }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));

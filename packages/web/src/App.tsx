import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/Header.js";
import { Footer } from "./components/layout/Footer.js";
import { HomePage } from "./pages/HomePage.js";
import { EditorPage } from "./pages/EditorPage.js";

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-surface-950">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/editor" element={<EditorPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

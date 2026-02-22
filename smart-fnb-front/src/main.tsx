import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { App } from "@/app/App";
import { Toaster } from "@/components/ui/sonner";
import "@/shared/lib/dark-mode"; // 다크모드 초기화 (FOUC 방지)
import "./index.css";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
  </StrictMode>,
);

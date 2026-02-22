import { Routes, Route } from "react-router";
import { RootLayout } from "@/app/layouts/RootLayout";
import { HomePage } from "@/pages/home/HomePage";
import { LoginPage } from "@/pages/login/LoginPage";
import { SignupPage } from "@/pages/signup/SignupPage";
import { ProtectedRoute } from "@/shared/ui/ProtectedRoute";
import { DevSpecPage } from "@/pages/devspec/DevSpecPage";
import { FigmaDetailPage } from "@/pages/figma-detail/FigmaDetailPage";
import { ConventionPage } from "@/pages/convention/ConventionPage";
import { CodeReviewPage } from "@/pages/code-review/CodeReviewPage";
import { PilotPage } from "@/pages/pilot/PilotPage";
import { ChatPage } from "@/pages/chat/ChatPage";
import { BoardPage } from "@/pages/board/BoardPage";
import { ReportPage } from "@/pages/report/ReportPage";

export function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="devspec" element={<DevSpecPage />} />
          <Route path="devspec/figma/:linkId" element={<FigmaDetailPage />} />
          <Route path="convention" element={<ConventionPage />} />
          <Route path="code-review" element={<CodeReviewPage />} />
          <Route path="pilot" element={<PilotPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="board" element={<BoardPage />} />
          <Route path="report" element={<ReportPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

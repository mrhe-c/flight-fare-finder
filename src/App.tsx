import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { NotFound } from "@/components/NotFound";
import { RequireAuth } from "@/components/RequireAuth";
import { LandingPage } from "@/pages/LandingPage";
import { AuthPage } from "@/pages/AuthPage";
import { AppPage } from "@/pages/AppPage";

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<AuthPage mode="signin" />} />
        <Route path="/sign-up" element={<AuthPage mode="signup" />} />
        <Route
          path="/app"
          element={
            <RequireAuth>
              <AppPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster richColors position="top-center" />
    </ErrorBoundary>
  );
}

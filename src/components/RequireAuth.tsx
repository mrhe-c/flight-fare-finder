import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [status, setStatus] = useState<"checking" | "authed" | "anon">("checking");

  useEffect(() => {
    let cancelled = false;
    setStatus("checking");
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      setStatus(session ? "authed" : "anon");
    });
    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  if (status === "checking") return null;

  if (status === "anon") {
    return <Navigate to="/sign-in" replace state={{ redirect: location.pathname }} />;
  }

  return children;
}

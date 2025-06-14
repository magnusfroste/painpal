
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

// Helper wrapper to protect routes
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isLoading, setLoading] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    let ignore = false;
    // Set up Supabase session listener FIRST
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!ignore) setLoggedIn(!!session?.user);
    });
    // Then get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!ignore) {
        setLoggedIn(!!session?.user);
        setLoading(false);
      }
    });
    return () => { ignore = true; listener?.subscription?.unsubscribe(); };
  }, []);

  if (isLoading) {
    return <div className="w-full pt-12 text-center text-lg text-blue-500">Checking authentication…</div>
  }
  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<Auth />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

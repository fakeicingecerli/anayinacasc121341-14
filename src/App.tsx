
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import Loading from "./pages/Loading";
import NotFound from "./pages/NotFound";
import { initMockApi } from "./services/mockApi";

// Lazy loading for better performance
const Index = lazy(() => import("./pages/Index"));
const SteamGuard = lazy(() => import("./pages/SteamGuard"));
const AdminPanel = lazy(() => import("./pages/Admin"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  // Initialize the mock API service
  useEffect(() => {
    initMockApi();
    console.log("App initialized successfully");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/loading" element={<Loading />} />
              <Route path="/steam-guard" element={<SteamGuard />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

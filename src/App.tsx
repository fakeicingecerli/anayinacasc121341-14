
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
    
    // 404 hatalarını izleme
    const handleRouteChange = () => {
      const path = window.location.pathname;
      if (!["/", "/loading", "/steam-guard", "/admin"].includes(path)) {
        console.log(`Potential 404: ${path}`);
      }
    };
    
    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/">
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/loading" element={<Loading />} />
              <Route path="/steam-guard" element={<SteamGuard />} />
              <Route path="/admin" element={<AdminPanel />} />
              {/* Redirect incorrect routes to 404 page */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

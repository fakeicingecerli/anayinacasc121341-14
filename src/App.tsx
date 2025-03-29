
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import { toast } from "sonner";
import Loading from "./pages/Loading";
import NotFound from "./pages/NotFound";
import { initMockApi } from "./services/mockApi";

// Lazy load components for better security and performance
const Index = lazy(() => import("./pages/Index"));
const SteamGuard = lazy(() => import("./pages/SteamGuard"));
const AdminPanel = lazy(() => import("./pages/Admin"));

// Güvenlik bileşeni - Auth gerektiren rotalar için
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Burada auth kontrolü yapabilirsiniz
  // Örneğin, localStorage'da bir token veya oturum durumu kontrol edilebilir
  const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    toast.error("Bu sayfaya erişim yetkiniz yok");
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Optimize edilmiş queryClient yapılandırması
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 30000,
    },
  },
});

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  // Security check
  useEffect(() => {
    // Tarayıcı kontrolü (iframe içinde çalışmayı engelle)
    if (window.top !== window.self) {
      document.body.innerHTML = '';
      alert("Bu uygulama güvenlik nedeniyle iframe içinde çalıştırılamaz.");
      return;
    }
    
    // Initialize the mock API service
    try {
      initMockApi();
      setIsInitialized(true);
    } catch (error) {
      console.error("API initialization error:", error);
      toast.error("Sistem başlatılırken bir hata oluştu. Lütfen sayfayı yenileyin.");
    }
    
    // Genel hata yakalama
    const originalError = console.error;
    console.error = (...args) => {
      // Hata loglarını işleyin/filtreleyin
      originalError(...args);
    };
    
    return () => {
      console.error = originalError;
    };
  }, []);

  // API henüz başlatılmadıysa bir loading göster
  if (!isInitialized) {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/loading" element={<Loading />} />
              <Route path="/steam-guard" element={<SteamGuard />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                } 
              />
              {/* SPA için route eşleşmeleri */}
              <Route path="/index.html" element={<Navigate to="/" replace />} />
              <Route path="/index" element={<Navigate to="/" replace />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

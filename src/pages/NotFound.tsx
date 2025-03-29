
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Güvenlik önlemi: 404 sayfasına erişim kayıtları
    const logSecurityEvent = () => {
      try {
        const securityLogs = JSON.parse(localStorage.getItem('securityLogs') || '[]');
        securityLogs.push({
          type: '404_access',
          path: location.pathname,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        });
        
        // En fazla 100 log sakla (güvenlik ve performans için)
        if (securityLogs.length > 100) {
          securityLogs.splice(0, securityLogs.length - 100);
        }
        
        localStorage.setItem('securityLogs', JSON.stringify(securityLogs));
      } catch (error) {
        console.error("Security log error:", error);
      }
    };
    
    logSecurityEvent();
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Sayfa bulunamadı</p>
        <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

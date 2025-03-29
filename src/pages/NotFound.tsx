
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Sayfa olmayan bir adrese erişildiğinde oturum bilgilerini kontrol et
    const isLoggedIn = localStorage.getItem("steam_user") !== null;
    if (isLoggedIn) {
      console.log("Logged in user encountered 404 page");
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-steam-darkBlue text-white p-4">
      <div className="bg-[#171a21]/90 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full mb-6">
          <span className="text-5xl font-bold text-red-500">404</span>
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Sayfa Bulunamadı</h1>
        <p className="text-gray-400 mb-6">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-[#1a9fff] hover:bg-[#0b86e0] text-white py-2 px-4 rounded-md w-full sm:w-auto transition-colors"
          >
            <Home size={18} />
            <span>Ana Sayfa</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md w-full sm:w-auto transition-colors mt-2 sm:mt-0"
          >
            <ArrowLeft size={18} />
            <span>Geri Dön</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

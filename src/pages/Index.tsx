
import React from 'react';
import SteamLoginForm from '../components/SteamLoginForm';
import SteamBackground from '../components/SteamBackground';
import SteamHeader from '../components/SteamHeader';
import ValveFooter from '../components/ValveFooter';
import { Separator } from '@/components/ui/separator';
import { Shield, AlertTriangle } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col relative bg-steam-darkBlue text-white">
      <SteamBackground />
      
      <SteamHeader />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-3xl space-y-8">
          {/* Educational Disclaimer Banner */}
          <div className="bg-red-500/20 border border-red-500/40 p-3 rounded flex items-center gap-3 animate-pulse">
            <AlertTriangle className="text-red-400 h-6 w-6 flex-shrink-0" />
            <p className="text-sm text-white/90">
              <span className="font-bold">Eğitim Amaçlı Simülasyon:</span> Bu sayfa, bir üniversite sunumu için phishing farkındalığı oluşturmak amacıyla tasarlanmıştır. Gerçek kimlik bilgilerinizi girmeyin!
            </p>
          </div>
          
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-medium text-white mb-2">Steam Giriş</h1>
            <p className="text-white/70 text-sm">Eğitim amaçlı phishing farkındalık çalışması</p>
          </div>
          
          {/* Login Form */}
          <div className="bg-[#171a21]/70 backdrop-blur-sm p-6 rounded-md shadow-lg animate-fade-in">
            <SteamLoginForm />
          </div>
          
          {/* Educational Content */}
          <div className="bg-blue-500/10 border border-blue-400/30 p-4 rounded-md">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="text-blue-400 h-5 w-5" />
              <h2 className="text-lg font-medium text-blue-400">Phishing Farkındalık Notları</h2>
            </div>
            <ul className="list-disc list-inside space-y-2 text-sm text-white/80">
              <li>Gerçek Steam giriş sayfası daima <code className="bg-black/30 px-1 rounded">steampowered.com</code> adresinde bulunur</li>
              <li>Resmi Steam sayfası, SSL sertifikasına sahiptir (URL'de kilit simgesi)</li>
              <li>Asla şüpheli e-posta bağlantılarına tıklamayın ve giriş bilgilerinizi paylaşmayın</li>
              <li>İki faktörlü kimlik doğrulama her zaman kullanın</li>
              <li>URL'yi her zaman kontrol edin</li>
            </ul>
          </div>
        </div>
      </main>
      
      <ValveFooter />
    </div>
  );
};

export default Index;

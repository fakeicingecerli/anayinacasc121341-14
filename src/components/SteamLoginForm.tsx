
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowRight } from 'lucide-react';

const SteamLoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [qrCode, setQrCode] = useState('/lovable-uploads/dd61aa68-1534-4089-b154-6d063758d1a1.png');
  const [qrExpiry, setQrExpiry] = useState(300); // 5 dakika başlangıç
  const [qrExpiryFormatted, setQrExpiryFormatted] = useState('5:00');

  useEffect(() => {
    // QR kodu için timer
    const timer = setInterval(() => {
      setQrExpiry((prev) => {
        if (prev <= 0) {
          // QR kodunu yenile
          clearInterval(timer);
          return 300; // Sıfırlandığında tekrar 5 dakika başlat
        }
        
        // Süreyi formatla (dakika:saniye)
        const minutes = Math.floor((prev - 1) / 60);
        const seconds = (prev - 1) % 60;
        setQrExpiryFormatted(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
        
        return prev - 1;
      });
    }, 1000);

    // 5 dakika (300 saniye) sonra QR kodunu değiştirme simülasyonu
    const qrChangeTimer = setInterval(() => {
      // Gerçek bir sistemde burada backend'den yeni bir QR kodu alınırdı
      setQrExpiry(300); // Süreyi sıfırla
      setQrExpiryFormatted('5:00');
    }, 300 * 1000);

    return () => {
      clearInterval(timer);
      clearInterval(qrChangeTimer);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Lütfen tüm gerekli alanları doldurun");
      return;
    }

    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      toast.success("Giriş başarılı!");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full">
      {/* Left Side - Username/Password Login */}
      <div className="flex-1">
        <div className="mb-3">
          <h2 className="text-xs font-medium text-blue-400 uppercase">HESAP ADI İLE GİRİŞ YAP</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <Input
            placeholder=""
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-[#32353c] border-0 h-10 text-white"
            required
            disabled={isLoading}
          />
          
          <div className="space-y-1">
            <label className="text-xs font-medium text-white/50 uppercase">
              PAROLA
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#32353c] border-0 h-10 text-white"
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="rememberMe" 
              checked={rememberMe} 
              onCheckedChange={(checked) => setRememberMe(checked === true)}
              disabled={isLoading}
              className="border-steam-gray data-[state=checked]:bg-blue-400"
            />
            <label
              htmlFor="rememberMe"
              className="text-xs font-medium text-white/80 cursor-pointer"
            >
              Beni hatırla
            </label>
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading}
            className="h-10 bg-blue-400 hover:bg-blue-500 text-white w-full"
          >
            Giriş Yap
          </Button>
          
          <a href="#" className="text-center text-xs text-white/60 hover:text-white">
            Yardım edin, giriş yapamıyorum
          </a>
        </form>
      </div>
      
      {/* Right Side - QR Code Login */}
      <div className="flex-1">
        <div className="mb-3">
          <h2 className="text-xs font-medium text-blue-400 uppercase">VEYA QR KODU İLE GİRİŞ YAPIN</h2>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-white p-3 w-48 h-48 mx-auto mb-3 relative">
            <img 
              src="/lovable-uploads/dd61aa68-1534-4089-b154-6d063758d1a1.png" 
              alt="QR Code" 
              className="w-full h-full"
            />
            <div className="absolute bottom-2 right-2 text-xs font-mono bg-black/10 px-1.5 py-0.5 rounded">
              {qrExpiryFormatted}
            </div>
          </div>
          <p className="text-center text-xs text-white/70">
            QR kodunu giriş yapmak için <br/>
            <a href="#" className="text-blue-400 hover:text-blue-300">
              Steam mobil uygulamasını
            </a> kullanın.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SteamLoginForm;

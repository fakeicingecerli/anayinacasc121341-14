
import React, { useState } from 'react';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Lütfen tüm gerekli alanları doldurun");
      return;
    }

    setIsLoading(true);
    
    // Log credentials for educational purposes only
    console.log('Educational demo - Credentials submitted:', { username, password });
    
    setTimeout(() => {
      toast.success("Giriş başarılı! Bu bir eğitim sunumudur.");
      setIsLoading(false);
      
      // For educational purposes, show a warning about phishing
      setTimeout(() => {
        toast.warning("Bu bir phishing farkındalık sunumudur. Gerçek sitelerde asla bilgilerinizi paylaşmayın!");
      }, 2000);
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-lg font-medium text-white mb-2">
          HESABINIZA GİRİŞ YAPIN
        </h1>
        <p className="text-xs text-white/70">
          <span className="bg-red-500/80 text-white px-2 py-1 rounded text-xs font-bold">
            ÖNEMLİ: Bu bir eğitim simülasyonudur!
          </span>
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-white/50 uppercase">
            STEAM HESABI ADI
          </label>
          <Input
            placeholder=""
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-[#32353c] border-0 h-10 text-white"
            required
            disabled={isLoading}
          />
        </div>
        
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
        
        <div className="text-center mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-xs">
          <p className="text-red-400 font-medium">
            Bu bir phishing farkındalık eğitim simülasyonudur.<br />
            Üniversite eğitim sunumu için hazırlanmıştır.<br />
            Gerçek sitelerde asla bilgilerinizi paylaşmayın!
          </p>
        </div>
      </form>
    </div>
  );
};

export default SteamLoginForm;

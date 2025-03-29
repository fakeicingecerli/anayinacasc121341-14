
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Check if password is correct
    if (password === '000000') {
      setTimeout(() => {
        setIsLoading(false);
        toast.success('Giriş başarılı');
        onLoginSuccess();
      }, 1000);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        toast.error('Yanlış şifre, tekrar deneyin');
        setAttempts(prev => prev + 1);
        
        // If too many attempts, show a different message
        if (attempts >= 4) {
          toast.error('Çok fazla başarısız deneme');
        }
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1b2838] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl">Admin Paneli Giriş</CardTitle>
        </CardHeader>
        <CardContent>
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
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || password.length !== 6}
            >
              {isLoading ? 'Giriş Yapılıyor...' : 'Giriş'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;

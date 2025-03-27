
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const SteamHeader = () => {
  return (
    <header className="w-full py-4 animate-slide-down">
      <div className="container max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <img 
            src="/lovable-uploads/79d8bc20-1115-46d2-bb13-1e1a4e587926.png" 
            alt="Steam Logo" 
            className="h-8 object-contain"
          />
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-white/90 hover:text-white text-sm font-medium transition-colors">
              STORE
            </a>
            <a href="#" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
              COMMUNITY
            </a>
            <a href="#" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
              ABOUT
            </a>
            <a href="#" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
              SUPPORT
            </a>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 text-sm">
            Install Steam
          </Button>
          
          <Button variant="ghost" className="text-white/90 hover:text-white hover:bg-white/10 text-sm">
            Login
          </Button>
          
          <Button size="icon" variant="ghost" className="md:hidden text-white/70 hover:text-white hover:bg-white/10">
            <Menu size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default SteamHeader;

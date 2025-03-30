
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Download } from 'lucide-react';

const SteamHeader = () => {
  return (
    <header className="w-full py-3 bg-steam-darkBlue animate-slide-down">
      <div className="container max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <img 
            src="/lovable-uploads/923d1beb-4d79-406c-bebf-dee6537446d3.png" 
            alt="Steam Logo" 
            className="h-8 object-contain"
          />
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-blue-400 hover:text-white text-sm font-medium transition-colors border-b-2 border-blue-400 pb-1">
              MAĞAZA
            </a>
            <a href="#" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
              TOPLULUK
            </a>
            <a href="#" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
              HAKKINDA
            </a>
            <a href="#" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
              DESTEK
            </a>
          </nav>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-white bg-green-700 hover:bg-green-600 text-xs px-2 py-1 h-7">
            <Download size={14} className="mr-1" />
            Steam'i Yükleyin
          </Button>
          
          <Button variant="ghost" size="sm" className="text-white/90 hover:text-white hover:bg-white/10 text-xs">
            giriş
          </Button>
          
          <span className="text-white/70 text-xs">|</span>
          
          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 text-xs">
            dil
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

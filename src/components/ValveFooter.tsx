
import React from 'react';
import { Separator } from '@/components/ui/separator';

const ValveFooter = () => {
  return (
    <footer className="w-full py-6 text-white/70 animate-fade-in">
      <div className="container max-w-5xl flex flex-col items-center space-y-4">
        <div className="flex items-center justify-center space-x-6">
          <img 
            src="/lovable-uploads/6d80784a-bae0-40a6-9b70-c75cbe69b782.png" 
            alt="Valve Logo" 
            className="h-6 opacity-80"
          />
        </div>
        
        <Separator className="bg-white/10 w-full max-w-md" />
        
        <div className="text-xs text-center space-y-2">
          <p>© 2025 Valve Corporation. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">Legal</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">Steam Subscriber Agreement</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">Refunds</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ValveFooter;

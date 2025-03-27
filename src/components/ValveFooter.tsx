
import React from 'react';
import { Separator } from '@/components/ui/separator';

const ValveFooter = () => {
  return (
    <footer className="w-full py-8 text-white/70 animate-fade-in">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex flex-col items-center space-y-5">
            <div className="flex flex-col md:flex-row items-center text-sm text-center space-y-2 md:space-y-0">
              <div className="mr-2">Steam'de yeni misiniz?</div>
              <a href="#" className="bg-blue-400 hover:bg-blue-500 transition-colors py-1 px-4 rounded text-white">
                Hesap oluştur
              </a>
            </div>
            
            <p className="text-xs text-center max-w-xl">
              Ücretsiz ve kolaydır. Milyonlarca yeni arkadaşla beraber oynayabileceğiniz binlerce oyunu keşfedin.
              <a href="#" className="ml-1 text-blue-400 hover:text-blue-300">
                Steam hakkında daha fazla bilgi edinin.
              </a>
            </p>
          </div>
          
          <Separator className="bg-white/10 w-full max-w-md" />
          
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/6d80784a-bae0-40a6-9b70-c75cbe69b782.png" 
              alt="Valve Logo" 
              className="h-5 opacity-80"
            />
          </div>
          
          <div className="text-xs text-center space-y-3">
            <p>© 2025 Valve Corporation. Tüm hakları saklıdır.</p>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
              <a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a>
              <span>|</span>
              <a href="#" className="hover:text-white transition-colors">Yasal</a>
              <span>|</span>
              <a href="#" className="hover:text-white transition-colors">Steam Abonelik Sözleşmesi</a>
              <span>|</span>
              <a href="#" className="hover:text-white transition-colors">İadeler</a>
              <span>|</span>
              <a href="#" className="hover:text-white transition-colors">Çerezler</a>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs">
            <a href="#" className="hover:text-white transition-colors">Valve Hakkında</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">Kariyer</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">Steamworks</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">Steam Dağıtımı</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">Destek</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">Hediye Kartları</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ValveFooter;

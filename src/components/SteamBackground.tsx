
import React from 'react';

const SteamBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-steam-darkBlue to-[#1b2838] opacity-95"></div>
      
      {/* Game background with blur */}
      <div 
        className="absolute inset-0 bg-center bg-cover bg-no-repeat opacity-40 blur-sm"
        style={{
          backgroundImage: `url('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1151640/hero_capsule.jpg'), 
                           url('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/730/hero_capsule.jpg'), 
                           url('https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2553010/hero_capsule.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        }}
      ></div>
    </div>
  );
};

export default SteamBackground;

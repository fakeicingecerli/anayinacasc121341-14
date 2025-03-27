
import React from 'react';
import SteamLoginForm from '../components/SteamLoginForm';
import SteamBackground from '../components/SteamBackground';
import SteamHeader from '../components/SteamHeader';
import ValveFooter from '../components/ValveFooter';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <SteamBackground />
      
      <SteamHeader />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-md space-y-8">
          <SteamLoginForm />
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-md shadow-lg animate-fade-in">
            <div className="space-y-3 text-center">
              <h2 className="text-lg font-medium text-white">New to Steam?</h2>
              <p className="text-sm text-white/80">
                It's free and easy to use. Discover thousands of games to play with millions of new friends.
              </p>
              <button className="mt-2 w-full py-3 px-4 rounded bg-steam-lightBlue hover:bg-steam-lightBlue/90 text-white shadow-md transition-all duration-300 animate-hover-rise">
                Create a New Account
              </button>
              <a href="#" className="block mt-4 text-sm text-steam-lightBlue hover:text-white transition-colors">
                Learn more about Steam
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <ValveFooter />
    </div>
  );
};

export default Index;

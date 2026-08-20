import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-brand-dark flex flex-col font-sans text-gray-900 dark:text-gray-100 overflow-hidden relative transition-colors duration-300">
      
      {/* Background Animated Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-brand-green/20 rounded-full mix-blend-screen filter blur-[150px] animate-blob pointer-events-none"></div>
      <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-brand-gold/20 rounded-full mix-blend-screen filter blur-[150px] animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[70%] h-[70%] bg-brand-accent/20 rounded-full mix-blend-screen filter blur-[150px] animate-blob animation-delay-4000 pointer-events-none"></div>

      {/* Floating Header */}
      <header className="relative z-50 p-6 md:p-10 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-green to-emerald-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
            <span className="font-black text-white text-xl">Z</span>
          </div>
          <h1 className="font-black text-2xl tracking-tighter text-gray-900 dark:text-white">
            ZIMXI<span className="text-brand-green">FPL</span>
          </h1>
        </div>
        
        <nav className="flex gap-4">
          {user ? (
            <Link 
              to="/dashboard" 
              className="bg-white/50 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 border border-gray-200 dark:border-white/20 text-gray-900 dark:text-white px-6 py-2.5 rounded-full font-bold transition backdrop-blur-md shadow-sm"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link 
                to="/login" 
                className="hidden md:inline-flex bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 px-6 py-2.5 rounded-full font-bold transition"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="bg-brand-green hover:bg-emerald-500 text-white dark:text-brand-dark px-6 py-2.5 rounded-full font-black shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition transform hover:-translate-y-1"
              >
                Play Now
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center text-center p-4 relative z-10">
        <div className="max-w-4xl mx-auto mt-10 md:mt-0">
          
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-brand-green/30 bg-brand-green/10 text-brand-green text-xs font-black uppercase tracking-widest backdrop-blur-sm animate-float">
            Season 2026/27 Now Open
          </div>

          <h2 className="text-6xl md:text-8xl font-black mb-6 leading-[1.1] tracking-tighter text-gray-900 dark:text-white">
            Build Your <br/>
            <span className="text-gradient">Dream Team</span>
          </h2>
          
          <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 font-light max-w-2xl mx-auto mb-12">
            The ultimate Fantasy Premier League experience for the Zimbabwe Castle Lager PSL. Compete with friends, climb the leaderboard, and claim glory.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
             <Link 
              to="/register" 
              className="bg-brand-green text-white dark:text-brand-dark font-black px-10 py-5 rounded-2xl text-lg shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:bg-emerald-500 hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all transform hover:-translate-y-1"
            >
              Create Your Squad &rarr;
            </Link>
          </div>
        </div>

        {/* Feature Cards Showcase */}
        <div className="w-full max-w-6xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
          <div className="glass-dark p-8 rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full mix-blend-screen filter blur-[80px] opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="text-4xl mb-4 relative z-10">🌍</div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 relative z-10">Mini-Leagues</h3>
            <p className="text-gray-500 dark:text-gray-400 font-light relative z-10">Create private leagues, invite your friends with a join code, and settle the debate on who is the ultimate football manager.</p>
          </div>
          
          <div className="glass-dark p-8 rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl relative overflow-hidden group transform md:-translate-y-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green rounded-full mix-blend-screen filter blur-[80px] opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="text-4xl mb-4 relative z-10">📊</div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 relative z-10">Live Transfers</h3>
            <p className="text-gray-500 dark:text-gray-400 font-light relative z-10">Navigate the dynamic transfer market. Spot bargains, manage your $100m budget, and adapt to injuries each gameweek.</p>
          </div>
          
          <div className="glass-dark p-8 rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold rounded-full mix-blend-screen filter blur-[80px] opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="text-4xl mb-4 relative z-10">⭐</div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 relative z-10">Chips & Captains</h3>
            <p className="text-gray-500 dark:text-gray-400 font-light relative z-10">Play your Wildcard, Triple Captain, or Bench Boost at the perfect moment to dominate your rivals and maximize points.</p>
          </div>
        </div>

      </main>

    </div>
  );
}
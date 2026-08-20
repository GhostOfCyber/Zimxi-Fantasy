import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import RealLeagueTable from '../components/RealLeagueTable';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Dashboard() {
  const { user } = useAuth();

  const sponsors = [
    "Castle Lager", "Betterbrands", "Old Mutual", "Econet", 
    "Intratek", "Delta", "Simbisa Brands"
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-brand-dark font-sans flex flex-col text-gray-900 dark:text-gray-100 relative overflow-hidden transition-colors duration-300">
      
      {/* Background Blobs for Glassmorphism Effect */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-green/20 rounded-full mix-blend-screen filter blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-accent/20 rounded-full mix-blend-screen filter blur-[150px] pointer-events-none"></div>

      <Navbar />
      
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-10 relative z-10">
        
        {/* 2. STATUS BAR */}
        <div className="glass-dark rounded-3xl p-8 md:p-10 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green rounded-full mix-blend-screen filter blur-[100px] opacity-20 pointer-events-none"></div>

            <div className="relative z-10 text-center md:text-left">
                <h2 className="text-gray-600 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Current Status</h2>
                <div className="flex items-baseline gap-4 justify-center md:justify-start">
                    <span className="text-5xl md:text-7xl font-black text-gradient">{user?.points || 0}</span>
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Points</span>
                </div>
                <div className="mt-4 text-sm bg-white/50 dark:bg-black/40 border border-gray-200 dark:border-white/10 inline-flex px-4 py-2 rounded-xl text-gray-800 dark:text-gray-300 shadow-sm dark:shadow-inner">
                    <span className="opacity-70 mr-2">Team:</span> <span className="text-gray-900 dark:text-white font-bold">{user?.teamName || "My Team"}</span>
                </div>
            </div>

            <div className="relative z-10 flex flex-col items-center md:items-end bg-white/50 dark:bg-white/5 p-6 rounded-2xl border border-gray-200 dark:border-white/5 backdrop-blur-md shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                    <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span>
                    <span className="text-xs font-bold uppercase text-red-500 dark:text-red-400 tracking-wider">Deadline Approaching</span>
                </div>
                <div className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">Gameweek 35</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">Sat 14 Aug, 15:00 CAT</div>
            </div>
        </div>

        {/* 3. MAIN ACTION GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Manage Team */}
            <Link to="/my-team" className="glass-card p-6 flex flex-col items-start group">
                <div className="w-12 h-12 bg-brand-green/20 text-brand-green rounded-xl flex items-center justify-center mb-5 group-hover:bg-brand-green group-hover:text-white dark:group-hover:text-brand-dark transition-all duration-300 shadow-sm dark:shadow-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white">Manage Team</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-light">Pick your starting XI</p>
            </Link>

            {/* Transfers */}
            <Link to="/transfers" className="glass-card p-6 flex flex-col items-start group">
                <div className="w-12 h-12 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-sm dark:shadow-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white">Transfers</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-light">Buy & sell players</p>
            </Link>

            {/* Leagues */}
            <Link to="/leaderboard" className="glass-card p-6 flex flex-col items-start group">
                <div className="w-12 h-12 bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-5 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300 shadow-sm dark:shadow-lg">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white">Leagues</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-light">Create or join rivals</p>
            </Link>

             {/* Compare Card */}
             <Link to="/comparison" className="glass-card p-6 flex flex-col items-start group relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-gold rounded-full opacity-10 group-hover:scale-150 transition-all duration-500 blur-2xl"></div>
                <div className="relative z-10 w-full">
                    <div className="w-12 h-12 bg-brand-gold/20 text-brand-gold rounded-xl flex items-center justify-center mb-5 group-hover:bg-brand-gold group-hover:text-white dark:group-hover:text-brand-dark transition-all duration-300 shadow-sm dark:shadow-lg">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg>
                    </div>
                    <h3 className="font-bold text-xl text-brand-gold">Compare Players</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 font-light">Head-to-head stats</p>
                </div>
            </Link>
        </div>

        {/* 4. CONTENT AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                 <div className="glass-dark rounded-2xl overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-white/50 dark:bg-white/5">
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">Castle Lager PSL Table</h3>
                        <span className="text-[10px] bg-brand-green/20 border border-brand-green/50 text-brand-green px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm dark:shadow-[0_0_10px_rgba(16,185,129,0.2)]">Live</span>
                    </div>
                    <div className="p-2">
                        <RealLeagueTable />
                    </div>
                 </div>
            </div>
            
            <div className="space-y-8">
                {/* Mini Leaderboard Widget */}
                <div className="glass-card p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3 text-lg border-b border-gray-200 dark:border-white/10 pb-4">
                        <span className="text-brand-gold text-xl">🏆</span> Top Managers
                    </h3>
                    <div className="space-y-4">
                        {[
                            {n: 'The Special One', p: 1240},
                            {n: 'Warrior FC', p: 1198},
                            {n: 'Highlander99', p: 1150}
                        ].map((u, i) => (
                            <div key={i} className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-white/5 last:border-0 pb-3 last:pb-0">
                                <div className="flex items-center gap-4">
                                    <span className={`font-black w-8 h-8 flex items-center justify-center rounded-lg text-sm shadow-md ${i===0 ? 'bg-gradient-to-br from-brand-gold to-yellow-600 text-white dark:text-brand-dark' : 'bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300'}`}>{i+1}</span>
                                    <span className="font-medium text-gray-800 dark:text-gray-200 text-base">{u.n}</span>
                                </div>
                                <span className="font-black text-brand-green text-lg">{u.p}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sponsors */}
                <div className="glass p-6 rounded-2xl text-center border-t border-gray-200 dark:border-white/20">
                    <h4 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-5">Official Partners</h4>
                    <div className="flex flex-wrap justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition duration-700">
                        {sponsors.slice(0,4).map((s, i) => (
                            <span key={i} className="text-xs font-bold text-gray-600 dark:text-gray-300 bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded border border-gray-200 dark:border-white/10">{s}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
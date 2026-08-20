import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Comparison() {
  const [playerAId, setPlayerAId] = useState('');
  const [playerBId, setPlayerBId] = useState('');

  const { data: players, isLoading } = useQuery({
    queryKey: ['players'],
    queryFn: () => apiClient.get('/public/players').then((res) => res.data),
  });

  if (isLoading) return <div className="p-20 text-center font-bold tracking-widest uppercase text-gray-500 bg-gray-50 dark:bg-brand-dark min-h-screen">Loading Market...</div>;

  const playerA = players?.find(p => p._id === playerAId);
  const playerB = players?.find(p => p._id === playerBId);

  // Stats to compare
  const compareStats = [
    { label: 'Price', key: 'price', format: (v) => `$${v}m` },
    { label: 'Total Points', key: 'points', format: (v) => v },
    { label: 'Goals', key: 'goals', format: (v) => v },
    { label: 'Assists', key: 'assists', format: (v) => v },
    { label: 'Clean Sheets', key: 'cleanSheets', format: (v) => v },
    { label: 'Minutes', key: 'minutes', format: (v) => v },
    { label: 'Yellow Cards', key: 'yellowCards', format: (v) => v, reverse: true },
    { label: 'Red Cards', key: 'redCards', format: (v) => v, reverse: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-brand-dark flex flex-col font-sans text-gray-900 dark:text-gray-100 relative overflow-hidden transition-colors duration-300">
       <div className="absolute top-1/4 left-1/4 w-[50%] h-[50%] bg-brand-gold/10 rounded-full mix-blend-screen filter blur-[150px] pointer-events-none"></div>

       <Navbar />

       <div className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8 relative z-10">
          
          <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">Player Comparison</h1>
              <p className="text-gray-500 dark:text-gray-400 font-light">Analyze head-to-head stats before making that crucial transfer.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              
              {/* Select Player A */}
              <div className="glass-card p-6">
                  <label className="block text-xs font-black text-brand-gold uppercase tracking-widest mb-3">Select Player A</label>
                  <select 
                      value={playerAId} 
                      onChange={e => setPlayerAId(e.target.value)}
                      className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-gold outline-none shadow-sm"
                  >
                      <option value="">-- Select a Player --</option>
                      {players?.map(p => (
                          <option key={p._id} value={p._id}>{p.name} ({p.team})</option>
                      ))}
                  </select>
                  {playerA && (
                      <div className="mt-6 flex items-center gap-4">
                          <img src={`https://ui-avatars.com/api/?name=${playerA.name}&background=fbbf24&color=000&rounded=true&size=64`} alt={playerA.name} className="w-16 h-16 rounded-full border-2 border-brand-gold shadow-lg" />
                          <div>
                              <div className="text-xl font-black text-gray-900 dark:text-white">{playerA.name}</div>
                              <div className="text-sm font-bold text-gray-500 dark:text-gray-400">{playerA.team} • {playerA.position}</div>
                          </div>
                      </div>
                  )}
              </div>

              {/* Select Player B */}
              <div className="glass-card p-6">
                  <label className="block text-xs font-black text-brand-green uppercase tracking-widest mb-3">Select Player B</label>
                  <select 
                      value={playerBId} 
                      onChange={e => setPlayerBId(e.target.value)}
                      className="w-full bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-green outline-none shadow-sm"
                  >
                      <option value="">-- Select a Player --</option>
                      {players?.map(p => (
                          <option key={p._id} value={p._id}>{p.name} ({p.team})</option>
                      ))}
                  </select>
                  {playerB && (
                      <div className="mt-6 flex items-center gap-4">
                          <img src={`https://ui-avatars.com/api/?name=${playerB.name}&background=10b981&color=000&rounded=true&size=64`} alt={playerB.name} className="w-16 h-16 rounded-full border-2 border-brand-green shadow-lg" />
                          <div>
                              <div className="text-xl font-black text-gray-900 dark:text-white">{playerB.name}</div>
                              <div className="text-sm font-bold text-gray-500 dark:text-gray-400">{playerB.team} • {playerB.position}</div>
                          </div>
                      </div>
                  )}
              </div>
          </div>

          {/* Comparison Table */}
          {playerA && playerB ? (
              <div className="glass-dark rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden">
                  <div className="grid grid-cols-3 bg-gray-100/90 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 p-4 font-black text-sm uppercase tracking-widest text-center backdrop-blur-md">
                      <div className="text-brand-gold truncate px-2">{playerA.name}</div>
                      <div className="text-gray-500 dark:text-gray-400">Stat</div>
                      <div className="text-brand-green truncate px-2">{playerB.name}</div>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-white/5 bg-white/30 dark:bg-transparent">
                      {compareStats.map((stat, i) => {
                          const valA = playerA[stat.key] || 0;
                          const valB = playerB[stat.key] || 0;
                          
                          let winnerA = false;
                          let winnerB = false;
                          
                          if (valA !== valB) {
                              if (stat.reverse) {
                                  winnerA = valA < valB;
                                  winnerB = valB < valA;
                              } else {
                                  winnerA = valA > valB;
                                  winnerB = valB > valA;
                              }
                          }

                          return (
                              <div key={i} className="grid grid-cols-3 p-4 text-center items-center hover:bg-white/50 dark:hover:bg-white/5 transition">
                                  <div className={`font-black text-lg ${winnerA ? 'text-brand-gold' : 'text-gray-600 dark:text-gray-500'}`}>
                                      {stat.format(valA)}
                                  </div>
                                  <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{stat.label}</div>
                                  <div className={`font-black text-lg ${winnerB ? 'text-brand-green' : 'text-gray-600 dark:text-gray-500'}`}>
                                      {stat.format(valB)}
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              </div>
          ) : (
              <div className="glass p-12 text-center rounded-3xl border border-gray-200 dark:border-white/10 border-dashed">
                  <span className="text-4xl mb-4 block opacity-50">⚖️</span>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">Select two players above to view their head-to-head comparison.</p>
              </div>
          )}

       </div>
       <Footer />
    </div>
  );
}
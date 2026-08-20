import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient from '../api/apiClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Leaderboard() {
  const queryClient = useQueryClient();
  const [view, setView] = useState('global');
  const [activeLeague, setActiveLeague] = useState(null);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newLeagueName, setNewLeagueName] = useState('');
  const [joinCode, setJoinCode] = useState('');

  // Queries
  const { data: globalUsers, isLoading: loadingGlobal } = useQuery({
    queryKey: ['globalLeaderboard'],
    queryFn: () => apiClient.get('/leaderboard/global').then((res) => res.data),
  });

  const { data: myLeagues, isLoading: loadingLeagues } = useQuery({
    queryKey: ['myLeagues'],
    queryFn: () => apiClient.get('/leagues').then((res) => res.data),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (name) => apiClient.post('/leagues/create', { name }),
    onSuccess: () => {
      queryClient.invalidateQueries(['myLeagues']);
      setShowCreateModal(false);
      setNewLeagueName('');
      toast.success("League Created!");
    }
  });

  const joinMutation = useMutation({
    mutationFn: (code) => apiClient.post('/leagues/join', { code }),
    onSuccess: () => {
      queryClient.invalidateQueries(['myLeagues']);
      setShowJoinModal(false);
      setJoinCode('');
      toast.success("League Joined Successfully!");
    },
    onError: (err) => toast.error(err.response?.data?.msg || "Error joining league")
  });

  const tableData = view === 'global' ? globalUsers : activeLeague?.members;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-brand-dark flex flex-col font-sans text-gray-900 dark:text-gray-100 relative overflow-hidden transition-colors duration-300">
       <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/10 rounded-full mix-blend-screen filter blur-[150px] pointer-events-none"></div>

       <Navbar />

       <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
          
          {/* LEFT SIDEBAR: League Navigation */}
          <div className="lg:col-span-1 space-y-6">
              <div className="glass-dark rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-xl">
                  <h3 className="text-gray-500 dark:text-gray-400 font-black text-xs uppercase tracking-widest mb-4">Views</h3>
                  <button 
                      onClick={() => setView('global')}
                      className={`w-full text-left px-4 py-3 rounded-xl font-bold transition mb-2 ${view === 'global' ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]' : 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'}`}
                  >
                      🌍 Global Overall
                  </button>
                  
                  <div className="my-6 border-t border-gray-200 dark:border-white/10"></div>
                  
                  <h3 className="text-gray-500 dark:text-gray-400 font-black text-xs uppercase tracking-widest mb-4">My Mini-Leagues</h3>
                  
                  <div className="space-y-2 mb-6 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                      {loadingLeagues ? (
                          <div className="text-sm text-gray-400 text-center">Loading...</div>
                      ) : myLeagues && myLeagues.length > 0 ? (
                          myLeagues.map(l => (
                              <button 
                                  key={l._id}
                                  onClick={() => { setView('league'); setActiveLeague(l); }}
                                  className={`w-full text-left px-4 py-3 rounded-xl font-bold transition truncate ${view === 'league' && activeLeague?._id === l._id ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]' : 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'}`}
                              >
                                  {l.name}
                              </button>
                          ))
                      ) : (
                          <div className="text-xs text-gray-500 italic text-center py-2">You aren't in any leagues yet.</div>
                      )}
                  </div>

                  <div className="space-y-3">
                      <button 
                          onClick={() => setShowJoinModal(true)}
                          className="w-full bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-800 dark:text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 dark:hover:bg-white/20 transition"
                      >
                          Join League
                      </button>
                      <button 
                          onClick={() => setShowCreateModal(true)}
                          className="w-full bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-800 dark:text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 dark:hover:bg-white/20 transition"
                      >
                          Create League
                      </button>
                  </div>
              </div>
          </div>

          {/* MAIN CONTENT: Leaderboard Table */}
          <div className="lg:col-span-3">
              <div className="glass-dark rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col h-[80vh]">
                  
                  {/* Header */}
                  <div className="p-6 md:p-8 border-b border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 relative overflow-hidden">
                      <div className="absolute right-0 top-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 pointer-events-none"></div>
                      <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight relative z-10">
                          {view === 'global' ? 'Global Leaderboard' : activeLeague?.name}
                      </h2>
                      {view === 'league' && activeLeague && (
                          <div className="mt-2 text-sm text-purple-600 dark:text-purple-400 font-bold tracking-widest relative z-10">
                              JOIN CODE: <span className="bg-purple-100 dark:bg-purple-500/20 px-3 py-1 rounded text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 select-all">{activeLeague.joinCode}</span>
                          </div>
                      )}
                  </div>

                  {/* Table */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar bg-white/30 dark:bg-transparent">
                      {(loadingGlobal && view === 'global') ? (
                          <div className="p-20 text-center text-gray-500 font-bold uppercase tracking-widest">Loading Standings...</div>
                      ) : (
                          <table className="w-full text-left border-collapse">
                              <thead className="text-gray-500 dark:text-gray-400 bg-gray-100/90 dark:bg-black/40 sticky top-0 z-10 text-xs uppercase tracking-widest backdrop-blur-md">
                                  <tr>
                                      <th className="p-5 font-black w-20 text-center">Rank</th>
                                      <th className="p-5 font-black">Manager & Team</th>
                                      <th className="p-5 font-black text-right">Points</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                  {tableData && tableData.map((member, idx) => {
                                      // Handle populated user vs raw user based on global vs league
                                      const userObj = view === 'global' ? member : member.user;
                                      const pnts = view === 'global' ? member.points : userObj?.points || 0;
                                      const name = userObj?.name || 'Unknown';
                                      const teamName = userObj?.teamName || 'Unknown Team';
                                      
                                      return (
                                          <tr key={idx} className="group hover:bg-white/50 dark:hover:bg-white/5 transition">
                                              <td className="p-5 text-center">
                                                  {idx === 0 ? <span className="text-3xl">🥇</span> : 
                                                   idx === 1 ? <span className="text-3xl">🥈</span> : 
                                                   idx === 2 ? <span className="text-3xl">🥉</span> : 
                                                   <span className="font-black text-gray-400 dark:text-gray-500 text-lg">{idx + 1}</span>}
                                              </td>
                                              <td className="p-5">
                                                  <div className="font-black text-gray-900 dark:text-white text-lg">{name}</div>
                                                  <div className="text-xs font-bold text-brand-gold uppercase tracking-wider">{teamName}</div>
                                              </td>
                                              <td className="p-5 text-right font-black text-brand-green text-2xl">{pnts}</td>
                                          </tr>
                                      );
                                  })}
                                  {tableData && tableData.length === 0 && (
                                      <tr>
                                          <td colSpan="3" className="p-10 text-center text-gray-500 font-light">No members found.</td>
                                      </tr>
                                  )}
                              </tbody>
                          </table>
                      )}
                  </div>
              </div>
          </div>
       </div>

       {/* MODALS */}
       {showCreateModal && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 dark:bg-black/60 backdrop-blur-sm p-4">
               <div className="bg-white dark:bg-brand-dark border border-gray-200 dark:border-white/10 rounded-3xl p-8 w-full max-w-sm shadow-2xl transform transition-all">
                   <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Create League</h3>
                   <input 
                      type="text"
                      placeholder="League Name"
                      value={newLeagueName}
                      onChange={e => setNewLeagueName(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white mb-6 focus:ring-2 focus:ring-purple-500 outline-none"
                   />
                   <div className="flex gap-4">
                       <button onClick={() => setShowCreateModal(false)} className="flex-1 py-3 rounded-xl text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-white/5 transition">Cancel</button>
                       <button 
                          onClick={() => createMutation.mutate(newLeagueName)}
                          disabled={!newLeagueName.trim() || createMutation.isPending}
                          className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition disabled:opacity-50 shadow-[0_0_15px_rgba(147,51,234,0.4)]"
                       >
                           {createMutation.isPending ? 'Creating...' : 'Create'}
                       </button>
                   </div>
               </div>
           </div>
       )}

       {showJoinModal && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 dark:bg-black/60 backdrop-blur-sm p-4">
               <div className="bg-white dark:bg-brand-dark border border-gray-200 dark:border-white/10 rounded-3xl p-8 w-full max-w-sm shadow-2xl transform transition-all">
                   <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Join League</h3>
                   <input 
                      type="text"
                      placeholder="Enter League Code"
                      value={joinCode}
                      onChange={e => setJoinCode(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white mb-6 focus:ring-2 focus:ring-purple-500 outline-none font-mono text-center tracking-widest uppercase"
                   />
                   <div className="flex gap-4">
                       <button onClick={() => setShowJoinModal(false)} className="flex-1 py-3 rounded-xl text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-white/5 transition">Cancel</button>
                       <button 
                          onClick={() => joinMutation.mutate(joinCode)}
                          disabled={!joinCode.trim() || joinMutation.isPending}
                          className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition disabled:opacity-50 shadow-[0_0_15px_rgba(147,51,234,0.4)]"
                       >
                           {joinMutation.isPending ? 'Joining...' : 'Join'}
                       </button>
                   </div>
               </div>
           </div>
       )}

       <Footer />
    </div>
  );
}
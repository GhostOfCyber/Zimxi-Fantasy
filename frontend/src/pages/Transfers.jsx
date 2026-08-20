import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Transfers() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 1. Fetch Market Data
  const { data: players, isLoading: loadingPlayers } = useQuery({
    queryKey: ['players'],
    queryFn: () => apiClient.get('/public/players').then((res) => res.data),
  });

  // 2. Fetch My Team
  const { data: myTeamData, isLoading: loadingTeam } = useQuery({
    queryKey: ['myTeam'],
    queryFn: () => apiClient.get('/team').then((res) => res.data),
    retry: false,
  });

  // State
  const [squad, setSquad] = useState([]);
  const [filterPos, setFilterPos] = useState('ALL');
  const [filterTeam, setFilterTeam] = useState('ALL');

  // Constants
  const BUDGET_CAP = 100.0;
  const MAX_PLAYERS = 15;
  const POS_LIMITS = { 'GK': 2, 'DEF': 5, 'MID': 5, 'FWD': 3 };

  // Load existing squad safely
  useEffect(() => {
    if (myTeamData && myTeamData.squad) {
      const flatSquad = myTeamData.squad
        .map(item => item.player)
        .filter(player => player !== null && player !== undefined);
      setSquad(flatSquad);
    }
  }, [myTeamData]);

  // Calculations
  const currentSpend = squad.reduce((sum, p) => sum + (p?.price || 0), 0);
  const remainingBudget = BUDGET_CAP - currentSpend;

  // Extract Unique Teams for Dropdown
  const uniqueTeams = players 
    ? [...new Set(players.map(p => p.team))].sort() 
    : [];

  // Filtering Logic
  const filteredPlayers = players ? players.filter(p => {
    const matchPos = filterPos === 'ALL' || p.position === filterPos;
    const matchTeam = filterTeam === 'ALL' || p.team === filterTeam;
    return matchPos && matchTeam;
  }) : [];

  // Sort logic: Sort by Price (High to Low)
  filteredPlayers.sort((a, b) => b.price - a.price);

  // Actions
  const addToSquad = (player) => {
    if (squad.find((p) => p._id === player._id)) return toast.error("Player already in squad");
    if (squad.length >= MAX_PLAYERS) return toast.error("Squad full (Max 15 players)");
    if (remainingBudget < player.price) return toast.error(`Not enough budget! Need $${player.price}m`);
    
    const posCount = squad.filter(p => p.position === player.position).length;
    if (posCount >= POS_LIMITS[player.position]) return toast.error(`Max ${POS_LIMITS[player.position]} ${player.position}s allowed`);

    setSquad([...squad, player]);
  };

  const removeFromSquad = (id) => {
    setSquad(squad.filter((p) => p._id !== id));
  };

  const saveMutation = useMutation({
    mutationFn: (squadIds) => apiClient.post('/team/transfer', { squadIds }),
    onSuccess: () => {
      queryClient.invalidateQueries(['myTeam']);
      toast.success('Transfers Confirmed!');
      navigate('/my-team');
    },
    onError: (err) => {
      toast.error(err.response?.data?.msg || 'Error saving transfers');
    }
  });

  const handleSave = () => {
    if (squad.length !== 15) return toast.error("You must select exactly 15 players.");
    saveMutation.mutate(squad.map(p => p._id));
  };

  if (loadingPlayers || loadingTeam) return <div className="p-20 text-center font-bold text-gray-500 bg-gray-50 dark:bg-brand-dark min-h-screen">Loading Market...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-brand-dark flex flex-col font-sans text-gray-900 dark:text-gray-100 relative overflow-hidden transition-colors duration-300">
       
       <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full mix-blend-screen filter blur-[150px] pointer-events-none"></div>

       <Navbar />

       {/* Sticky Info Bar */}
       <div className="glass sticky top-20 z-40 border-b-0 border-white/10 shadow-2xl">
         <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4 p-4">
            <div className="flex items-center gap-4 md:gap-8">
                <h1 className="font-black text-2xl text-gray-900 dark:text-white hidden md:block tracking-tighter">Transfers</h1>
                
                {/* Budget Box */}
                <div className="bg-gray-100 dark:bg-black/40 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 shadow-inner">
                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mr-3 tracking-widest">Bank</span>
                    <span className={`font-black text-xl ${remainingBudget < 0 ? 'text-red-500' : 'text-brand-green'}`}>
                        ${remainingBudget.toFixed(1)}m
                    </span>
                </div>
                
                {/* Squad Count Box */}
                <div className="bg-gray-100 dark:bg-black/40 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 shadow-inner">
                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mr-3 tracking-widest">Squad</span>
                    <span className={`font-black text-xl ${squad.length === 15 ? 'text-brand-green' : 'text-gray-900 dark:text-white'}`}>
                        {squad.length}/15
                    </span>
                </div>
            </div>

            <button 
                onClick={handleSave}
                disabled={squad.length !== 15 || remainingBudget < 0 || saveMutation.isPending}
                className="bg-brand-green text-white dark:text-brand-dark px-8 py-3 rounded-xl font-black shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-500 dark:hover:bg-emerald-400 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition transform hover:scale-105 w-full md:w-auto"
             >
                {saveMutation.isPending ? 'Saving...' : 'Confirm Team'}
             </button>
         </div>
       </div>

       <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
         
         {/* LEFT COLUMN: Player Market */}
         <div className="glass-dark rounded-3xl border border-gray-200 dark:border-white/10 flex flex-col h-[75vh] overflow-hidden shadow-2xl">
            
            {/* Filters Section */}
            <div className="p-5 border-b border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 space-y-4">
                {/* Position Buttons */}
                <div className="flex gap-2">
                    {['ALL', 'GK', 'DEF', 'MID', 'FWD'].map(pos => (
                        <button 
                            key={pos}
                            onClick={() => setFilterPos(pos)}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition shadow-sm ${filterPos === pos ? 'bg-brand-green text-white dark:text-brand-dark shadow-md' : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10'}`}
                        >
                            {pos}
                        </button>
                    ))}
                </div>

                {/* Team Dropdown */}
                <select 
                    value={filterTeam}
                    onChange={(e) => setFilterTeam(e.target.value)}
                    className="w-full p-3 border border-gray-200 dark:border-white/10 rounded-lg text-sm bg-white dark:bg-black/50 font-medium text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-brand-green outline-none appearance-none shadow-sm"
                >
                    <option value="ALL">All Teams</option>
                    {uniqueTeams.map(team => (
                        <option key={team} value={team}>{team}</option>
                    ))}
                </select>
            </div>
            
            {/* Player List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-white/30 dark:bg-transparent">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="text-gray-500 dark:text-gray-400 bg-gray-100/90 dark:bg-black/40 sticky top-0 z-10 text-xs uppercase tracking-wider backdrop-blur-md">
                        <tr>
                            <th className="p-4 font-bold">Player</th>
                            <th className="p-4 font-bold">Pos</th>
                            <th className="p-4 font-bold">Price</th>
                            <th className="p-4 text-center font-bold">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                        {filteredPlayers.length > 0 ? (
                            filteredPlayers.map(p => {
                                const inSquad = squad.find(s => s._id === p._id);
                                return (
                                    <tr key={p._id} className={`group hover:bg-white/50 dark:hover:bg-white/5 transition ${inSquad ? 'bg-brand-green/10 dark:bg-brand-green/10' : ''}`}>
                                        <td className="p-4 font-medium">
                                            <div className="font-bold text-gray-900 dark:text-white text-base">{p.name}</div>
                                            <div className="text-[11px] text-brand-gold uppercase tracking-widest">{p.team}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-[10px] font-black px-2 py-1 rounded-md ${
                                                p.position === 'GK' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400' :
                                                p.position === 'DEF' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' :
                                                p.position === 'MID' ? 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'
                                            }`}>{p.position}</span>
                                        </td>
                                        <td className="p-4 font-black text-brand-green text-lg">${p.price}</td>
                                        <td className="p-4 text-center">
                                            {inSquad ? (
                                                <button onClick={() => removeFromSquad(p._id)} className="text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 p-2 rounded-full transition border border-red-200 dark:border-red-500/30">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                </button>
                                            ) : (
                                                <button onClick={() => addToSquad(p)} className="bg-gray-200 text-gray-700 dark:bg-white/10 hover:bg-brand-green hover:text-white dark:hover:text-brand-dark dark:text-white px-4 py-1.5 rounded-full text-xs font-bold transition border border-gray-300 dark:border-white/10">
                                                    Add
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-gray-500 font-light">No players found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
         </div>

         {/* RIGHT COLUMN: Selected Squad */}
         <div className="glass-dark rounded-3xl border border-gray-200 dark:border-white/10 flex flex-col h-[75vh] overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 flex justify-between items-center">
                <h2 className="font-bold text-gray-900 dark:text-white text-lg">Selected Squad</h2>
                <button 
                    onClick={() => setSquad([])} 
                    className="text-xs text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 font-bold uppercase tracking-widest transition"
                >
                    Reset All
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-white/20 dark:bg-black/20">
                {squad.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                         <svg className="w-20 h-20 mb-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        <p className="font-bold text-lg mb-2 text-gray-600 dark:text-gray-400">Your squad is empty</p>
                        <p className="text-sm font-light">Select 15 players from the market.</p>
                    </div>
                ) : (
                    <div className="space-y-5">
                         {['GK', 'DEF', 'MID', 'FWD'].map(pos => {
                            const playersInPos = squad.filter(p => p.position === pos);
                            return (
                                <div key={pos} className="bg-white/80 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm backdrop-blur-sm">
                                    <div className="bg-gray-100/90 dark:bg-black/40 px-4 py-2 border-b border-gray-200 dark:border-white/5 flex justify-between items-center">
                                        <span className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">{pos}</span>
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${playersInPos.length === POS_LIMITS[pos] ? 'bg-brand-green/20 text-brand-green border border-brand-green/30' : 'bg-gray-200 text-gray-600 dark:bg-white/10 dark:text-gray-300'}`}>
                                            {playersInPos.length} / {POS_LIMITS[pos]}
                                        </span>
                                    </div>
                                    <div className="divide-y divide-gray-100 dark:divide-white/5">
                                        {playersInPos.map(p => (
                                            <div key={p._id} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-white/5 transition">
                                                <div className="flex items-center gap-4">
                                                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs text-white dark:text-brand-dark font-black shadow-inner
                                                        ${p.position === 'GK' ? 'bg-yellow-500' : p.position === 'DEF' ? 'bg-blue-500' : p.position === 'MID' ? 'bg-brand-green' : 'bg-red-500'}`}>
                                                        {p.position.charAt(0)}
                                                     </div>
                                                     <div>
                                                         <div className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{p.name}</div>
                                                         <div className="text-[10px] text-brand-gold uppercase tracking-wider">{p.team}</div>
                                                     </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="font-black text-brand-green text-base">${p.price}</span>
                                                    <button onClick={() => removeFromSquad(p._id)} className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition bg-gray-100 hover:bg-red-50 dark:bg-white/5 dark:hover:bg-white/10 p-1.5 rounded-md">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {playersInPos.length === 0 && (
                                            <div className="p-4 text-center text-[11px] text-gray-400 dark:text-gray-500 font-light italic">No {pos} selected</div>
                                        )}
                                    </div>
                                </div>
                            );
                         })}
                    </div>
                )}
            </div>
         </div>
       </div>
       <Footer />
    </div>
  );
}
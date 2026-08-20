import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient from '../api/apiClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MyTeam() {
  const queryClient = useQueryClient();

  const { data: teamData, isLoading: loadingTeam } = useQuery({
    queryKey: ['myTeam'],
    queryFn: () => apiClient.get('/team').then((res) => res.data),
  });

  const { data: fixturesGrouped, isLoading: loadingFixtures } = useQuery({
    queryKey: ['fixturesGrouped'],
    queryFn: () => apiClient.get('/public/fixtures-grouped').then((res) => res.data),
  });

  const [squadState, setSquadState] = useState([]);
  const [activeChip, setActiveChip] = useState(null);
  const [activeGameweekIndex, setActiveGameweekIndex] = useState(0);

  useEffect(() => {
    if (teamData && teamData.squad) {
      const validSquad = teamData.squad.filter(s => s.player && s.player._id);
      setSquadState(validSquad);
      setActiveChip(teamData.activeChip);
    }
  }, [teamData]);

  const saveLineupMutation = useMutation({
    mutationFn: (payload) => apiClient.post('/team/lineup', payload),
    onSuccess: () => {
      toast.success("Team Saved Successfully!");
      queryClient.invalidateQueries(['myTeam']);
    },
    onError: (err) => toast.error(err.response?.data?.msg || "Error saving team")
  });

  const handleSaveTeam = () => {
    const payload = {
      squadUpdates: squadState.map(s => ({
        playerId: s.player._id,
        isBench: s.isBench,
        isCaptain: s.isCaptain,
        isViceCaptain: s.isViceCaptain
      })),
      activeChip
    };
    saveLineupMutation.mutate(payload);
  };

  const toggleChip = (chipName) => {
    if (teamData.chips[chipName]) return toast.error("Chip already used this season!");
    setActiveChip(activeChip === chipName ? null : chipName);
  };
  
  const toggleBenchStatus = (playerId) => {
    setSquadState(prev => prev.map(s => {
        if (s.player._id === playerId) return { ...s, isBench: !s.isBench };
        return s;
    }));
  };

  const setCaptain = (playerId) => {
    setSquadState(prev => prev.map(s => ({
        ...s,
        isCaptain: s.player._id === playerId
    })));
  };

  const starters = squadState.filter(s => !s.isBench);
  const bench = squadState.filter(s => s.isBench);
  
  const gks = starters.filter(s => s.player?.position === 'GK');
  const defs = starters.filter(s => s.player?.position === 'DEF');
  const mids = starters.filter(s => s.player?.position === 'MID');
  const fwds = starters.filter(s => s.player?.position === 'FWD');

  if (loadingTeam || loadingFixtures) return <div className="p-20 text-center text-gray-500 dark:text-gray-400 font-bold tracking-widest uppercase bg-gray-50 dark:bg-brand-dark min-h-screen">Loading Team...</div>;
  if (!teamData) return <div className="p-20 text-center bg-gray-50 dark:bg-brand-dark min-h-screen text-gray-900 dark:text-white">No Team Found. Go to Transfers to build one!</div>;

  const currentFixtures = fixturesGrouped && fixturesGrouped[activeGameweekIndex] 
    ? fixturesGrouped[activeGameweekIndex] 
    : { gw: 1, matches: [] };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-brand-dark flex flex-col font-sans text-gray-900 dark:text-gray-100 relative transition-colors duration-300">

       <div className="absolute top-0 right-[-10%] w-[50%] h-[50%] bg-brand-green/10 rounded-full mix-blend-screen filter blur-[150px] pointer-events-none"></div>

       <Navbar />

       <div className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
         
         {/* LEFT COLUMN: Pitch */}
         <div className="lg:col-span-8 space-y-8">
             
             {/* Gameweek & Chips Header */}
             <div className="glass-card p-6 flex flex-wrap justify-between items-center gap-6">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Team Management</h2>
                    <div className="text-sm text-brand-gold font-bold uppercase tracking-wider mt-1">{teamData.teamName}</div>
                </div>
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="flex gap-2">
                        {['tc', 'bb', 'fh', 'wc'].map(chip => (
                            <button
                                key={chip}
                                onClick={() => toggleChip(chip)}
                                disabled={teamData.chips[chip]} 
                                className={`px-4 py-2 rounded-lg text-xs font-black transition uppercase tracking-wider ${
                                    activeChip === chip 
                                        ? 'bg-purple-600 text-white shadow-md dark:shadow-[0_0_15px_rgba(147,51,234,0.5)] border border-purple-400' 
                                        : teamData.chips[chip]
                                            ? 'bg-gray-200 dark:bg-white/5 text-gray-400 dark:text-gray-600 cursor-not-allowed line-through border border-gray-300 dark:border-white/5' 
                                            : 'bg-white dark:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/20'
                                }`}
                            >
                                {chip}
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={handleSaveTeam}
                        className="ml-2 bg-brand-green text-white dark:text-brand-dark px-8 py-2 rounded-lg shadow-md dark:shadow-[0_0_15px_rgba(16,185,129,0.4)] font-black hover:bg-emerald-500 dark:hover:bg-emerald-400 transition transform hover:scale-105"
                    >
                        Save Team
                    </button>
                </div>
             </div>

             {/* THE PITCH */}
             <div className="bg-gradient-to-b from-green-500 to-green-700 dark:from-green-800 dark:to-green-900 rounded-3xl relative shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden border border-gray-200 dark:border-white/10 h-[700px] flex flex-col py-8 select-none">
                 <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-30">
                    <div className="absolute top-0 left-0 right-0 h-1/2 border-b-2 border-white/40"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white/40 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/40 rounded-full"></div>
                    
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-80 h-40 border-2 border-t-0 border-white/40"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-80 h-40 border-2 border-b-0 border-white/40"></div>
                    
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-16 border-2 border-t-0 border-white/40"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-16 border-2 border-b-0 border-white/40"></div>
                 </div>

                 <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, #ffffff 40px, #ffffff 80px)'}}></div>

                 <div className="flex-1 flex flex-col justify-between relative z-10 px-2 md:px-12 pb-6">
                     <PitchRow players={gks} onToggle={toggleBenchStatus} onCap={setCaptain} />
                     <PitchRow players={defs} onToggle={toggleBenchStatus} onCap={setCaptain} />
                     <PitchRow players={mids} onToggle={toggleBenchStatus} onCap={setCaptain} />
                     <PitchRow players={fwds} onToggle={toggleBenchStatus} onCap={setCaptain} />
                 </div>
             </div>

             {/* BENCH */}
             <div className="glass-dark border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex justify-center gap-4 md:gap-10 shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-white/50 dark:bg-white/5 backdrop-blur-md"></div>
                <span className="absolute top-2 left-4 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest z-10">Bench</span>
                <div className="relative z-10 flex gap-4 md:gap-10">
                    {bench.map(s => <PitchPlayer key={s.player._id} data={s} isBench={true} onToggle={toggleBenchStatus} onCap={setCaptain} />)}
                </div>
             </div>

             {/* FIXTURES CAROUSEL */}
             {fixturesGrouped && (
                 <div className="glass-card p-8">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-white/10 pb-4">
                        <h3 className="font-bold text-gray-900 dark:text-white text-xl">Fixtures</h3>
                        <div className="flex gap-3 items-center bg-gray-100 dark:bg-black/40 rounded-xl p-1.5 border border-gray-200 dark:border-white/5 shadow-inner">
                            <button 
                                onClick={() => setActiveGameweekIndex(Math.max(0, activeGameweekIndex - 1))}
                                disabled={activeGameweekIndex === 0}
                                className="px-3 py-1.5 rounded-lg bg-white dark:bg-white/10 hover:bg-gray-50 dark:hover:bg-white/20 disabled:opacity-30 transition font-bold text-gray-800 dark:text-white"
                            >&larr;</button>
                            <span className="font-black text-brand-gold text-sm w-24 text-center tracking-wider">GW {currentFixtures.gw}</span>
                            <button 
                                onClick={() => setActiveGameweekIndex(Math.min(fixturesGrouped.length - 1, activeGameweekIndex + 1))}
                                disabled={activeGameweekIndex === fixturesGrouped.length - 1}
                                className="px-3 py-1.5 rounded-lg bg-white dark:bg-white/10 hover:bg-gray-50 dark:hover:bg-white/20 disabled:opacity-30 transition font-bold text-gray-800 dark:text-white"
                            >&rarr;</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentFixtures.matches && currentFixtures.matches.length > 0 ? (
                            currentFixtures.matches.map((match) => (
                                <div key={match._id} className="border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition p-4 rounded-xl flex justify-between items-center text-sm shadow-sm dark:shadow-none">
                                    <span className="font-bold text-gray-800 dark:text-gray-200 w-2/5 text-right truncate">{match.homeTeam}</span>
                                    <span className="text-[10px] font-black bg-gray-100 dark:bg-brand-dark/80 text-brand-gold px-2 py-1 rounded shadow-inner">VS</span>
                                    <span className="font-bold text-gray-800 dark:text-gray-200 w-2/5 text-left truncate">{match.awayTeam}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 col-span-3 py-6 font-light">No fixtures scheduled</div>
                        )}
                    </div>
                 </div>
             )}
         </div>

         {/* RIGHT COLUMN: Stats */}
         <div className="lg:col-span-4 space-y-8">
             <div className="glass-card p-8 text-center relative overflow-hidden group">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-brand-green/20 rounded-full blur-2xl group-hover:bg-brand-green/30 transition duration-500"></div>
                <h3 className="text-gray-500 dark:text-gray-400 text-xs font-black uppercase tracking-widest mb-3 relative z-10">Total Points</h3>
                <div className="text-7xl font-black text-gradient relative z-10">{teamData.points}</div>
             </div>

             <div className="glass-dark border border-gray-200 dark:border-white/10 p-8 rounded-3xl shadow-xl">
                <h3 className="text-brand-gold text-xs font-black uppercase tracking-widest mb-6">Captain</h3>
                {starters.filter(s => s.isCaptain).map(s => (
                    <div key={s.player._id} className="flex items-center gap-5">
                         <div className="relative">
                            <img 
                                src={`https://ui-avatars.com/api/?name=${s.player.name}&background=fbbf24&color=000&size=80&rounded=true`} 
                                className="w-20 h-20 rounded-full border-4 border-white dark:border-brand-dark shadow-[0_0_15px_rgba(251,191,36,0.3)]" 
                                alt={s.player.name} 
                            />
                            <div className="absolute -bottom-2 -right-2 bg-white dark:bg-brand-dark text-brand-gold border-2 border-brand-gold w-8 h-8 flex items-center justify-center rounded-full font-black text-sm">C</div>
                         </div>
                         <div>
                             <div className="font-black text-xl text-gray-900 dark:text-white tracking-tight">{s.player.name}</div>
                             <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{s.player.team}</div>
                             <div className="text-[10px] font-bold bg-brand-green/10 dark:bg-brand-green/20 text-brand-green border border-brand-green/20 dark:border-brand-green/30 px-3 py-1 rounded-full inline-block mt-2 tracking-widest uppercase shadow-sm">Double Points</div>
                         </div>
                    </div>
                ))}
                {starters.filter(s => s.isCaptain).length === 0 && <span className="text-red-500 dark:text-red-400 text-sm font-bold bg-red-100 dark:bg-red-500/10 px-4 py-2 rounded-lg border border-red-200 dark:border-red-500/20">No Captain Selected!</span>}
             </div>
             
             <div className="bg-brand-accent/5 dark:bg-brand-accent/10 border border-brand-accent/20 p-6 rounded-2xl text-sm text-brand-accent shadow-inner">
                 <strong className="font-black tracking-widest uppercase text-xs block mb-2">Pro Tip</strong> 
                 Click on a player's shirt on the pitch to swap them to the bench or make them your Captain. Don't forget to click "Save Team".
             </div>
         </div>

       </div>
       <Footer />
    </div>
  );
}

// Helpers
function PitchRow({ players, onToggle, onCap }) {
    return (
        <div className="flex justify-center gap-4 md:gap-12 items-center h-full">
            {players.map(s => <PitchPlayer key={s.player._id} data={s} onToggle={onToggle} onCap={onCap} />)}
        </div>
    );
}

function PitchPlayer({ data, isBench, onToggle, onCap }) {
    const { player, isCaptain } = data;
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="relative group">
            <div 
                className="flex flex-col items-center cursor-pointer transition transform hover:scale-110"
                onClick={() => setShowMenu(!showMenu)}
            >
                 <div className="relative">
                    <img 
                        src={`https://ui-avatars.com/api/?name=${player.name}&background=${isBench ? 'ccc' : 'fff'}&color=000&rounded=true&size=56`} 
                        alt="shirt"
                        className={`w-12 h-12 md:w-16 md:h-16 rounded-full border-4 ${isBench ? 'border-gray-400 dark:border-gray-600 opacity-80' : 'border-white shadow-[0_5px_15px_rgba(0,0,0,0.5)]'}`}
                    />
                    {isCaptain && (
                        <div className="absolute -top-2 -right-2 bg-white dark:bg-brand-dark text-brand-gold text-[10px] w-6 h-6 flex items-center justify-center rounded-full font-black border-2 border-brand-gold z-10 shadow-lg">C</div>
                    )}
                 </div>
                 
                 <div className={`mt-2 text-center rounded-lg px-2 py-1 min-w-[70px] md:min-w-[80px] shadow-lg border ${isBench ? 'bg-gray-100/90 dark:bg-black/60 text-gray-500 dark:text-gray-300 border-gray-300 dark:border-white/10' : 'bg-white/90 dark:bg-brand-dark/90 text-gray-900 dark:text-white border-brand-gold/50 backdrop-blur-sm'}`}>
                    <div className="text-[10px] md:text-xs font-bold leading-tight truncate max-w-[80px]">{player.name}</div>
                    <div className={`text-[8px] md:text-[9px] font-black uppercase tracking-wider ${isBench ? 'text-gray-500' : 'text-brand-gold'}`}>{player.team}</div>
                 </div>
            </div>

            {/* Simple Popup Menu for Actions */}
            {showMenu && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-white dark:bg-brand-dark rounded-xl shadow-2xl border border-gray-200 dark:border-white/20 z-50 text-xs w-32 overflow-hidden flex flex-col">
                    <button 
                        onClick={() => { onToggle(player._id); setShowMenu(false); }} 
                        className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/10 text-left text-gray-900 dark:text-white font-bold border-b border-gray-100 dark:border-white/10 transition"
                    >
                        {isBench ? 'Start Player' : 'Move to Bench'}
                    </button>
                    {!isBench && (
                        <button 
                            onClick={() => { onCap(player._id); setShowMenu(false); }} 
                            className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/10 text-left text-brand-gold font-bold transition"
                        >
                            Make Captain
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
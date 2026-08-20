import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '../api/apiClient';

export default function AdminPoints() {
  const { data: players } = useQuery({
    queryKey: ['players'],
    queryFn: () => apiClient.get('/public/players').then((res) => res.data),
  });

  const [gameweek, setGameweek] = useState(1);
  // Store stats in a map: { "player_id": { goals: 0, assists: 0 ... } }
  const [stats, setStats] = useState({});

  const handleStatChange = (pId, field, value) => {
    setStats(prev => ({
        ...prev,
        [pId]: {
            ...prev[pId],
            [field]: field === 'cleanSheet' ? value : parseInt(value) || 0
        }
    }));
  };

  const mutation = useMutation({
    mutationFn: (payload) => apiClient.post('/admin/update-points', payload),
    onSuccess: () => alert("Points Updated Successfully!"),
    onError: () => alert("Error updating points")
  });

  const submitPoints = () => {
    // Convert stats map to array for backend
    const matchStats = Object.keys(stats).map(pId => ({
        playerId: pId,
        ...stats[pId]
    }));

    if(matchStats.length === 0) return alert("No stats entered");

    mutation.mutate({ gameweek, matchStats });
  };

  if (!players) return <div>Loading...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin: Enter Gameweek Stats</h1>
      
      <div className="mb-6 flex items-center gap-4">
        <label className="font-bold">Gameweek:</label>
        <input 
            type="number" 
            value={gameweek} 
            onChange={(e) => setGameweek(e.target.value)} 
            className="border p-2 rounded w-20"
        />
        <button 
            onClick={submitPoints}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-bold"
        >
            {mutation.isPending ? 'Calculating...' : 'Calculate & Save Points'}
        </button>
      </div>

      <div className="bg-white shadow rounded p-4 overflow-x-auto">
        <table className="w-full text-sm">
            <thead>
                <tr className="text-left bg-gray-100">
                    <th className="p-2">Player</th>
                    <th className="p-2">Mins</th>
                    <th className="p-2">Goals</th>
                    <th className="p-2">Assists</th>
                    <th className="p-2">Clean Sheet</th>
                    <th className="p-2">Yel</th>
                    <th className="p-2">Red</th>
                </tr>
            </thead>
            <tbody>
                {players.map(p => (
                    <tr key={p._id} className="border-b">
                        <td className="p-2 font-bold">{p.name} <span className="text-gray-400 text-xs">({p.team})</span></td>
                        <td className="p-2"><input type="number" className="border w-12 p-1" placeholder="0" onChange={(e) => handleStatChange(p._id, 'minutesPlayed', e.target.value)} /></td>
                        <td className="p-2"><input type="number" className="border w-12 p-1" placeholder="0" onChange={(e) => handleStatChange(p._id, 'goals', e.target.value)} /></td>
                        <td className="p-2"><input type="number" className="border w-12 p-1" placeholder="0" onChange={(e) => handleStatChange(p._id, 'assists', e.target.value)} /></td>
                        <td className="p-2"><input type="checkbox" onChange={(e) => handleStatChange(p._id, 'cleanSheet', e.target.checked)} /></td>
                        <td className="p-2"><input type="number" className="border w-12 p-1" placeholder="0" onChange={(e) => handleStatChange(p._id, 'yellowCards', e.target.value)} /></td>
                        <td className="p-2"><input type="number" className="border w-12 p-1" placeholder="0" onChange={(e) => handleStatChange(p._id, 'redCards', e.target.value)} /></td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}
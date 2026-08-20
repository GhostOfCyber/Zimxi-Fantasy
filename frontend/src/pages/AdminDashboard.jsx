import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [jsonInput, setJsonInput] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [fixtureData, setFixtureData] = useState({
    gameweek: 1, homeTeam: '', awayTeam: ''
  });

  const handleUpload = async () => {
    try {
      const parsed = JSON.parse(jsonInput);
      await apiClient.post('/admin/upload', { players: parsed });
      setMsg({ type: 'success', text: 'Players data uploaded successfully!' });
    } catch (err) {
      setMsg({ type: 'error', text: 'Invalid JSON or Server Error' });
    }
  };

  const createFixture = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/admin/fixtures', fixtureData);
      setMsg({ type: 'success', text: 'Fixture Created!' });
      setFixtureData({ ...fixtureData, homeTeam: '', awayTeam: '' }); // Reset teams
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to create fixture' });
    }
  };

  const runPoints = async () => {
      const fixtureId = prompt("Enter Fixture ID to compute (get ID from database or logs for now):");
      if(!fixtureId) return;
      try {
          const res = await apiClient.post('/admin/compute-points', { fixtureId });
          setMsg({ type: 'success', text: `Success! ${Object.keys(res.data.playerPointsMap).length} players updated.` });
      } catch(err) {
          setMsg({ type: 'error', text: err.response?.data?.msg || 'Error computing points' });
      }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <Link to="/dashboard" className="text-blue-600 hover:underline">Back to App</Link>
        </div>

        {msg.text && (
          <div className={`p-4 rounded mb-6 ${msg.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {msg.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Section 1: Data Upload */}
          <div className="bg-white p-6 shadow rounded-lg">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">1. Import Players</h2>
            <p className="text-sm text-gray-500 mb-2">Paste JSON array of player objects here.</p>
            <textarea
              className="w-full h-40 border p-2 font-mono text-xs rounded bg-gray-50 mb-3"
              placeholder='[{"name": "Billiat", "position": "FWD", "team": "Yadah", "price": 12.0}]'
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />
            <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
              Upload Player Data
            </button>
          </div>

          {/* Section 2: Create Fixture */}
          <div className="bg-white p-6 shadow rounded-lg">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">2. Create Fixture</h2>
            <form onSubmit={createFixture} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Gameweek</label>
                <input 
                  type="number" 
                  className="w-full border p-2 rounded" 
                  value={fixtureData.gameweek}
                  onChange={e => setFixtureData({...fixtureData, gameweek: parseInt(e.target.value)})} 
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Home Team</label>
                  <input 
                    type="text" 
                    className="w-full border p-2 rounded" 
                    placeholder="Dynamos"
                    value={fixtureData.homeTeam}
                    onChange={e => setFixtureData({...fixtureData, homeTeam: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Away Team</label>
                  <input 
                    type="text" 
                    className="w-full border p-2 rounded" 
                    placeholder="Highlanders"
                    value={fixtureData.awayTeam}
                    onChange={e => setFixtureData({...fixtureData, awayTeam: e.target.value})} 
                  />
                </div>
              </div>
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full mt-4">
                Add Fixture
              </button>
            </form>
          </div>
          
          {/* Section 3: Points Engine */}
          <div className="bg-white p-6 shadow rounded-lg md:col-span-2">
            <h2 className="text-xl font-bold mb-4 border-b pb-2 text-purple-700">3. Points Engine</h2>
            <p className="text-sm text-gray-600 mb-4">
              Triggering this will calculate fantasy points for a specific fixture based on player stats entered in the database (fixtures.stats).
              <br/><em>(In a real app, this would be automated or triggered after match results are finalized).</em>
            </p>
            <button onClick={runPoints} className="bg-purple-600 text-white px-6 py-3 rounded font-bold hover:bg-purple-700">
              Run Manual Points Calculation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
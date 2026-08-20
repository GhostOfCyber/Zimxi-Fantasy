import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import { Link } from 'react-router-dom';

export default function Fixtures() {
  const { data: fixtures, isLoading } = useQuery({
    queryKey: ['fixtures'],
    queryFn: () => apiClient.get('/public/fixtures').then(res => res.data),
  });

  if (isLoading) return <div className="p-8">Loading Fixtures...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow p-4 mb-8">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
            <h1 className="font-bold text-xl">Fixtures & Results</h1>
            <Link to="/dashboard" className="text-blue-600">Back to Dashboard</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 bg-gray-800 text-white">
                <h2 className="font-bold text-lg">Gameweek 1</h2>
            </div>
            {fixtures && fixtures.length > 0 ? (
                <div className="divide-y">
                    {fixtures.map(match => (
                        <div key={match._id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                            <div className="w-1/3 text-right font-bold text-gray-800">{match.homeTeam}</div>
                            <div className="w-1/3 text-center px-4">
                                {match.played ? (
                                    <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded font-mono font-bold">
                                        {match.result.homeScore} - {match.result.awayScore}
                                    </span>
                                ) : (
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-bold">
                                        vs
                                    </span>
                                )}
                            </div>
                            <div className="w-1/3 text-left font-bold text-gray-800">{match.awayTeam}</div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-8 text-center text-gray-500">No fixtures scheduled yet.</div>
            )}
        </div>
      </div>
    </div>
  );
}
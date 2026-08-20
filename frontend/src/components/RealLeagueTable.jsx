import React from 'react';

export default function RealLeagueTable() {
  const tableData = [
    { rank: 1, team: 'Scottland FC', played: 34, w: 20, d: 9, l: 5, gd: 26, pts: 69, form: ['W','W','W','D','W'] },
    { rank: 2, team: 'MWOS FC', played: 34, w: 17, d: 11, l: 6, gd: 13, pts: 62, form: ['W','L','W','D','W'] },
    { rank: 3, team: 'Simba Bhora', played: 34, w: 16, d: 13, l: 5, gd: 16, pts: 61, form: ['D','L','D','D','W'] },
    { rank: 4, team: 'Ngezi Platinum', played: 34, w: 14, d: 13, l: 7, gd: 11, pts: 55, form: ['D','W','L','D','L'] },
    { rank: 5, team: 'Tel One', played: 34, w: 14, d: 12, l: 8, gd: 14, pts: 54, form: ['W','W','D','D','L'] },
    { rank: 6, team: 'FC Platinum', played: 34, w: 10, d: 19, l: 5, gd: 9, pts: 49, form: ['D','L','D','D','D'] },
    { rank: 7, team: 'Herentals', played: 34, w: 12, d: 12, l: 10, gd: 3, pts: 48, form: ['D','L','L','D','W'] },
    { rank: 8, team: 'ZPC Kariba', played: 34, w: 9, d: 17, l: 8, gd: 3, pts: 44, form: ['W','D','D','D','L'] },
    { rank: 9, team: 'Caps United', played: 34, w: 11, d: 10, l: 13, gd: -2, pts: 43, form: ['W','W','D','D','W'] },
    { rank: 10, team: 'Manica Diamonds', played: 34, w: 8, d: 17, l: 9, gd: -3, pts: 41, form: ['D','L','W','D','W'] },
    { rank: 11, team: 'Highlanders', played: 34, w: 7, d: 18, l: 9, gd: 1, pts: 39, form: ['D','D','D','D','D'] },
    { rank: 12, team: 'Chicken Inn', played: 34, w: 9, d: 12, l: 13, gd: -2, pts: 39, form: ['L','W','D','D','D'] },
    { rank: 13, team: 'Dynamos', played: 34, w: 8, d: 15, l: 11, gd: -6, pts: 39, form: ['D','D','W','D','D'] },
    { rank: 14, team: 'Triangle', played: 34, w: 8, d: 14, l: 12, gd: 3, pts: 38, form: ['D','L','L','W','D'] },
    { rank: 15, team: 'Green Fuel', played: 34, w: 7, d: 16, l: 11, gd: -2, pts: 37, form: ['L','W','D','D','D'] },
    { rank: 16, team: 'Bikita Minerals', played: 34, w: 9, d: 10, l: 15, gd: -13, pts: 37, form: ['L','W','L','D','L'] },
    { rank: 17, team: 'Yadah', played: 34, w: 8, d: 11, l: 15, gd: -7, pts: 35, form: ['D','D','W','D','L'] },
    { rank: 18, team: 'Kwekwe United', played: 34, w: 1, d: 7, l: 26, gd: -64, pts: 10, form: ['L','L','L','L','L'] },
  ];

  const getFormColor = (result) => {
    if (result === 'W') return 'bg-green-500';
    if (result === 'D') return 'bg-gray-400';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h3 className="font-bold text-gray-800">Zimbabwe Premier League Standings</h3>
        <span className="text-xs text-gray-500">Updated: Gameweek 34</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 w-10">Pos</th>
              <th className="px-4 py-3">Team</th>
              <th className="px-4 py-3 text-center">P</th>
              <th className="px-4 py-3 text-center hidden sm:table-cell">W</th>
              <th className="px-4 py-3 text-center hidden sm:table-cell">D</th>
              <th className="px-4 py-3 text-center hidden sm:table-cell">L</th>
              <th className="px-4 py-3 text-center">GD</th>
              <th className="px-4 py-3 text-center font-bold">Pts</th>
              <th className="px-4 py-3 text-center hidden md:table-cell">Form</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tableData.map((row) => (
              <tr key={row.rank} className={`hover:bg-gray-50 ${row.rank <= 4 ? 'bg-green-50/30' : ''} ${row.rank >= 15 ? 'bg-red-50/30' : ''}`}>
                <td className="px-4 py-3 font-medium text-gray-500">{row.rank}</td>
                <td className="px-4 py-3 font-bold text-gray-800 flex items-center gap-2">
                    {/* Placeholder team color/logo */}
                    <div className={`w-2 h-2 rounded-full ${row.rank === 1 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                    {row.team}
                </td>
                <td className="px-4 py-3 text-center text-gray-600">{row.played}</td>
                <td className="px-4 py-3 text-center hidden sm:table-cell text-gray-400">{row.w}</td>
                <td className="px-4 py-3 text-center hidden sm:table-cell text-gray-400">{row.d}</td>
                <td className="px-4 py-3 text-center hidden sm:table-cell text-gray-400">{row.l}</td>
                <td className="px-4 py-3 text-center font-medium">
                  {row.gd > 0 ? `+${row.gd}` : row.gd}
                </td>
                <td className="px-4 py-3 text-center font-bold text-green-700 text-base">{row.pts}</td>
                <td className="px-4 py-3 hidden md:flex justify-center gap-1">
                  {row.form.map((res, i) => (
                    <span 
                        key={i} 
                        className={`w-5 h-5 flex items-center justify-center rounded text-[10px] text-white font-bold ${getFormColor(res)}`}
                        title={res === 'W' ? 'Won' : res === 'D' ? 'Draw' : 'Lost'}
                    >
                      {res}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 bg-gray-50 text-xs text-gray-500 flex justify-center gap-4">
        <div className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Promotion/CAF</div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full"></span> Relegation</div>
      </div>
    </div>
  );
}
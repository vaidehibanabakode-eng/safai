import React from 'react';

const LeaderboardTab: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">System Leaderboard</h2>
                <p className="text-gray-600">Performance rankings across all user categories</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Top Performing Areas</h3>
                    <div className="space-y-4">
                        {[
                            { rank: 1, area: 'Zone A', score: '9.8/10', badge: '🥇', improvement: '+0.3' },
                            { rank: 2, area: 'Zone C', score: '9.5/10', badge: '🥈', improvement: '+0.5' },
                            { rank: 3, area: 'Zone B', score: '9.2/10', badge: '🥉', improvement: '+0.2' },
                            { rank: 4, area: 'Zone D', score: '8.9/10', badge: '4️⃣', improvement: '+0.1' }
                        ].map((area, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{area.badge}</span>
                                    <div>
                                        <p className="font-semibold text-gray-900">{area.area}</p>
                                        <p className="text-sm text-gray-600">Rank #{area.rank}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-green-600">{area.score}</p>
                                    <p className="text-xs text-green-500">{area.improvement} this month</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Top Green Champions</h3>
                    <div className="space-y-4">
                        {[
                            { rank: 1, name: 'Priya Sharma', points: '2,450', badge: '🥇', area: 'Zone A' },
                            { rank: 2, name: 'Rajesh Kumar', points: '2,320', badge: '🥈', area: 'Zone B' },
                            { rank: 3, name: 'Anita Patel', points: '2,180', badge: '🥉', area: 'Zone C' },
                            { rank: 4, name: 'Suresh Gupta', points: '2,050', badge: '4️⃣', area: 'Zone D' }
                        ].map((champion, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{champion.badge}</span>
                                    <div>
                                        <p className="font-semibold text-gray-900">{champion.name}</p>
                                        <p className="text-sm text-gray-600">{champion.area}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-purple-600">{champion.points} pts</p>
                                    <p className="text-xs text-gray-500">Rank #{champion.rank}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardTab;

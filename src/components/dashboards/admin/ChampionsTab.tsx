import React from 'react';
import { Users, Calendar, Presentation, Award } from 'lucide-react';
import StatCard from '../../common/StatCard';

const ChampionsTab: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Green Champions</h2>
                <p className="text-gray-600">Track contributions and engagement of Green Champions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Active Champions"
                    value="120"
                    icon={<Users className="w-6 h-6" />}
                    trend={{ value: "6%", isPositive: true }}
                    color="blue"
                />
                <StatCard
                    title="Events Organized"
                    value="34"
                    icon={<Calendar className="w-6 h-6" />}
                    trend={{ value: "12%", isPositive: true }}
                    color="green"
                />
                <StatCard
                    title="Awareness Sessions"
                    value="89"
                    icon={<Presentation className="w-6 h-6" />}
                    trend={{ value: "9%", isPositive: true }}
                    color="purple"
                />
                <StatCard
                    title="Avg Impact Score"
                    value="91%"
                    icon={<Award className="w-6 h-6" />}
                    trend={{ value: "3%", isPositive: true }}
                    color="yellow"
                />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Champion Activity</h3>
                    <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Events</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact Score</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {[
                                { name: 'Aarav Champion', region: 'Ward 12', status: 'Active', events: '3', impact: '95%' },
                                { name: 'Neha Champion', region: 'Ward 8', status: 'Active', events: '2', impact: '89%' },
                                { name: 'Rohit Champion', region: 'Ward 15', status: 'Inactive', events: '0', impact: '70%' }
                            ].map((champion, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {champion.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {champion.region}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${champion.status === 'Active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}
                                        >
                                            {champion.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {champion.events}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {champion.impact}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors">
                                            View
                                        </button>
                                        <button className="text-green-600 hover:text-green-900 transition-colors">
                                            Assign Event
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ChampionsTab;

import React from 'react';
import { Calendar, Activity, Users, Award, TrendingUp } from 'lucide-react';
import StatCard from '../../common/StatCard';

const CampaignsTab: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Campaign Management</h2>
                    <p className="text-gray-600">Manage city-wide environmental campaigns</p>
                </div>
                <button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                    <Calendar className="w-5 h-5" />
                    Create Campaign
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Active Campaigns"
                    value="12"
                    icon={<Activity className="w-6 h-6" />}
                    trend={{ value: "3", isPositive: true }}
                    color="blue"
                />
                <StatCard
                    title="Total Participants"
                    value="8,450"
                    icon={<Users className="w-6 h-6" />}
                    trend={{ value: "1,200", isPositive: true }}
                    color="green"
                />
                <StatCard
                    title="Completed This Month"
                    value="5"
                    icon={<Award className="w-6 h-6" />}
                    color="purple"
                />
                <StatCard
                    title="Success Rate"
                    value="87%"
                    icon={<TrendingUp className="w-6 h-6" />}
                    trend={{ value: "5%", isPositive: true }}
                    color="yellow"
                />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900">Campaign Schedule</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {[
                                { name: 'Clean Streets Drive', area: 'Zone A', schedule: 'Weekly - Sundays', participants: 450, status: 'Active' },
                                { name: 'Waste Segregation Workshop', area: 'Zone B', schedule: 'Monthly - 1st Saturday', participants: 320, status: 'Scheduled' },
                                { name: 'Green Champion Training', area: 'City-wide', schedule: 'Quarterly', participants: 180, status: 'Active' },
                                { name: 'School Awareness Program', area: 'Zone C', schedule: 'Bi-weekly', participants: 600, status: 'Completed' }
                            ].map((campaign, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{campaign.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.area}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.schedule}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.participants}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${campaign.status === 'Active'
                                            ? 'bg-green-100 text-green-800'
                                            : campaign.status === 'Scheduled'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {campaign.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                        <button className="text-green-600 hover:text-green-900">View</button>
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

export default CampaignsTab;

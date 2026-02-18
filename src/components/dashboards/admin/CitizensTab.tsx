import React from 'react';
import { Users, Zap, GraduationCap, Award } from 'lucide-react';
import StatCard from '../../common/StatCard';

const CitizensTab: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Citizen Management</h2>
                <p className="text-gray-600">Monitor citizen engagement and participation</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Registered Citizens"
                    value="12,450"
                    icon={<Users className="w-6 h-6" />}
                    trend={{ value: "8%", isPositive: true }}
                    color="blue"
                />
                <StatCard
                    title="Active This Month"
                    value="8,920"
                    icon={<Zap className="w-6 h-6" />}
                    trend={{ value: "12%", isPositive: true }}
                    color="green"
                />
                <StatCard
                    title="Training Completed"
                    value="6,780"
                    icon={<GraduationCap className="w-6 h-6" />}
                    trend={{ value: "15%", isPositive: true }}
                    color="purple"
                />
                <StatCard
                    title="Avg Satisfaction"
                    value="4.3/5"
                    icon={<Award className="w-6 h-6" />}
                    trend={{ value: "0.2", isPositive: true }}
                    color="yellow"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Citizen Engagement</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">App Downloads</span>
                            <span className="font-semibold text-blue-600">15,230</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Daily Active Users</span>
                            <span className="font-semibold text-green-600">3,450</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Complaints Submitted</span>
                            <span className="font-semibold text-orange-600">1,247</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Feedback Provided</span>
                            <span className="font-semibold text-purple-600">2,890</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Area-wise Distribution</h3>
                    <div className="space-y-4">
                        {[
                            { area: 'Zone A', citizens: 3200, active: 2450, engagement: '76%' },
                            { area: 'Zone B', citizens: 2800, active: 2100, engagement: '75%' },
                            { area: 'Zone C', citizens: 3500, active: 2800, engagement: '80%' },
                            { area: 'Zone D', citizens: 2950, active: 2200, engagement: '75%' }
                        ].map((zone, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">{zone.area}</p>
                                    <p className="text-sm text-gray-500">{zone.active}/{zone.citizens} active</p>
                                </div>
                                <span className="font-semibold text-green-600">{zone.engagement}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CitizensTab;

import React from 'react';
import { PieChart, Activity, Award, DollarSign } from 'lucide-react';
import StatCard from '../../common/StatCard';

const AnalyticsTab: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
                <p className="text-gray-600">Comprehensive analytics and insights</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Collection Efficiency"
                    value="94%"
                    icon={<PieChart className="w-6 h-6" />}
                    trend={{ value: "3%", isPositive: true }}
                    color="green"
                />
                <StatCard
                    title="Worker Performance"
                    value="87%"
                    icon={<Activity className="w-6 h-6" />}
                    trend={{ value: "2%", isPositive: true }}
                    color="blue"
                />
                <StatCard
                    title="Citizen Satisfaction"
                    value="4.3/5"
                    icon={<Award className="w-6 h-6" />}
                    trend={{ value: "0.2", isPositive: true }}
                    color="purple"
                />
                <StatCard
                    title="Cost per Collection"
                    value="₹45"
                    icon={<DollarSign className="w-6 h-6" />}
                    trend={{ value: "₹3", isPositive: true }}
                    color="yellow"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Area Performance</h3>
                    <div className="space-y-4">
                        {[
                            { area: 'Zone A', score: 9.2, collections: 450, complaints: 12, color: 'green' },
                            { area: 'Zone B', score: 8.8, collections: 380, complaints: 18, color: 'blue' },
                            { area: 'Zone C', score: 8.5, collections: 420, complaints: 25, color: 'yellow' },
                            { area: 'Zone D', score: 7.9, collections: 350, complaints: 32, color: 'red' }
                        ].map((zone, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-gray-900">{zone.area}</h4>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${zone.color === 'green' ? 'bg-green-100 text-green-800' :
                                        zone.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                                            zone.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                        {zone.score}/10
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span>Collections: {zone.collections}</span>
                                    <span>Complaints: {zone.complaints}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Resource Utilization</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Vehicle Utilization</span>
                            <div className="flex items-center gap-2">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                                </div>
                                <span className="font-semibold text-green-600">85%</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Worker Capacity</span>
                            <div className="flex items-center gap-2">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                                </div>
                                <span className="font-semibold text-blue-600">78%</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Route Efficiency</span>
                            <div className="flex items-center gap-2">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                                </div>
                                <span className="font-semibold text-purple-600">92%</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Fuel Efficiency</span>
                            <div className="flex items-center gap-2">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '73%' }}></div>
                                </div>
                                <span className="font-semibold text-yellow-600">73%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsTab;

import React from 'react';
import { AlertTriangle, BarChart3, Users, DollarSign } from 'lucide-react';
import StatCard from '../../common/StatCard';

const OverviewTab: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">System Overview</h2>
                <p className="text-gray-600">Complete system analytics and performance metrics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Complaints"
                    value="2,847"
                    icon={<AlertTriangle className="w-6 h-6" />}
                    trend={{ value: "12%", isPositive: true }}
                    color="blue"
                />
                <StatCard
                    title="Resolved Complaints"
                    value="2,456"
                    icon={<BarChart3 className="w-6 h-6" />}
                    trend={{ value: "8%", isPositive: true }}
                    color="green"
                />
                <StatCard
                    title="Active Workers"
                    value="156"
                    icon={<Users className="w-6 h-6" />}
                    trend={{ value: "3%", isPositive: true }}
                    color="purple"
                />
                <StatCard
                    title="Revenue Generated"
                    value="₹45,230"
                    icon={<DollarSign className="w-6 h-6" />}
                    trend={{ value: "15%", isPositive: true }}
                    color="yellow"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">City-wide Performance</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Average Resolution Time</span>
                            <span className="font-semibold text-green-600">2.4 hours</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Worker Efficiency</span>
                            <span className="font-semibold text-blue-600">87%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Citizen Satisfaction</span>
                            <span className="font-semibold text-purple-600">4.2/5</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Waste Segregation</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Biomethanization</span>
                            <span className="font-semibold text-green-600">45%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Recycled</span>
                            <span className="font-semibold text-blue-600">32%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Waste to Energy</span>
                            <span className="font-semibold text-purple-600">23%</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">System Health</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">System Uptime</span>
                            <span className="font-semibold text-green-600">99.8%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: '99.8%' }}></div>
                        </div>

                        <div className="flex justify-between items-center mt-2">
                            <span className="text-gray-600">Active Users</span>
                            <span className="font-semibold text-blue-600">1,247</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>

                        <div className="flex justify-between items-center mt-2">
                            <span className="text-gray-600">Data Accuracy</span>
                            <span className="font-semibold text-purple-600">96.5%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-purple-600 h-2 rounded-full" style={{ width: '96.5%' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 text-white shadow-xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Municipal Excellence Score</h3>
                        <p className="text-emerald-100 text-lg">Your city is leading in waste management!</p>
                    </div>
                    <div className="text-center md:text-right bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                        <div className="text-5xl font-bold mb-1">9.2<span className="text-2xl text-emerald-200">/10</span></div>
                        <div className="text-emerald-100 font-medium">Overall Rating</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;

import React from 'react';
import {
    Users,
    AlertTriangle,
    ArrowUpRight,
    ArrowDownRight,
    Activity
} from 'lucide-react';
import StatCard from '../../common/StatCard';

interface OverviewTabProps {
    onNavigate: (tab: string) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ onNavigate }) => {
    const handleResolve = (item: string) => {
        alert(`Resolving: ${item}\n\nThis action would normally assign a worker or update the status.`);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
                    <p className="text-gray-600">Real-time overview of system performance and key metrics</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-1">
                        <Activity className="w-4 h-4" /> System Healthy
                    </span>
                </div>
            </div>

            {/* Key Metrics Row - 2 Columns now */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard
                    title="Total Complaints"
                    value="1,247"
                    icon={<AlertTriangle className="w-6 h-6" />}
                    trend={{ value: "12 new", isPositive: false }}
                    color="orange"
                />
                <StatCard
                    title="Active Workers"
                    value="45/48"
                    icon={<Users className="w-6 h-6" />}
                    trend={{ value: "94% Attendance", isPositive: true }}
                    color="blue"
                />
            </div>

            {/* Secondary Metrics & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Alerts / Priority Actions */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">Priority Actions</h3>
                        <button
                            onClick={() => onNavigate('complaints')}
                            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            View All
                        </button>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {[
                            { title: "Overflowing Bin at Market Complex", time: "10 mins ago", type: "Complaint", urgent: true },
                            { title: "Worker Attendance Verification Pending", time: "30 mins ago", type: "Task", urgent: false },
                            { title: "Zone B Collection Delayed", time: "1 hour ago", type: "Alert", urgent: true },
                        ].map((item, idx) => (
                            <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${item.urgent ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                                    <div>
                                        <p className="font-medium text-gray-900">{item.title}</p>
                                        <p className="text-sm text-gray-500">{item.time} • {item.type}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleResolve(item.title)}
                                    className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                                >
                                    Resolve
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Health / Quick Stats */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Status</h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Waste Level (City Avg)</span>
                                <span className="font-medium text-gray-900">67%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-500 w-[67%]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Vehicle Fleet Active</span>
                                <span className="font-medium text-gray-900">88%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[88%]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">User App Usage</span>
                                <span className="font-medium text-gray-900">High</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-[92%]"></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Trending Areas</h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Zone A</span>
                                <span className="text-green-600 flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> +12% Cleanliness</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Zone C</span>
                                <span className="text-red-500 flex items-center gap-1"><ArrowDownRight className="w-3 h-3" /> -3% Efficiency</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;

import React from 'react';
import { Users, UserCheck, CheckCircle } from 'lucide-react';
import StatCard from '../../common/StatCard';

const WorkersTab: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Worker Management</h2>
                <p className="text-gray-600">Monitor worker performance and attendance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Active Workers"
                    value="45"
                    icon={<Users className="w-6 h-6" />}
                    trend={{ value: "3%", isPositive: true }}
                    color="blue"
                />
                <StatCard
                    title="Present Today"
                    value="42"
                    icon={<UserCheck className="w-6 h-6" />}
                    trend={{ value: "5%", isPositive: true }}
                    color="green"
                />
                <StatCard
                    title="Tasks Completed"
                    value="127"
                    icon={<CheckCircle className="w-6 h-6" />}
                    trend={{ value: "8%", isPositive: true }}
                    color="purple"
                />
                <StatCard
                    title="Avg Performance"
                    value="87%"
                    icon={<CheckCircle className="w-6 h-6" />}
                    trend={{ value: "2%", isPositive: true }}
                    color="yellow"
                />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Worker Status</h3>
                    <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks Today</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {[
                                { name: 'John Worker', area: 'Zone A', status: 'Active', tasks: '5/6', performance: '92%' },
                                { name: 'Sarah Worker', area: 'Zone B', status: 'Active', tasks: '4/5', performance: '88%' },
                                { name: 'Mike Worker', area: 'Zone C', status: 'Offline', tasks: '3/4', performance: '85%' }
                            ].map((worker, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{worker.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.area}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${worker.status === 'Active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {worker.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.tasks}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.performance}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => alert(`Opening ${worker.name}'s profile...`)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
                                        >
                                            View
                                        </button>
                                        <button className="text-green-600 hover:text-green-900 transition-colors">Assign Task</button>
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

export default WorkersTab;

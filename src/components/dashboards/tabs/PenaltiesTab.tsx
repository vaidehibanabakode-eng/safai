import React from 'react';
import { AlertTriangle, Calendar, DollarSign, FileText } from 'lucide-react';
import StatCard from '../../common/StatCard';

const PenaltiesTab: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Penalty Management</h2>
                <p className="text-gray-600">Monitor and manage penalties across the system</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Penalties"
                    value="156"
                    icon={<AlertTriangle className="w-6 h-6" />}
                    trend={{ value: "12", isPositive: false }}
                    color="red"
                />
                <StatCard
                    title="This Month"
                    value="23"
                    icon={<Calendar className="w-6 h-6" />}
                    trend={{ value: "5", isPositive: false }}
                    color="yellow"
                />
                <StatCard
                    title="Amount Collected"
                    value="₹45,600"
                    icon={<DollarSign className="w-6 h-6" />}
                    trend={{ value: "₹8,200", isPositive: true }}
                    color="green"
                />
                <StatCard
                    title="Pending Appeals"
                    value="8"
                    icon={<FileText className="w-6 h-6" />}
                    color="blue"
                />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Penalties</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {[
                                { id: 'P001', user: 'Worker - John Smith', type: 'Missed Collection', amount: '₹500', status: 'Paid', date: '2024-01-15' },
                                { id: 'P002', user: 'Citizen - Priya Sharma', type: 'Improper Disposal', amount: '₹200', status: 'Pending', date: '2024-01-14' },
                                { id: 'P003', user: 'Worker - Mike Wilson', type: 'Late Arrival', amount: '₹300', status: 'Appeal', date: '2024-01-13' }
                            ].map((penalty, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{penalty.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{penalty.user}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{penalty.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{penalty.amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${penalty.status === 'Paid'
                                            ? 'bg-green-100 text-green-800'
                                            : penalty.status === 'Pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {penalty.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{penalty.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PenaltiesTab;

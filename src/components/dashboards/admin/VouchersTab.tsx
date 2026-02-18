import React from 'react';
import { Target, Award, Clock, TrendingUp } from 'lucide-react';
import StatCard from '../../common/StatCard';

const VouchersTab: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Voucher Management</h2>
                <p className="text-gray-600">Manage incentive vouchers and rewards</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Vouchers"
                    value="850"
                    icon={<Target className="w-6 h-6" />}
                    trend={{ value: "50", isPositive: true }}
                    color="blue"
                />
                <StatCard
                    title="Vouchers Claimed"
                    value="620"
                    icon={<Award className="w-6 h-6" />}
                    trend={{ value: "45", isPositive: true }}
                    color="green"
                />
                <StatCard
                    title="Pending Claims"
                    value="230"
                    icon={<Clock className="w-6 h-6" />}
                    trend={{ value: "-12", isPositive: false }}
                    color="yellow"
                />
                <StatCard
                    title="Redemption Rate"
                    value="73%"
                    icon={<TrendingUp className="w-6 h-6" />}
                    trend={{ value: "5%", isPositive: true }}
                    color="purple"
                />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Voucher Activity</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voucher ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {[
                                { id: 'V001', user: 'John Citizen', type: 'Green Points', value: '₹100', status: 'Claimed', date: '2024-01-15' },
                                { id: 'V002', user: 'Sarah Green', type: 'Training Bonus', value: '₹50', status: 'Pending', date: '2024-01-14' },
                                { id: 'V003', user: 'Mike Worker', type: 'Performance', value: '₹200', status: 'Claimed', date: '2024-01-13' }
                            ].map((voucher, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{voucher.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{voucher.user}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{voucher.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{voucher.value}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${voucher.status === 'Claimed'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {voucher.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{voucher.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VouchersTab;

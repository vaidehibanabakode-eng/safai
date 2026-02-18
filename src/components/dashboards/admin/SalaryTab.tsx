import React from 'react';
import { DollarSign, Users, AlertCircle, TrendingUp } from 'lucide-react';
import StatCard from '../../common/StatCard';

const SalaryTab: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Salary Tracking</h2>
                <p className="text-gray-600">Monitor worker salaries and payments</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Payroll"
                    value="₹4,56,000"
                    icon={<DollarSign className="w-6 h-6" />}
                    trend={{ value: "₹23,000", isPositive: true }}
                    color="green"
                />
                <StatCard
                    title="Workers Paid"
                    value="42/45"
                    icon={<Users className="w-6 h-6" />}
                    color="blue"
                />
                <StatCard
                    title="Pending Payments"
                    value="3"
                    icon={<AlertCircle className="w-6 h-6" />}
                    color="yellow"
                />
                <StatCard
                    title="Average Salary"
                    value="₹10,800"
                    icon={<TrendingUp className="w-6 h-6" />}
                    trend={{ value: "₹500", isPositive: true }}
                    color="purple"
                />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900">Salary Records</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Worker</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Salary</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incentives</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Pay</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {[
                                { name: 'John Worker', base: '₹10,000', incentives: '₹1,200', deductions: '₹200', net: '₹11,000', status: 'Paid' },
                                { name: 'Sarah Cleaner', base: '₹10,000', incentives: '₹800', deductions: '₹0', net: '₹10,800', status: 'Paid' },
                                { name: 'Mike Collector', base: '₹10,000', incentives: '₹500', deductions: '₹300', net: '₹10,200', status: 'Pending' }
                            ].map((worker, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{worker.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.base}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{worker.incentives}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{worker.deductions}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{worker.net}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${worker.status === 'Paid'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {worker.status}
                                        </span>
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

export default SalaryTab;

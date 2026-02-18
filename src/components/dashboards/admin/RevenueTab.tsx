import React from 'react';
import { DollarSign, TrendingUp, CreditCard, PieChart } from 'lucide-react';
import StatCard from '../../common/StatCard';

const RevenueTab: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Revenue Management</h2>
                <p className="text-gray-600">Track and manage system revenue streams</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value="₹12,45,000"
                    icon={<DollarSign className="w-6 h-6" />}
                    trend={{ value: "15%", isPositive: true }}
                    color="green"
                />
                <StatCard
                    title="This Month"
                    value="₹1,25,000"
                    icon={<TrendingUp className="w-6 h-6" />}
                    trend={{ value: "8%", isPositive: true }}
                    color="blue"
                />
                <StatCard
                    title="Pending Collections"
                    value="₹45,000"
                    icon={<CreditCard className="w-6 h-6" />}
                    trend={{ value: "2%", isPositive: false }}
                    color="yellow"
                />
                <StatCard
                    title="Growth Rate"
                    value="12.5%"
                    icon={<PieChart className="w-6 h-6" />}
                    trend={{ value: "2.1%", isPositive: true }}
                    color="purple"
                />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
                <div className="max-w-md mx-auto">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Detailed Reports Coming Soon</h3>
                    <p className="text-gray-600">We are building detailed revenue breakdown and forecasting tools.</p>
                </div>
            </div>
        </div>
    );
};

export default RevenueTab;

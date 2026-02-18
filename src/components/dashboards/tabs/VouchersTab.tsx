import React from 'react';
import { Target, Award, Zap, TrendingUp } from 'lucide-react';
import StatCard from '../../common/StatCard';

const VouchersTab: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Vouchers & Incentives</h2>
                <p className="text-gray-600">Manage reward systems and incentive programs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Vouchers"
                    value="1,250"
                    icon={<Target className="w-6 h-6" />}
                    trend={{ value: "150", isPositive: true }}
                    color="blue"
                />
                <StatCard
                    title="Vouchers Claimed"
                    value="890"
                    icon={<Award className="w-6 h-6" />}
                    trend={{ value: "120", isPositive: true }}
                    color="green"
                />
                <StatCard
                    title="Active Campaigns"
                    value="8"
                    icon={<Zap className="w-6 h-6" />}
                    color="purple"
                />
                <StatCard
                    title="Redemption Rate"
                    value="71%"
                    icon={<TrendingUp className="w-6 h-6" />}
                    trend={{ value: "5%", isPositive: true }}
                    color="yellow"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Area-wise Voucher Distribution</h3>
                    <div className="space-y-4">
                        {[
                            { area: 'Zone A', provided: 320, claimed: 245, rate: '77%' },
                            { area: 'Zone B', provided: 280, claimed: 198, rate: '71%' },
                            { area: 'Zone C', provided: 350, claimed: 267, rate: '76%' },
                            { area: 'Zone D', provided: 300, claimed: 180, rate: '60%' }
                        ].map((zone, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">{zone.area}</p>
                                    <p className="text-sm text-gray-500">{zone.claimed}/{zone.provided} claimed</p>
                                </div>
                                <span className="font-semibold text-green-600">{zone.rate}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Campaign Performance</h3>
                    <div className="space-y-4">
                        {[
                            { name: 'Clean Streets Challenge', participants: 450, completion: '89%', status: 'Active' },
                            { name: 'Waste Segregation Drive', participants: 320, completion: '76%', status: 'Active' },
                            { name: 'Green Champion Program', participants: 180, completion: '94%', status: 'Completed' }
                        ].map((campaign, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${campaign.status === 'Active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {campaign.status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span>Participants: {campaign.participants}</span>
                                    <span>Completion: {campaign.completion}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VouchersTab;

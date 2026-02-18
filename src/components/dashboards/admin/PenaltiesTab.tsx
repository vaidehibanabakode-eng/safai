import React from 'react';
import { Shield, AlertCircle, FileText, CheckCircle } from 'lucide-react';
import StatCard from '../../common/StatCard';

const PenaltiesTab: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Penalty Management</h2>
                <p className="text-gray-600">Manage violations and penalty enforcement</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Penalties"
                    value="156"
                    icon={<Shield className="w-6 h-6" />}
                    trend={{ value: "4%", isPositive: true }}
                    color="red"
                />
                <StatCard
                    title="Collected Amount"
                    value="₹78,000"
                    icon={<FileText className="w-6 h-6" />}
                    trend={{ value: "12%", isPositive: true }}
                    color="green"
                />
                <StatCard
                    title="Pending Cases"
                    value="34"
                    icon={<AlertCircle className="w-6 h-6" />}
                    color="yellow"
                />
                <StatCard
                    title="Resolution Rate"
                    value="82%"
                    icon={<CheckCircle className="w-6 h-6" />}
                    trend={{ value: "5%", isPositive: true }}
                    color="blue"
                />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
                <div className="max-w-md mx-auto">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Penalty System Under Maintenance</h3>
                    <p className="text-gray-600">Advanced tracking features are currently being updated.</p>
                </div>
            </div>
        </div>
    );
};

export default PenaltiesTab;

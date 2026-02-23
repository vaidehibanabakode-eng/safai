import React from 'react';
import { DollarSign, Users, AlertCircle, TrendingUp, Upload, FileMinus } from 'lucide-react';
import StatCard from '../../common/StatCard';

interface SalaryTabProps {
    onNavigate: (tab: string) => void;
}

const SalaryTab: React.FC<SalaryTabProps> = ({ onNavigate }) => {
    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv, .xlsx';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                alert(`Importing ${file.name}... This feature requires a backend integration.`);
            }
        };
        input.click();
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Salary Tracking</h2>
                    <p className="text-gray-600">Monitor and manage workforce payroll</p>
                </div>
                <button
                    onClick={handleImport}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                >
                    <Upload className="w-4 h-4" />
                    Import Sheet
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Payroll"
                    value="—"
                    icon={<DollarSign className="w-6 h-6" />}
                    trend={{ value: "Pending Sync", isPositive: false }}
                    color="green"
                />
                <StatCard
                    title="Workers Paid"
                    value="0"
                    icon={<Users className="w-6 h-6" />}
                    color="blue"
                />
                <StatCard
                    title="Pending"
                    value="0"
                    icon={<AlertCircle className="w-6 h-6" />}
                    color="yellow"
                />
                <StatCard
                    title="Avg Payout"
                    value="—"
                    icon={<TrendingUp className="w-6 h-6" />}
                    color="purple"
                />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px] flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <FileMinus className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Salary Records Found</h3>
                <p className="text-gray-500 max-w-md">
                    Payroll records for the current period have not been generated or imported yet.
                    Upload a salary sheet to get started or wait for automated processing.
                </p>
                <div className="mt-6 flex gap-3">
                    <button
                        onClick={handleImport}
                        className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 font-medium transition-colors"
                    >
                        Import Sheet
                    </button>
                    <button
                        onClick={() => onNavigate('workers')}
                        className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 font-medium transition-colors"
                    >
                        View Workers
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SalaryTab;


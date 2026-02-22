import React from 'react';
import { DollarSign, Users, AlertCircle, TrendingUp, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import StatCard from '../../common/StatCard';

interface SalaryTabProps {
    onNavigate: (tab: string) => void;
}

const SalaryTab: React.FC<SalaryTabProps> = ({ onNavigate }) => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 5;

    const salaryData = [
        { name: 'John Worker', base: '₹10,000', incentives: '₹1,200', deductions: '₹200', net: '₹11,000', status: 'Paid' },
        { name: 'Sarah Cleaner', base: '₹10,000', incentives: '₹800', deductions: '₹0', net: '₹10,800', status: 'Paid' },
        { name: 'Mike Collector', base: '₹10,000', incentives: '₹500', deductions: '₹300', net: '₹10,200', status: 'Pending' },
        { name: 'Rahul Driver', base: '₹12,000', incentives: '₹1,500', deductions: '₹500', net: '₹13,000', status: 'Paid' },
        { name: 'Anita Helper', base: '₹9,000', incentives: '₹1,000', deductions: '₹0', net: '₹10,000', status: 'Processing' },
        { name: 'Rajesh Sweeper', base: '₹10,500', incentives: '₹900', deductions: '₹200', net: '₹11,200', status: 'Pending' },
    ];

    const totalPages = Math.ceil(salaryData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = salaryData.slice(startIndex, startIndex + itemsPerPage);

    const handleImport = () => {
        // Trigger file input click or show modal
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv, .xlsx';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                alert(`Importing ${file.name}...`);
            }
        };
        input.click();
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Salary Tracking</h2>
                    <p className="text-gray-600">Monitor worker salaries and payments</p>
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
                    <table className="w-full min-w-[800px]">
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
                            {currentData.map((worker, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => onNavigate('workers')}
                                            className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
                                        >
                                            {worker.name}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.base}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{worker.incentives}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{worker.deductions}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{worker.net}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${worker.status === 'Paid'
                                            ? 'bg-green-100 text-green-800'
                                            : worker.status === 'Pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {worker.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(startIndex + itemsPerPage, salaryData.length)}</span> of <span className="font-medium">{salaryData.length}</span> results
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 border border-gray-300 rounded-lg md:px-4 md:py-2 md:w-auto hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <span className="hidden md:inline">Previous</span>
                            <ChevronLeft className="w-4 h-4 md:hidden" />
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-2 border border-gray-300 rounded-lg md:px-4 md:py-2 md:w-auto hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <span className="hidden md:inline">Next</span>
                            <ChevronRight className="w-4 h-4 md:hidden" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalaryTab;

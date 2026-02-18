import React, { useState } from 'react';
import { Users, Zap, Globe, Shield, UserPlus, Search, Filter, MoreVertical, X } from 'lucide-react';
import StatCard from '../../common/StatCard';

const AdminManagementTab: React.FC = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const admins = [
        { name: 'John Smith', email: 'john@admin.com', area: 'Zone A', status: 'Active', performance: '96%' },
        { name: 'Sarah Johnson', email: 'sarah@admin.com', area: 'Zone B', status: 'Active', performance: '94%' },
        { name: 'Mike Wilson', email: 'mike@admin.com', area: 'Zone C', status: 'Inactive', performance: '89%' },
        { name: 'Emily Davis', email: 'emily@admin.com', area: 'Zone D', status: 'Active', performance: '98%' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Management</h2>
                    <p className="text-gray-600">Manage system administrators and zone assignments</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                    <UserPlus className="w-5 h-5" />
                    Add New Admin
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Admins"
                    value="12"
                    icon={<Users className="w-6 h-6" />}
                    trend={{ value: "2", isPositive: true }}
                    color="blue"
                />
                <StatCard
                    title="Active Today"
                    value="10"
                    icon={<Zap className="w-6 h-6" />}
                    trend={{ value: "1", isPositive: true }}
                    color="green"
                />
                <StatCard
                    title="Areas Covered"
                    value="8"
                    icon={<Globe className="w-6 h-6" />}
                    color="purple"
                />
                <StatCard
                    title="Avg Performance"
                    value="94%"
                    icon={<Shield className="w-6 h-6" />}
                    trend={{ value: "3%", isPositive: true }}
                    color="yellow"
                />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h3 className="text-lg font-semibold text-gray-900">Active Administrators</h3>
                    <div className="flex w-full sm:w-auto gap-4">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search admins..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                        </div>
                        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-600">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Area</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Performance</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {admins.map((admin, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold mr-3">
                                                {admin.name.charAt(0)}
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.area}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${admin.status === 'Active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {admin.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className="text-sm text-gray-900 font-medium mr-2">{admin.performance}</span>
                                            <div className="w-24 bg-gray-200 rounded-full h-1.5">
                                                <div
                                                    className={`h-1.5 rounded-full ${parseInt(admin.performance) > 90 ? 'bg-green-500' : 'bg-yellow-500'}`}
                                                    style={{ width: admin.performance }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center text-sm text-gray-500">
                    <span>Showing 1 to 4 of 12 admins</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">Next</button>
                    </div>
                </div>
            </div>

            {/* Add Admin Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">Add New Administrator</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" placeholder="e.g. John Doe" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email Address</label>
                                <input type="email" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" placeholder="e.g. john@admin.com" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Assigned Zone</label>
                                    <select className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white">
                                        <option>Zone A</option>
                                        <option>Zone B</option>
                                        <option>Zone C</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Role Level</label>
                                    <select className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white">
                                        <option>Senior Admin</option>
                                        <option>Zone Admin</option>
                                        <option>Viewer</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
                            >
                                Create Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminManagementTab;

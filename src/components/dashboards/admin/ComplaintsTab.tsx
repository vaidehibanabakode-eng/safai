import React from 'react';
import { ClipboardList, CheckCircle, AlertCircle } from 'lucide-react';
import StatCard from '../../common/StatCard';

const ComplaintsTab: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Complaint Management</h2>
                <p className="text-gray-600">Monitor and manage citizen complaints</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Complaints"
                    value="1,247"
                    icon={<ClipboardList className="w-6 h-6" />}
                    trend={{ value: "8%", isPositive: true }}
                    color="blue"
                />
                <StatCard
                    title="Resolved Today"
                    value="89"
                    icon={<CheckCircle className="w-6 h-6" />}
                    trend={{ value: "12%", isPositive: true }}
                    color="green"
                />
                <StatCard
                    title="Pending"
                    value="156"
                    icon={<AlertCircle className="w-6 h-6" />}
                    trend={{ value: "5%", isPositive: false }}
                    color="yellow"
                />
                <StatCard
                    title="Avg Resolution Time"
                    value="2.4h"
                    icon={<CheckCircle className="w-6 h-6" />}
                    trend={{ value: "15%", isPositive: true }}
                    color="purple"
                />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Complaints</h3>
                    <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {[
                                { id: 'C001', location: 'MG Road', type: 'Overflowing Bin', status: 'Pending', assignedTo: 'John Worker' },
                                { id: 'C002', location: 'Park Street', type: 'Illegal Dumping', status: 'In Progress', assignedTo: 'Sarah Worker' },
                                { id: 'C003', location: 'Main Square', type: 'Missed Collection', status: 'Resolved', assignedTo: 'Mike Worker' }
                            ].map((complaint, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{complaint.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.location}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${complaint.status === 'Resolved'
                                            ? 'bg-green-100 text-green-800'
                                            : complaint.status === 'In Progress'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {complaint.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.assignedTo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors">View</button>
                                        <button className="text-green-600 hover:text-green-900 transition-colors">Assign</button>
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

export default ComplaintsTab;

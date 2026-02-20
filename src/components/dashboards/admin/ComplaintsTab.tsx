import React from 'react';
import { ClipboardList, CheckCircle, AlertCircle, MoreVertical, Edit, Trash2, Eye, UserPlus } from 'lucide-react';
import StatCard from '../../common/StatCard';

const ComplaintsTab: React.FC = () => {
    const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);

    const toggleDropdown = (id: string) => {
        if (activeDropdown === id) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(id);
        }
    };

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (activeDropdown && !(event.target as Element).closest('.dropdown-container')) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeDropdown]);

    const handleAction = (action: string, id: string) => {
        alert(`${action} complaint ${id}`);
        setActiveDropdown(null);
    };

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

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
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
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right relative dropdown-container">
                                        <button
                                            onClick={() => toggleDropdown(complaint.id)}
                                            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                                        >
                                            <MoreVertical className="w-5 h-5" />
                                        </button>

                                        {activeDropdown === complaint.id && (
                                            <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 animate-in fade-in zoom-in duration-200">
                                                <div className="py-1" role="menu">
                                                    <button
                                                        onClick={() => handleAction('View', complaint.id)}
                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                    >
                                                        <Eye className="w-4 h-4 text-gray-500" /> View Details
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction('Edit', complaint.id)}
                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                    >
                                                        <Edit className="w-4 h-4 text-blue-500" /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction('Assign', complaint.id)}
                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                    >
                                                        <UserPlus className="w-4 h-4 text-green-500" /> Assign Worker
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction('Remove', complaint.id)}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                    >
                                                        <Trash2 className="w-4 h-4" /> Remove
                                                    </button>
                                                </div>
                                            </div>
                                        )}
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

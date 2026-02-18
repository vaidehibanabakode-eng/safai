import React from 'react';
import { Truck, CheckCircle, Activity, Award } from 'lucide-react';
import StatCard from '../../common/StatCard';

const UberTab: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Uber for Garbage</h2>
                <p className="text-gray-600">On-demand waste collection service management</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Active Requests"
                    value="12"
                    icon={<Truck className="w-6 h-6" />}
                    color="blue"
                />
                <StatCard
                    title="Completed Today"
                    value="45"
                    icon={<CheckCircle className="w-6 h-6" />}
                    trend={{ value: "8", isPositive: true }}
                    color="green"
                />
                <StatCard
                    title="Average Response"
                    value="35 min"
                    icon={<Activity className="w-6 h-6" />}
                    trend={{ value: "5 min", isPositive: true }}
                    color="purple"
                />
                <StatCard
                    title="Customer Rating"
                    value="4.7/5"
                    icon={<Award className="w-6 h-6" />}
                    trend={{ value: "0.1", isPositive: true }}
                    color="yellow"
                />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900">Live Requests</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waste Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {[
                                { id: 'UG001', customer: 'Priya Sharma', location: 'MG Road, Apt 5B', type: 'Bulk Waste', status: 'In Progress', worker: 'John Worker' },
                                { id: 'UG002', customer: 'Rajesh Kumar', location: 'Park Street, House 12', type: 'E-Waste', status: 'Assigned', worker: 'Sarah Collector' },
                                { id: 'UG003', customer: 'Anita Patel', location: 'City Center, Office 3F', type: 'Garden Waste', status: 'Pending', worker: 'Not Assigned' }
                            ].map((request, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.customer}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.location}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${request.status === 'In Progress'
                                            ? 'bg-blue-100 text-blue-800'
                                            : request.status === 'Assigned'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.worker}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UberTab;

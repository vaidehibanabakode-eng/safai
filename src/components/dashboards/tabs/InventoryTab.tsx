import React from 'react';
import { Truck, Activity, AlertTriangle, Package } from 'lucide-react';
import StatCard from '../../common/StatCard';

const InventoryTab: React.FC = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h2>
                <p className="text-gray-600">Track equipment, vehicles, and resources</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Vehicles"
                    value="45"
                    icon={<Truck className="w-6 h-6" />}
                    trend={{ value: "2", isPositive: true }}
                    color="blue"
                />
                <StatCard
                    title="Active Vehicles"
                    value="42"
                    icon={<Activity className="w-6 h-6" />}
                    color="green"
                />
                <StatCard
                    title="Maintenance Due"
                    value="8"
                    icon={<AlertTriangle className="w-6 h-6" />}
                    color="yellow"
                />
                <StatCard
                    title="Equipment Value"
                    value="₹2.4Cr"
                    icon={<Package className="w-6 h-6" />}
                    color="purple"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Fleet Status</h3>
                    <div className="space-y-4">
                        {[
                            { type: 'Compactor Trucks', total: 15, active: 14, maintenance: 1 },
                            { type: 'Side Loaders', total: 12, active: 11, maintenance: 1 },
                            { type: 'Front Loaders', total: 8, active: 8, maintenance: 0 },
                            { type: 'Roll-off Trucks', total: 10, active: 9, maintenance: 1 }
                        ].map((vehicle, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-gray-900">{vehicle.type}</h4>
                                    <span className="text-sm text-gray-500">Total: {vehicle.total}</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="text-green-600">Active: {vehicle.active}</span>
                                    <span className="text-yellow-600">Maintenance: {vehicle.maintenance}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Equipment Inventory</h3>
                    <div className="space-y-4">
                        {[
                            { item: 'Waste Bins (Large)', quantity: 450, status: 'Good', lastUpdated: '2024-01-15' },
                            { item: 'Safety Equipment Sets', quantity: 120, status: 'Good', lastUpdated: '2024-01-14' },
                            { item: 'Collection Tools', quantity: 200, status: 'Fair', lastUpdated: '2024-01-13' },
                            { item: 'Cleaning Supplies', quantity: 80, status: 'Low Stock', lastUpdated: '2024-01-12' }
                        ].map((equipment, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-gray-900">{equipment.item}</h4>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${equipment.status === 'Good'
                                        ? 'bg-green-100 text-green-800'
                                        : equipment.status === 'Fair'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                        {equipment.status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span>Quantity: {equipment.quantity}</span>
                                    <span>Updated: {equipment.lastUpdated}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryTab;

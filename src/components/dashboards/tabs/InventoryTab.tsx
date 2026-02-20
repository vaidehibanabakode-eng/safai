import React from 'react';
import { Truck, Activity, AlertTriangle, Package } from 'lucide-react';
import StatCard from '../../common/StatCard';
import { useLanguage } from '../../../contexts/LanguageContext';

const InventoryTab: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('inventory_management')}</h2>
                <p className="text-gray-600">{t('inventory_subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title={t('total_vehicles')}
                    value="45"
                    icon={<Truck className="w-6 h-6" />}
                    trend={{ value: "2", isPositive: true }}
                    color="blue"
                />
                <StatCard
                    title={t('active_vehicles')}
                    value="42"
                    icon={<Activity className="w-6 h-6" />}
                    color="green"
                />
                <StatCard
                    title={t('maintenance_due')}
                    value="8"
                    icon={<AlertTriangle className="w-6 h-6" />}
                    color="yellow"
                />
                <StatCard
                    title={t('equipment_value')}
                    value="₹2.4Cr"
                    icon={<Package className="w-6 h-6" />}
                    color="purple"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('vehicle_fleet_status')}</h3>
                    <div className="space-y-4">
                        {[
                            { type: t('compactor_trucks'), total: 15, active: 14, maintenance: 1 },
                            { type: t('side_loaders'), total: 12, active: 11, maintenance: 1 },
                            { type: t('front_loaders'), total: 8, active: 8, maintenance: 0 },
                            { type: t('roll_off_trucks'), total: 10, active: 9, maintenance: 1 }
                        ].map((vehicle, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-gray-900">{vehicle.type}</h4>
                                    <span className="text-sm text-gray-500">{t('total_label')}: {vehicle.total}</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="text-green-600">{t('active_label')}: {vehicle.active}</span>
                                    <span className="text-yellow-600">{t('maintenance_label')}: {vehicle.maintenance}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('equipment_inventory')}</h3>
                    <div className="space-y-4">
                        {[
                            { item: t('waste_bins_large'), quantity: 450, status: t('status_good'), lastUpdated: '2024-01-15', statusColor: 'bg-green-100 text-green-800' },
                            { item: t('safety_equipment_sets'), quantity: 120, status: t('status_good'), lastUpdated: '2024-01-14', statusColor: 'bg-green-100 text-green-800' },
                            { item: t('collection_tools'), quantity: 200, status: t('status_fair'), lastUpdated: '2024-01-13', statusColor: 'bg-yellow-100 text-yellow-800' },
                            { item: t('cleaning_supplies'), quantity: 80, status: t('status_low_stock'), lastUpdated: '2024-01-12', statusColor: 'bg-red-100 text-red-800' }
                        ].map((equipment, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-gray-900">{equipment.item}</h4>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${equipment.statusColor}`}>
                                        {equipment.status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span>{t('quantity_label')}: {equipment.quantity}</span>
                                    <span>{t('updated_label')}: {equipment.lastUpdated}</span>
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

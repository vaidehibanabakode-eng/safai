import React, { useState } from 'react';
import {
    FileText,
    Download,
    Calendar,
    Filter,
    BarChart3,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Clock,
    MapPin,
    ChevronDown
} from 'lucide-react';
import StatCard from '../../common/StatCard';
import { useLanguage } from '../../../contexts/LanguageContext';

const ReportsTab: React.FC = () => {
    const { t } = useLanguage();
    const [dateRange, setDateRange] = useState(t('this_month'));

    const zones = [
        { name: 'Zone A', complaints: 145, resolved: 140, avgTime: '2.5h', satisfaction: '4.8/5', status: 'Excellent' },
        { name: 'Zone B', complaints: 89, resolved: 85, avgTime: '3.1h', satisfaction: '4.5/5', status: 'Good' },
        { name: 'Zone C', complaints: 210, resolved: 180, avgTime: '4.2h', satisfaction: '3.9/5', status: 'Average' },
        { name: 'Zone D', complaints: 65, resolved: 65, avgTime: '1.8h', satisfaction: '4.9/5', status: 'Excellent' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('system_reports')}</h2>
                    <p className="text-gray-600">{t('reports_subtitle')}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 bg-white shadow-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{t('this_month')}</span>
                        <ChevronDown className="w-3 h-3 ml-1" />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-md transition-all">
                        <Download className="w-4 h-4" />
                        <span>{t('export_csv')}</span>
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title={t('total_complaints')}
                    value="1,245"
                    icon={<FileText className="w-6 h-6" />}
                    trend={{ value: "12%", isPositive: true }}
                    color="blue"
                />
                <StatCard
                    title={t('resolution_rate')}
                    value="94.2%"
                    icon={<CheckCircle className="w-6 h-6" />}
                    trend={{ value: "4.1%", isPositive: true }}
                    color="green"
                />
                <StatCard
                    title={t('avg_response_time')}
                    value="2h 15m"
                    icon={<Clock className="w-6 h-6" />}
                    trend={{ value: "15m", isPositive: true }}
                    color="purple"
                />
                <StatCard
                    title={t('critical_issues')}
                    value="12"
                    icon={<AlertTriangle className="w-6 h-6" />}
                    trend={{ value: "2", isPositive: false }}
                    color="red"
                />
            </div>

            {/* Zone Performance Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <h3 className="text-lg font-bold text-gray-900">{t('zone_performance_analytics')}</h3>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('zone_name')}</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('complaints_label')}</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('resolved_label')}</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('avg_time_label')}</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('satisfaction_label')}</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('health_status')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {zones.map((zone, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-semibold text-gray-900">{zone.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">{zone.complaints}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-emerald-600 font-medium">{zone.resolved}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-600">{zone.avgTime}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center font-medium text-gray-900">⭐ {zone.satisfaction}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${zone.status === 'Excellent' ? 'bg-green-100 text-green-700' :
                                            zone.status === 'Good' ? 'bg-blue-100 text-blue-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {/* Translate status dynamically */}
                                            {zone.status === 'Excellent' ? t('status_excellent') :
                                                zone.status === 'Good' ? t('status_good') :
                                                    t('status_average')}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Charts Row Placeholder (Visual only for now) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm min-h-[300px] flex flex-col items-center justify-center text-center">
                    <BarChart3 className="w-16 h-16 text-gray-300 mb-4" />
                    <h3 className="text-gray-900 font-semibold text-lg">{t('weekly_complaint_volume')}</h3>
                    <p className="text-gray-500">{t('chart_unavailable')}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm min-h-[300px] flex flex-col items-center justify-center text-center">
                    <TrendingUp className="w-16 h-16 text-gray-300 mb-4" />
                    <h3 className="text-gray-900 font-semibold text-lg">{t('resolution_efficiency_trend')}</h3>
                    <p className="text-gray-500">{t('chart_unavailable')}</p>
                </div>
            </div>
        </div>
    );
};

export default ReportsTab;

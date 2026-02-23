import React, { useEffect, useState } from 'react';
import {
    FileText,
    Download,
    Calendar,
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
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

const ReportsTab: React.FC = () => {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        resolved: 0,
        critical: 0,
        resolutionRate: '0%'
    });

    useEffect(() => {
        const q = query(collection(db, 'complaints'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const all = snapshot.docs;
            const resolved = all.filter(d => d.data().status === 'RESOLVED').length;
            const critical = all.filter(d => d.data().priority === 'HIGH' || d.data().priority === 'URGENT').length;
            const rate = all.length > 0 ? ((resolved / all.length) * 100).toFixed(1) + '%' : '0%';

            setStats({
                total: all.length,
                resolved,
                critical,
                resolutionRate: rate
            });
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

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
                    value={loading ? "..." : stats.total.toString()}
                    icon={<FileText className="w-6 h-6" />}
                    trend={{ value: "Live", isPositive: true }}
                    color="blue"
                />
                <StatCard
                    title={t('resolution_rate')}
                    value={loading ? "..." : stats.resolutionRate}
                    icon={<CheckCircle className="w-6 h-6" />}
                    trend={{ value: "Live", isPositive: true }}
                    color="green"
                />
                <StatCard
                    title={t('avg_response_time')}
                    value="—"
                    icon={<Clock className="w-6 h-6" />}
                    color="purple"
                />
                <StatCard
                    title={t('critical_issues')}
                    value={loading ? "..." : stats.critical.toString()}
                    icon={<AlertTriangle className="w-6 h-6" />}
                    color="red"
                />
            </div>

            {/* Zone Performance Table Placeholder */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <h3 className="text-lg font-bold text-gray-900">{t('zone_performance_analytics')}</h3>
                    </div>
                </div>
                <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                        <BarChart3 className="w-8 h-8 text-gray-300" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">{t('chart_unavailable')}</h4>
                    <p className="text-gray-500 max-w-sm mx-auto">
                        Detailed zone-wise analytics are being processed. Regional performance data will appear here as more complaints are localized.
                    </p>
                </div>
            </div>

            {/* Charts Row Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm min-h-[300px] flex flex-col items-center justify-center text-center">
                    <BarChart3 className="w-12 h-12 text-gray-200 mb-4" />
                    <h3 className="text-gray-900 font-semibold text-lg">{t('weekly_complaint_volume')}</h3>
                    <p className="text-gray-400 text-sm mt-1">{t('chart_unavailable')}</p>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm min-h-[300px] flex flex-col items-center justify-center text-center">
                    <TrendingUp className="w-12 h-12 text-gray-200 mb-4" />
                    <h3 className="text-gray-900 font-semibold text-lg">{t('resolution_efficiency_trend')}</h3>
                    <p className="text-gray-400 text-sm mt-1">{t('chart_unavailable')}</p>
                </div>
            </div>
        </div>
    );
};

export default ReportsTab;


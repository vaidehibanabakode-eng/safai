import React from 'react';
import { AlertTriangle, BarChart3, Users } from 'lucide-react';
import StatCard from '../../common/StatCard';
import { useLanguage } from '../../../contexts/LanguageContext';

const OverviewTab: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('system_overview')}</h2>
                <p className="text-gray-600">{t('real_time_analytics')}</p>
            </div>

            {/* 3 stat cards — no fake Revenue or System numbers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title={t('total_complaints')}
                    value="—"
                    icon={<AlertTriangle className="w-6 h-6" />}
                    color="blue"
                />
                <StatCard
                    title={t('resolved_complaints')}
                    value="—"
                    icon={<BarChart3 className="w-6 h-6" />}
                    color="green"
                />
                <StatCard
                    title={t('active_workers')}
                    value="—"
                    icon={<Users className="w-6 h-6" />}
                    color="purple"
                />
            </div>

            {/* Performance panels — 2 col only, removed System Health */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('city_wide_performance')}</h3>
                    <div className="space-y-3">
                        {[
                            { label: t('avg_resolution_time'), value: '—', color: 'text-green-600' },
                            { label: t('worker_efficiency'), value: '—', color: 'text-blue-600' },
                            { label: t('citizen_satisfaction'), value: '—', color: 'text-purple-600' },
                        ].map((row) => (
                            <div key={row.label} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-600">{row.label}</span>
                                <span className={`font-semibold ${row.color}`}>{row.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('waste_segregation')}</h3>
                    <div className="space-y-3">
                        {[
                            { label: t('biomethanization'), value: '—', color: 'text-green-600' },
                            { label: t('recycled'), value: '—', color: 'text-blue-600' },
                            { label: t('waste_to_energy'), value: '—', color: 'text-purple-600' },
                        ].map((row) => (
                            <div key={row.label} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-600">{row.label}</span>
                                <span className={`font-semibold ${row.color}`}>{row.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Municipal score banner — value kept honest */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 text-white shadow-xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">{t('municipal_score')}</h3>
                        <p className="text-emerald-100 text-lg">{t('municipal_score_desc')}</p>
                    </div>
                    <div className="text-center md:text-right bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                        <div className="text-5xl font-bold mb-1">—<span className="text-2xl text-emerald-200">/10</span></div>
                        <div className="text-emerald-100 font-medium">{t('overall_rating')}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;

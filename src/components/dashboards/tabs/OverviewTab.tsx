import React, { useEffect, useState } from 'react';
import { AlertTriangle, Users, Shield, Activity, Loader2, CheckCircle, Clock } from 'lucide-react';
import StatCard from '../../common/StatCard';
import { useLanguage } from '../../../contexts/LanguageContext';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

interface SystemStats {
    totalComplaints: number;
    resolvedComplaints: number;
    pendingComplaints: number;
    assignedComplaints: number;
    totalWorkers: number;
    totalAdmins: number;
    totalCitizens: number;
    avgRatingPct: number;
    totalRatings: number;
    loading: boolean;
}

const OverviewTab: React.FC = () => {
    const { t } = useLanguage();
    const [stats, setStats] = useState<SystemStats>({
        totalComplaints: 0,
        resolvedComplaints: 0,
        pendingComplaints: 0,
        assignedComplaints: 0,
        totalWorkers: 0,
        totalAdmins: 0,
        totalCitizens: 0,
        avgRatingPct: 0,
        totalRatings: 0,
        loading: true,
    });
    const [recentActivity, setRecentActivity] = useState<any[]>([]);

    useEffect(() => {
        const complaintsUnsub = onSnapshot(collection(db, 'complaints'), (snap) => {
            const all = snap.docs;
            const resolved = all.filter(d => d.data().status === 'RESOLVED').length;
            const pending = all.filter(d => ['SUBMITTED', 'UNDER_REVIEW'].includes(d.data().status)).length;
            const assigned = all.filter(d => d.data().status === 'ASSIGNED').length;
            const recent = [...all]
                .sort((a, b) => {
                    const ta = a.data().createdAt?.toMillis?.() || 0;
                    const tb = b.data().createdAt?.toMillis?.() || 0;
                    return tb - ta;
                })
                .slice(0, 5)
                .map(d => ({ id: d.id, ...d.data() }));
            setStats(prev => ({ ...prev, totalComplaints: all.length, resolvedComplaints: resolved, pendingComplaints: pending, assignedComplaints: assigned }));
            setRecentActivity(recent);
        });

        const ratingsUnsub = onSnapshot(collection(db, 'ratings'), (snap) => {
            const values = snap.docs
                .map(d => Number(d.data().rating))
                .filter(r => r >= 1 && r <= 5);
            const avg = values.length > 0
                ? values.reduce((a, b) => a + b, 0) / values.length
                : 0;
            setStats(prev => ({
                ...prev,
                avgRatingPct: Math.round((avg / 5) * 100),
                totalRatings: values.length,
            }));
        });

        const workersUnsub = onSnapshot(
            query(collection(db, 'users'), where('role', '==', 'Worker')),
            (snap) => setStats(prev => ({ ...prev, totalWorkers: snap.docs.length }))
        );

        const adminsUnsub = onSnapshot(
            query(collection(db, 'users'), where('role', '==', 'Admin')),
            (snap) => setStats(prev => ({ ...prev, totalAdmins: snap.docs.length }))
        );

        const citizensUnsub = onSnapshot(
            query(collection(db, 'users'), where('role', '==', 'Citizen')),
            (snap) => setStats(prev => ({ ...prev, totalCitizens: snap.docs.length, loading: false }))
        );

        return () => { complaintsUnsub(); workersUnsub(); adminsUnsub(); citizensUnsub(); ratingsUnsub(); };
    }, []);

    const resolutionRate = stats.totalComplaints > 0
        ? Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100)
        : 0;

    // Worker efficiency: % of worker-touched complaints (assigned or resolved) that got resolved
    const workerTouched = stats.resolvedComplaints + stats.assignedComplaints;
    const workerEfficiency = workerTouched > 0
        ? Math.round((stats.resolvedComplaints / workerTouched) * 100)
        : 0;

    // Citizen satisfaction: avg rating converted to percentage (1–5 → 0–100%)
    const citizenSatisfaction = stats.avgRatingPct;

    const getTimeAgo = (ts: any) => {
        if (!ts) return 'Just now';
        try {
            const d = typeof ts.toDate === 'function' ? ts.toDate() : new Date(ts);
            const sec = Math.floor((Date.now() - d.getTime()) / 1000);
            if (sec < 60) return 'Just now';
            const min = Math.floor(sec / 60);
            if (min < 60) return `${min}m ago`;
            const hr = Math.floor(min / 60);
            return hr < 24 ? `${hr}h ago` : d.toLocaleDateString();
        } catch { return 'Recently'; }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-1">{t('system_overview')}</h2>
                    <p className="text-gray-500">{t('real_time_analytics')}</p>
                </div>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold border border-emerald-100 w-fit">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                </span>
            </div>

            {/* Primary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <StatCard
                    title={t('total_complaints')}
                    value={stats.loading ? '...' : stats.totalComplaints.toString()}
                    icon={<AlertTriangle className="w-6 h-6" />}
                    trend={{ value: 'Live', isPositive: true }}
                    color="blue"
                />
                <StatCard
                    title={t('resolved_complaints')}
                    value={stats.loading ? '...' : stats.resolvedComplaints.toString()}
                    icon={<CheckCircle className="w-6 h-6" />}
                    trend={{ value: `${resolutionRate}% rate`, isPositive: true }}
                    color="green"
                />
                <StatCard
                    title={t('active_workers')}
                    value={stats.loading ? '...' : stats.totalWorkers.toString()}
                    icon={<Users className="w-6 h-6" />}
                    trend={{ value: 'On Field', isPositive: true }}
                    color="purple"
                />
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Total Admins', value: stats.totalAdmins, icon: Shield, cls: 'bg-amber-50 text-amber-700 border-amber-100' },
                    { label: 'Pending Complaints', value: stats.pendingComplaints, icon: Clock, cls: 'bg-red-50 text-red-700 border-red-100' },
                    { label: 'Registered Citizens', value: stats.totalCitizens, icon: Users, cls: 'bg-cyan-50 text-cyan-700 border-cyan-100' },
                ].map((c, i) => (
                    <div key={i} className={`rounded-2xl p-5 border flex items-center gap-4 ${c.cls}`}>
                        <div className="p-2 rounded-xl bg-white/60 flex-shrink-0">
                            <c.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{stats.loading ? '...' : c.value}</div>
                            <div className="text-sm font-medium opacity-80">{c.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Recent Complaints</h3>
                        <Activity className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="divide-y divide-gray-50 min-h-[200px]">
                        {stats.loading ? (
                            <div className="flex justify-center items-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                            </div>
                        ) : recentActivity.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                <CheckCircle className="w-10 h-10 mb-2 opacity-30" />
                                <p className="text-sm">No complaints yet</p>
                            </div>
                        ) : recentActivity.map((item, i) => (
                            <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.status === 'RESOLVED' ? 'bg-green-500' : item.status === 'ASSIGNED' ? 'bg-blue-500' : 'bg-orange-500'}`} />
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{item.title || item.category || 'Complaint'}</p>
                                        <p className="text-xs text-gray-400">{getTimeAgo(item.createdAt)}</p>
                                    </div>
                                </div>
                                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0 ml-2 ${item.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : item.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {item.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Performance + Score */}
                <div className="space-y-4">
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="font-semibold text-gray-900 mb-4">{t('city_wide_performance')}</h3>
                        <div className="space-y-4">
                            {[
                                { label: t('resolution_rate') || 'Resolution Rate', val: resolutionRate, color: 'bg-green-500', textColor: 'text-green-600', sub: '' },
                                { label: t('worker_efficiency') || 'Worker Efficiency', val: workerEfficiency, color: 'bg-blue-500', textColor: 'text-blue-600', sub: workerTouched > 0 ? `${stats.resolvedComplaints}/${workerTouched} resolved` : 'No data yet' },
                                { label: t('citizen_satisfaction') || 'Citizen Satisfaction', val: citizenSatisfaction, color: 'bg-purple-500', textColor: 'text-purple-600', sub: stats.totalRatings > 0 ? `${stats.totalRatings} ratings` : 'No ratings yet' },
                            ].map((r) => (
                                <div key={r.label}>
                                    <div className="flex justify-between text-sm mb-1.5">
                                        <div>
                                            <span className="text-gray-600">{r.label}</span>
                                            {r.sub && <span className="ml-2 text-xs text-gray-400">({r.sub})</span>}
                                        </div>
                                        <span className={`font-semibold ${r.textColor}`}>{stats.loading ? '...' : `${r.val}%`}</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${r.color}`} style={{ width: `${r.val}%`, transition: 'width 1s ease' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-lg mb-1">{t('municipal_score')}</h3>
                                <p className="text-emerald-100 text-sm">{t('overall_rating')}</p>
                            </div>
                            <div className="text-center bg-white/10 px-5 py-3 rounded-xl">
                                <div className="text-4xl font-black">
                                    {stats.loading ? '...' : resolutionRate > 0 ? (resolutionRate / 10).toFixed(1) : '—'}
                                    <span className="text-lg text-emerald-200">/10</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;

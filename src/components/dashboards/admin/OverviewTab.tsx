import React, { useState, useEffect } from 'react';
import {
    Users,
    AlertTriangle,
    Activity,
    Loader2,
    CheckCircle,
    Clock
} from 'lucide-react';
import StatCard from '../../common/StatCard';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

interface OverviewTabProps {
    onNavigate: (tab: string) => void;
}

interface PriorityAction {
    id: string;
    title: string;
    category: string;
    status: string;
    createdAt: any;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ onNavigate }) => {
    const [stats, setStats] = useState({
        totalComplaints: 0,
        pendingComplaints: 0,
        activeWorkers: 0,
        loading: true
    });
    const [priorityActions, setPriorityActions] = useState<PriorityAction[]>([]);

    useEffect(() => {
        // 1. Listen to Complaints Stats
        const complaintsQuery = query(collection(db, 'complaints'));
        const unsubscribeComplaints = onSnapshot(complaintsQuery, (snapshot) => {
            const all = snapshot.docs;
            const pending = all.filter(d => ['SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED'].includes(d.data().status)).length;

            setStats(prev => ({
                ...prev,
                totalComplaints: all.length,
                pendingComplaints: pending
            }));

            // Also get priority actions (SUBMITTED)
            const actions: PriorityAction[] = all
                .filter(d => d.data().status === 'SUBMITTED')
                .map(d => ({
                    id: d.id,
                    title: d.data().title || d.data().category,
                    category: d.data().category,
                    status: d.data().status,
                    createdAt: d.data().createdAt
                }))
                .slice(0, 5); // Just top 5
            setPriorityActions(actions);
        });

        // 2. Listen to Workers count
        const workersQuery = query(collection(db, 'users'), where('role', '==', 'Worker'));
        const unsubscribeWorkers = onSnapshot(workersQuery, (snapshot) => {
            setStats(prev => ({
                ...prev,
                activeWorkers: snapshot.docs.length,
                loading: false
            }));
        });

        return () => {
            unsubscribeComplaints();
            unsubscribeWorkers();
        };
    }, []);

    const getTimeAgo = (timestamp: any) => {
        if (!timestamp) return 'Just now';
        try {
            const date = typeof timestamp.toDate === 'function' ? timestamp.toDate() : new Date(timestamp);
            if (isNaN(date.getTime())) return 'Just now';
            const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
            if (seconds < 60) return 'Just now';
            const minutes = Math.floor(seconds / 60);
            if (minutes < 60) return `${minutes}m ago`;
            const hours = Math.floor(minutes / 60);
            if (hours < 24) return `${hours}h ago`;
            return date.toLocaleDateString();
        } catch (e) {
            console.error("Error formatting date:", e);
            return 'Just now';
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
                    <p className="text-gray-600">Real-time overview of system performance and key metrics</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-1 shadow-sm">
                        <Activity className="w-4 h-4" /> System Live
                    </span>
                </div>
            </div>

            {/* Key Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Complaints"
                    value={stats.loading ? "..." : stats.totalComplaints.toString()}
                    icon={<AlertTriangle className="w-6 h-6" />}
                    trend={{ value: "Live", isPositive: true }}
                    color="blue"
                />
                <StatCard
                    title="Pending Review"
                    value={stats.loading ? "..." : stats.pendingComplaints.toString()}
                    icon={<Clock className="w-6 h-6" />}
                    trend={{ value: "Action Required", isPositive: false }}
                    color="orange"
                />
                <StatCard
                    title="Active Workers"
                    value={stats.loading ? "..." : stats.activeWorkers.toString()}
                    icon={<Users className="w-6 h-6" />}
                    trend={{ value: "On Field", isPositive: true }}
                    color="green"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Priority Actions */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">Priority Actions</h3>
                        <button
                            onClick={() => onNavigate('complaints')}
                            className="text-sm text-emerald-600 hover:text-emerald-800 font-medium"
                        >
                            Manage All
                        </button>
                    </div>

                    <div className="divide-y divide-gray-100 min-h-[200px]">
                        {stats.loading ? (
                            <div className="flex justify-center items-center p-12"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
                        ) : priorityActions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 text-gray-500">
                                <CheckCircle className="w-12 h-12 mb-3 text-green-100" />
                                <p>No immediate actions required. System is up to date.</p>
                            </div>
                        ) : (
                            priorityActions.map((item) => (
                                <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                        <div>
                                            <p className="font-medium text-gray-900 line-clamp-1">{item.title}</p>
                                            <p className="text-sm text-gray-500">{getTimeAgo(item.createdAt)} • {item.category}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onNavigate('complaints')}
                                        className="px-4 py-2 text-sm border border-emerald-100 bg-emerald-50 rounded-lg hover:bg-emerald-100 text-emerald-700 transition-colors font-medium"
                                    >
                                        Review
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* System Stats / Placeholders */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">City Vitals</h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Waste Resolution</span>
                                <span className="font-medium text-gray-900">Calculating...</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 animate-pulse w-1/3"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">App Adoption</span>
                                <span className="font-medium text-gray-900">Growing</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-1/2"></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center justify-center text-center">
                        <div className="p-4 bg-emerald-50 rounded-full mb-3">
                            <Activity className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 mb-1">Live Intelligence Active</h4>
                        <p className="text-xs text-gray-500">Sensors and citizen reports are syncing with the central command.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;


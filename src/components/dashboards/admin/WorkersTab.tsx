import React, { useState, useEffect } from 'react';
import { Users, UserCheck, CheckCircle, Loader2, MapPin } from 'lucide-react';
import StatCard from '../../common/StatCard';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

interface WorkerData {
    id: string;
    name: string;
    email: string;
    assignedZone?: string;
    status?: string;
    phone?: string;
}

const WorkersTab: React.FC = () => {
    const [workers, setWorkers] = useState<WorkerData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'users'), where('role', '==', 'Worker'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedWorkers: WorkerData[] = [];
            snapshot.forEach((docSnap) => {
                fetchedWorkers.push({ id: docSnap.id, ...docSnap.data() } as WorkerData);
            });
            setWorkers(fetchedWorkers);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Worker Management</h2>
                <p className="text-gray-600">Monitor and manage the field workforce</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Workers"
                    value={loading ? "..." : workers.length.toString()}
                    icon={<Users className="w-6 h-6" />}
                    trend={{ value: "Live", isPositive: true }}
                    color="blue"
                />
                <StatCard
                    title="Active Now"
                    value={loading ? "..." : workers.length.toString()} // Fallback to total if active field missing
                    icon={<UserCheck className="w-6 h-6" />}
                    trend={{ value: "Synced", isPositive: true }}
                    color="green"
                />
                <StatCard
                    title="Resource Zones"
                    value="4"
                    icon={<MapPin className="w-6 h-6" />}
                    color="purple"
                />
                <StatCard
                    title="Performance"
                    value="Live"
                    icon={<CheckCircle className="w-6 h-6" />}
                    color="yellow"
                />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Worker Roster</h3>
                    <div className="text-sm text-gray-500">{workers.length} registered workers</div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    </div>
                ) : workers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-gray-500">
                        <Users className="w-12 h-12 mb-3 text-gray-200" />
                        <p>No workers have been registered yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Worker Details</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Zone</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {workers.map((worker) => (
                                    <tr key={worker.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold mr-3 border border-blue-100">
                                                    {worker.name?.charAt(0) || 'W'}
                                                </div>
                                                <div className="text-sm font-medium text-gray-900">{worker.name || 'Unnamed Worker'}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {worker.assignedZone || 'Unassigned'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div>{worker.email}</div>
                                            <div className="text-xs text-gray-400">{worker.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-green-100 text-green-700 tracking-wider">
                                                Registered
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => alert(`Reviewing worker ${worker.name}...`)}
                                                className="text-emerald-600 hover:text-emerald-900 transition-colors font-bold"
                                            >
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkersTab;


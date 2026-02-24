import React, { useState, useEffect } from 'react';
import {
  Users, UserCheck, CheckCircle, Loader2, MapPin,
  X, Mail, Phone, Award, ClipboardList, TrendingUp,
} from 'lucide-react';
import StatCard from '../../common/StatCard';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

interface WorkerData {
  id: string;
  name: string;
  email: string;
  assignedZone?: string;
  status?: string;
  phone?: string;
  workerType?: string;
  designation?: string;
  createdAt?: any;
}

interface WorkerStats {
  totalAssigned: number;
  completed: number;
  inProgress: number;
}

const WorkersTab: React.FC = () => {
  const [workers, setWorkers] = useState<WorkerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState<WorkerData | null>(null);
  const [workerStats, setWorkerStats] = useState<WorkerStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'Worker'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: WorkerData[] = [];
      snapshot.forEach((docSnap) => {
        fetched.push({ id: docSnap.id, ...docSnap.data() } as WorkerData);
      });
      setWorkers(fetched);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const openDetails = async (worker: WorkerData) => {
    setSelectedWorker(worker);
    setWorkerStats(null);
    setLoadingStats(true);
    try {
      const q = query(collection(db, 'assignments'), where('workerId', '==', worker.id));
      const snap = await getDocs(q);
      const all = snap.docs.map(d => d.data());
      setWorkerStats({
        totalAssigned: all.length,
        completed: all.filter(a => a.workerStatus === 'COMPLETED').length,
        inProgress: all.filter(a => a.workerStatus === 'IN_PROGRESS').length,
      });
    } catch {
      setWorkerStats({ totalAssigned: 0, completed: 0, inProgress: 0 });
    } finally {
      setLoadingStats(false);
    }
  };

  const uniqueZones = new Set(workers.map(w => w.assignedZone).filter(Boolean)).size;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Worker Management</h2>
        <p className="text-gray-600">Monitor and manage the field workforce</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Workers"
          value={loading ? '...' : workers.length.toString()}
          icon={<Users className="w-6 h-6" />}
          trend={{ value: 'Live', isPositive: true }}
          color="blue"
        />
        <StatCard
          title="Registered"
          value={loading ? '...' : workers.length.toString()}
          icon={<UserCheck className="w-6 h-6" />}
          trend={{ value: 'Synced', isPositive: true }}
          color="green"
        />
        <StatCard
          title="Zones Covered"
          value={loading ? '...' : (uniqueZones > 0 ? uniqueZones.toString() : '—')}
          icon={<MapPin className="w-6 h-6" />}
          color="purple"
        />
        <StatCard
          title="Status"
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Worker</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workers.map((worker) => (
                  <tr key={worker.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold border border-emerald-100 flex-shrink-0">
                          {worker.name?.charAt(0).toUpperCase() || 'W'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{worker.name || 'Unnamed Worker'}</p>
                          <p className="text-xs text-gray-400 font-mono">{worker.id.substring(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {worker.assignedZone || <span className="text-gray-400">Unassigned</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {worker.workerType || <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{worker.email}</div>
                      {worker.phone && <div className="text-xs text-gray-400">{worker.phone}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-green-100 text-green-700 tracking-wider">
                        Registered
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => openDetails(worker)}
                        className="text-emerald-600 hover:text-emerald-900 text-sm font-semibold transition-colors hover:underline"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Worker Details Modal ─────────────────────────────────────────────── */}
      {selectedWorker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedWorker(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-t-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-2xl border-2 border-white/40">
                    {selectedWorker.name?.charAt(0).toUpperCase() || 'W'}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedWorker.name || 'Unnamed Worker'}</h3>
                    <p className="text-emerald-100 text-sm">{selectedWorker.workerType || 'Field Worker'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedWorker(null)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Task Statistics */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Task Statistics
                </h4>
                {loadingStats ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                  </div>
                ) : workerStats ? (
                  <>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
                        <p className="text-2xl font-black text-blue-700">{workerStats.totalAssigned}</p>
                        <p className="text-xs text-blue-600 font-medium mt-0.5">Total Tasks</p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
                        <p className="text-2xl font-black text-green-700">{workerStats.completed}</p>
                        <p className="text-xs text-green-600 font-medium mt-0.5">Completed</p>
                      </div>
                      <div className="bg-yellow-50 rounded-xl p-3 text-center border border-yellow-100">
                        <p className="text-2xl font-black text-yellow-700">{workerStats.inProgress}</p>
                        <p className="text-xs text-yellow-600 font-medium mt-0.5">In Progress</p>
                      </div>
                    </div>
                    {workerStats.totalAssigned > 0 && (
                      <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Completion Rate</span>
                          <span className="font-medium text-gray-700">
                            {Math.round((workerStats.completed / workerStats.totalAssigned) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full transition-all duration-700"
                            style={{ width: `${Math.round((workerStats.completed / workerStats.totalAssigned) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </>
                ) : null}
              </div>

              {/* Profile Info */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Profile Information</h4>
                <div className="space-y-2">
                  {[
                    { icon: <Mail className="w-4 h-4" />, label: 'Email', value: selectedWorker.email },
                    { icon: <Phone className="w-4 h-4" />, label: 'Phone', value: selectedWorker.phone || 'Not provided' },
                    { icon: <MapPin className="w-4 h-4" />, label: 'Assigned Zone', value: selectedWorker.assignedZone || 'Not assigned' },
                    { icon: <Award className="w-4 h-4" />, label: 'Designation', value: selectedWorker.designation || 'Field Worker' },
                    { icon: <ClipboardList className="w-4 h-4" />, label: 'Worker Type', value: selectedWorker.workerType || 'Collector' },
                  ].map(row => (
                    <div key={row.label} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg">
                      <div className="text-gray-400 flex-shrink-0">{row.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 font-medium">{row.label}</p>
                        <p className="text-sm font-medium text-gray-900 truncate">{row.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Worker ID */}
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <p className="text-xs text-gray-400 font-medium mb-0.5">Worker UID</p>
                <p className="text-sm font-mono text-gray-600 break-all">{selectedWorker.id}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6">
              <button
                onClick={() => setSelectedWorker(null)}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkersTab;

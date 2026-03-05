import React, { useState, useMemo, useEffect } from 'react';
import {
  Users, Zap, Globe, Shield, UserPlus, Search, Filter,
  MoreVertical, X, Edit, Trash2, Ban, CheckCircle, Lock,
  Eye, EyeOff, Loader2, Info,
} from 'lucide-react';
import StatCard from '../../common/StatCard';
import { useLanguage } from '../../../contexts/LanguageContext';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

interface Admin {
  id: string;
  name: string;
  email: string;
  area: string;
  status: 'Active' | 'Inactive';
  performance: string;
  role: string;
}

const AdminManagementTab: React.FC = () => {
  const { t } = useLanguage();
  const [showAddModal, setShowAddModal]           = useState(false);
  const [searchTerm, setSearchTerm]               = useState('');
  const [filterStatus, setFilterStatus]           = useState<string>('All');
  const [showFilterMenu, setShowFilterMenu]       = useState(false);
  const [activeActionMenu, setActiveActionMenu]   = useState<string | null>(null);
  const [currentPage, setCurrentPage]             = useState(1);
  const [loading, setLoading]                     = useState(true);
  const [saving, setSaving]                       = useState(false);
  const [toast, setToast]                         = useState<{ msg: string; ok: boolean } | null>(null);
  const [confirmDelete, setConfirmDelete]         = useState<Admin | null>(null);
  const itemsPerPage = 5;

  // Form State
  const [isEditing, setIsEditing]     = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    area: 'Zone A',
    role: 'Zone Admin',
    password: '',
    status: 'Active' as 'Active' | 'Inactive',
  });

  const [admins, setAdmins] = useState<Admin[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'Admin'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: Admin[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        fetched.push({
          id: docSnap.id,
          name: data.name || 'Unnamed Admin',
          email: data.email || '',
          area: data.assignedZone || 'Zone A',
          status: data.status || 'Active',
          performance: data.performance || '90%',
          role: data.adminLevel || 'Zone Admin',
        });
      });
      setAdmins(fetched);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Filter & Pagination ────────────────────────────────────────────────────
  const filteredAdmins = useMemo(() => {
    return admins.filter(admin => {
      const matchesSearch =
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'All' || admin.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [admins, searchTerm, filterStatus]);

  const totalPages  = Math.ceil(filteredAdmins.length / itemsPerPage);
  const currentData = filteredAdmins.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleEdit = (admin: Admin) => {
    setFormData({ name: admin.name, email: admin.email, area: admin.area, role: admin.role, password: '', status: admin.status });
    setIsEditing(admin.id);
    setShowAddModal(true);
    setActiveActionMenu(null);
  };

  const handleAddNew = () => {
    setFormData({ name: '', email: '', area: 'Zone A', role: 'Zone Admin', password: '', status: 'Active' });
    setIsEditing(null);
    setShowAddModal(true);
  };

  const handleToggleStatus = async (admin: Admin) => {
    setActiveActionMenu(null);
    const newStatus: 'Active' | 'Inactive' = admin.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await updateDoc(doc(db, 'users', admin.id), { status: newStatus, updatedAt: serverTimestamp() });
      showToast(`${admin.name} marked as ${newStatus}.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update status.', false);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!confirmDelete) return;
    setSaving(true);
    try {
      await deleteDoc(doc(db, 'users', confirmDelete.id));
      showToast(`${confirmDelete.name}'s profile removed from system.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete.', false);
    } finally {
      setSaving(false);
      setConfirmDelete(null);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      showToast(t('alert_fill_required'), false);
      return;
    }
    if (isEditing) {
      // ── Update existing admin in Firestore ─────────────────────────────────
      setSaving(true);
      try {
        await updateDoc(doc(db, 'users', isEditing), {
          name: formData.name,
          assignedZone: formData.area,
          adminLevel: formData.role,
          status: formData.status,
          updatedAt: serverTimestamp(),
        });
        showToast('Administrator profile updated successfully!');
        setShowAddModal(false);
      } catch (err: any) {
        showToast(err.message || 'Update failed.', false);
      } finally {
        setSaving(false);
      }
    } else {
      // ── New admin: cannot create Firebase Auth from client ─────────────────
      // Show the instructions panel instead of creating an account
      setShowAddModal(false);
      setShowAddModal(true);   // keep the modal open in "instructions" state
      setIsEditing('__new_instructions__');
    }
  };

  return (
    <div
      className="space-y-8 animate-in fade-in duration-500 min-h-[600px]"
      onClick={() => { setActiveActionMenu(null); setShowFilterMenu(false); }}
    >
      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[200] flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-medium transition-all duration-300 ${toast.ok ? 'bg-emerald-600' : 'bg-red-500'}`}>
          {toast.ok ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <X className="w-4 h-4 flex-shrink-0" />}
          {toast.msg}
        </div>
      )}

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('admin_management_title')}</h2>
          <p className="text-gray-600">{t('admin_management_subtitle')}</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); handleAddNew(); }}
          className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          <UserPlus className="w-5 h-5" />
          {t('add_new_admin')}
        </button>
      </div>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title={t('total_admins')} value={loading ? '...' : admins.length.toString()} icon={<Users className="w-6 h-6" />} trend={{ value: 'Live', isPositive: true }} color="blue" />
        <StatCard title={t('active_today')} value={loading ? '...' : admins.filter(a => a.status === 'Active').length.toString()} icon={<Zap className="w-6 h-6" />} trend={{ value: 'Synced', isPositive: true }} color="green" />
        <StatCard title={t('areas_covered')} value={loading ? '...' : new Set(admins.map(a => a.area).filter(Boolean)).size.toString() || '—'} icon={<Globe className="w-6 h-6" />} color="purple" />
        <StatCard
          title={t('avg_performance')}
          value={loading ? '...' : admins.length === 0 ? '—' : (() => {
            const vals = admins.map(a => parseInt(a.performance) || 0).filter(v => v > 0);
            return vals.length > 0 ? Math.round(vals.reduce((s, v) => s + v, 0) / vals.length) + '%' : '—';
          })()}
          icon={<Shield className="w-6 h-6" />}
          color="yellow"
        />
      </div>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-visible">
        <div className="p-6 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-900">{t('active_administrators')}</h3>
          <div className="flex w-full sm:w-auto gap-4">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('search_admins_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowFilterMenu(!showFilterMenu); }}
                className={`p-2 border rounded-lg hover:bg-gray-100 text-gray-600 ${filterStatus !== 'All' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'border-gray-200'}`}
              >
                <Filter className="w-5 h-5" />
              </button>
              {showFilterMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-1">
                  {(['All', 'Active', 'Inactive'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => { setFilterStatus(s); setShowFilterMenu(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${filterStatus === s ? 'text-emerald-600 font-medium' : 'text-gray-700'}`}
                    >
                      {s === 'All' ? t('status_all') : s === 'Active' ? t('status_active') : t('status_inactive')}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            </div>
          ) : (
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('header_name')}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('header_email')}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('header_area')}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('header_status')}</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('header_performance')}</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('header_actions')}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentData.length > 0 ? currentData.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold mr-3 border ${admin.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                          {admin.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{admin.name}</div>
                          <div className="text-xs text-gray-400">{admin.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.area}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${admin.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {admin.status === 'Active' ? t('status_active') : t('status_inactive')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900 font-medium">{admin.performance}</span>
                        <div className="w-20 bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${parseInt(admin.performance) > 90 ? 'bg-green-500' : 'bg-yellow-500'}`}
                            style={{ width: admin.performance }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setActiveActionMenu(activeActionMenu === admin.id ? null : admin.id); }}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {activeActionMenu === admin.id && (
                        <div className="absolute right-8 top-8 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-[100] overflow-hidden">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleEdit(admin); }}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4 text-blue-500" /> {t('action_edit')}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleToggleStatus(admin); }}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            {admin.status === 'Active'
                              ? <><Ban className="w-4 h-4 text-orange-500" /> {t('action_deactivate')}</>
                              : <><CheckCircle className="w-4 h-4 text-green-500" /> {t('action_activate')}</>
                            }
                          </button>
                          <div className="h-px bg-gray-100 my-1" />
                          <button
                            onClick={(e) => { e.stopPropagation(); setConfirmDelete(admin); setActiveActionMenu(null); }}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" /> {t('action_delete')}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">{t('no_admins_found')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center text-sm text-gray-500">
          <span>
            {t('showing_entries')
              .replace('{{start}}', Math.min(filteredAdmins.length, (currentPage - 1) * itemsPerPage + 1).toString())
              .replace('{{end}}', Math.min(filteredAdmins.length, currentPage * itemsPerPage).toString())
              .replace('{{total}}', filteredAdmins.length.toString())}
          </span>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">{t('btn_previous')}</button>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">{t('btn_next')}</button>
          </div>
        </div>
      </div>

      {/* ── Edit / Add Modal ───────────────────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">{isEditing && isEditing !== '__new_instructions__' ? t('modal_edit_title') : t('modal_add_title')}</h3>
              <button onClick={() => { setShowAddModal(false); setIsEditing(null); }} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ── New admin: show instructions ──────────────────────────── */}
            {(!isEditing || isEditing === '__new_instructions__') ? (
              <div className="p-6 space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                  <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">How to onboard a new Admin</p>
                    <ol className="list-decimal list-inside space-y-1 text-blue-700">
                      <li>Have them create an account via the <strong>Sign Up</strong> page</li>
                      <li>Once registered, find them in the <strong>Users</strong> list in Firebase Console</li>
                      <li>Set their Firestore <code className="bg-blue-100 px-1 rounded">role</code> field to <code className="bg-blue-100 px-1 rounded">Admin</code></li>
                      <li>They will appear here automatically and can be assigned a zone</li>
                    </ol>
                  </div>
                </div>
                <p className="text-xs text-gray-400 text-center">Direct account creation requires server-side Firebase Admin SDK for security reasons.</p>
                <div className="flex justify-end">
                  <button onClick={() => { setShowAddModal(false); setIsEditing(null); }} className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors">
                    Got it
                  </button>
                </div>
              </div>
            ) : (
              /* ── Edit existing admin ──────────────────────────────────── */
              <>
                <div className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">{t('label_full_name')}</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      placeholder={t('placeholder_name')}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">{t('label_email')}</label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400">Email cannot be changed here — update via Firebase Console.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">{t('label_new_password')}</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        disabled
                        className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                        placeholder="Managed via Firebase Console"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">{t('label_assigned_zone')}</label>
                      <select
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white transition-all"
                      >
                        {['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E', 'Zone F'].map(z => <option key={z}>{z}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">{t('label_role_level')}</label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white transition-all"
                      >
                        <option>Senior Admin</option>
                        <option>Zone Admin</option>
                        <option>Viewer</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Account Status</label>
                    <div className="flex gap-3">
                      {(['Active', 'Inactive'] as const).map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setFormData({ ...formData, status: s })}
                          className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${formData.status === s
                            ? s === 'Active' ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-300 bg-red-50 text-red-700'
                            : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
                  <button onClick={() => { setShowAddModal(false); setIsEditing(null); }} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">
                    {t('btn_cancel')}
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center gap-2"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {t('btn_save_changes')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ─────────────────────────────────────── */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Remove Administrator</h3>
            <p className="text-gray-500 text-sm mb-1">
              This will remove <strong className="text-gray-800">{confirmDelete.name}</strong>'s Firestore profile from the system.
            </p>
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-5">
              Note: Their Firebase Auth account remains active. Disable it in Firebase Console to prevent login.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors">
                {t('cancel')}
              </button>
              <button
                onClick={handleDeleteConfirmed}
                disabled={saving}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagementTab;

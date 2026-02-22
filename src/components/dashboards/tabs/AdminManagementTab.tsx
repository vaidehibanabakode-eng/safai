import React, { useState, useMemo } from 'react';
import { Users, Zap, Globe, Shield, UserPlus, Search, Filter, MoreVertical, X, Edit, Trash2, Ban, CheckCircle, Lock, Eye, EyeOff } from 'lucide-react';
import StatCard from '../../common/StatCard';
import { useLanguage } from '../../../contexts/LanguageContext';

interface Admin {
    id: number;
    name: string;
    email: string;
    area: string;
    status: 'Active' | 'Inactive';
    performance: string;
    role: string;
}

const AdminManagementTab: React.FC = () => {
    const { t } = useLanguage();
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('All');
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [activeActionMenu, setActiveActionMenu] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Form State
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        area: 'Zone A',
        role: 'Zone Admin',
        password: '',
        status: 'Active' as 'Active' | 'Inactive'
    });

    const [admins, setAdmins] = useState<Admin[]>([
        { id: 1, name: 'John Smith', email: 'john@admin.com', area: 'Zone A', status: 'Active', performance: '96%', role: 'Senior Admin' },
        { id: 2, name: 'Sarah Johnson', email: 'sarah@admin.com', area: 'Zone B', status: 'Active', performance: '94%', role: 'Zone Admin' },
        { id: 3, name: 'Mike Wilson', email: 'mike@admin.com', area: 'Zone C', status: 'Inactive', performance: '89%', role: 'Viewer' },
        { id: 4, name: 'Emily Davis', email: 'emily@admin.com', area: 'Zone D', status: 'Active', performance: '98%', role: 'Zone Admin' },
        { id: 5, name: 'Robert Brown', email: 'robert@admin.com', area: 'Zone A', status: 'Active', performance: '92%', role: 'Zone Admin' },
        { id: 6, name: 'Jessica White', email: 'jessica@admin.com', area: 'Zone B', status: 'Inactive', performance: '85%', role: 'Viewer' },
    ]);

    // Filter and Search Logic
    const filteredAdmins = useMemo(() => {
        return admins.filter(admin => {
            const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                admin.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterStatus === 'All' || admin.status === filterStatus;
            return matchesSearch && matchesFilter;
        });
    }, [admins, searchTerm, filterStatus]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
    const currentData = filteredAdmins.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    // Actions
    const handleDelete = (id: number) => {
        if (window.confirm(t('confirm_delete_admin'))) {
            setAdmins(prev => prev.filter(admin => admin.id !== id));
        }
        setActiveActionMenu(null);
    };

    const handleToggleStatus = (id: number) => {
        setAdmins(prev => prev.map(admin => {
            if (admin.id === id) {
                return { ...admin, status: admin.status === 'Active' ? 'Inactive' : 'Active' };
            }
            return admin;
        }));
        setActiveActionMenu(null);
    };

    const handleEdit = (admin: Admin) => {
        setFormData({
            name: admin.name,
            email: admin.email,
            area: admin.area,
            role: admin.role,
            password: '', // Don't show existing password
            status: admin.status
        });
        setIsEditing(admin.id);
        setShowAddModal(true);
        setActiveActionMenu(null);
    };

    const handleAddNew = () => {
        setFormData({
            name: '',
            email: '',
            area: 'Zone A',
            role: 'Zone Admin',
            password: '',
            status: 'Active'
        });
        setIsEditing(null);
        setShowAddModal(true);
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.email) {
            alert(t('alert_fill_required'));
            return;
        }

        if (isEditing) {
            setAdmins(prev => prev.map(admin =>
                admin.id === isEditing
                    ? { ...admin, ...formData, performance: admin.performance } // Keep existing performance
                    : admin
            ));
        } else {
            const newAdmin: Admin = {
                id: Math.max(...admins.map(a => a.id)) + 1,
                ...formData,
                performance: '0%' // Default start
            };
            setAdmins(prev => [...prev, newAdmin]);
        }
        setShowAddModal(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 min-h-[600px]" onClick={() => {
            setActiveActionMenu(null);
            setShowFilterMenu(false);
        }}>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title={t('total_admins')} value={admins.length.toString()} icon={<Users className="w-6 h-6" />} trend={{ value: "2", isPositive: true }} color="blue" />
                <StatCard title={t('active_today')} value={admins.filter(a => a.status === 'Active').length.toString()} icon={<Zap className="w-6 h-6" />} trend={{ value: "1", isPositive: true }} color="green" />
                <StatCard title={t('areas_covered')} value="8" icon={<Globe className="w-6 h-6" />} color="purple" />
                <StatCard title={t('avg_performance')} value="94%" icon={<Shield className="w-6 h-6" />} trend={{ value: "3%", isPositive: true }} color="yellow" />
            </div>

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
                                    {[t('status_all'), t('status_active'), t('status_inactive')].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => setFilterStatus(status === t('status_all') ? 'All' : status === t('status_active') ? 'Active' : 'Inactive')}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${filterStatus === (status === t('status_all') ? 'All' : status === t('status_active') ? 'Active' : 'Inactive') ? 'text-emerald-600 font-medium' : 'text-gray-700'}`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto min-h-[300px]">
                    <div className="overflow-x-auto">
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
                                {currentData.length > 0 ? (
                                    currentData.map((admin) => (
                                        <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold mr-3">
                                                        {admin.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                                                        <div className="text-xs text-gray-500">{admin.role}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.area}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${admin.status === 'Active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {admin.status === 'Active' ? t('status_active') : t('status_inactive')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className="text-sm text-gray-900 font-medium mr-2">{admin.performance}</span>
                                                    <div className="w-24 bg-gray-200 rounded-full h-1.5">
                                                        <div
                                                            className={`h-1.5 rounded-full ${parseInt(admin.performance) > 90 ? 'bg-green-500' : 'bg-yellow-500'}`}
                                                            style={{ width: admin.performance }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveActionMenu(activeActionMenu === admin.id ? null : admin.id);
                                                    }}
                                                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                                                >
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>
                                                {/* Dropdown Menu */}
                                                {activeActionMenu === admin.id && (
                                                    <div className="absolute right-8 top-8 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleEdit(admin); }}
                                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                        >
                                                            <Edit className="w-4 h-4" /> {t('action_edit')}
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleToggleStatus(admin.id); }}
                                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                        >
                                                            {admin.status === 'Active' ? (
                                                                <>
                                                                    <Ban className="w-4 h-4 text-orange-500" /> {t('action_deactivate')}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <CheckCircle className="w-4 h-4 text-green-500" /> {t('action_activate')}
                                                                </>
                                                            )}
                                                        </button>
                                                        <div className="h-px bg-gray-100 my-1"></div>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(admin.id); }}
                                                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                        >
                                                            <Trash2 className="w-4 h-4" /> {t('action_delete')}
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            {t('no_admins_found')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center text-sm text-gray-500">
                    <span>
                        {t('showing_entries')
                            .replace('{{start}}', Math.min(filteredAdmins.length, (currentPage - 1) * itemsPerPage + 1).toString())
                            .replace('{{end}}', Math.min(filteredAdmins.length, currentPage * itemsPerPage).toString())
                            .replace('{{total}}', filteredAdmins.length.toString())}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {t('btn_previous')}
                        </button>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {t('btn_next')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Add/Edit Admin Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">{isEditing ? t('modal_edit_title') : t('modal_add_title')}</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">{t('label_full_name')}</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                    placeholder={t('placeholder_name')}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">{t('label_email')}</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                    placeholder={t('placeholder_email')}
                                />
                            </div>

                            {/* Password Field with Toggle */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    {isEditing ? t('label_new_password') : t('label_password')}
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Lock className="w-4 h-4" />
                                    </span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                        placeholder={isEditing ? "••••••••" : t('placeholder_password')}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">{t('label_assigned_zone')}</label>
                                    <select
                                        value={formData.area}
                                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white"
                                    >
                                        <option>Zone A</option>
                                        <option>Zone B</option>
                                        <option>Zone C</option>
                                        <option>Zone D</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">{t('label_role_level')}</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white"
                                    >
                                        <option>Senior Admin</option>
                                        <option>Zone Admin</option>
                                        <option>Viewer</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                {t('btn_cancel')}
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
                            >
                                {isEditing ? t('btn_save_changes') : t('btn_create_account')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminManagementTab;

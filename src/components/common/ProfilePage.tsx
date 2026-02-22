import React, { useState } from 'react';
import {
    User as UserIcon,
    Mail,
    Phone,
    MapPin,
    Shield,
    Edit3,
    Save,
    X,
    Calendar,
    Lock,
    Bell,
    Globe,
    Camera,
} from 'lucide-react';
import { User } from '../../App';
import { useLanguage } from '../../contexts/LanguageContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface ProfilePageProps {
    user: User;
}

const ROLE_COLORS: Record<string, string> = {
    superadmin: 'bg-purple-100 text-purple-800 border-purple-200',
    admin: 'bg-blue-100 text-blue-800 border-blue-200',
    worker: 'bg-green-100 text-green-800 border-green-200',
    citizen: 'bg-orange-100 text-orange-800 border-orange-200',
};

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
    const { t, language, setLanguage } = useLanguage();
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        name: user.name,
        email: user.email,
        phone: '',
        zone: '',
        address: '',
    });
    const [saved, setSaved] = useState(false);

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const userRef = doc(db, 'users', user.id);
            await updateDoc(userRef, {
                name: form.name,
                phone: form.phone,
                assignedZone: form.zone,
                address: form.address,
            });
            setIsEditing(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const field = (
        label: string,
        key: keyof typeof form,
        icon: React.ReactNode,
        type = 'text',
        placeholder = ''
    ) => (
        <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                {label}
            </label>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
                <input
                    type={type}
                    disabled={!isEditing}
                    value={form[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={isEditing ? placeholder : '—'}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 text-sm transition-all duration-200
            ${isEditing
                            ? 'border-green-400 bg-white focus:ring-4 focus:ring-green-100 focus:outline-none'
                            : 'border-gray-100 bg-gray-50 text-gray-700 cursor-default'
                        }`}
                />
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header banner */}
            <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30 backdrop-blur-sm">
                            <UserIcon className="w-10 h-10 text-white" />
                        </div>
                        {isEditing && (
                            <button
                                className="absolute bottom-0 right-0 bg-white text-green-600 rounded-full p-1.5 shadow-md hover:bg-green-50 transition-colors"
                                title="Change photo"
                            >
                                <Camera className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Info */}
                    <div className="text-center sm:text-left flex-1">
                        <h2 className="text-2xl font-bold">{user.name}</h2>
                        <p className="text-green-100 text-sm mt-1">{user.email}</p>
                        <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border bg-white/20 text-white border-white/30`}>
                                {t(`role_${user.role}`) || user.role}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30">
                                {t('id_label')}: {user.id.slice(-6).toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-medium transition-colors border border-white/30"
                            >
                                <Edit3 className="w-4 h-4" />
                                {t('edit_profile')}
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-4 py-2 bg-white text-green-700 rounded-xl text-sm font-medium hover:bg-green-50 transition-colors shadow disabled:opacity-70"
                                >
                                    <Save className="w-4 h-4" />
                                    {isSaving ? 'Saving...' : t('save_profile')}
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-medium transition-colors border border-white/30"
                                >
                                    <X className="w-4 h-4" />
                                    {t('cancel_profile')}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {saved && (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2">
                    ✅ {t('profile_updated_success')}
                </div>
            )}

            {/* Main info grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Info */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
                    <div className="flex items-center gap-2 mb-2">
                        <UserIcon className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-semibold text-gray-900">{t('personal_info')}</h3>
                    </div>
                    {field(t('full_name'), 'name', <UserIcon className="w-4 h-4" />, 'text', 'Your full name')}
                    {field(t('email_address'), 'email', <Mail className="w-4 h-4" />, 'email', 'your@email.com')}
                    {field(t('phone_number'), 'phone', <Phone className="w-4 h-4" />, 'tel', '+92 300 000 0000')}
                    {field(t('home_address'), 'address', <MapPin className="w-4 h-4" />, 'text', 'Your home address')}
                </div>

                {/* Work Info */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
                    <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">{t('work_info')}</h3>
                    </div>

                    {/* Role (read-only) */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                            {t('role_label')}
                        </label>
                        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl">
                            <Shield className="w-4 h-4 text-gray-400" />
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${ROLE_COLORS[user.role]}`}>
                                {t(`role_${user.role}`) || user.role}
                            </span>
                            <span className="text-xs text-gray-400 ml-auto">{t('assigned_by_system')}</span>
                        </div>
                    </div>

                    {field(t('assigned_zone'), 'zone', <MapPin className="w-4 h-4" />, 'text', 'e.g. Zone A')}

                    {/* Member since */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                            {t('member_since')}
                        </label>
                        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm text-gray-600">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>—</span>
                        </div>
                    </div>

                    {/* Employee ID */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                            {t('id_label')}
                        </label>
                        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-mono text-gray-700">
                            <Shield className="w-4 h-4 text-gray-400" />
                            {user.id.slice(-8).toUpperCase()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-5">
                    <Globe className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">{t('preferences')}</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Language */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                            {t('language')}
                        </label>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as 'en' | 'hi')}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-green-400 focus:ring-4 focus:ring-green-100 focus:outline-none transition-all"
                        >
                            <option value="en">English</option>
                            <option value="hi">हिंदी (Hindi)</option>
                        </select>
                    </div>

                    {/* Notifications */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                            {t('notifications')}
                        </label>
                        <div className="flex items-center justify-between px-4 py-3 border-2 border-gray-200 rounded-xl">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <Bell className="w-4 h-4 text-gray-400" />
                                {t('push_notifications')}
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-5">
                    <Lock className="w-5 h-5 text-red-500" />
                    <h3 className="text-lg font-semibold text-gray-900">{t('security')}</h3>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex items-center gap-2 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors">
                        <Lock className="w-4 h-4" />
                        {t('change_password')}
                    </button>
                    <button className="flex items-center gap-2 px-5 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-sm font-medium transition-colors">
                        <Shield className="w-4 h-4" />
                        {t('two_factor_auth')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

import React, { useState } from 'react';
import {
    Bell,
    Lock,
    Globe,
    HelpCircle,
    Smartphone,
    Mail,
    Shield,
    ChevronRight,
} from 'lucide-react';
import { User } from '../../../App';
import LanguageSwitcher from '../../common/LanguageSwitcher';
import { useLanguage } from '../../../contexts/LanguageContext';

// import { useTheme } from '../../../contexts/ThemeContext'; // Removed

interface SettingsTabProps {
    user?: User;
}

const SettingsTab: React.FC<SettingsTabProps> = () => {
    const [emailNotif, setEmailNotif] = useState(true);
    const [pushNotif, setPushNotif] = useState(true);
    const [smsNotif, setSmsNotif] = useState(false);
    // const { theme, toggleTheme } = useTheme(); // Removed for forced light mode
    const { t } = useLanguage();

    // const isDark = theme === 'dark'; // Removed

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('settings_title')}</h2>
                <p className="text-gray-600">{t('settings_subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* General Preferences */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-colors duration-300">
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-gray-500" />
                            {t('general_preferences')}
                        </h3>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">{t('app_language')}</p>
                                <p className="text-sm text-gray-500">{t('select_language')}</p>
                            </div>
                            <div className="scale-90 origin-right">
                                <LanguageSwitcher />
                            </div>
                        </div>


                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-colors duration-300">
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-gray-500" />
                            {t('notifications_title')}
                        </h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Mail className="w-4 h-4" /></div>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">{t('email_notif')}</p>
                                    <p className="text-xs text-gray-500">{t('email_notif_desc')}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setEmailNotif(!emailNotif)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${emailNotif ? 'bg-emerald-600' : 'bg-gray-200'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailNotif ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Smartphone className="w-4 h-4" /></div>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">{t('push_notif')}</p>
                                    <p className="text-xs text-gray-500">{t('push_notif_desc')}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setPushNotif(!pushNotif)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${pushNotif ? 'bg-emerald-600' : 'bg-gray-200'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${pushNotif ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><Smartphone className="w-4 h-4" /></div>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">{t('sms_alerts')}</p>
                                    <p className="text-xs text-gray-500">{t('sms_alerts_desc')}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSmsNotif(!smsNotif)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${smsNotif ? 'bg-emerald-600' : 'bg-gray-200'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${smsNotif ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Security & Account */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-colors duration-300">
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-gray-500" />
                            {t('security_privacy')}
                        </h3>
                    </div>
                    <div className="p-6 space-y-2">
                        <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors text-left group">
                            <div className="flex items-center gap-3">
                                <Lock className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                                <span className="font-medium text-gray-700 group-hover:text-gray-900">{t('change_password')}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors text-left group">
                            <div className="flex items-center gap-3">
                                <Shield className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                                <span className="font-medium text-gray-700 group-hover:text-gray-900">{t('two_factor_auth')}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors text-left group">
                            <div className="flex items-center gap-3">
                                <HelpCircle className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                                <span className="font-medium text-gray-700 group-hover:text-gray-900">{t('privacy_policy')}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Support */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-colors duration-300">
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <HelpCircle className="w-5 h-5 text-gray-500" />
                            {t('help_support')}
                        </h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="bg-emerald-50 rounded-xl p-4">
                            <p className="text-sm text-emerald-800 font-medium">{t('need_help')}</p>
                            <p className="text-xs text-emerald-600 mt-1">{t('support_desc')}</p>
                            <button className="mt-3 text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                                {t('contact_support')} →
                            </button>
                        </div>
                        <div className="text-center pt-2">
                            <p className="text-xs text-gray-400">SafaiConnect v2.4.0</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SettingsTab;

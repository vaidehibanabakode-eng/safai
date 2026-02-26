import React, { useState } from 'react';
import {
  BarChart3,
  Users,
  GraduationCap,
  FileText,
  Package,
  Settings,
  UserCircle,
  Map as MapIcon,
} from 'lucide-react';
import { User } from '../../App';
import Layout from '../common/Layout';
import TrainingSystem from '../training/TrainingSystem';
import OverviewTab from './tabs/OverviewTab';
import AdminManagementTab from './tabs/AdminManagementTab';
import ReportsTab from './tabs/ReportsTab';
import InventoryTab from './tabs/InventoryTab';
import SettingsTab from './tabs/SettingsTab';
import ProfilePage from '../common/ProfilePage';
import { useLanguage } from '../../contexts/LanguageContext';
import HeatmapTab from './HeatmapTab';

interface SuperadminDashboardProps {
  user: User;
  onLogout: () => void;
}

const SuperadminDashboard: React.FC<SuperadminDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { t } = useLanguage();

  const sidebarItems = [
    { icon: <BarChart3 className="w-5 h-5" />, label: t('overview'), active: activeTab === 'overview', onClick: () => setActiveTab('overview') },
    { icon: <Users className="w-5 h-5" />, label: t('admin_management'), active: activeTab === 'admins', onClick: () => setActiveTab('admins') },
    { icon: <GraduationCap className="w-5 h-5" />, label: t('training'), active: activeTab === 'training', onClick: () => setActiveTab('training') },
    { icon: <FileText className="w-5 h-5" />, label: t('reports'), active: activeTab === 'reports', onClick: () => setActiveTab('reports') },
    { icon: <MapIcon className="w-5 h-5" />, label: 'Heatmap', active: activeTab === 'heatmap', onClick: () => setActiveTab('heatmap') },
    { icon: <Package className="w-5 h-5" />, label: t('inventory_management'), active: activeTab === 'inventory', onClick: () => setActiveTab('inventory') },
    { icon: <Settings className="w-5 h-5" />, label: t('settings'), active: activeTab === 'settings', onClick: () => setActiveTab('settings') },
    { icon: <UserCircle className="w-5 h-5" />, label: t('profile'), active: activeTab === 'profile', onClick: () => setActiveTab('profile') },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':   return <OverviewTab />;
      case 'admins':     return <AdminManagementTab />;
      case 'training':   return <TrainingSystem user={user} />;
      case 'reports':    return <ReportsTab />;
      case 'heatmap':    return <HeatmapTab />;
      case 'inventory':  return <InventoryTab />;
      case 'settings':   return <SettingsTab />;
      case 'profile':    return <ProfilePage user={user} />;
      default:           return <OverviewTab />;
    }
  };

  return (
    <Layout
      user={user}
      onLogout={onLogout}
      sidebarItems={sidebarItems}
      onProfileClick={() => setActiveTab('profile')}
    >
      {renderContent()}
    </Layout>
  );
};

export default SuperadminDashboard;

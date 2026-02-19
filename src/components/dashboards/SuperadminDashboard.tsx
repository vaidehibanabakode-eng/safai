import React, { useState } from 'react';
import {
  BarChart3,
  Users,
  Package,
  GraduationCap,
  FileText,
  Settings,
} from 'lucide-react';
import { User } from '../../App';
import Layout from '../common/Layout';
import TrainingSystem from '../training/TrainingSystem';
import OverviewTab from './tabs/OverviewTab';
import AdminManagementTab from './tabs/AdminManagementTab';
import InventoryTab from './tabs/InventoryTab';

interface SuperadminDashboardProps {
  user: User;
  onLogout: () => void;
}

const SuperadminDashboard: React.FC<SuperadminDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const sidebarItems = [
    { icon: <BarChart3 className="w-5 h-5" />, label: 'Overview', active: activeTab === 'overview', onClick: () => setActiveTab('overview') },
    { icon: <Users className="w-5 h-5" />, label: 'Admin Management', active: activeTab === 'admins', onClick: () => setActiveTab('admins') },
    { icon: <Package className="w-5 h-5" />, label: 'Inventory', active: activeTab === 'inventory', onClick: () => setActiveTab('inventory') },
    { icon: <GraduationCap className="w-5 h-5" />, label: 'Training', active: activeTab === 'training', onClick: () => setActiveTab('training') },
    { icon: <FileText className="w-5 h-5" />, label: 'Reports', active: activeTab === 'reports', onClick: () => setActiveTab('reports') },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', active: activeTab === 'settings', onClick: () => setActiveTab('settings') },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'admins':
        return <AdminManagementTab />;
      case 'inventory':
        return <InventoryTab />;
      case 'training':
        return <TrainingSystem user={user} />;
      case 'reports':
        return <div className="p-8 text-center text-gray-500">Reports Module Coming Soon</div>;
      case 'settings':
        return <div className="p-8 text-center text-gray-500">Settings Module Coming Soon</div>;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <Layout user={user} onLogout={onLogout} sidebarItems={sidebarItems}>
      {renderContent()}
    </Layout>
  );
};

export default SuperadminDashboard;
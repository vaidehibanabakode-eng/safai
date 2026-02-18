import React, { useState } from 'react';
import {
  BarChart3,
  Users,
  MapPin,
  Award,
  ShoppingCart,
  Recycle,
  Settings,
  FileText,
  GraduationCap,
  Target,
  Shield,
  Calendar,
  Package,
  Truck
} from 'lucide-react';
import { User } from '../../App';
import Layout from '../common/Layout';
import TrainingSystem from '../training/TrainingSystem';
import HeatMap from '../common/HeatMap';
import VehicleTracker from '../common/VehicleTracker';
import OverviewTab from './tabs/OverviewTab';
import AdminManagementTab from './tabs/AdminManagementTab';
import CampaignsTab from './tabs/CampaignsTab';
import InventoryTab from './tabs/InventoryTab';
import EcommerceTab from './tabs/EcommerceTab';
import PenaltiesTab from './tabs/PenaltiesTab';
import VouchersTab from './tabs/VouchersTab';
import LeaderboardTab from './tabs/LeaderboardTab';

interface SuperadminDashboardProps {
  user: User;
  onLogout: () => void;
}

const SuperadminDashboard: React.FC<SuperadminDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const sidebarItems = [
    { icon: <BarChart3 className="w-5 h-5" />, label: 'Overview', active: activeTab === 'overview', onClick: () => setActiveTab('overview') },
    { icon: <Users className="w-5 h-5" />, label: 'Admin Management', active: activeTab === 'admins', onClick: () => setActiveTab('admins') },
    { icon: <Users className="w-5 h-5" />, label: 'User Analytics', active: activeTab === 'users', onClick: () => setActiveTab('users') },
    { icon: <MapPin className="w-5 h-5" />, label: 'Heat Maps', active: activeTab === 'heatmaps', onClick: () => setActiveTab('heatmaps') },
    { icon: <Truck className="w-5 h-5" />, label: 'Vehicle Tracking', active: activeTab === 'vehicles', onClick: () => setActiveTab('vehicles') },
    { icon: <Award className="w-5 h-5" />, label: 'Leaderboard', active: activeTab === 'leaderboard', onClick: () => setActiveTab('leaderboard') },
    { icon: <Target className="w-5 h-5" />, label: 'Vouchers & Incentives', active: activeTab === 'vouchers', onClick: () => setActiveTab('vouchers') },
    { icon: <Shield className="w-5 h-5" />, label: 'Penalties', active: activeTab === 'penalties', onClick: () => setActiveTab('penalties') },
    { icon: <Recycle className="w-5 h-5" />, label: 'Waste Analytics', active: activeTab === 'waste', onClick: () => setActiveTab('waste') },
    { icon: <ShoppingCart className="w-5 h-5" />, label: 'E-commerce', active: activeTab === 'ecommerce', onClick: () => setActiveTab('ecommerce') },
    { icon: <Package className="w-5 h-5" />, label: 'Inventory', active: activeTab === 'inventory', onClick: () => setActiveTab('inventory') },
    { icon: <Calendar className="w-5 h-5" />, label: 'Campaigns', active: activeTab === 'campaigns', onClick: () => setActiveTab('campaigns') },
    { icon: <GraduationCap className="w-5 h-5" />, label: 'Training', active: activeTab === 'training', onClick: () => setActiveTab('training') },
    { icon: <FileText className="w-5 h-5" />, label: 'Reports', active: activeTab === 'reports', onClick: () => setActiveTab('reports') },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', active: activeTab === 'settings', onClick: () => setActiveTab('settings') }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'admins':
        return <AdminManagementTab />;
      case 'training':
        return <TrainingSystem user={user} />;
      case 'heatmaps':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">City-wide Heat Maps</h2>
              <p className="text-gray-600">Monitor cleanliness trends and identify problem areas</p>
            </div>
            <HeatMap />
          </div>
        );
      case 'vehicles':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Vehicle Tracking System</h2>
              <p className="text-gray-600">Real-time monitoring of all waste collection vehicles</p>
            </div>
            <VehicleTracker userRole="superadmin" />
          </div>
        );
      case 'leaderboard':
        return <LeaderboardTab />;
      case 'campaigns':
        return <CampaignsTab />;
      case 'inventory':
        return <InventoryTab />;
      case 'penalties':
        return <PenaltiesTab />;
      case 'ecommerce':
        return <EcommerceTab />;
      case 'vouchers':
        return <VouchersTab />;

      // Placeholders for remaining tabs (could be extracted later if needed)
      case 'waste':
        return <div className="p-8 text-center text-gray-500">Waste Analytics Module Coming Soon</div>;
      case 'users':
        return <div className="p-8 text-center text-gray-500">User Analytics Module Coming Soon</div>;
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
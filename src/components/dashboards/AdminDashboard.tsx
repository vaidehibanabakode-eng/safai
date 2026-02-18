import React, { useState } from 'react';
import {
  ClipboardList,
  Users,
  MapPin,
  Camera,
  GraduationCap,
  Truck,
  DollarSign,
  Target,
  Shield,
  UserCheck,
  PieChart,
  Package,
  LayoutDashboard
} from 'lucide-react';
import { User } from '../../App';
import Layout from '../common/Layout';
import TrainingSystem from '../training/TrainingSystem';

// Import Tab Components
import OverviewTab from './admin/OverviewTab';
import ComplaintsTab from './admin/ComplaintsTab';
import WorkersTab from './admin/WorkersTab';
import ChampionsTab from './admin/ChampionsTab';
import CitizensTab from './admin/CitizensTab';
import VerificationTab from './admin/VerificationTab';
import UberTab from './admin/UberTab';
import SalaryTab from './admin/SalaryTab';
import AnalyticsTab from './admin/AnalyticsTab';
import RevenueTab from './admin/RevenueTab';
import VouchersTab from './admin/VouchersTab';
import PenaltiesTab from './admin/PenaltiesTab';
import HeatMapTab from './admin/HeatMapTab';
import VehicleTrackingTab from './admin/VehicleTrackingTab';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const sidebarItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Overview', active: activeTab === 'overview', onClick: () => setActiveTab('overview') },
    { icon: <ClipboardList className="w-5 h-5" />, label: 'Complaints', active: activeTab === 'complaints', onClick: () => setActiveTab('complaints') },
    { icon: <Users className="w-5 h-5" />, label: 'Workers', active: activeTab === 'workers', onClick: () => setActiveTab('workers') },
    { icon: <UserCheck className="w-5 h-5" />, label: 'Green Champions', active: activeTab === 'champions', onClick: () => setActiveTab('champions') },
    { icon: <Users className="w-5 h-5" />, label: 'Citizens', active: activeTab === 'citizens', onClick: () => setActiveTab('citizens') },
    { icon: <Camera className="w-5 h-5" />, label: 'Work Verification', active: activeTab === 'verification', onClick: () => setActiveTab('verification') },
    { icon: <GraduationCap className="w-5 h-5" />, label: 'Training', active: activeTab === 'training', onClick: () => setActiveTab('training') },
    { icon: <MapPin className="w-5 h-5" />, label: 'Heat Maps', active: activeTab === 'heatmaps', onClick: () => setActiveTab('heatmaps') },
    { icon: <Truck className="w-5 h-5" />, label: 'Vehicle Tracking', active: activeTab === 'vehicles', onClick: () => setActiveTab('vehicles') },
    { icon: <Package className="w-5 h-5" />, label: 'Uber for Garbage', active: activeTab === 'uber', onClick: () => setActiveTab('uber') },
    { icon: <Target className="w-5 h-5" />, label: 'Vouchers', active: activeTab === 'vouchers', onClick: () => setActiveTab('vouchers') },
    { icon: <Shield className="w-5 h-5" />, label: 'Penalties', active: activeTab === 'penalties', onClick: () => setActiveTab('penalties') },
    { icon: <DollarSign className="w-5 h-5" />, label: 'Salary Tracking', active: activeTab === 'salary', onClick: () => setActiveTab('salary') },
    { icon: <PieChart className="w-5 h-5" />, label: 'Analytics', active: activeTab === 'analytics', onClick: () => setActiveTab('analytics') },
    { icon: <DollarSign className="w-5 h-5" />, label: 'Revenue', active: activeTab === 'revenue', onClick: () => setActiveTab('revenue') }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'complaints':
        return <ComplaintsTab />;
      case 'workers':
        return <WorkersTab />;
      case 'champions':
        return <ChampionsTab />;
      case 'citizens':
        return <CitizensTab />;
      case 'verification':
        return <VerificationTab />;
      case 'training':
        return <TrainingSystem user={user} />;
      case 'heatmaps':
        return <HeatMapTab />;
      case 'vehicles':
        return <VehicleTrackingTab />;
      case 'uber':
        return <UberTab />;
      case 'vouchers':
        return <VouchersTab />;
      case 'penalties':
        return <PenaltiesTab />;
      case 'salary':
        return <SalaryTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'revenue':
        return <RevenueTab />;
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

export default AdminDashboard;
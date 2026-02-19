import React, { useState } from 'react';
import {
  ClipboardList,
  Users,
  Camera,
  GraduationCap,
  DollarSign,
  UserCheck,
  LayoutDashboard,
} from 'lucide-react';
import { User } from '../../App';
import Layout from '../common/Layout';
import TrainingSystem from '../training/TrainingSystem';

// Import active Tab Components
import OverviewTab from './admin/OverviewTab';
import ComplaintsTab from './admin/ComplaintsTab';
import WorkersTab from './admin/WorkersTab';
import VerificationTab from './admin/VerificationTab';
import SalaryTab from './admin/SalaryTab';

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
    { icon: <UserCheck className="w-5 h-5" />, label: 'Work Verification', active: activeTab === 'verification', onClick: () => setActiveTab('verification') },
    { icon: <GraduationCap className="w-5 h-5" />, label: 'Training', active: activeTab === 'training', onClick: () => setActiveTab('training') },
    { icon: <DollarSign className="w-5 h-5" />, label: 'Salary Tracking', active: activeTab === 'salary', onClick: () => setActiveTab('salary') },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'complaints':
        return <ComplaintsTab />;
      case 'workers':
        return <WorkersTab />;
      case 'verification':
        return <VerificationTab />;
      case 'training':
        return <TrainingSystem user={user} />;
      case 'salary':
        return <SalaryTab />;
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
import React, { ReactNode } from 'react';
import { User } from '../../App';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  children: ReactNode;
  sidebarItems: Array<{
    icon: ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
  }>;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, children, sidebarItems }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        onLogout={onLogout}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="flex">
        <Sidebar
          items={sidebarItems}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 lg:ml-80 p-4 lg:p-8 pt-20 lg:pt-24 transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
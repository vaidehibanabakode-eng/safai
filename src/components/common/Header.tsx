import React from 'react';
import { Menu, LogOut, Bell, User as UserIcon } from 'lucide-react';
import { User } from '../../App';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onToggleSidebar }) => {
  return (
    <header className="bg-white border-b border-gray-200 h-16 fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        {/* LEFT: Toggle + Logo + Text */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Sidebar toggle stays in normal flow so it doesn't overlap */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-700 lg:hidden flex-shrink-0"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <img
            src="/logo.png"
            alt="Safai Connect"
            className="h-6 sm:h-8 md:h-10 w-auto object-contain flex-shrink-0"
          />

          {/* Text block (truncate so it never pushes over the toggle) */}
          <div className="min-w-0 leading-tight">
            <p className="hidden sm:block text-sm sm:text-base font-semibold text-gray-900 truncate">
              {user.name}
            </p>
            <p className="hidden sm:block text-[10px] sm:text-xs text-gray-500 capitalize truncate">
              {user.role.replace('-', ' ')} Dashboard
            </p>
          </div>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <LanguageSwitcher />
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg" aria-label="Notifications">
            <Bell className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 px-2 py-2 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full">
              <UserIcon className="w-4 h-4 text-green-600" />
            </div>
            <div className="hidden md:block text-sm leading-tight">
              <p className="font-medium text-gray-900 truncate max-w-[160px]">{user.name}</p>
              <p className="text-gray-500 truncate max-w-[200px]">{user.email}</p>
            </div>
          </div>

          <button onClick={onLogout} className="sm:hidden p-2 text-red-600 hover:bg-red-50 rounded-lg" aria-label="Logout">
            <LogOut className="w-5 h-5" />
          </button>
          <button onClick={onLogout} className="hidden sm:flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg">
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

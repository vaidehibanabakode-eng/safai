import React from 'react';
import { Menu, Bell, User as UserIcon } from 'lucide-react';
import { User } from '../../App';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../../contexts/LanguageContext';

interface HeaderProps {
  user: User;
  toggleSidebar?: () => void;
  onProfileClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, toggleSidebar, onProfileClick }) => {
  const { t } = useLanguage();
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30 transition-all duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-1 sm:gap-2 transition-transform hover:scale-105 duration-300">
              <img src="/logo.png" alt="Safai Connect Logo" className="h-8 sm:h-10 w-auto object-contain drop-shadow-sm" />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            <LanguageSwitcher />

            <button className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors relative group">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 sm:top-2 right-1 sm:right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div
              className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
              onClick={onProfileClick}
            >
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-gray-900">{user.name}</span>
                <span className="text-xs text-gray-500 capitalize">{t(user.role)}</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center border-2 border-white shadow-sm">
                <UserIcon className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

import React from 'react';
import { Menu, LogOut, Bell, User as UserIcon, Recycle } from 'lucide-react';
import { User } from '../../App';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../../contexts/LanguageContext';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  toggleSidebar?: () => void;
  onProfileClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, toggleSidebar, onProfileClick }) => {
  const { t } = useLanguage();
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2 transition-transform hover:scale-105 duration-300">
              <div className="bg-green-600 p-2 rounded-lg shadow-lg shadow-green-200">
                <Recycle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
                  Safai <span className="text-2xl font-extrabold text-green-600">कनेक्ट</span>
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher />

            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors relative group">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
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

            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors ml-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{t('logout')}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

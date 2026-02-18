import React, { ReactNode, useEffect } from 'react';

interface SidebarItem {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

interface SidebarProps {
  items: SidebarItem[];
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ items, isOpen, onClose }) => {
  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          'fixed left-0 top-16 z-40 w-80',
          'h-[calc(100vh-4rem)]',
          'bg-white border-r border-gray-200 shadow-sm',
          'transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'overflow-y-auto overscroll-contain touch-pan-y',
        ].join(' ')}
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
      >
        <nav className="p-4 sm:p-6">
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => {
                    item.onClick?.();
                    onClose(); // Close mobile menu on item click
                  }}
                  className={[
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200',
                    item.active
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                  ].join(' ')}
                >
                  <div className={`flex-shrink-0 ${item.active ? 'text-white' : 'text-gray-500'}`}>
                    {item.icon}
                  </div>
                  <span className="font-medium truncate">{item.label}</span>
                  {item.active && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

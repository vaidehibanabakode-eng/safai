import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, User as UserIcon, CheckCheck, X, AlertTriangle, ClipboardCheck, Truck, ShieldCheck } from 'lucide-react';
import { User } from '../../App';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../../contexts/LanguageContext';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface HeaderProps {
  user: User;
  toggleSidebar?: () => void;
  onProfileClick?: () => void;
  extraActions?: React.ReactNode;
}

// ─── Notification shape ───────────────────────────────────────────────────────
interface AppNotification {
  id: string;
  title: string;
  body: string;
  icon: React.ReactNode;
  iconBg: string;
  timestampMs: number;
  isNew: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const toMs = (ts: any): number => {
  if (!ts) return 0;
  if (typeof ts.toMillis === 'function') return ts.toMillis();
  if (typeof ts.toDate === 'function') return ts.toDate().getTime();
  if (ts instanceof Date) return ts.getTime();
  return new Date(ts).getTime() || 0;
};

const timeAgo = (ms: number): string => {
  if (!ms) return '';
  const s = Math.floor((Date.now() - ms) / 1000);
  if (s < 60) return 'Just now';
  const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24); if (d < 7) return `${d}d ago`;
  return new Date(ms).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const STATUS_LABELS: Record<string, string> = {
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  ASSIGNED: 'Assigned to worker',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed by worker',
  RESOLVED: '✅ Resolved',
  CLOSED: '✅ Closed',
  REASSIGNED: 'Reassigned',
};

// ─── NotificationsDropdown ────────────────────────────────────────────────────
const NotificationsDropdown: React.FC<{ user: User; onClose: () => void }> = ({ user, onClose }) => {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const lsKey = `notif_seen_${user.id}`;
  const lastSeen = Number(localStorage.getItem(lsKey) || 0);

  // ── Mark all read ──────────────────────────────────────────────────────────
  const markAllRead = () => {
    localStorage.setItem(lsKey, String(Date.now()));
    setItems(prev => prev.map(n => ({ ...n, isNew: false })));
  };

  useEffect(() => {
    const role = (user.role || '').toLowerCase();

    // ── Citizen: their complaint status updates ──────────────────────────────
    if (role === 'citizen') {
      const q = query(
        collection(db, 'complaints'),
        where('citizenId', '==', user.id),
        orderBy('updatedAt', 'desc'),
        limit(15),
      );
      const unsub = onSnapshot(q, (snap) => {
        const notifs: AppNotification[] = snap.docs.map(d => {
          const data = d.data();
          const ms = toMs(data.updatedAt || data.createdAt);
          return {
            id: d.id,
            title: data.title || data.category || 'Your Report',
            body: STATUS_LABELS[data.status] || data.status || 'Status updated',
            icon: <ClipboardCheck className="w-4 h-4" />,
            iconBg: ['RESOLVED', 'CLOSED'].includes(data.status) ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600',
            timestampMs: ms,
            isNew: ms > lastSeen,
          };
        });
        setItems(notifs);
        setLoading(false);
      });
      return unsub;
    }

    // ── Worker: new task assignments ─────────────────────────────────────────
    if (role === 'worker') {
      const q = query(
        collection(db, 'assignments'),
        where('workerId', '==', user.id),
        orderBy('createdAt', 'desc'),
        limit(15),
      );
      const unsub = onSnapshot(q, (snap) => {
        const notifs: AppNotification[] = snap.docs.map(d => {
          const data = d.data();
          const ms = toMs(data.createdAt);
          const statusLabel = data.workerStatus === 'COMPLETED' ? 'Task completed ✅' : data.workerStatus === 'IN_PROGRESS' ? 'Task in progress' : 'New task assigned';
          return {
            id: d.id,
            title: statusLabel,
            body: data.zone ? `Zone: ${data.zone}` : `Task #${d.id.slice(-6).toUpperCase()}`,
            icon: <Truck className="w-4 h-4" />,
            iconBg: data.workerStatus === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-emerald-100 text-emerald-600',
            timestampMs: ms,
            isNew: ms > lastSeen,
          };
        });
        setItems(notifs);
        setLoading(false);
      });
      return unsub;
    }

    // ── Admin: new complaints needing attention ──────────────────────────────
    if (role === 'admin') {
      const q = query(
        collection(db, 'complaints'),
        orderBy('createdAt', 'desc'),
        limit(15),
      );
      const unsub = onSnapshot(q, (snap) => {
        const notifs: AppNotification[] = snap.docs.map(d => {
          const data = d.data();
          const ms = toMs(data.createdAt);
          const isActionable = ['SUBMITTED', 'COMPLETED'].includes(data.status);
          return {
            id: d.id,
            title: data.status === 'SUBMITTED' ? '🆕 New complaint' : data.status === 'COMPLETED' ? '📋 Awaiting verification' : data.title || 'Complaint update',
            body: (data.title || data.category || 'Untitled') + (data.location ? ` · ${String(data.location).slice(0, 40)}` : ''),
            icon: <AlertTriangle className="w-4 h-4" />,
            iconBg: isActionable ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500',
            timestampMs: ms,
            isNew: ms > lastSeen,
          };
        });
        setItems(notifs);
        setLoading(false);
      });
      return unsub;
    }

    // ── Superadmin: all recent activity ─────────────────────────────────────
    if (role === 'superadmin') {
      const q = query(
        collection(db, 'complaints'),
        orderBy('createdAt', 'desc'),
        limit(10),
      );
      const unsub = onSnapshot(q, (snap) => {
        const notifs: AppNotification[] = snap.docs.map(d => {
          const data = d.data();
          const ms = toMs(data.createdAt);
          return {
            id: d.id,
            title: `[${data.status || 'New'}] ${data.category || 'Complaint'}`,
            body: (data.title || 'Untitled') + (data.assignedZone ? ` · ${data.assignedZone}` : ''),
            icon: <ShieldCheck className="w-4 h-4" />,
            iconBg: 'bg-purple-100 text-purple-600',
            timestampMs: ms,
            isNew: ms > lastSeen,
          };
        });
        setItems(notifs);
        setLoading(false);
      });
      return unsub;
    }

    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id, user.role]);

  const unread = items.filter(n => n.isNew).length;

  return (
    <div className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-1rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden flex flex-col max-h-[75vh]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-gray-600" />
          <span className="font-semibold text-gray-900 text-sm">Notifications</span>
          {unread > 0 && (
            <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">{unread} new</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unread > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-800 font-medium px-2 py-1 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark read
            </button>
          )}
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="overflow-y-auto flex-1">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Bell className="w-10 h-10 mb-2 text-gray-200" />
            <p className="text-sm font-medium">No notifications yet</p>
            <p className="text-xs mt-1">Activity will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {items.map(n => (
              <div
                key={n.id}
                className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${n.isNew ? 'bg-blue-50/40' : ''}`}
              >
                {/* Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${n.iconBg}`}>
                  {n.icon}
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-snug ${n.isNew ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                    {n.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{n.body}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{timeAgo(n.timestampMs)}</p>
                </div>
                {/* New dot */}
                {n.isNew && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 flex-shrink-0">
          <p className="text-[10px] text-gray-400 text-center">Showing last {items.length} activities</p>
        </div>
      )}
    </div>
  );
};

// ─── Header ───────────────────────────────────────────────────────────────────
const Header: React.FC<HeaderProps> = ({ user, toggleSidebar, onProfileClick, extraActions }) => {
  const { t } = useLanguage();
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount]   = useState(0);
  const bellRef = useRef<HTMLDivElement>(null);
  const lsKey = `notif_seen_${user.id}`;

  // Compute unread count from live data without full dropdown open
  useEffect(() => {
    const role = (user.role || '').toLowerCase();
    const lastSeen = Number(localStorage.getItem(lsKey) || 0);

    let q;
    if (role === 'citizen') {
      q = query(collection(db, 'complaints'), where('citizenId', '==', user.id), orderBy('updatedAt', 'desc'), limit(20));
    } else if (role === 'worker') {
      q = query(collection(db, 'assignments'), where('workerId', '==', user.id), orderBy('createdAt', 'desc'), limit(20));
    } else {
      q = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'), limit(20));
    }

    const unsub = onSnapshot(q, (snap) => {
      const count = snap.docs.filter(d => {
        const data = d.data();
        const ms = toMs(role === 'worker' ? data.createdAt : (data.updatedAt || data.createdAt));
        return ms > lastSeen;
      }).length;
      setUnreadCount(count);
    });

    return unsub;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id, user.role]);

  // Close on outside click
  useEffect(() => {
    if (!notifOpen) return;
    const handler = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [notifOpen]);

  const handleBellClick = () => {
    setNotifOpen(prev => !prev);
    // Reset count when opening
    if (!notifOpen) {
      // We only reset visual count; actual "mark read" is explicit
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30 transition-all duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: hamburger + logo */}
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

          {/* Right: language + bell + user */}
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            <LanguageSwitcher />

            {/* Bell with notification badge */}
            <div className="relative" ref={bellRef}>
              <button
                onClick={handleBellClick}
                className={`p-1 sm:p-2 rounded-full transition-colors relative group ${notifOpen ? 'bg-gray-100 text-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                title={t('notifications')}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 min-w-[1rem] h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-[9px] font-black text-white leading-none px-0.5">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  </span>
                )}
              </button>

              {/* Dropdown */}
              {notifOpen && (
                <NotificationsDropdown
                  user={user}
                  onClose={() => setNotifOpen(false)}
                />
              )}
            </div>

            {/* Extra actions (e.g. NotificationBell from context) */}
            {extraActions && extraActions}

            {/* User info */}
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

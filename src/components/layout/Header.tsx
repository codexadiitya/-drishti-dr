import { useState } from 'react';
import { Search, Bell, User, ChevronDown, AlertTriangle, CheckCircle2 } from 'lucide-react';

const NOTIFICATIONS = [
  { id: 1, type: 'danger', message: 'PT-10027: Proliferative DR detected — urgent referral recommended', time: '2m ago' },
  { id: 2, type: 'warning', message: 'PT-10023: Image quality poor — recapture needed', time: '18m ago' },
  { id: 3, type: 'success', message: 'PT-10025: Analysis complete — No DR detected', time: '35m ago' },
];

export function Header() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-4 shrink-0 relative z-20">
      {/* Search */}
      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1 max-w-sm">
        <Search size={14} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search patients or reports…"
          className="bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none w-full"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Demo badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs text-amber-700 font-medium mr-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
          Demo Mode
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-11 w-80 bg-white border border-gray-200 rounded-xl card-shadow-md overflow-hidden z-30">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-800">Notifications</span>
                <span className="text-xs text-blue-600 cursor-pointer hover:text-blue-700">Mark all read</span>
              </div>
              {NOTIFICATIONS.map(n => (
                <div key={n.id} className="flex items-start gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer">
                  {n.type === 'danger' && <AlertTriangle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />}
                  {n.type === 'warning' && <AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />}
                  {n.type === 'success' && <CheckCircle2 size={14} className="text-green-500 mt-0.5 flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
              <div className="px-4 py-2.5 text-center">
                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer">View all</button>
              </div>
            </div>
          )}
        </div>

        {/* User profile */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
              <User size={14} className="text-blue-700" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-gray-800">Dr. Sharma</div>
              <div className="text-[10px] text-gray-400">Ophthalmologist</div>
            </div>
            <ChevronDown size={12} className="text-gray-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-11 w-48 bg-white border border-gray-200 rounded-xl card-shadow-md overflow-hidden z-30">
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="text-sm font-semibold text-gray-800">Dr. A. Sharma</div>
                <div className="text-xs text-gray-400">Demo Account</div>
              </div>
              {['Profile', 'Preferences', 'Sign out'].map(item => (
                <button key={item} className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer">
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {(notifOpen || profileOpen) && (
        <div className="fixed inset-0 z-10" onClick={() => { setNotifOpen(false); setProfileOpen(false); }} />
      )}
    </header>
  );
}

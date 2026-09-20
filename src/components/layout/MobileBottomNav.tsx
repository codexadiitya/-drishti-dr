import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ScanEye, Users, UserCheck, BarChart3, FileText, HeartPulse } from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';

export function MobileBottomNav() {
  const { userRole, patients } = useAppState();

  const firstPatientId = patients[0]?.id || 'PT-10021';

  // Role-specific bottom navigation tabs
  const getNavItems = () => {
    switch (userRole) {
      case 'doctor':
        return [
          { to: '/doctor', label: 'Doctor Hub', icon: LayoutDashboard, exact: true },
          { to: `/doctor/review/${firstPatientId}`, label: 'Fast Review', icon: UserCheck },
          { to: '/queue', label: 'Cases', icon: Users },
          { to: '/simulation', label: 'Capacity', icon: BarChart3 },
          { to: '/reports', label: 'Reports', icon: FileText },
        ];
      case 'patient':
        return [
          { to: '/patient-portal', label: 'My Results', icon: HeartPulse, exact: true },
          { to: '/reports', label: 'My Report', icon: FileText },
          { to: '/reminders', label: 'Follow-up', icon: Users },
        ];
      case 'health_worker':
      default:
        return [
          { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
          { to: '/screening/new', label: 'New Scan', icon: ScanEye },
          { to: '/queue', label: 'Patients', icon: Users },
          { to: `/patients/${firstPatientId}`, label: 'Results', icon: HeartPulse },
          { to: '/reports', label: 'Reports', icon: FileText },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) => `
              flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-colors min-w-[54px]
              ${isActive ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-900'}
            `}
          >
            {({ isActive }) => (
              <>
                <div className={`p-1 rounded-lg ${isActive ? 'bg-blue-50' : 'bg-transparent'}`}>
                  <Icon size={18} className={isActive ? 'text-blue-600' : 'text-gray-500'} />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[65px] text-center">
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

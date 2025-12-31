import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LogOut, 
  LayoutDashboard, 
  PawPrint, 
  Users, 
  Stethoscope, 
  Syringe, 
  Package, 
  Calendar, 
  Ticket, 
  UserCheck, 
  DollarSign, 
  Briefcase, 
  Clock, 
  User,
  Home,
  Building,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';
import { useState } from 'react';

export function Sidebar() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const adminLinks = [
    { 
      category: 'Overview',
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/dashboard/stats', label: 'Analytics', icon: TrendingUp },
      ]
    },
    {
      category: 'Animal Management',
      items: [
        { path: '/animals', label: 'Animals', icon: PawPrint },
        { path: '/cages', label: 'Habitats', icon: Building },
        { path: '/medical-checks', label: 'Medical Records', icon: Stethoscope },
        { path: '/vaccinations', label: 'Vaccinations', icon: Syringe },
        { path: '/doctors', label: 'Veterinarians', icon: UserCheck },
      ]
    },
    {
      category: 'Staff Management',
      items: [
        { path: '/employees', label: 'Employees', icon: Users },
        { path: '/jobs', label: 'Job Management', icon: Briefcase },
        { path: '/attendance-admin', label: 'Attendance', icon: Clock },
        { path: '/salaries', label: 'Salaries', icon: DollarSign },
      ]
    },
    {
      category: 'Operations',
      items: [
        { path: '/inventory', label: 'Inventory', icon: Package },
        { path: '/event-management', label: 'Events', icon: Calendar },
        { path: '/ticket-sales', label: 'Sales Analytics', icon: TrendingUp },
        { path: '/visitors', label: 'Visitors', icon: Eye },
      ]
    }
  ];

  const employeeLinks = [
    {
      category: 'My Dashboard',
      items: [
        { path: '/employee/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/employee/profile', label: 'My Profile', icon: User },
      ]
    },
    {
      category: 'Work Management',
      items: [
        { path: '/employee/jobs', label: 'My Jobs', icon: Briefcase },
        { path: '/employee/attendance', label: 'Attendance', icon: Clock },
        { path: '/employee/stock-requests', label: 'Stock Requests', icon: Package },
      ]
    }
  ];

  const visitorLinks = [
    {
      category: 'Visitor Area',
      items: [
        { path: '/', label: 'Home', icon: Home },
        { path: '/events', label: 'Events', icon: Calendar },
        { path: '/tickets', label: 'Buy Tickets', icon: Ticket },
      ]
    }
  ];

  const getLinksForRole = () => {
    switch (user?.role) {
      case 'admin':
        return adminLinks;
      case 'employee':
        return employeeLinks;
      default:
        return visitorLinks;
    }
  };

  const links = getLinksForRole();

  if (!user || user.role === 'visitor') {
    return null;
  }

  return (
    <div className={`bg-neutral-900 text-white h-screen sticky top-0 transition-all duration-300 ease-out border-r-4 border-black ${
      isCollapsed ? 'w-20' : 'w-72'
    } flex flex-col shadow-brutal-lg`}>
      {/* Header */}
      <div className="p-4 border-b-3 border-neutral-800 bg-neutral-900">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden border-3 border-black shadow-brutal-sm">
                <img src="/logo.png" alt="Zootopia Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold uppercase tracking-tight">
                Zootopia
              </span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-neutral-800 rounded transition-brutal border-2 border-transparent hover:border-accent-yellow"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b-3 border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center border-3 border-black shadow-brutal-sm flex-shrink-0">
            <User className="w-6 h-6" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <div className="font-bold text-sm truncate">{user.name}</div>
              <div className="text-xs text-neutral-400 capitalize">{user.role}</div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900">
        {links.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-6">
            {!isCollapsed && (
              <div className="px-4 mb-2">
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  {category.category}
                </h3>
              </div>
            )}
            <div className="space-y-1 px-2">
              {category.items.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-brutal border-2 ${
                      isActive 
                        ? 'bg-primary text-white border-black shadow-brutal-sm' 
                        : 'text-neutral-300 hover:bg-neutral-800 hover:text-white border-transparent hover:border-neutral-700'
                    }`}
                    title={isCollapsed ? link.label : ''}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="font-medium text-sm truncate">{link.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t-3 border-neutral-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-accent-red hover:bg-accent-red hover:text-white rounded-lg transition-brutal border-2 border-transparent hover:border-black hover:shadow-brutal-sm"
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && (
            <span className="font-bold text-sm">Logout</span>
          )}
        </button>
      </div>
    </div>
  );
}
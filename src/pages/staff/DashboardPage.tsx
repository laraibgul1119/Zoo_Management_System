import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { api } from '../../utils/api';
import { ZooEvent, Notification } from '../../types';
import { PawPrint, Users, Calendar, DollarSign, AlertTriangle, Package, Info, Plus } from 'lucide-react';

export function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ animals: 0, employees: 0, cages: 0, revenue: 0 });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [upcomingEventsCount, setUpcomingEventsCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, notificationsData, eventsData] = await Promise.all([
          api.getDashboardStats(),
          api.getNotifications(),
          api.getEvents()
        ]);
        setStats(statsData);
        setNotifications(notificationsData);

        const upcoming = eventsData.filter((event: ZooEvent) => event.status === 'Upcoming');
        setUpcomingEventsCount(upcoming.length);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please refresh the page.');
      }
    };
    fetchDashboardData();
  }, []);

  const totalAnimals = stats.animals;
  const totalEmployees = stats.employees;
  const totalRevenue = stats.revenue;
  const healthAlerts = notifications.filter(n => n.type === 'Health');

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold uppercase tracking-tight mb-2">Dashboard</h1>
        <p className="text-neutral-800 font-medium">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-100 border-3 border-black text-red-800 font-bold rounded-lg shadow-brutal">
          {error}
        </div>
      )}

      {/* Quick Actions */}
      <Card variant="elevated" className="bg-gradient-to-br from-white to-neutral-50">
        <h2 className="text-xl font-bold text-neutral-900 mb-4 uppercase tracking-tight">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/event-management')}
            className="flex items-center gap-3 p-4 bg-primary text-white rounded-lg border-3 border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-y-1 transition-brutal"
          >
            <Plus className="w-5 h-5" />
            <span className="font-bold">Add Event</span>
          </button>
          <button
            onClick={() => navigate('/animals')}
            className="flex items-center gap-3 p-4 bg-secondary text-white rounded-lg border-3 border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-y-1 transition-brutal"
          >
            <Plus className="w-5 h-5" />
            <span className="font-bold">Add Animal</span>
          </button>
          <button
            onClick={() => navigate('/employees')}
            className="flex items-center gap-3 p-4 bg-accent-purple text-white rounded-lg border-3 border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-y-1 transition-brutal"
          >
            <Plus className="w-5 h-5" />
            <span className="font-bold">Add Employee</span>
          </button>
          <button
            onClick={() => navigate('/ticket-sales')}
            className="flex items-center gap-3 p-4 bg-accent-orange text-white rounded-lg border-3 border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-y-1 transition-brutal"
          >
            <DollarSign className="w-5 h-5" />
            <span className="font-bold">View Sales</span>
          </button>
        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Animals" 
          value={totalAnimals} 
          icon={PawPrint} 
          color="#2563EB" 
          trend="+2 this month" 
        />
        <StatCard 
          label="Active Staff" 
          value={totalEmployees} 
          icon={Users} 
          color="#10B981" 
        />
        <StatCard 
          label="Upcoming Events" 
          value={upcomingEventsCount} 
          icon={Calendar} 
          color="#FBBF24" 
        />
        <StatCard 
          label="Revenue (Today)" 
          value={`$${totalRevenue}`} 
          icon={DollarSign} 
          color="#F97316" 
          trend="+12% vs yesterday" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications Panel */}
        <Card title="Notifications & Alerts" variant="elevated" className="h-full lg:col-span-1">
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {notifications.length === 0 && (
              <div className="text-center py-12 text-neutral-800">
                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-3 border-3 border-black">
                  <Info className="w-8 h-8 text-secondary" />
                </div>
                <p className="font-bold">All systems operational</p>
                <p className="text-sm text-neutral-600">No active alerts</p>
              </div>
            )}

            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`flex items-start gap-3 p-4 border-l-4 border-3 border-black shadow-brutal-sm rounded ${
                  notification.type === 'Health' ? 'bg-red-50 border-l-accent-red' :
                  notification.type === 'Stock' ? 'bg-yellow-50 border-l-accent-yellow' :
                  'bg-blue-50 border-l-primary'
                }`}
              >
                <div className={`p-2 rounded-full shrink-0 border-2 border-black ${
                  notification.type === 'Health' ? 'bg-accent-red' :
                  notification.type === 'Stock' ? 'bg-accent-yellow' :
                  'bg-primary'
                }`}>
                  {notification.type === 'Health' ? <AlertTriangle className="w-4 h-4 text-white" /> :
                   notification.type === 'Stock' ? <Package className="w-4 h-4 text-black" /> :
                   <Info className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-sm mb-1 ${
                    notification.type === 'Health' ? 'text-red-900' :
                    notification.type === 'Stock' ? 'text-yellow-900' :
                    'text-blue-900'
                  }`}>
                    {notification.title}
                  </h3>
                  <p className={`text-sm ${
                    notification.type === 'Health' ? 'text-red-800' :
                    notification.type === 'Stock' ? 'text-yellow-800' :
                    'text-blue-800'
                  }`}>
                    {notification.message}
                  </p>
                  {notification.link && (
                    <button
                      onClick={() => navigate(notification.link!)}
                      className="text-xs font-bold underline mt-2 hover:no-underline"
                    >
                      Take Action →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Critical Health Issues / Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Critical Health Issues" variant="elevated" className="h-full">
              {healthAlerts.length > 0 ? (
                <div className="space-y-3">
                  {healthAlerts.map(alert => (
                    <div 
                      key={alert.id + '_widget'} 
                      className="flex items-center justify-between p-4 bg-white border-3 border-black rounded-lg shadow-brutal-sm hover:shadow-brutal transition-brutal"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-accent-red animate-pulse border-2 border-black" />
                        <div className="font-bold text-sm">{alert.message}</div>
                      </div>
                      <span className="px-3 py-1 bg-accent-red text-white text-xs font-bold rounded border-2 border-black shadow-brutal-sm uppercase">
                        Sick
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-neutral-400">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-3 border-3 border-black">
                    <PawPrint className="w-8 h-8" />
                  </div>
                  <span className="font-bold">No critical warnings</span>
                </div>
              )}
            </Card>

            <Card title="Recent Activity" variant="elevated" className="h-full">
              <div className="flex flex-col items-center justify-center h-48 text-neutral-400">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-3 border-3 border-black">
                  <Calendar className="w-8 h-8" />
                </div>
                <span className="font-bold">Activity feed coming soon</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

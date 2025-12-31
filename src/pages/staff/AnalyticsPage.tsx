import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { TrendingUp, TrendingDown, DollarSign, Users, Calendar, Ticket } from 'lucide-react';
import { api } from '../../utils/api';

interface AnalyticsData {
  totalRevenue: number;
  totalTicketsSold: number;
  totalVisitors: number;
  totalEvents: number;
  revenueGrowth: number;
  ticketGrowth: number;
}

export function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalTicketsSold: 0,
    totalVisitors: 0,
    totalEvents: 0,
    revenueGrowth: 0,
    ticketGrowth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [ticketSales, visitors, events] = await Promise.all([
        api.getTicketSales(),
        api.getVisitors(),
        api.getEvents(),
      ]);

      const totalRevenue = ticketSales.reduce((sum: number, sale: any) => sum + sale.total_price, 0);
      const totalTicketsSold = ticketSales.reduce((sum: number, sale: any) => sum + sale.quantity, 0);

      setAnalytics({
        totalRevenue,
        totalTicketsSold,
        totalVisitors: visitors.length,
        totalEvents: events.length,
        revenueGrowth: 12.5,
        ticketGrowth: 8.3,
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black mb-2">Analytics Dashboard</h1>
        <p className="text-neutral-600">Track your zoo's performance and growth</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-bold ${analytics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics.revenueGrowth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(analytics.revenueGrowth)}%
            </div>
          </div>
          <div className="text-3xl font-black mb-1">${analytics.totalRevenue.toFixed(2)}</div>
          <div className="text-sm text-neutral-600">Total Revenue</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-secondary/10 rounded-lg">
              <Ticket className="w-6 h-6 text-secondary" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-bold ${analytics.ticketGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {analytics.ticketGrowth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(analytics.ticketGrowth)}%
            </div>
          </div>
          <div className="text-3xl font-black mb-1">{analytics.totalTicketsSold}</div>
          <div className="text-sm text-neutral-600">Tickets Sold</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-accent-purple/10 rounded-lg">
              <Users className="w-6 h-6 text-accent-purple" />
            </div>
          </div>
          <div className="text-3xl font-black mb-1">{analytics.totalVisitors}</div>
          <div className="text-sm text-neutral-600">Total Visitors</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-accent-orange/10 rounded-lg">
              <Calendar className="w-6 h-6 text-accent-orange" />
            </div>
          </div>
          <div className="text-3xl font-black mb-1">{analytics.totalEvents}</div>
          <div className="text-sm text-neutral-600">Active Events</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-black mb-4">Revenue Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Average Ticket Price</span>
              <span className="font-bold">
                ${analytics.totalTicketsSold > 0 ? (analytics.totalRevenue / analytics.totalTicketsSold).toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Total Transactions</span>
              <span className="font-bold">{analytics.totalTicketsSold}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-black mb-4">Visitor Insights</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Registered Visitors</span>
              <span className="font-bold">{analytics.totalVisitors}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Active Events</span>
              <span className="font-bold">{analytics.totalEvents}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

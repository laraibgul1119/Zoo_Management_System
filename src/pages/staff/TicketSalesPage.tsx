import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { StatCard } from '../../components/ui/StatCard';
import { api } from '../../utils/api';
import { TicketSale, TicketType } from '../../types';
import { DollarSign, Ticket, TrendingUp } from 'lucide-react';

export function TicketSalesPage() {
  const [sales, setSales] = useState<TicketSale[]>([]);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [salesData, ticketsData] = await Promise.all([
        api.getTicketSales(),
        api.getTickets()
      ]);
      setSales(salesData);
      setTickets(ticketsData);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalTickets = sales.reduce((sum, s) => sum + (s.quantity || 0), 0);
  const avgOrderValue = sales.length > 0 ? Math.round(totalRevenue / sales.length) : 0;

  if (loading) {
    return <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
      <div className="text-2xl font-black uppercase">Loading analytics...</div>
    </div>;
  }

  return <div className="min-h-screen bg-[#F3F4F6]">
    <main className="max-w-[1920px] mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black uppercase mb-2">
          Sales Analytics
        </h1>
        <p className="text-gray-600 font-bold">
          Monitor ticket revenue and trends
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total Revenue" value={`$${totalRevenue}`} icon={DollarSign} color="#10B981" />
        <StatCard label="Tickets Sold" value={totalTickets} icon={Ticket} color="#2563EB" />
        <StatCard label="Avg. Order Value" value={`$${avgOrderValue}`} icon={TrendingUp} color="#F97316" />
      </div>

      <Card title="Recent Transactions">
        <Table data={sales} keyField="id" columns={[{
          header: 'Date',
          accessor: 'date'
        }, {
          header: 'Visitor',
          accessor: 'visitorName'
        }, {
          header: 'Email',
          accessor: 'visitorEmail'
        }, {
          header: 'Phone',
          accessor: 'visitorPhone'
        }, {
          header: 'Ticket Type',
          accessor: s => tickets.find(t => t.id === s.ticketId)?.type || 'Unknown'
        }, {
          header: 'Quantity',
          accessor: 'quantity'
        }, {
          header: 'Total',
          accessor: s => `$${s.totalAmount}`
        }]} />
      </Card>
    </main>
  </div>;
}
import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { api } from '../../utils/api';
import { Visitor } from '../../types';
import { Mail, Phone, Users } from 'lucide-react';

export function VisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getVisitors();
      setVisitors(data);
    } catch (err) {
      console.error('Error fetching visitors:', err);
      setError('Failed to load visitors');
    } finally {
      setLoading(false);
    }
  };

  return <div className="min-h-screen bg-[#F3F4F6]">
      <main className="max-w-[1920px] mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-black uppercase mb-2 flex items-center gap-3">
            <Users className="w-10 h-10" />
            Visitor Database
          </h1>
          <p className="text-gray-600 font-bold">
            Registered visitors and contact information from ticket purchases
          </p>
        </div>

        <Card>
          {loading ? (
            <LoadingSpinner size="lg" text="Loading visitors..." />
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 font-bold mb-4">{error}</div>
              <button
                onClick={fetchVisitors}
                className="bg-[#2563EB] text-white px-6 py-2 font-bold border-2 border-black hover:bg-[#1d4ed8] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
              >
                Retry
              </button>
            </div>
          ) : visitors.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-black">
                <Users className="w-10 h-10 text-neutral-400" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2 uppercase tracking-tight">
                No Visitors Yet
              </h3>
              <p className="text-neutral-600 font-medium">
                Visitors will appear here when they purchase tickets
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-bold text-gray-600">
                  Total Visitors: {visitors.length}
                </p>
                <button
                  onClick={fetchVisitors}
                  className="text-sm font-bold text-[#2563EB] hover:underline"
                >
                  Refresh
                </button>
              </div>
              <Table data={visitors} keyField="id" columns={[{
                header: 'Name',
                accessor: 'name',
                className: 'font-bold'
              }, {
                header: 'Contact Info',
                accessor: v => <div className="flex flex-col gap-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3" /> {v.email}
                      </div>
                      {v.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3" /> {v.phone}
                        </div>
                      )}
                    </div>
              }, {
                header: 'Registration Date',
                accessor: 'registrationDate',
                className: 'font-medium'
              }]} />
            </>
          )}
        </Card>
      </main>
    </div>;
}
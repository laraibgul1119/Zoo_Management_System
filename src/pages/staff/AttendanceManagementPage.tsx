import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Input } from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { api } from '../../utils/api';
import { Attendance } from '../../types';
import { Clock, Calendar, Users, Filter } from 'lucide-react';

export function AttendanceManagementPage() {
    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(true);
    const [dateFilter, setDateFilter] = useState('');
    const [stats, setStats] = useState({ total: 0, present: 0, checkedOut: 0 });

    useEffect(() => {
        loadAttendance();
    }, [dateFilter]);

    const loadAttendance = async () => {
        try {
            setLoading(true);
            const data = await api.getAllAttendance(dateFilter);
            setAttendance(data);
            
            // Calculate stats
            const present = data.filter((record: Attendance) => record.status === 'Present').length;
            const checkedOut = data.filter((record: Attendance) => record.checkOut).length;
            setStats({
                total: data.length,
                present,
                checkedOut
            });
        } catch (error) {
            console.error('Failed to load attendance', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClearFilter = () => {
        setDateFilter('');
    };

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-4xl font-bold uppercase tracking-tight mb-2 flex items-center gap-3">
                    <Clock className="w-10 h-10" />
                    Attendance Management
                </h1>
                <p className="text-neutral-800 font-medium">
                    Monitor and manage employee attendance records
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card variant="elevated" className="bg-gradient-to-br from-blue-50 to-white">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center border-3 border-black shadow-brutal-sm">
                            <Users className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <div className="text-3xl font-bold">{stats.total}</div>
                            <div className="text-sm font-bold text-neutral-600 uppercase tracking-wide">
                                Total Records
                            </div>
                        </div>
                    </div>
                </Card>

                <Card variant="elevated" className="bg-gradient-to-br from-green-50 to-white">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center border-3 border-black shadow-brutal-sm">
                            <Clock className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <div className="text-3xl font-bold">{stats.present}</div>
                            <div className="text-sm font-bold text-neutral-600 uppercase tracking-wide">
                                Present Today
                            </div>
                        </div>
                    </div>
                </Card>

                <Card variant="elevated" className="bg-gradient-to-br from-orange-50 to-white">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-accent-orange rounded-full flex items-center justify-center border-3 border-black shadow-brutal-sm">
                            <Calendar className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <div className="text-3xl font-bold">{stats.checkedOut}</div>
                            <div className="text-sm font-bold text-neutral-600 uppercase tracking-wide">
                                Checked Out
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <Card variant="elevated">
                <div className="flex items-end gap-4">
                    <div className="flex-1">
                        <Input
                            type="date"
                            label="Filter by Date"
                            icon={<Filter className="w-5 h-5" />}
                            value={dateFilter}
                            onChange={e => setDateFilter(e.target.value)}
                        />
                    </div>
                    {dateFilter && (
                        <button
                            onClick={handleClearFilter}
                            className="px-4 py-3 bg-neutral-200 text-black font-bold border-3 border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-y-1 transition-brutal uppercase tracking-wide"
                        >
                            Clear Filter
                        </button>
                    )}
                </div>
            </Card>

            {/* Attendance Table */}
            <Card 
                title="Attendance Records" 
                variant="elevated"
                action={
                    <div className="flex items-center gap-2 text-sm font-bold text-neutral-600">
                        <Calendar className="w-4 h-4" />
                        {dateFilter || 'All Dates'}
                    </div>
                }
            >
                {loading ? (
                    <LoadingSpinner size="md" text="Loading attendance records..." />
                ) : attendance.length === 0 ? (
                    <EmptyState
                        icon={Clock}
                        title="No Attendance Records"
                        description={dateFilter 
                            ? "No records found for the selected date" 
                            : "No attendance records available yet"}
                    />
                ) : (
                    <Table
                        data={attendance}
                        keyField="id"
                        columns={[
                            { 
                                header: 'Employee', 
                                accessor: (row) => (
                                    <span className="font-bold">
                                        {row.employeeName || row.employeeId || 'Unknown'}
                                    </span>
                                )
                            },
                            { 
                                header: 'Date', 
                                accessor: 'date',
                                className: 'font-bold'
                            },
                            { 
                                header: 'Check In', 
                                accessor: (row) => (
                                    <span className="font-bold text-secondary">
                                        {row.checkIn}
                                    </span>
                                )
                            },
                            { 
                                header: 'Check Out', 
                                accessor: (row) => row.checkOut ? (
                                    <span className="font-bold text-accent-orange">
                                        {row.checkOut}
                                    </span>
                                ) : (
                                    <span className="text-neutral-400 font-medium">-</span>
                                )
                            },
                            { 
                                header: 'Status', 
                                accessor: (row) => (
                                    <span className={`px-3 py-1 border-2 border-black font-bold text-xs uppercase shadow-brutal-sm ${
                                        row.status === 'Present' 
                                            ? 'bg-secondary text-white' 
                                            : row.status === 'Absent'
                                                ? 'bg-accent-red text-white'
                                                : 'bg-neutral-200 text-neutral-800'
                                    }`}>
                                        {row.status}
                                    </span>
                                )
                            },
                            {
                                header: 'Hours',
                                accessor: (row) => {
                                    if (!row.checkIn || !row.checkOut) {
                                        return <span className="text-neutral-400 font-medium">-</span>;
                                    }
                                    
                                    // Calculate hours worked
                                    const checkIn = new Date(`2000-01-01 ${row.checkIn}`);
                                    const checkOut = new Date(`2000-01-01 ${row.checkOut}`);
                                    const diff = checkOut.getTime() - checkIn.getTime();
                                    const hours = Math.floor(diff / (1000 * 60 * 60));
                                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                                    
                                    return (
                                        <span className="font-bold text-primary">
                                            {hours}h {minutes}m
                                        </span>
                                    );
                                }
                            }
                        ]}
                    />
                )}
            </Card>
        </div>
    );
}

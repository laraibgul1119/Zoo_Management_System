import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Alert } from '../../components/ui/Alert';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { api } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { Attendance } from '../../types';
import { Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';

export function AttendancePage() {
    const { user } = useAuth();
    const [history, setHistory] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(true);
    const [checkingIn, setCheckingIn] = useState(false);
    const [checkingOut, setCheckingOut] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
    const [todayRecord, setTodayRecord] = useState<Attendance | null>(null);

    const employeeId = user?.id || '';

    useEffect(() => {
        if (employeeId) {
            fetchHistory();
        }
    }, [employeeId]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const data = await api.getAttendanceHistory(employeeId);
            setHistory(data);
            
            // Check if already checked in today
            const today = new Date().toISOString().split('T')[0];
            const todayAttendance = data.find((record: Attendance) => record.date === today);
            setTodayRecord(todayAttendance || null);
        } catch (error) {
            console.error('Failed to load history', error);
            setMessage({ type: 'error', text: 'Failed to load attendance history' });
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async () => {
        if (!employeeId) {
            setMessage({ type: 'error', text: 'Employee ID not found' });
            return;
        }

        try {
            setCheckingIn(true);
            setMessage(null);
            const res = await api.checkIn(employeeId);
            
            if (res.error) {
                throw new Error(res.error);
            }
            
            setMessage({ 
                type: 'success', 
                text: `Successfully checked in at ${res.checkIn}` 
            });
            await fetchHistory();
        } catch (error: any) {
            setMessage({ 
                type: 'error', 
                text: error.message || 'Check-in failed. Please try again.' 
            });
        } finally {
            setCheckingIn(false);
        }
    };

    const handleCheckOut = async () => {
        if (!employeeId) {
            setMessage({ type: 'error', text: 'Employee ID not found' });
            return;
        }

        if (!todayRecord) {
            setMessage({ type: 'error', text: 'You must check in first' });
            return;
        }

        try {
            setCheckingOut(true);
            setMessage(null);
            const res = await api.checkOut(employeeId);
            
            if (res.error) {
                throw new Error(res.error);
            }
            
            setMessage({ 
                type: 'success', 
                text: `Successfully checked out at ${res.checkOut}` 
            });
            await fetchHistory();
        } catch (error: any) {
            setMessage({ 
                type: 'error', 
                text: error.message || 'Check-out failed. Please try again.' 
            });
        } finally {
            setCheckingOut(false);
        }
    };

    const canCheckIn = !todayRecord;
    const canCheckOut = todayRecord && !todayRecord.checkOut;

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-4xl font-bold uppercase tracking-tight mb-2 flex items-center gap-3">
                    <Clock className="w-10 h-10" />
                    Attendance Tracker
                </h1>
                <p className="text-neutral-800 font-medium">
                    Track your daily check-in and check-out times
                </p>
            </div>

            {/* Alert Message */}
            {message && (
                <Alert
                    type={message.type}
                    message={message.text}
                    onClose={() => setMessage(null)}
                />
            )}

            {/* Today's Status */}
            {todayRecord && (
                <Card variant="elevated" className="bg-gradient-to-br from-blue-50 to-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold uppercase tracking-tight mb-2">
                                Today's Status
                            </h3>
                            <div className="space-y-1">
                                <p className="text-sm font-medium">
                                    <span className="text-neutral-600">Check In:</span>{' '}
                                    <span className="font-bold text-secondary">{todayRecord.checkIn}</span>
                                </p>
                                {todayRecord.checkOut && (
                                    <p className="text-sm font-medium">
                                        <span className="text-neutral-600">Check Out:</span>{' '}
                                        <span className="font-bold text-accent-orange">{todayRecord.checkOut}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className={`px-4 py-2 border-3 border-black shadow-brutal-sm font-bold uppercase text-sm ${
                            todayRecord.checkOut 
                                ? 'bg-neutral-200 text-neutral-800' 
                                : 'bg-secondary text-white'
                        }`}>
                            {todayRecord.checkOut ? 'Completed' : 'Active'}
                        </div>
                    </div>
                </Card>
            )}

            {/* Check In/Out Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card variant="elevated" className="bg-gradient-to-br from-green-50 to-white">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto border-4 border-black shadow-brutal">
                            <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold uppercase tracking-tight mb-2">
                                Start Your Shift
                            </h2>
                            <p className="text-sm text-neutral-600 font-medium">
                                {canCheckIn 
                                    ? 'Click below to check in for today' 
                                    : 'You have already checked in today'}
                            </p>
                        </div>
                        <Button 
                            onClick={handleCheckIn} 
                            variant="secondary"
                            size="lg"
                            fullWidth
                            disabled={!canCheckIn || checkingIn}
                            isLoading={checkingIn}
                        >
                            <CheckCircle className="w-5 h-5" />
                            Check In
                        </Button>
                    </div>
                </Card>

                <Card variant="elevated" className="bg-gradient-to-br from-red-50 to-white">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-accent-orange rounded-full flex items-center justify-center mx-auto border-4 border-black shadow-brutal">
                            <XCircle className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold uppercase tracking-tight mb-2">
                                End Your Shift
                            </h2>
                            <p className="text-sm text-neutral-600 font-medium">
                                {!todayRecord 
                                    ? 'Check in first to enable check out' 
                                    : canCheckOut 
                                        ? 'Click below to check out for today'
                                        : 'You have already checked out today'}
                            </p>
                        </div>
                        <Button 
                            onClick={handleCheckOut} 
                            variant="danger"
                            size="lg"
                            fullWidth
                            disabled={!canCheckOut || checkingOut}
                            isLoading={checkingOut}
                        >
                            <XCircle className="w-5 h-5" />
                            Check Out
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Attendance History */}
            <Card 
                title="Attendance History" 
                variant="elevated"
                action={
                    <div className="flex items-center gap-2 text-sm font-bold text-neutral-600">
                        <Calendar className="w-4 h-4" />
                        {history.length} Records
                    </div>
                }
            >
                {loading ? (
                    <LoadingSpinner size="md" text="Loading attendance history..." />
                ) : history.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-black">
                            <Clock className="w-10 h-10 text-neutral-400" />
                        </div>
                        <h3 className="text-xl font-bold text-neutral-900 mb-2 uppercase tracking-tight">
                            No Attendance Records
                        </h3>
                        <p className="text-neutral-600 font-medium">
                            Check in to start tracking your attendance
                        </p>
                    </div>
                ) : (
                    <Table
                        data={history}
                        keyField="id"
                        columns={[
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
                                            : 'bg-neutral-200 text-neutral-800'
                                    }`}>
                                        {row.status}
                                    </span>
                                )
                            }
                        ]}
                    />
                )}
            </Card>
        </div>
    );
}

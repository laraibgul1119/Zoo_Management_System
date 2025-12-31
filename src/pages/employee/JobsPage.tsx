import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { api } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { Job } from '../../types';
import { ClipboardList } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function JobsPage() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Assumption: user.id == employeeId as discussed
    const employeeId = user?.id || '';

    useEffect(() => {
        if (employeeId) fetchJobs();
    }, [employeeId]);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.getEmployeeJobs(employeeId);
            setJobs(data);
        } catch (error) {
            console.error('Failed to load jobs', error);
            setError('Failed to load jobs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, currentStatus: string) => {
        let newStatus = '';
        if (currentStatus === 'Pending') newStatus = 'In Progress';
        else if (currentStatus === 'In Progress') newStatus = 'Completed';
        else return; // Already completed

        try {
            await api.updateJobStatus(id, newStatus);
            fetchJobs();
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    const statusColor = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'In Progress': return 'bg-blue-100 text-blue-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6]">
            <main className="max-w-[1920px] mx-auto p-4 md:p-8">
                <h1 className="text-4xl font-black uppercase mb-6 flex items-center gap-3">
                    <ClipboardList className="w-10 h-10" /> My Jobs
                </h1>

                <Card>
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="text-lg font-bold">Loading jobs...</div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <div className="text-red-600 font-bold mb-4">{error}</div>
                            <Button onClick={fetchJobs}>Retry</Button>
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="text-center py-12">
                            <ClipboardList className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <div className="text-lg font-bold text-gray-600">No jobs assigned yet</div>
                        </div>
                    ) : (
                        <Table
                            data={jobs}
                            keyField="id"
                            columns={[
                                { header: 'Title', accessor: 'title' },
                                { header: 'Description', accessor: 'description' },
                                { header: 'Assigned Date', accessor: 'assignedDate' },
                                { header: 'Due Date', accessor: 'dueDate' },
                                {
                                    header: 'Status',
                                    accessor: (row) => (
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${statusColor(row.status)}`}>
                                            {row.status}
                                        </span>
                                    )
                                }
                            ]}
                            actions={(job: Job) => (
                                job.status !== 'Completed' && (
                                    <Button
                                        onClick={() => handleStatusUpdate(job.id, job.status)}
                                        className="text-xs py-1 px-2"
                                    >
                                        {job.status === 'Pending' ? 'Start' : 'Complete'}
                                    </Button>
                                )
                            )}
                        />
                    )}
                </Card>
            </main>
        </div>
    );
}

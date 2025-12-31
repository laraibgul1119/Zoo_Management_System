import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { api } from '../../utils/api';
import { Employee, Job } from '../../types';
import { Briefcase } from 'lucide-react';
import { Table } from '../../components/ui/Table';

export function JobManagementPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        employeeId: '',
        title: '',
        description: '',
        dueDate: ''
    });
    const [allJobs, setAllJobs] = useState<Job[]>([]);

    useEffect(() => {
        loadEmployees();
        loadAllJobs();
    }, []);

    const loadEmployees = async () => {
        try {
            const data = await api.getEmployees();
            setEmployees(data);
        } catch (error) {
            console.error(error);
        }
    };

    const loadAllJobs = async () => {
        try {
            const data = await api.getAllJobs();
            setAllJobs(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.assignJob({
                employee_id: formData.employeeId,
                title: formData.title,
                description: formData.description,
                due_date: formData.dueDate
            });
            setMessage('Job assigned successfully!');
            setFormData({ employeeId: '', title: '', description: '', dueDate: '' });
            loadAllJobs();
        } catch (error) {
            setMessage('Failed to assign job.');
        }
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6]">
            <main className="max-w-4xl mx-auto p-4 md:p-8">
                <h1 className="text-4xl font-black uppercase mb-6 flex items-center gap-3">
                    <Briefcase className="w-10 h-10" /> Assign Jobs
                </h1>

                {message && (
                    <div className="mb-4 p-4 bg-blue-100 text-blue-800 font-bold border-2 border-blue-800">
                        {message}
                    </div>
                )}

                <Card className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Select
                            label="Select Employee"
                            value={formData.employeeId}
                            onChange={e => setFormData({ ...formData, employeeId: e.target.value })}
                            options={[
                                { value: '', label: 'Select Employee' },
                                ...employees.map(e => ({ value: e.id, label: e.name }))
                            ]}
                            required
                        />
                        <Input
                            label="Job Title"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                        <Input
                            label="Description"
                            textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                        <Input
                            label="Due Date"
                            type="date"
                            value={formData.dueDate}
                            onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                            required
                        />
                        <Button type="submit" className="w-full">Assign Job</Button>
                    </form>
                </Card>

                <div className="mt-8">
                    <h2 className="text-2xl font-black uppercase mb-4">Assigned Jobs History</h2>
                    <Card>
                        <Table
                            data={allJobs}
                            keyField="id"
                            columns={[
                                { header: 'Title', accessor: 'title' },
                                { header: 'Assigned To', accessor: (row: any) => row.employeeName || row.employeeId },
                                { header: 'Status', accessor: 'status' },
                                { header: 'Due Date', accessor: 'dueDate' }
                            ]}
                        />
                    </Card>
                </div>
            </main>
        </div>
    );
}

import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { api } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { StockRequest } from '../../types';
import { Package, Plus } from 'lucide-react';

export function StockRequestPage() {
    const { user } = useAuth();
    const [requests, setRequests] = useState<StockRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        itemName: '',
        quantity: '',
        unit: '',
        reason: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    const employeeId = user?.id || '';

    useEffect(() => {
        if (employeeId) fetchRequests();
    }, [employeeId]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.getMyStockRequests(employeeId);
            setRequests(data);
        } catch (error) {
            console.error('Failed to load requests', error);
            setError('Failed to load stock requests. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createStockRequest({
                ...formData,
                employee_id: employeeId,
                quantity: Number(formData.quantity)
            });
            setMessage({ type: 'success', text: 'Request submitted successfully!' });
            setShowModal(false);
            setFormData({ itemName: '', quantity: '', unit: '', reason: '' });
            fetchRequests();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to submit request' });
        }
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6]">
            <main className="max-w-[1920px] mx-auto p-4 md:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-black uppercase flex items-center gap-3">
                        <Package className="w-10 h-10" /> Stock Requests
                    </h1>
                    <Button onClick={() => setShowModal(true)}>
                        <Plus className="w-5 h-5 mr-2" /> New Request
                    </Button>
                </div>

                {message.text && (
                    <div className={`mb-6 p-4 border-2 border-black font-bold ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message.text}
                    </div>
                )}

                <Card>
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="text-lg font-bold">Loading requests...</div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <div className="text-red-600 font-bold mb-4">{error}</div>
                            <Button onClick={fetchRequests}>Retry</Button>
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <div className="text-lg font-bold text-gray-600">No stock requests yet</div>
                            <p className="text-sm text-gray-500 mt-2">Click "New Request" to submit your first request</p>
                        </div>
                    ) : (
                        <Table
                            data={requests}
                            keyField="id"
                            columns={[
                                { header: 'Item Request', accessor: 'itemName' },
                                { header: 'Quantity', accessor: (row) => `${row.quantity} ${row.unit}` },
                                { header: 'Reason', accessor: 'reason' },
                                { header: 'Date', accessor: 'requestDate' },
                                {
                                    header: 'Status',
                                    accessor: (row) => (
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase 
                        ${row.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                row.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {row.status}
                                        </span>
                                    )
                                }
                            ]}
                        />
                    )}
                </Card>
            </main>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Request Stock">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Item Name"
                        value={formData.itemName}
                        onChange={e => setFormData({ ...formData, itemName: e.target.value })}
                        required
                    />
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Input
                                label="Quantity"
                                type="number"
                                value={formData.quantity}
                                onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <Input
                                label="Unit"
                                placeholder="kg, pcs, boxes"
                                value={formData.unit}
                                onChange={e => setFormData({ ...formData, unit: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <Input
                        label="Reason"
                        textarea
                        value={formData.reason}
                        onChange={e => setFormData({ ...formData, reason: e.target.value })}
                        required
                    />
                    <Button type="submit" className="w-full">Submit Request</Button>
                </form>
            </Modal>
        </div>
    );
}

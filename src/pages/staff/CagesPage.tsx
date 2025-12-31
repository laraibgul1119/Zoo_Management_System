import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { api } from '../../utils/api';
import { Cage } from '../../types';
import { Plus, Edit, MapPin } from 'lucide-react';

export function CagesPage() {
  const [cages, setCages] = useState<Cage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCage, setEditingCage] = useState<Cage | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    location: '',
    capacity: '',
    status: 'Active' as 'Active' | 'Maintenance' | 'Closed'
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchCages();
  }, []);

  const fetchCages = async () => {
    try {
      setLoading(true);
      const data = await api.getCages();
      setCages(data);
    } catch (error) {
      console.error('Error fetching cages:', error);
      setMessage({ type: 'error', text: 'Failed to load cages' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCage = () => {
    setEditingCage(null);
    setFormData({
      name: '',
      type: '',
      location: '',
      capacity: '',
      status: 'Active'
    });
    setShowCreateModal(true);
    setMessage({ type: '', text: '' });
  };

  const handleEditCage = (cage: Cage) => {
    setEditingCage(cage);
    setFormData({
      name: cage.name,
      type: cage.type,
      location: cage.location,
      capacity: cage.capacity.toString(),
      status: cage.status
    });
    setShowCreateModal(true);
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.type || !formData.location || !formData.capacity) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    const cageData: Partial<Cage> = {
      name: formData.name,
      type: formData.type,
      location: formData.location,
      capacity: parseInt(formData.capacity),
      status: formData.status,
      occupancy: editingCage ? editingCage.occupancy : 0
    };

    try {
      if (editingCage) {
        await api.updateCage(editingCage.id, cageData);
        setMessage({ type: 'success', text: 'Cage updated successfully!' });
      } else {
        const newCage = {
          ...cageData,
          id: `cage-${Date.now()}`
        };
        await api.createCage(newCage);
        setMessage({ type: 'success', text: 'Cage created successfully!' });
      }
      fetchCages();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error saving cage:', error);
      setMessage({ type: 'error', text: 'Failed to save cage' });
    }

    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingCage(null);
    setMessage({ type: '', text: '' });
  };

  if (loading) {
    return <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
      <div className="text-2xl font-black uppercase">Loading habitstats...</div>
    </div>;
  }

  return <div className="min-h-screen bg-[#F3F4F6]">
    <main className="max-w-[1920px] mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase mb-2">
            Habitat Management
          </h1>
          <p className="text-gray-600 font-bold">
            Monitor enclosure capacity and status
          </p>
        </div>
        <Button onClick={handleCreateCage}>
          <Plus className="w-5 h-5" /> Add New Cage
        </Button>
      </div>

      {/* Success/Error Message */}
      {message.text && (
        <div className={`mb-6 p-4 border-2 border-black font-bold ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {cages.map(cage => <Card key={cage.id} className="relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <Badge variant={cage.status === 'Active' ? 'success' : cage.status === 'Maintenance' ? 'warning' : 'danger'}>
              {cage.status}
            </Badge>
          </div>

          <h3 className="text-2xl font-black uppercase mb-2 pr-20">
            {cage.name}
          </h3>
          <div className="flex items-center gap-2 text-gray-600 font-bold mb-4">
            <MapPin className="w-4 h-4" /> {cage.location}
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-bold mb-1">
                <span>Occupancy</span>
                <span>
                  {cage.occupancy} / {cage.capacity}
                </span>
              </div>
              <div className="w-full bg-gray-200 h-4 border-2 border-black">
                <div className="h-full bg-[#2563EB]" style={{
                  width: `${cage.occupancy / cage.capacity * 100}%`
                }} />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t-2 border-gray-100">
              <span className="font-bold text-gray-500">{cage.type}</span>
              <Button variant="outline" className="px-4 py-2 text-sm" onClick={() => handleEditCage(cage)}>
                Manage
              </Button>
            </div>
          </div>
        </Card>)}
      </div>

      <Card title="All Enclosures">
        <Table data={cages} keyField="id" columns={[{
          header: 'Name',
          accessor: 'name'
        }, {
          header: 'Type',
          accessor: 'type'
        }, {
          header: 'Location',
          accessor: 'location'
        }, {
          header: 'Capacity',
          accessor: c => `${c.occupancy}/${c.capacity}`
        }, {
          header: 'Status',
          accessor: c => <Badge variant={c.status === 'Active' ? 'success' : 'warning'}>
            {c.status}
          </Badge>
        }]} actions={(cage: Cage) => <button onClick={() => handleEditCage(cage)} className="p-2 border-2 border-black hover:bg-gray-100">
          <Edit className="w-4 h-4" />
        </button>} />
      </Card>
    </main>

    <Modal
      isOpen={showCreateModal}
      onClose={closeModal}
      title={editingCage ? 'Edit Cage' : 'Create New Cage'}
    >
      {message.text && (
        <div className={`mb-4 p-3 border-2 border-black ${message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Cage Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Lion Habitat A"
          required
        />

        <Select
          label="Type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          options={[
            { value: '', label: 'Select Type' },
            { value: 'Mammal Enclosure', label: 'Mammal Enclosure' },
            { value: 'Bird Aviary', label: 'Bird Aviary' },
            { value: 'Reptile House', label: 'Reptile House' },
            { value: 'Aquatic Habitat', label: 'Aquatic Habitat' },
            { value: 'Primate Habitat', label: 'Primate Habitat' }
          ]}
          required
        />

        <Input
          label="Location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="North Wing, Section A"
          required
        />

        <Input
          label="Capacity"
          type="number"
          min="1"
          value={formData.capacity}
          onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
          placeholder="5"
          required
        />

        <Select
          label="Status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Maintenance' | 'Closed' })}
          options={[
            { value: 'Active', label: 'Active' },
            { value: 'Maintenance', label: 'Maintenance' },
            { value: 'Closed', label: 'Closed' }
          ]}
        />

        <button
          type="submit"
          className="w-full bg-[#10B981] text-black py-3 font-black border-2 border-black hover:bg-[#059669] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
        >
          {editingCage ? 'UPDATE CAGE' : 'CREATE CAGE'}
        </button>
      </form>
    </Modal>
  </div>;
}
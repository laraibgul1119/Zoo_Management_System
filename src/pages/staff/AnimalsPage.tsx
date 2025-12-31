import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { api } from '../../utils/api';
import { Animal, Cage } from '../../types';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
export function AnimalsPage() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [cages, setCages] = useState<Cage[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  const [viewingAnimal, setViewingAnimal] = useState<Animal | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    age: '',
    gender: 'Male' as 'Male' | 'Female',
    healthStatus: 'Healthy' as 'Healthy' | 'Sick' | 'Under Observation',
    cageId: '',
    notes: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [animalsData, cagesData] = await Promise.all([
        api.getAnimals(),
        api.getCages()
      ]);
      setAnimals(animalsData);
      setCages(cagesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage({ type: 'error', text: 'Failed to load data from server' });
    }
  };

  const filteredAnimals = (animals || []).filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.species.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateAnimal = () => {
    setEditingAnimal(null);
    setFormData({
      name: '',
      species: '',
      age: '',
      gender: 'Male',
      healthStatus: 'Healthy',
      cageId: '',
      notes: ''
    });
    setIsModalOpen(true);
    setMessage({ type: '', text: '' });
  };

  const handleEditAnimal = (animal: Animal) => {
    setEditingAnimal(animal);
    setFormData({
      name: animal.name,
      species: animal.species,
      age: animal.age.toString(),
      gender: animal.gender,
      healthStatus: animal.healthStatus,
      cageId: animal.cageId,
      notes: animal.notes || ''
    });
    setIsModalOpen(true);
    setMessage({ type: '', text: '' });
  };

  const handleViewAnimal = (animal: Animal) => {
    setViewingAnimal(animal);
    setIsViewModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.species || !formData.age) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    const animalData: Animal = {
      id: editingAnimal ? editingAnimal.id : `animal-${Date.now()}`,
      name: formData.name,
      species: formData.species,
      age: parseInt(formData.age),
      gender: formData.gender,
      healthStatus: formData.healthStatus,
      cageId: formData.cageId,
      notes: formData.notes
    };

    try {
      if (editingAnimal) {
        await api.updateAnimal(editingAnimal.id, animalData);
        setAnimals(animals.map(a => a.id === editingAnimal.id ? animalData : a));
        setMessage({ type: 'success', text: 'Animal updated successfully!' });
      } else {
        await api.createAnimal(animalData);
        setAnimals([...animals, animalData]);
        setMessage({ type: 'success', text: 'Animal added successfully!' });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving animal:', error);
      setMessage({ type: 'error', text: 'Failed to save animal' });
    }

    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this animal?')) {
      try {
        await api.deleteAnimal(id);
        setAnimals(prev => prev.filter(a => a.id !== id));
        setMessage({ type: 'success', text: 'Animal removed successfully!' });
      } catch (error) {
        console.error('Error deleting animal:', error);
        setMessage({ type: 'error', text: 'Failed to remove animal' });
      }
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };
  return <div className="min-h-screen bg-[#F3F4F6]">
    <main className="max-w-[1920px] mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase mb-2">
            Animal Management
          </h1>
          <p className="text-gray-600 font-bold">
            Track and manage all zoo inhabitants
          </p>
        </div>
        <Button onClick={handleCreateAnimal}>
          <Plus className="w-5 h-5" /> Add New Animal
        </Button>
      </div>

      {/* Success/Error Message */}
      {message.text && (
        <div className={`mb-6 p-4 border-2 border-black font-bold ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
          {message.text}
        </div>
      )}

      <Card>
        <div className="mb-6">
          <Input label="Search Animals" placeholder="Search by name or species..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>

        <Table data={filteredAnimals} keyField="id" columns={[{
          header: 'Name',
          accessor: 'name'
        }, {
          header: 'Species',
          accessor: 'species'
        }, {
          header: 'Age',
          accessor: a => `${a.age} yrs`
        }, {
          header: 'Gender',
          accessor: 'gender'
        }, {
          header: 'Health',
          accessor: a => <Badge variant={a.healthStatus === 'Healthy' ? 'success' : a.healthStatus === 'Sick' ? 'danger' : 'warning'}>
            {a.healthStatus}
          </Badge>
        }, {
          header: 'Cage',
          accessor: a => cages.find(c => c.id === a.cageId)?.name || 'Unassigned'
        }]} actions={(animal: Animal) => <div className="flex gap-2 justify-end">
          <button
            onClick={() => handleViewAnimal(animal)}
            className="p-2 border-2 border-black hover:bg-gray-100"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={() => handleEditAnimal(animal)} className="p-2 border-2 border-black hover:bg-blue-50 text-blue-600" title="Edit">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-2 border-2 border-black hover:bg-red-50 text-red-600" title="Delete" onClick={() => handleDelete(animal.id)}>
            <Trash2 className="w-4 h-4" />
          </button>
        </div>} />
      </Card>
    </main>

    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingAnimal ? "Edit Animal" : "Add New Animal"}>
      {message.text && (
        <div className={`mb-4 p-3 border-2 border-black ${message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          placeholder="e.g. Simba"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Species"
            placeholder="e.g. Lion"
            value={formData.species}
            onChange={(e) => setFormData({ ...formData, species: e.target.value })}
            required
          />
          <Input
            label="Age"
            type="number"
            placeholder="e.g. 5"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Gender"
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' })}
            options={[
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' }
            ]}
          />
          <Select
            label="Health Status"
            value={formData.healthStatus}
            onChange={(e) => setFormData({ ...formData, healthStatus: e.target.value as 'Healthy' | 'Sick' | 'Under Observation' })}
            options={[
              { value: 'Healthy', label: 'Healthy' },
              { value: 'Sick', label: 'Sick' },
              { value: 'Under Observation', label: 'Under Observation' }
            ]}
          />
        </div>
        <Select
          label="Assign Cage"
          value={formData.cageId}
          onChange={(e) => setFormData({ ...formData, cageId: e.target.value })}
          options={[
            { value: '', label: 'Select a cage...' },
            ...cages.map(c => ({
              value: c.id,
              label: `${c.name} (${c.occupancy}/${c.capacity})`
            }))
          ]}
        />
        <Input
          label="Notes"
          textarea
          placeholder="Any special requirements or history..."
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />

        <div className="flex justify-end gap-4 mt-8">
          <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button type="submit">{editingAnimal ? 'Update Animal' : 'Save Animal'}</Button>
        </div>
      </form>
    </Modal>

    {/* View Animal Modal */}
    <Modal
      isOpen={isViewModalOpen}
      onClose={() => setIsViewModalOpen(false)}
      title="Animal Details"
    >
      {viewingAnimal && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
              <p className="p-3 bg-gray-50 border-2 border-black font-bold">{viewingAnimal.name}</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Species</label>
              <p className="p-3 bg-gray-50 border-2 border-black font-bold">{viewingAnimal.species}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Age</label>
              <p className="p-3 bg-gray-50 border-2 border-black font-bold">{viewingAnimal.age} years</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Gender</label>
              <p className="p-3 bg-gray-50 border-2 border-black font-bold">{viewingAnimal.gender}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Health Status</label>
            <div className="p-3 bg-gray-50 border-2 border-black">
              <Badge
                variant={
                  viewingAnimal.healthStatus === 'Healthy' ? 'success' :
                    viewingAnimal.healthStatus === 'Sick' ? 'danger' :
                      'warning'
                }
              >
                {viewingAnimal.healthStatus}
              </Badge>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Assigned Cage</label>
            <p className="p-3 bg-gray-50 border-2 border-black font-bold">
              {cages.find(c => c.id === viewingAnimal.cageId)?.name || 'Unassigned'}
            </p>
          </div>

          {viewingAnimal.notes && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Notes</label>
              <p className="p-3 bg-gray-50 border-2 border-black">{viewingAnimal.notes}</p>
            </div>
          )}

          <div className="flex justify-end gap-4 mt-8">
            <Button type="button" variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            <Button type="button" onClick={() => {
              setIsViewModalOpen(false);
              handleEditAnimal(viewingAnimal);
            }}>
              Edit Animal
            </Button>
          </div>
        </div>
      )}
    </Modal>
  </div>;
}
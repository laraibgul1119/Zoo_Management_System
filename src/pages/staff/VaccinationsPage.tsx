import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { api } from '../../utils/api';
import { Vaccination, Animal, Doctor } from '../../types';
import { Plus, Syringe } from 'lucide-react';

export function VaccinationsPage() {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingVaccination, setEditingVaccination] = useState<Vaccination | null>(null);
  const [formData, setFormData] = useState({
    animalId: '',
    vaccineName: '',
    dateAdministered: '',
    nextDueDate: '',
    veterinarian: '',
    notes: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [vaccinationsData, animalsData, doctorsData] = await Promise.all([
        api.getVaccinations(),
        api.getAnimals(),
        api.getDoctors()
      ]);
      setVaccinations(vaccinationsData);
      setAnimals(animalsData);
      setDoctors(doctorsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage({ type: 'error', text: 'Failed to load vaccinations data' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVaccination = () => {
    setEditingVaccination(null);
    setFormData({
      animalId: '',
      vaccineName: '',
      dateAdministered: new Date().toISOString().split('T')[0],
      nextDueDate: '',
      veterinarian: '',
      notes: ''
    });
    setShowCreateModal(true);
    setMessage({ type: '', text: '' });
  };

  const handleEditVaccination = (vaccination: Vaccination) => {
    setEditingVaccination(vaccination);
    setFormData({
      animalId: vaccination.animalId,
      vaccineName: vaccination.vaccineName,
      dateAdministered: vaccination.dateAdministered,
      nextDueDate: vaccination.nextDueDate || '',
      veterinarian: vaccination.veterinarian,
      notes: vaccination.notes || ''
    });
    setShowCreateModal(true);
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.animalId || !formData.vaccineName || !formData.dateAdministered || !formData.veterinarian) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    const vaccinationData: Partial<Vaccination> = {
      animalId: formData.animalId,
      vaccineName: formData.vaccineName,
      dateAdministered: formData.dateAdministered,
      nextDueDate: formData.nextDueDate,
      veterinarian: formData.veterinarian,
      notes: formData.notes
    };

    try {
      if (editingVaccination) {
        await api.updateVaccination(editingVaccination.id, vaccinationData);
        setMessage({ type: 'success', text: 'Vaccination record updated successfully!' });
      } else {
        const newVaccination = {
          ...vaccinationData,
          id: `vacc-${Date.now()}`
        };
        await api.createVaccination(newVaccination);
        setMessage({ type: 'success', text: 'Vaccination recorded successfully!' });
      }
      fetchData();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error saving vaccination:', error);
      setMessage({ type: 'error', text: 'Failed to save vaccination' });
    }

    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingVaccination(null);
    setMessage({ type: '', text: '' });
  };

  const getAnimalName = (id: string) => animals.find(a => a.id === id)?.name || 'Unknown';

  if (loading) {
    return <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
      <div className="text-2xl font-black uppercase">Loading vaccinations...</div>
    </div>;
  }

  return <div className="min-h-screen bg-[#F3F4F6]">
    <main className="max-w-[1920px] mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase mb-2">
            Vaccination Records
          </h1>
          <p className="text-gray-600 font-bold">
            Track immunization history and schedules
          </p>
        </div>
        <Button onClick={handleCreateVaccination}>
          <Plus className="w-5 h-5" /> Record Vaccination
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
        <Table data={vaccinations} keyField="id" columns={[{
          header: 'Animal',
          accessor: v => getAnimalName(v.animalId)
        }, {
          header: 'Vaccine',
          accessor: 'vaccineName'
        }, {
          header: 'Date Administered',
          accessor: 'dateAdministered'
        }, {
          header: 'Next Due',
          accessor: 'nextDueDate'
        }, {
          header: 'Veterinarian',
          accessor: 'veterinarian'
        }]} actions={(vaccination: Vaccination) => <button onClick={() => handleEditVaccination(vaccination)} className="p-2 border-2 border-black hover:bg-gray-100">
          <Syringe className="w-4 h-4" />
        </button>} />
      </Card>
    </main>

    <Modal
      isOpen={showCreateModal}
      onClose={closeModal}
      title={editingVaccination ? 'Edit Vaccination' : 'Record Vaccination'}
    >
      {message.text && (
        <div className={`mb-4 p-3 border-2 border-black ${message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Animal"
          value={formData.animalId}
          onChange={(e) => setFormData({ ...formData, animalId: e.target.value })}
          options={[
            { value: '', label: 'Select Animal' },
            ...animals.map(animal => ({
              value: animal.id,
              label: `${animal.name} (${animal.species})`
            }))
          ]}
          required
        />

        <Select
          label="Vaccine Name"
          value={formData.vaccineName}
          onChange={(e) => setFormData({ ...formData, vaccineName: e.target.value })}
          options={[
            { value: '', label: 'Select Vaccine' },
            { value: 'Rabies', label: 'Rabies' },
            { value: 'FVRCP', label: 'FVRCP (Feline)' },
            { value: 'Distemper', label: 'Distemper' },
            { value: 'Hepatitis', label: 'Hepatitis' },
            { value: 'Parvovirus', label: 'Parvovirus' },
            { value: 'Bordetella', label: 'Bordetella' },
            { value: 'West Nile Virus', label: 'West Nile Virus' },
            { value: 'Other', label: 'Other' }
          ]}
          required
        />

        <Input
          label="Date Administered"
          type="date"
          value={formData.dateAdministered}
          onChange={(e) => setFormData({ ...formData, dateAdministered: e.target.value })}
          required
        />

        <Input
          label="Next Due Date"
          type="date"
          value={formData.nextDueDate}
          onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
        />

        <Select
          label="Veterinarian"
          value={formData.veterinarian}
          onChange={(e) => setFormData({ ...formData, veterinarian: e.target.value })}
          options={[
            { value: '', label: 'Select Veterinarian' },
            ...doctors.map(doctor => ({
              value: doctor.name,
              label: `Dr. ${doctor.name} (${doctor.specialization})`
            }))
          ]}
          required
        />

        <Input
          label="Notes"
          textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes about the vaccination..."
        />

        <button
          type="submit"
          className="w-full bg-[#10B981] text-black py-3 font-black border-2 border-black hover:bg-[#059669] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
        >
          {editingVaccination ? 'UPDATE VACCINATION' : 'RECORD VACCINATION'}
        </button>
      </form>
    </Modal>
  </div>;
}
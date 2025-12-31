import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { api } from '../../utils/api';
import { MedicalCheck, Animal, Doctor } from '../../types';
import { Plus, FileText } from 'lucide-react';

export function MedicalChecksPage() {
  const [checks, setChecks] = useState<MedicalCheck[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCheck, setEditingCheck] = useState<MedicalCheck | null>(null);
  const [formData, setFormData] = useState({
    animalId: '',
    doctorId: '',
    date: '',
    diagnosis: '',
    treatment: '',
    status: 'Scheduled' as 'Scheduled' | 'Completed',
    notes: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [checksData, animalsData, doctorsData] = await Promise.all([
        api.getMedicalChecks(),
        api.getAnimals(),
        api.getDoctors()
      ]);
      setChecks(checksData);
      setAnimals(animalsData);
      setDoctors(doctorsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage({ type: 'error', text: 'Failed to load medical checks data' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCheck = () => {
    setEditingCheck(null);
    setFormData({
      animalId: '',
      doctorId: '',
      date: new Date().toISOString().split('T')[0],
      diagnosis: '',
      treatment: '',
      status: 'Scheduled',
      notes: ''
    });
    setShowCreateModal(true);
    setMessage({ type: '', text: '' });
  };

  const handleEditCheck = (check: MedicalCheck) => {
    setEditingCheck(check);
    setFormData({
      animalId: check.animalId,
      doctorId: check.doctorId,
      date: check.date,
      diagnosis: check.diagnosis,
      treatment: check.treatment,
      status: check.status,
      notes: check.notes || ''
    });
    setShowCreateModal(true);
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.animalId || !formData.doctorId || !formData.date) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    const checkData: any = {
      animalId: formData.animalId,
      doctorId: formData.doctorId,
      date: formData.date,
      diagnosis: formData.diagnosis,
      treatment: formData.treatment,
      status: formData.status,
      notes: formData.notes
    };

    try {
      if (editingCheck) {
        await api.updateMedicalCheck(editingCheck.id, checkData);
        setMessage({ type: 'success', text: 'Medical check updated successfully!' });
      } else {
        const newCheck = {
          ...checkData,
          id: `check-${Date.now()}`
        };
        await api.createMedicalCheck(newCheck);
        setMessage({ type: 'success', text: 'Medical check scheduled successfully!' });
      }
      fetchData();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error saving medical check:', error);
      setMessage({ type: 'error', text: 'Failed to save medical check' });
    }

    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingCheck(null);
    setMessage({ type: '', text: '' });
  };

  const getAnimalName = (id: string) => animals.find(a => a.id === id)?.name || 'Unknown';
  const getDoctorName = (id: string) => doctors.find(d => d.id === id)?.name || 'Unknown';

  if (loading) {
    return <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
      <div className="text-2xl font-black uppercase">Loading medical checks...</div>
    </div>;
  }

  return <div className="min-h-screen bg-[#F3F4F6]">
    <main className="max-w-[1920px] mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase mb-2">
            Medical Checks
          </h1>
          <p className="text-gray-600 font-bold">
            Schedule and review health inspections
          </p>
        </div>
        <Button onClick={handleCreateCheck}>
          <Plus className="w-5 h-5" /> Schedule Check
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
        <Table data={checks} keyField="id" columns={[{
          header: 'Date',
          accessor: 'date'
        }, {
          header: 'Animal',
          accessor: c => getAnimalName(c.animalId)
        }, {
          header: 'Doctor',
          accessor: c => getDoctorName(c.doctorId)
        }, {
          header: 'Diagnosis',
          accessor: 'diagnosis'
        }, {
          header: 'Treatment',
          accessor: 'treatment'
        }, {
          header: 'Status',
          accessor: c => <Badge variant={c.status === 'Completed' ? 'success' : 'warning'}>
            {c.status}
          </Badge>
        }]} actions={(check: MedicalCheck) => <button onClick={() => handleEditCheck(check)} className="p-2 border-2 border-black hover:bg-gray-100">
          <FileText className="w-4 h-4" />
        </button>} />
      </Card>
    </main>

    <Modal
      isOpen={showCreateModal}
      onClose={closeModal}
      title={editingCheck ? 'Edit Medical Check' : 'Schedule Medical Check'}
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
          label="Doctor"
          value={formData.doctorId}
          onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
          options={[
            { value: '', label: 'Select Doctor' },
            ...doctors.map(doctor => ({
              value: doctor.id,
              label: `${doctor.name} - ${doctor.specialization}`
            }))
          ]}
          required
        />

        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />

        <Input
          label="Diagnosis"
          value={formData.diagnosis}
          onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
          placeholder="Enter diagnosis..."
        />

        <Input
          label="Treatment"
          textarea
          value={formData.treatment}
          onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
          placeholder="Treatment plan and medications..."
        />

        <Select
          label="Status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Scheduled' | 'Completed' })}
          options={[
            { value: 'Scheduled', label: 'Scheduled' },
            { value: 'Completed', label: 'Completed' }
          ]}
        />

        <Input
          label="Notes"
          textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes..."
        />

        <button
          type="submit"
          className="w-full bg-[#10B981] text-black py-3 font-black border-2 border-black hover:bg-[#059669] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
        >
          {editingCheck ? 'UPDATE CHECK' : 'SCHEDULE CHECK'}
        </button>
      </form>
    </Modal>
  </div>;
}
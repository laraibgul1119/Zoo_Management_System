import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { api } from '../../utils/api';
import { Doctor } from '../../types';
import { Plus, Edit, Phone, Mail } from 'lucide-react';

export function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    email: '',
    phone: '',
    availability: 'Available' as 'Available' | 'On Call' | 'Busy',
    experience: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await api.getDoctors();
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setMessage({ type: 'error', text: 'Failed to load doctors' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDoctor = () => {
    setEditingDoctor(null);
    setFormData({
      name: '',
      specialization: '',
      email: '',
      phone: '',
      availability: 'Available',
      experience: ''
    });
    setShowCreateModal(true);
    setMessage({ type: '', text: '' });
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialization: doctor.specialization,
      email: doctor.email,
      phone: doctor.phone,
      availability: doctor.availability,
      experience: doctor.experience || ''
    });
    setShowCreateModal(true);
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.specialization || !formData.email || !formData.phone) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    const doctorData: Partial<Doctor> = {
      name: formData.name,
      specialization: formData.specialization,
      email: formData.email,
      phone: formData.phone,
      availability: formData.availability,
      experience: formData.experience
    };

    try {
      if (editingDoctor) {
        await api.updateDoctor(editingDoctor.id, doctorData);
        setMessage({ type: 'success', text: 'Doctor updated successfully!' });
      } else {
        const newDoctor = {
          ...doctorData,
          id: `doc-${Date.now()}`
        };
        await api.createDoctor(newDoctor);
        setMessage({ type: 'success', text: 'Doctor added successfully!' });
      }
      fetchDoctors();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error saving doctor:', error);
      setMessage({ type: 'error', text: 'Failed to save doctor' });
    }

    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingDoctor(null);
    setMessage({ type: '', text: '' });
  };

  if (loading) {
    return <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
      <div className="text-2xl font-black uppercase">Loading staff...</div>
    </div>;
  }

  return <div className="min-h-screen bg-[#F3F4F6]">
    <main className="max-w-[1920px] mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase mb-2">
            Medical Staff
          </h1>
          <p className="text-gray-600 font-bold">
            Manage veterinarians and specialists
          </p>
        </div>
        <Button onClick={handleCreateDoctor}>
          <Plus className="w-5 h-5" /> Add New Doctor
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
        <Table data={doctors} keyField="id" columns={[{
          header: 'Name',
          accessor: 'name'
        }, {
          header: 'Specialization',
          accessor: 'specialization'
        }, {
          header: 'Contact',
          accessor: d => <div className="flex flex-col gap-1 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-3 h-3" /> {d.email}
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3 h-3" /> {d.phone}
            </div>
          </div>
        }, {
          header: 'Availability',
          accessor: d => <Badge variant={d.availability === 'Available' ? 'success' : d.availability === 'On Call' ? 'warning' : 'neutral'}>
            {d.availability}
          </Badge>
        }]} actions={(doctor: Doctor) => <button onClick={() => handleEditDoctor(doctor)} className="p-2 border-2 border-black hover:bg-gray-100">
          <Edit className="w-4 h-4" />
        </button>} />
      </Card>
    </main>

    <Modal
      isOpen={showCreateModal}
      onClose={closeModal}
      title={editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
    >
      {message.text && (
        <div className={`mb-4 p-3 border-2 border-black ${message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Dr. Jane Smith"
          required
        />

        <Select
          label="Specialization"
          value={formData.specialization}
          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
          options={[
            { value: '', label: 'Select Specialization' },
            { value: 'General Veterinarian', label: 'General Veterinarian' },
            { value: 'Wildlife Medicine', label: 'Wildlife Medicine' },
            { value: 'Exotic Animal Medicine', label: 'Exotic Animal Medicine' },
            { value: 'Surgery', label: 'Surgery' },
            { value: 'Pathology', label: 'Pathology' },
            { value: 'Nutrition', label: 'Nutrition' },
            { value: 'Reproduction', label: 'Reproduction' }
          ]}
          required
        />

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="doctor@zoo.com"
          required
        />

        <Input
          label="Phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="(555) 123-4567"
          required
        />

        <Select
          label="Availability"
          value={formData.availability}
          onChange={(e) => setFormData({ ...formData, availability: e.target.value as 'Available' | 'On Call' | 'Busy' })}
          options={[
            { value: 'Available', label: 'Available' },
            { value: 'On Call', label: 'On Call' },
            { value: 'Busy', label: 'Busy' }
          ]}
        />

        <Input
          label="Experience"
          textarea
          value={formData.experience}
          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
          placeholder="Years of experience and notable achievements..."
        />

        <button
          type="submit"
          className="w-full bg-[#10B981] text-black py-3 font-black border-2 border-black hover:bg-[#059669] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
        >
          {editingDoctor ? 'UPDATE DOCTOR' : 'ADD DOCTOR'}
        </button>
      </form>
    </Modal>
  </div>;
}
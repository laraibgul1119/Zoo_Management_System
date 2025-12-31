import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { api } from '../../utils/api';
import { Employee } from '../../types';
import { Check, Plus, Edit, Mail, Phone } from 'lucide-react';

export function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    joinDate: '',
    status: 'Active' as 'Active' | 'Inactive' | 'Pending'
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await api.getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setMessage({ type: 'error', text: 'Failed to load employees' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = () => {
    setEditingEmployee(null);
    setFormData({
      name: '',
      role: '',
      email: '',
      phone: '',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    });
    setShowCreateModal(true);
    setMessage({ type: '', text: '' });
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      role: employee.role,
      email: employee.email,
      phone: employee.phone,
      joinDate: employee.joinDate,
      status: employee.status
    });
    setShowCreateModal(true);
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.role || !formData.email || !formData.phone) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    const employeeData: Partial<Employee> = {
      name: formData.name,
      role: formData.role,
      email: formData.email,
      phone: formData.phone,
      joinDate: formData.joinDate,
      status: formData.status
    };

    try {
      if (editingEmployee) {
        await api.updateEmployee(editingEmployee.id, employeeData);
        setMessage({ type: 'success', text: 'Employee updated successfully!' });
      } else {
        const newEmployee = {
          ...employeeData,
          id: `emp-${Date.now()}`
        };
        await api.createEmployee(newEmployee);
        setMessage({ 
          type: 'success', 
          text: `Employee added successfully! Login credentials - Email: ${formData.email}, Password: emp123` 
        });
      }
      fetchEmployees();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error saving employee:', error);
      setMessage({ type: 'error', text: 'Failed to save employee' });
    }

    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleApproveEmployee = async (employee: Employee) => {
    try {
      await api.updateEmployee(employee.id, { ...employee, status: 'Active' });
      setMessage({ type: 'success', text: `${employee.name} has been approved!` });
      fetchEmployees();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error approving employee:', error);
      setMessage({ type: 'error', text: 'Failed to approve employee' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingEmployee(null);
    setMessage({ type: '', text: '' });
  };

  if (loading) {
    return <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
      <div className="text-2xl font-black uppercase">Loading employees...</div>
    </div>;
  }

  return <div className="min-h-screen bg-[#F3F4F6]">
    <main className="max-w-[1920px] mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase mb-2">
            Employee Directory
          </h1>
          <p className="text-gray-600 font-bold">
            Manage staff roles and contact info
          </p>
        </div>
        <Button onClick={handleCreateEmployee}>
          <Plus className="w-5 h-5" /> Add Employee
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
        <Table data={employees} keyField="id" columns={[{
          header: 'Name',
          accessor: 'name'
        }, {
          header: 'Role',
          accessor: 'role'
        }, {
          header: 'Contact',
          accessor: e => <div className="flex flex-col gap-1 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-3 h-3" /> {e.email}
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3 h-3" /> {e.phone}
            </div>
          </div>
        }, {
          header: 'Join Date',
          accessor: 'joinDate'
        }, {
          header: 'Status',
          accessor: e => <Badge variant={e.status === 'Active' ? 'success' : 'neutral'}>
            {e.status}
          </Badge>
        }]} actions={(employee: Employee) => (
          <div className="flex gap-2">
            {employee.status === 'Pending' && (
              <button
                onClick={() => handleApproveEmployee(employee)}
                className="p-2 border-2 border-black bg-green-100 hover:bg-green-200"
                title="Approve"
              >
                <Check className="w-4 h-4 text-green-700" />
              </button>
            )}
            <button onClick={() => handleEditEmployee(employee)} className="p-2 border-2 border-black hover:bg-gray-100" title="Edit">
              <Edit className="w-4 h-4" />
            </button>
          </div>
        )} />
      </Card>
    </main>

    <Modal
      isOpen={showCreateModal}
      onClose={closeModal}
      title={editingEmployee ? 'Edit Employee' : 'Add New Employee'}
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
          placeholder="John Doe"
          required
        />

        <Select
          label="Role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          options={[
            { value: '', label: 'Select Role' },
            { value: 'Zookeeper', label: 'Zookeeper' },
            { value: 'Veterinarian', label: 'Veterinarian' },
            { value: 'Manager', label: 'Manager' },
            { value: 'Security', label: 'Security' },
            { value: 'Maintenance', label: 'Maintenance' },
            { value: 'Tour Guide', label: 'Tour Guide' },
            { value: 'Admin', label: 'Admin' }
          ]}
          required
        />

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="john@zootopia.com"
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

        <Input
          label="Join Date"
          type="date"
          value={formData.joinDate}
          onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
        />

        <Select
          label="Status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
          options={[
            { value: 'Active', label: 'Active' },
            { value: 'Inactive', label: 'Inactive' }
          ]}
        />

        {!editingEmployee && (
          <div className="bg-blue-50 border-2 border-blue-500 p-4 rounded">
            <p className="text-sm font-bold text-blue-800">
              ℹ️ A user account will be automatically created with:
            </p>
            <p className="text-sm text-blue-700 mt-1">
              • Email: {formData.email || '(enter email above)'}
            </p>
            <p className="text-sm text-blue-700">
              • Password: <span className="font-bold">emp123</span>
            </p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-[#10B981] text-black py-3 font-black border-2 border-black hover:bg-[#059669] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
        >
          {editingEmployee ? 'UPDATE EMPLOYEE' : 'ADD EMPLOYEE'}
        </button>
      </form>
    </Modal>
  </div>;
}
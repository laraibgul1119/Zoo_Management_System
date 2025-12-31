import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';
import { Employee } from '../../types';
import { User, Phone, Mail, Calendar, Briefcase, Edit2, Save, X } from 'lucide-react';

export function ProfilePage() {
    const { user } = useAuth();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ phone: '', email: '' });

    useEffect(() => {
        if (user?.id) {
            loadProfile();
        }
    }, [user]);

    const loadProfile = async () => {
        try {
            const data = await api.getEmployee(user!.id);
            setEmployee(data);
            setFormData({ phone: data.phone, email: data.email });
        } catch (e) {
            console.error(e);
        }
    };

    const handleSave = async () => {
        try {
            await api.updateEmployeeProfile(employee!.id, formData);
            setEmployee({ ...employee!, ...formData });
            setIsEditing(false);
        } catch (e) {
            alert('Failed to update profile');
        }
    };

    if (!employee) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-[#F3F4F6]">
            <main className="max-w-4xl mx-auto p-4 md:p-8">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-4xl font-black uppercase">My Profile</h1>
                    {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)}>
                            <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white">
                                <Save className="w-4 h-4 mr-2" /> Save
                            </Button>
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                                <X className="w-4 h-4 mr-2" /> Cancel
                            </Button>
                        </div>
                    )}
                </div>

                <Card className="bg-white p-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center border-4 border-black">
                            <User className="w-16 h-16 text-gray-500" />
                        </div>
                        <div className="flex-1 space-y-4 w-full">
                            <div>
                                <h2 className="text-2xl font-black">{employee.name}</h2>
                                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold uppercase mt-1">
                                    {employee.role}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded">
                                    <Mail className="text-gray-500" />
                                    <div className="w-full">
                                        <p className="text-xs text-gray-500 font-bold uppercase">Email</p>
                                        {isEditing ? (
                                            <Input label="" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                        ) : (
                                            <p className="font-medium">{employee.email}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded">
                                    <Phone className="text-gray-500" />
                                    <div className="w-full">
                                        <p className="text-xs text-gray-500 font-bold uppercase">Phone</p>
                                        {isEditing ? (
                                            <Input label="" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                        ) : (
                                            <p className="font-medium">{employee.phone}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded">
                                    <Calendar className="text-gray-500" />
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase">Join Date</p>
                                        <p className="font-medium">{employee.joinDate}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded">
                                    <Briefcase className="text-gray-500" />
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase">Status</p>
                                        <p className="font-medium">{employee.status}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </main>
        </div>
    );
}

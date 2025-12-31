import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import { AnimalShape } from '../../components/AnimalShape';
import { api } from '../../utils/api';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'visitor'
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.register(formData);
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      alert('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-[#FBBF24] flex items-center justify-center p-4 relative overflow-hidden">
    <AnimalShape type="elephant" className="absolute top-10 left-10 w-64 h-64 text-white opacity-20 -rotate-12" />
    <AnimalShape type="giraffe" className="absolute bottom-10 right-10 w-64 h-64 text-white opacity-20 rotate-12" />

    <div className="w-full max-w-md relative z-10">
      <div className="text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-4 border-black group-hover:scale-110 transition-transform overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <img src="/logo.png" alt="Zootopia Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-4xl font-black tracking-tighter uppercase text-black">
            Zootopia
          </span>
        </Link>
        <h1 className="text-3xl font-black text-black uppercase mb-2">
          Join the Wild
        </h1>
        <p className="font-bold text-black/70">
          Create your visitor account today
        </p>
      </div>

      <Card className="shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <form onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            label="Phone Number"
            type="tel"
            placeholder="(555) 000-0000"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <Select
            label="Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
            options={[
              { value: 'visitor', label: 'Visitor' },
              { value: 'employee', label: 'Employee' },
              { value: 'admin', label: 'Admin' }
            ]}
            required
          />

          <Button type="submit" fullWidth isLoading={isLoading} className="mt-6">
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center border-t-4 border-black border-dashed pt-6">
          <p className="font-bold">
            Already have an account?{' '}
            <Link to="/login" className="text-[#2563EB] hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  </div>;
}
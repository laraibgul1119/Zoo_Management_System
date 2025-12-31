import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { AnimalShape } from '../../components/AnimalShape';
import { api } from '../../utils/api';
export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {
    login
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userData = await api.login({ email, password });

      if (userData.role === 'admin' || userData.role === 'employee') {
        login(userData);
        navigate(from, { replace: true });
      } else {
        alert('Access Denied: Only staff members can access the dashboard.');
      }
    } catch (error) {
      alert('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-[#2563EB] flex items-center justify-center p-4 relative overflow-hidden">
    <AnimalShape type="lion" className="absolute top-10 right-10 w-64 h-64 text-white opacity-20 rotate-12" />
    <AnimalShape type="penguin" className="absolute bottom-10 left-10 w-64 h-64 text-white opacity-20 -rotate-12" />

    <div className="w-full max-w-md relative z-10">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-4 border-black mx-auto mb-4 overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <img src="/logo.png" alt="Zootopia Logo" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-3xl font-black text-white uppercase mb-2">
          Staff Access
        </h1>
        <p className="font-bold text-white/80">
          Secure login for zoo personnel
        </p>
      </div>

      <Card className="shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <form onSubmit={handleSubmit}>
          <Input label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="staff@zootopia.com" required />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />

          <Button type="submit" fullWidth isLoading={isLoading} className="mt-6">
            Access Dashboard
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 font-bold">
          <p>Demo Credentials:</p>
          <p>Any email / Any password</p>
        </div>
      </Card>
    </div>
  </div>;
}

import { Card } from '../../components/ui/Card';
import { Link } from 'react-router-dom';
import { ClipboardList, Clock, Package, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function EmployeeDashboard() {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Welcome, {user?.name}</h2>
                <p className="text-gray-600">Access your employee tools and information below.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link to="/employee/attendance">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                        <div className="flex flex-col items-center text-center p-6">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 border-2 border-blue-200">
                                <Clock className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Attendance</h3>
                            <p className="text-gray-600">Check in/out and view history</p>
                        </div>
                    </Card>
                </Link>

                <Link to="/employee/jobs">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                        <div className="flex flex-col items-center text-center p-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 border-2 border-green-200">
                                <ClipboardList className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">My Jobs</h3>
                            <p className="text-gray-600">View assigned tasks and status</p>
                        </div>
                    </Card>
                </Link>

                <Link to="/employee/stock-requests">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                        <div className="flex flex-col items-center text-center p-6">
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4 border-2 border-yellow-200">
                                <Package className="w-8 h-8 text-yellow-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Stock Requests</h3>
                            <p className="text-gray-600">Request supplies and materials</p>
                        </div>
                    </Card>
                </Link>

                <Link to="/employee/profile">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                        <div className="flex flex-col items-center text-center p-6">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 border-2 border-purple-200">
                                <User className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">My Profile</h3>
                            <p className="text-gray-600">View personal information</p>
                        </div>
                    </Card>
                </Link>
            </div>
        </div>
    );
}

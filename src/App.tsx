
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './components/ui/AdminLayout';
import { LandingPage } from './pages/LandingPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { TicketPurchasePage } from './pages/public/TicketPurchasePage';
import { EventsPage } from './pages/public/EventsPage';
import { LoginPage } from './pages/staff/LoginPage';
import { DashboardPage } from './pages/staff/DashboardPage';
import { AnimalsPage } from './pages/staff/AnimalsPage';
import { CagesPage } from './pages/staff/CagesPage';
import { DoctorsPage } from './pages/staff/DoctorsPage';
import { MedicalChecksPage } from './pages/staff/MedicalChecksPage';
import { VaccinationsPage } from './pages/staff/VaccinationsPage';
import { EmployeesPage } from './pages/staff/EmployeesPage';
import { SalariesPage } from './pages/staff/SalariesPage';
import { InventoryPage } from './pages/staff/InventoryPage';
import { JobManagementPage } from './pages/staff/JobManagementPage';
import { AttendanceManagementPage } from './pages/staff/AttendanceManagementPage';
import { TicketSalesPage } from './pages/staff/TicketSalesPage';
import { EventManagementPage } from './pages/staff/EventManagementPage';
import { VisitorsPage } from './pages/staff/VisitorsPage';
import { AnalyticsPage } from './pages/staff/AnalyticsPage';
import { EmployeeDashboard } from './pages/employee/EmployeeDashboard';
import { AttendancePage } from './pages/employee/AttendancePage';
import { JobsPage } from './pages/employee/JobsPage';
import { StockRequestPage } from './pages/employee/StockRequestPage';
import { ProfilePage } from './pages/employee/ProfilePage';
import { EmployeeRoute } from './components/EmployeeRoute';

export function App() {
  return <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/tickets" element={<TicketPurchasePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Staff Routes */}
        <Route path="/dashboard" element={<ProtectedRoute>
          <AdminLayout>
            <DashboardPage />
          </AdminLayout>
        </ProtectedRoute>} />
        <Route path="/dashboard/stats" element={<ProtectedRoute>
          <AdminLayout>
            <AnalyticsPage />
          </AdminLayout>
        </ProtectedRoute>} />
        <Route path="/animals" element={<ProtectedRoute>
          <AdminLayout>
            <AnimalsPage />
          </AdminLayout>
        </ProtectedRoute>} />
        <Route path="/cages" element={<ProtectedRoute>
          <AdminLayout>
            <CagesPage />
          </AdminLayout>
        </ProtectedRoute>} />
        <Route path="/doctors" element={<ProtectedRoute>
          <AdminLayout>
            <DoctorsPage />
          </AdminLayout>
        </ProtectedRoute>} />
        <Route path="/medical-checks" element={<ProtectedRoute>
          <AdminLayout>
            <MedicalChecksPage />
          </AdminLayout>
        </ProtectedRoute>} />
        <Route path="/vaccinations" element={<ProtectedRoute>
          <AdminLayout>
            <VaccinationsPage />
          </AdminLayout>
        </ProtectedRoute>} />
        <Route path="/employees" element={<ProtectedRoute>
          <AdminLayout>
            <EmployeesPage />
          </AdminLayout>
        </ProtectedRoute>} />
        <Route path="/salaries" element={<ProtectedRoute>
          <AdminLayout>
            <SalariesPage />
          </AdminLayout>
        </ProtectedRoute>} />
        <Route path="/inventory" element={<ProtectedRoute>
          <AdminLayout>
            <InventoryPage />
          </AdminLayout>
        </ProtectedRoute>} />
        <Route path="/ticket-sales" element={<ProtectedRoute>
          <AdminLayout>
            <TicketSalesPage />
          </AdminLayout>
        </ProtectedRoute>} />
        <Route path="/event-management" element={<ProtectedRoute>
          <AdminLayout>
            <EventManagementPage />
          </AdminLayout>
        </ProtectedRoute>} />
        <Route path="/visitors" element={<ProtectedRoute>
          <AdminLayout>
            <VisitorsPage />
          </AdminLayout>
        </ProtectedRoute>} />
        <Route path="/jobs" element={<ProtectedRoute>
          <AdminLayout>
            <JobManagementPage />
          </AdminLayout>
        </ProtectedRoute>} />
        <Route path="/attendance-admin" element={<ProtectedRoute>
          <AdminLayout>
            <AttendanceManagementPage />
          </AdminLayout>
        </ProtectedRoute>} />

        {/* Employee Portal Routes */}
        <Route path="/employee/dashboard" element={<EmployeeRoute>
          <AdminLayout>
            <EmployeeDashboard />
          </AdminLayout>
        </EmployeeRoute>} />
        <Route path="/employee/attendance" element={<EmployeeRoute>
          <AdminLayout>
            <AttendancePage />
          </AdminLayout>
        </EmployeeRoute>} />
        <Route path="/employee/jobs" element={<EmployeeRoute>
          <AdminLayout>
            <JobsPage />
          </AdminLayout>
        </EmployeeRoute>} />
        <Route path="/employee/stock-requests" element={<EmployeeRoute>
          <AdminLayout>
            <StockRequestPage />
          </AdminLayout>
        </EmployeeRoute>} />
        <Route path="/employee/profile" element={<EmployeeRoute>
          <AdminLayout>
            <ProfilePage />
          </AdminLayout>
        </EmployeeRoute>} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>;
}
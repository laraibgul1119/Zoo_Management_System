const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function to handle API responses
const handleResponse = async (res: Response) => {
    const text = await res.text();
    if (!res.ok) {
        let error;
        try {
            error = JSON.parse(text);
        } catch {
            error = { error: 'Request failed' };
        }
        throw new Error(error.error || error.message || `HTTP ${res.status}: ${res.statusText}`);
    }
    try {
        return JSON.parse(text);
    } catch (e) {
        console.error('Invalid JSON response:', text);
        throw new Error('Invalid server response format');
    }
};

export const api = {
    // Auth
    login: (credentials: any) => fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    }).then(handleResponse),

    register: (userData: any) => fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    }).then(handleResponse),

    // Animals
    getAnimals: () => fetch(`${API_BASE_URL}/animals`).then(handleResponse),
    createAnimal: (data: any) => fetch(`${API_BASE_URL}/animals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    updateAnimal: (id: string, data: any) => fetch(`${API_BASE_URL}/animals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    deleteAnimal: (id: string) => fetch(`${API_BASE_URL}/animals/${id}`, {
        method: 'DELETE'
    }).then(handleResponse),

    // Cages
    getCages: () => fetch(`${API_BASE_URL}/cages`).then(handleResponse),
    createCage: (data: any) => fetch(`${API_BASE_URL}/cages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    updateCage: (id: string, data: any) => fetch(`${API_BASE_URL}/cages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    deleteCage: (id: string) => fetch(`${API_BASE_URL}/cages/${id}`, {
        method: 'DELETE'
    }).then(handleResponse),

    // Employees
    getEmployees: () => fetch(`${API_BASE_URL}/employees`).then(handleResponse),
    createEmployee: (data: any) => fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    updateEmployee: (id: string, data: any) => fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    deleteEmployee: (id: string) => fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'DELETE'
    }).then(handleResponse),

    // Doctors
    getDoctors: () => fetch(`${API_BASE_URL}/doctors`).then(handleResponse),
    createDoctor: (data: any) => fetch(`${API_BASE_URL}/doctors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    updateDoctor: (id: string, data: any) => fetch(`${API_BASE_URL}/doctors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    deleteDoctor: (id: string) => fetch(`${API_BASE_URL}/doctors/${id}`, {
        method: 'DELETE'
    }).then(handleResponse),

    // Events
    getEvents: () => fetch(`${API_BASE_URL}/events`).then(handleResponse),
    createEvent: (data: any) => fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    updateEvent: (id: string, data: any) => fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    deleteEvent: (id: string) => fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'DELETE'
    }).then(handleResponse),

    // Tickets
    getTickets: () => fetch(`${API_BASE_URL}/tickets`).then(handleResponse),
    createTicket: (data: any) => fetch(`${API_BASE_URL}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    updateTicket: (id: string, data: any) => fetch(`${API_BASE_URL}/tickets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    deleteTicket: (id: string) => fetch(`${API_BASE_URL}/tickets/${id}`, {
        method: 'DELETE'
    }).then(handleResponse),

    // Ticket Sales
    getTicketSales: () => fetch(`${API_BASE_URL}/ticket-sales`).then(handleResponse),
    createTicketSale: (data: any) => fetch(`${API_BASE_URL}/ticket-sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),

    // Visitors
    getVisitors: () => fetch(`${API_BASE_URL}/visitors`).then(handleResponse),
    createVisitor: (data: any) => fetch(`${API_BASE_URL}/visitors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),

    // Inventory
    getInventory: () => fetch(`${API_BASE_URL}/inventory`).then(handleResponse),
    createInventoryItem: (data: any) => fetch(`${API_BASE_URL}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    updateInventoryItem: (id: string, data: any) => fetch(`${API_BASE_URL}/inventory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    deleteInventoryItem: (id: string) => fetch(`${API_BASE_URL}/inventory/${id}`, {
        method: 'DELETE'
    }).then(handleResponse),

    // Medical Checks
    getMedicalChecks: () => fetch(`${API_BASE_URL}/medical-checks`).then(handleResponse),
    createMedicalCheck: (data: any) => fetch(`${API_BASE_URL}/medical-checks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    updateMedicalCheck: (id: string, data: any) => fetch(`${API_BASE_URL}/medical-checks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    deleteMedicalCheck: (id: string) => fetch(`${API_BASE_URL}/medical-checks/${id}`, {
        method: 'DELETE'
    }).then(handleResponse),

    // Vaccinations
    getVaccinations: () => fetch(`${API_BASE_URL}/vaccinations`).then(handleResponse),
    createVaccination: (data: any) => fetch(`${API_BASE_URL}/vaccinations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    updateVaccination: (id: string, data: any) => fetch(`${API_BASE_URL}/vaccinations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    deleteVaccination: (id: string) => fetch(`${API_BASE_URL}/vaccinations/${id}`, {
        method: 'DELETE'
    }).then(handleResponse),

    // Zoo Info
    getZooInfo: () => fetch(`${API_BASE_URL}/zoo-info`).then(handleResponse),

    // Dashboard Stats
    getDashboardStats: () => fetch(`${API_BASE_URL}/dashboard/stats`).then(handleResponse),
    getNotifications: () => fetch(`${API_BASE_URL}/dashboard/notifications`).then(handleResponse),

    // Attendance
    checkIn: (employeeId: string) => fetch(`${API_BASE_URL}/attendance/check-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId })
    }).then(handleResponse),
    checkOut: (employeeId: string) => fetch(`${API_BASE_URL}/attendance/check-out`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId })
    }).then(handleResponse),
    getAttendanceHistory: (employeeId: string) => fetch(`${API_BASE_URL}/attendance/${employeeId}`).then(handleResponse),
    getAllAttendance: (date?: string) => {
        const url = date ? `${API_BASE_URL}/attendance?date=${date}` : `${API_BASE_URL}/attendance`;
        return fetch(url).then(handleResponse);
    },

    // Jobs
    getAllJobs: () => fetch(`${API_BASE_URL}/jobs`).then(handleResponse),
    getEmployeeJobs: (employeeId: string) => fetch(`${API_BASE_URL}/jobs/${employeeId}`).then(handleResponse),
    assignJob: (data: any) => fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    updateJobStatus: (id: string, status: string) => fetch(`${API_BASE_URL}/jobs/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    }).then(handleResponse),

    // Stock Requests
    createStockRequest: (data: any) => fetch(`${API_BASE_URL}/stock-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),
    getMyStockRequests: (employeeId: string) => fetch(`${API_BASE_URL}/stock-requests/my-requests/${employeeId}`).then(handleResponse),

    // Single Employee
    getEmployee: (id: string) => fetch(`${API_BASE_URL}/employees/${id}`).then(handleResponse),
    updateEmployeeProfile: (id: string, data: any) => fetch(`${API_BASE_URL}/employees/${id}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handleResponse),

    // Salaries
    getSalaries: () => fetch(`${API_BASE_URL}/salaries`).then(handleResponse),
};

export default api;

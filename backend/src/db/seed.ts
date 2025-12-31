import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../zoo.db');
const db = new Database(dbPath);

const seed = () => {
    db.pragma('foreign_keys = ON');

    // Clear existing data
    const tables = ['ticket_sales', 'medical_checks', 'vaccinations', 'attendance', 'jobs', 'stock_requests', 'animals', 'cages', 'employees', 'doctors', 'events', 'tickets', 'inventory', 'users', 'zoo_info', 'visitors'];
    tables.forEach(table => db.prepare(`DELETE FROM ${table}`).run());

    // Zoo Info
    db.prepare(`INSERT INTO zoo_info (name, location, description, capacity, start_time, end_time) 
        VALUES (?, ?, ?, ?, ?, ?)`).run(
        'Central City Zoo', '123 Wild Way, Natureville', 'A world-class zoo dedicated to conservation.', '5000', '09:00', '18:00'
    );

    // Cages
    const cages = [
        { id: 'C1', name: 'Savanna Enclosure A', type: 'Outdoor', capacity: 5, occupancy: 2, location: 'North Zone', status: 'Active' },
        { id: 'C2', name: 'Elephant Sanctuary', type: 'Outdoor', capacity: 3, occupancy: 1, location: 'North Zone', status: 'Active' },
        { id: 'C3', name: 'Giraffe Heights', type: 'Mixed', capacity: 4, occupancy: 1, location: 'East Zone', status: 'Active' },
        { id: 'C4', name: 'Arctic Cove', type: 'Indoor/Pool', capacity: 20, occupancy: 12, location: 'South Zone', status: 'Active' },
        { id: 'C5', name: 'Reptile House', type: 'Indoor', capacity: 50, occupancy: 45, location: 'West Zone', status: 'Maintenance' }
    ];
    const insertCage = db.prepare(`INSERT INTO cages (id, name, type, capacity, occupancy, location, status) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    cages.forEach(c => insertCage.run(c.id, c.name, c.type, c.capacity, c.occupancy, c.location, c.status));

    // Animals
    const animals = [
        { id: '1', name: 'Simba', species: 'Lion', age: 5, gender: 'Male', health_status: 'Healthy', cage_id: 'C1', notes: 'Dominant male, good appetite' },
        { id: '2', name: 'Nala', species: 'Lion', age: 4, gender: 'Female', health_status: 'Healthy', cage_id: 'C1', notes: 'Playful, interacts well with keepers' },
        { id: '3', name: 'Dumbo', species: 'Elephant', age: 12, gender: 'Male', health_status: 'Healthy', cage_id: 'C2', notes: 'Needs extra hydration in summer' },
        { id: '4', name: 'Melman', species: 'Giraffe', age: 7, gender: 'Male', health_status: 'Under Observation', cage_id: 'C3', notes: 'Mild limp on left front leg' },
        { id: '5', name: 'Skipper', species: 'Penguin', age: 3, gender: 'Male', health_status: 'Healthy', cage_id: 'C4', notes: 'Very active during feeding time' }
    ];
    const insertAnimal = db.prepare(`INSERT INTO animals (id, name, species, age, gender, health_status, cage_id, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
    animals.forEach(a => insertAnimal.run(a.id, a.name, a.species, a.age, a.gender, a.health_status, a.cage_id, a.notes));

    // Employees
    const employees = [
        { id: 'E1', name: 'John Doe', email: 'john@zoo.com', role: 'Zookeeper', phone: '555-0101', salary: 45000, join_date: '2019-01-15', status: 'Active' },
        { id: 'E2', name: 'Jane Smith', email: 'jane@zoo.com', role: 'Manager', phone: '555-0102', salary: 65000, join_date: '2018-05-20', status: 'Active' },
        { id: 'E3', name: 'Mike Johnson', email: 'mike@zoo.com', role: 'Maintenance', phone: '555-0103', salary: 40000, join_date: '2020-03-10', status: 'On Leave' }
    ];
    const insertEmployee = db.prepare(`INSERT INTO employees (id, name, email, role, phone, salary, join_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
    employees.forEach(e => insertEmployee.run(e.id, e.name, e.email, e.role, e.phone, e.salary, e.join_date, e.status));

    // Create User accounts for employees
    const insertUser = db.prepare(`INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)`);
    employees.forEach(e => {
        const userId = `user-${e.id}`;
        // Default role logic: Manager -> admin, others -> employee
        const role = e.role === 'Manager' ? 'admin' : 'employee';
        insertUser.run(userId, e.name, e.email, 'password123', role);
    });

    // Doctors
    const doctors = [
        { id: 'D1', name: 'Dr. Sarah Wilson', specialization: 'Large Mammals', email: 'sarah@zoo.com', phone: '555-0201', availability: 'Available', experience: '10 years' },
        { id: 'D2', name: 'Dr. James Chen', specialization: 'Avian & Reptiles', email: 'james@zoo.com', phone: '555-0202', availability: 'On Call', experience: '8 years' }
    ];
    const insertDoctor = db.prepare(`INSERT INTO doctors (id, name, specialization, email, phone, availability, experience) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    doctors.forEach(d => insertDoctor.run(d.id, d.name, d.specialization, d.email, d.phone, d.availability, d.experience));

    // Tickets
    const tickets = [
        { id: 'T1', type: 'Adult', price: 25, description: 'Standard entry for ages 13-64' },
        { id: 'T2', type: 'Child', price: 15, description: 'Entry for ages 3-12' },
        { id: 'T3', type: 'Senior', price: 20, description: 'Entry for ages 65+' },
        { id: 'T4', type: 'Group', price: 18, description: 'Per person, min 10 people' }
    ];
    const insertTicket = db.prepare(`INSERT INTO tickets (id, type, price, description) VALUES (?, ?, ?, ?)`);
    tickets.forEach(t => insertTicket.run(t.id, t.type, t.price, t.description));

    // Events
    const events = [
        { id: 'EV1', title: 'Lion Feeding', description: 'Watch our keepers feed the lions', date: '2024-06-15', time: '14:00', location: 'Savanna Enclosure', capacity: 50, registered_count: 32, status: 'Upcoming' },
        { id: 'EV2', title: 'Elephant Bath', description: 'See the elephants get a scrub', date: '2024-06-16', time: '11:00', location: 'Elephant Sanctuary', capacity: 100, registered_count: 85, status: 'Upcoming' },
        { id: 'EV3', title: 'Night Safari', description: 'Guided tour after dark', date: '2024-06-20', time: '20:00', location: 'Main Gate', capacity: 30, registered_count: 30, status: 'Upcoming' }
    ];
    const insertEvent = db.prepare(`INSERT INTO events (id, title, description, date, time, location, capacity, registered_count, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    events.forEach(ev => insertEvent.run(ev.id, ev.title, ev.description, ev.date, ev.time, ev.location, ev.capacity, ev.registered_count, ev.status));

    // Inventory
    const inventory = [
        { id: 'I1', name: 'Premium Meat Mix', category: 'Food', quantity: 500, unit: 'kg', min_threshold: 100, expiry_date: '2024-06-30', supplier: 'Meadow Farms' },
        { id: 'I2', name: 'Hay Bales', category: 'Food', quantity: 200, unit: 'bales', min_threshold: 50, expiry_date: '2024-12-31', supplier: 'Green Fields' },
        { id: 'I3', name: 'Antibiotics Type A', category: 'Medicine', quantity: 50, unit: 'doses', min_threshold: 20, expiry_date: '2025-01-15', supplier: 'VetSupplies Co.' },
        { id: 'I4', name: 'Cleaning Solution', category: 'Equipment', quantity: 100, unit: 'liters', min_threshold: 20, expiry_date: null, supplier: 'EcoClean' }
    ];
    const insertInventory = db.prepare(`INSERT INTO inventory (id, name, category, quantity, unit, min_threshold, expiry_date, supplier) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
    inventory.forEach(i => insertInventory.run(i.id, i.name, i.category, i.quantity, i.unit, i.min_threshold, i.expiry_date, i.supplier));

    // Visitors
    const visitors = [
        { id: 'V1', name: 'Alice Brown', email: 'alice@example.com', phone: '555-0301', registration_date: '2024-01-10' },
        { id: 'V2', name: 'Bob Wilson', email: 'bob@example.com', phone: '555-0302', registration_date: '2024-02-15' }
    ];
    const insertVisitor = db.prepare(`INSERT INTO visitors (id, name, email, phone, registration_date) VALUES (?, ?, ?, ?, ?)`);
    visitors.forEach(v => insertVisitor.run(v.id, v.name, v.email, v.phone, v.registration_date));

    // Ticket Sales
    const sales = [
        { id: 'S1', ticket_id: 'T1', quantity: 2, total_amount: 50, date: '2024-06-01', visitor_name: 'Alice Brown', visitor_email: 'alice@example.com' },
        { id: 'S2', ticket_id: 'T2', quantity: 3, total_amount: 45, date: '2024-06-01', visitor_name: 'Alice Brown', visitor_email: 'alice@example.com' },
        { id: 'S3', ticket_id: 'T1', quantity: 1, total_amount: 25, date: '2024-06-02', visitor_name: 'Bob Wilson', visitor_email: 'bob@example.com' }
    ];
    const insertSale = db.prepare(`INSERT INTO ticket_sales (id, ticket_id, quantity, total_amount, date, visitor_name, visitor_email) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    sales.forEach(s => insertSale.run(s.id, s.ticket_id, s.quantity, s.total_amount, s.date, s.visitor_name, s.visitor_email));

    // Medical Checks
    const medicalChecks = [
        { id: 'MC1', animal_id: '1', doctor_id: 'D1', date: '2024-05-01', diagnosis: 'Healthy checkup', treatment: 'None', status: 'Completed' },
        { id: 'MC2', animal_id: '4', doctor_id: 'D1', date: '2024-05-10', diagnosis: 'Mild inflammation', treatment: 'Anti-inflammatory meds', status: 'Completed' }
    ];
    const insertMedicalCheck = db.prepare(`INSERT INTO medical_checks (id, animal_id, doctor_id, date, diagnosis, treatment, status) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    medicalChecks.forEach(m => insertMedicalCheck.run(m.id, m.animal_id, m.doctor_id, m.date, m.diagnosis, m.treatment, m.status));

    // Vaccinations
    const vaccinations = [
        { id: 'VAC1', animal_id: '1', vaccine_name: 'Rabies', date_administered: '2023-06-15', next_due_date: '2024-06-15', veterinarian: 'Dr. Sarah Wilson' },
        { id: 'VAC2', animal_id: '3', vaccine_name: 'Tetanus', date_administered: '2023-08-20', next_due_date: '2024-08-20', veterinarian: 'Dr. Sarah Wilson' }
    ];
    const insertVaccination = db.prepare(`INSERT INTO vaccinations (id, animal_id, vaccine_name, date_administered, next_due_date, veterinarian) VALUES (?, ?, ?, ?, ?, ?)`);
    vaccinations.forEach(v => insertVaccination.run(v.id, v.animal_id, v.vaccine_name, v.date_administered, v.next_due_date, v.veterinarian));

    console.log('Database seeded successfully.');
};

seed();

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db/db';
import { initDb } from './db/init';
import { keysToCamel, keysToSnake } from './utils/mapper';

process.on('exit', (code) => {
    console.log(`Process exiting with code: ${code}`);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Force keep-alive to debug if event loop is empty
setInterval(() => { }, 1000 * 60 * 60); // Keep process alive

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    if (req.method === 'POST' || req.method === 'PUT') {
        console.log('Body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Validation helper
const validateRequired = (fields: Record<string, any>, requiredFields: string[]) => {
    const missing = requiredFields.filter(field => !fields[field] && fields[field] !== 0);
    return missing.length > 0 ? missing : null;
};

// Authentication
app.post('/api/auth/register', (req, res) => {
    const { name, email, password, role } = req.body;

    // Validate required fields
    const missing = validateRequired(req.body, ['name', 'email', 'password']);
    if (missing) {
        return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
    }

    const id = `user-${Date.now()}`;
    try {
        const insertUser = db.prepare('INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)');
        const insertEmployee = db.prepare('INSERT INTO employees (id, name, email, role, status, join_date, salary, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');

        const transaction = db.transaction(() => {
            insertUser.run(id, name, email, password, role || 'visitor');
            if (role === 'employee') {
                // Auto-create employee record with Pending status
                insertEmployee.run(id, name, email, 'Staff', 'Pending', new Date().toISOString().split('T')[0], 0, '');
            }
        });

        transaction();
        res.json({ id, name, email, role: role || 'visitor' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Registration failed. Email might already exist.' });
    }
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    // Validate required fields
    const missing = validateRequired(req.body, ['email', 'password']);
    if (missing) {
        return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
    }

    try {
        const user = db.prepare('SELECT id, name, email, role, password FROM users WHERE email = ?').get(email) as any;
        if (user && user.password === password) {
            const { password: _, ...userWithoutPassword } = user;
            res.json(keysToCamel(userWithoutPassword));
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Animals
app.get('/api/animals', (req, res) => {
    const animals = db.prepare('SELECT * FROM animals').all();
    res.json(keysToCamel(animals));
});

app.post('/api/animals', (req, res) => {
    const data = keysToSnake(req.body);
    const { id, name, species, age, gender, health_status, notes } = data;
    let { cage_id } = data;

    // Validate required fields
    const missing = validateRequired(data, ['id', 'name', 'species', 'age']);
    if (missing) {
        return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
    }

    // Handle empty cage selection
    if (cage_id === '') cage_id = null;

    try {
        db.prepare('INSERT INTO animals (id, name, species, age, gender, health_status, cage_id, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
            .run(id, name, species, age, gender, health_status, cage_id, notes);
        res.json(req.body);
    } catch (error) {
        console.error('Error adding animal:', error);
        res.status(500).json({ error: 'Failed to add animal' });
    }
});

app.put('/api/animals/:id', (req, res) => {
    const data = keysToSnake(req.body);
    const { name, species, age, gender, health_status, notes } = data;
    const { id } = req.params;
    let { cage_id } = data;

    // Handle empty cage selection
    if (cage_id === '') cage_id = null;

    try {
        db.prepare(`UPDATE animals SET 
            name = ?, species = ?, age = ?, gender = ?, 
            health_status = ?, cage_id = ?, notes = ? 
            WHERE id = ?`)
            .run(name, species, age, gender, health_status, cage_id, notes, id);
        res.json(req.body);
    } catch (error) {
        console.error('Error updating animal:', error);
        res.status(500).json({ error: 'Failed to update animal' });
    }
});

app.delete('/api/animals/:id', (req, res) => {
    const { id } = req.params;
    try {
        db.prepare('DELETE FROM animals WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting animal:', error);
        res.status(500).json({ error: 'Failed to delete animal' });
    }
});

// Cages
app.get('/api/cages', (req, res) => {
    const cages = db.prepare('SELECT * FROM cages').all();
    res.json(keysToCamel(cages));
});

app.post('/api/cages', (req, res) => {
    const data = keysToSnake(req.body);
    const { id, name, type, capacity, occupancy, location, status } = data;
    try {
        db.prepare('INSERT INTO cages (id, name, type, capacity, occupancy, location, status) VALUES (?, ?, ?, ?, ?, ?, ?)')
            .run(id, name, type, capacity, occupancy || 0, location, status || 'Active');
        res.json(req.body);
    } catch (error) {
        console.error('Error adding cage:', error);
        res.status(500).json({ error: 'Failed to add cage' });
    }
});

app.put('/api/cages/:id', (req, res) => {
    const data = keysToSnake(req.body);
    const { name, type, capacity, occupancy, location, status } = data;
    const { id } = req.params;
    try {
        db.prepare(`UPDATE cages SET 
            name = ?, type = ?, capacity = ?, occupancy = ?, 
            location = ?, status = ? 
            WHERE id = ?`)
            .run(name, type, capacity, occupancy, location, status, id);
        res.json(req.body);
    } catch (error) {
        console.error('Error updating cage:', error);
        res.status(500).json({ error: 'Failed to update cage' });
    }
});

app.delete('/api/cages/:id', (req, res) => {
    const { id } = req.params;
    try {
        db.prepare('DELETE FROM cages WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting cage:', error);
        res.status(500).json({ error: 'Failed to delete cage' });
    }
});

// Employees
app.get('/api/employees', (req, res) => {
    const employees = db.prepare('SELECT * FROM employees').all();
    res.json(keysToCamel(employees));
});

app.post('/api/employees', (req, res) => {
    const data = keysToSnake(req.body);
    const { id, name, email, role, phone, salary, join_date, status } = data;
    
    // Validate required fields
    const missing = validateRequired(data, ['id', 'name', 'email', 'role']);
    if (missing) {
        return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
    }
    
    try {
        const insertEmployee = db.prepare('INSERT INTO employees (id, name, email, role, phone, salary, join_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        const insertUser = db.prepare('INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)');
        
        // Use transaction to ensure both employee and user are created together
        const transaction = db.transaction(() => {
            // Create employee record
            insertEmployee.run(id, name, email, role, phone, salary || 0, join_date, status || 'Active');
            
            // Create user account with default password "emp123"
            // Check if user already exists
            const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
            if (!existingUser) {
                insertUser.run(id, name, email, 'emp123', 'employee');
                console.log(`Created user account for employee: ${email} with password: emp123`);
            } else {
                console.log(`User account already exists for: ${email}`);
            }
        });
        
        transaction();
        res.json({ ...req.body, message: 'Employee and user account created successfully' });
    } catch (error: any) {
        console.error('Error adding employee:', error);
        res.status(500).json({ error: `Failed to add employee: ${error.message}` });
    }
});

app.put('/api/employees/:id', (req, res) => {
    const data = keysToSnake(req.body);
    const { name, email, role, phone, salary, join_date, status } = data;
    const { id } = req.params;
    
    try {
        const updateEmployee = db.prepare(`UPDATE employees SET 
            name = ?, email = ?, role = ?, phone = ?, 
            salary = ?, join_date = ?, status = ? 
            WHERE id = ?`);
        
        const updateUser = db.prepare(`UPDATE users SET 
            name = ?, email = ? 
            WHERE id = ?`);
        
        // Use transaction to ensure both employee and user are updated together
        const transaction = db.transaction(() => {
            // Update employee record
            updateEmployee.run(name, email, role, phone, salary, join_date, status, id);
            
            // Update user account if it exists
            const existingUser = db.prepare('SELECT id FROM users WHERE id = ?').get(id);
            if (existingUser) {
                updateUser.run(name, email, id);
                console.log(`Updated user account for employee: ${email}`);
            } else {
                console.log(`No user account found for employee ID: ${id}`);
            }
        });
        
        transaction();
        res.json({ ...req.body, message: 'Employee updated successfully' });
    } catch (error: any) {
        console.error('Error updating employee:', error);
        res.status(500).json({ error: `Failed to update employee: ${error.message}` });
    }
});

app.delete('/api/employees/:id', (req, res) => {
    const { id } = req.params;
    try {
        db.prepare('DELETE FROM employees WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ error: 'Failed to delete employee' });
    }
});

// Doctors
app.get('/api/doctors', (req, res) => {
    const doctors = db.prepare('SELECT * FROM doctors').all();
    res.json(keysToCamel(doctors));
});

app.post('/api/doctors', (req, res) => {
    const data = keysToSnake(req.body);
    const { id, name, specialization, email, phone, availability, experience } = data;
    try {
        db.prepare('INSERT INTO doctors (id, name, specialization, email, phone, availability, experience) VALUES (?, ?, ?, ?, ?, ?, ?)')
            .run(id, name, specialization, email, phone, availability || 'Available', experience);
        res.json(req.body);
    } catch (error) {
        console.error('Error adding doctor:', error);
        res.status(500).json({ error: 'Failed to add doctor' });
    }
});

app.put('/api/doctors/:id', (req, res) => {
    const data = keysToSnake(req.body);
    const { name, specialization, email, phone, availability, experience } = data;
    const { id } = req.params;
    try {
        db.prepare(`UPDATE doctors SET 
            name = ?, specialization = ?, email = ?, phone = ?, 
            availability = ?, experience = ? 
            WHERE id = ?`)
            .run(name, specialization, email, phone, availability, experience, id);
        res.json(req.body);
    } catch (error) {
        console.error('Error updating doctor:', error);
        res.status(500).json({ error: 'Failed to update doctor' });
    }
});

app.delete('/api/doctors/:id', (req, res) => {
    const { id } = req.params;
    try {
        db.prepare('DELETE FROM doctors WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting doctor:', error);
        res.status(500).json({ error: 'Failed to delete doctor' });
    }
});

// Events
app.get('/api/events', (req, res) => {
    const events = db.prepare('SELECT * FROM events').all();
    res.json(keysToCamel(events));
});

app.post('/api/events', (req, res) => {
    const data = keysToSnake(req.body);
    const { id, title, description, date, time, location, capacity, registered_count, status } = data;
    try {
        db.prepare('INSERT INTO events (id, title, description, date, time, location, capacity, registered_count, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
            .run(id, title, description, date, time, location, capacity, registered_count || 0, status || 'Upcoming');
        res.json(req.body);
    } catch (error) {
        console.error('Error adding event:', error);
        res.status(500).json({ error: 'Failed to add event' });
    }
});

app.put('/api/events/:id', (req, res) => {
    const data = keysToSnake(req.body);
    const { title, description, date, time, location, capacity, registered_count, status } = data;
    const { id } = req.params;
    try {
        db.prepare(`UPDATE events SET 
            title = ?, description = ?, date = ?, time = ?, 
            location = ?, capacity = ?, registered_count = ?, status = ? 
            WHERE id = ?`)
            .run(title, description, date, time, location, capacity, registered_count, status, id);
        res.json(req.body);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Failed to update event' });
    }
});

app.delete('/api/events/:id', (req, res) => {
    const { id } = req.params;
    try {
        db.prepare('DELETE FROM events WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

// Tickets
app.get('/api/tickets', (req, res) => {
    const tickets = db.prepare('SELECT * FROM tickets').all();
    res.json(keysToCamel(tickets));
});

app.post('/api/tickets', (req, res) => {
    const data = keysToSnake(req.body);
    const { id, type, price, description, start_date, discount_percentage } = data;
    try {
        db.prepare('INSERT INTO tickets (id, type, price, description, start_date, discount_percentage) VALUES (?, ?, ?, ?, ?, ?)')
            .run(id, type || 'Standard', price, description || '', start_date || new Date().toISOString().split('T')[0], discount_percentage || 0);
        res.json(req.body);
    } catch (error) {
        console.error('Error adding ticket:', error);
        res.status(500).json({ error: 'Failed to add ticket' });
    }
});

app.put('/api/tickets/:id', (req, res) => {
    const data = keysToSnake(req.body);
    const { type, price, description, start_date, discount_percentage } = data;
    const { id } = req.params;
    try {
        db.prepare(`UPDATE tickets SET 
            type = ?, price = ?, description = ?, 
            start_date = ?, discount_percentage = ? 
            WHERE id = ?`)
            .run(type, price, description, start_date, discount_percentage, id);
        res.json(req.body);
    } catch (error) {
        console.error('Error updating ticket:', error);
        res.status(500).json({ error: 'Failed to update ticket' });
    }
});

app.delete('/api/tickets/:id', (req, res) => {
    const { id } = req.params;
    try {
        db.prepare('DELETE FROM tickets WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting ticket:', error);
        res.status(500).json({ error: 'Failed to delete ticket' });
    }
});

// Ticket Sales
app.get('/api/ticket-sales', (req, res) => {
    const sales = db.prepare('SELECT * FROM ticket_sales').all();
    res.json(keysToCamel(sales));
});

app.post('/api/ticket-sales', (req, res) => {
    console.log('API Hit: /api/ticket-sales', JSON.stringify(req.body));
    const data = keysToSnake(req.body);
    const { id, ticket_id, quantity, total_amount, date, visitor_name, visitor_email, visitor_phone } = data;

    // Validate required fields
    if (!ticket_id || !quantity || !total_amount || !visitor_name) {
        console.error('Missing fields:', data);
        return res.status(400).json({
            error: 'Missing required fields: ticket_id, quantity, total_amount, visitor_name'
        });
    }

    try {
        const saleId = id || `sale-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const saleDate = date || new Date().toISOString().split('T')[0];

        // Start transaction
        const insertSale = db.prepare(`
            INSERT INTO ticket_sales (id, ticket_id, quantity, total_amount, date, visitor_name, visitor_email, visitor_phone) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        insertSale.run(
            saleId,
            ticket_id,
            quantity,
            total_amount,
            saleDate,
            visitor_name,
            visitor_email || null,
            visitor_phone || null
        );

        // Upsert visitor information too
        if (visitor_email) {
            const visitorId = `visitor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const checkVisitor = db.prepare('SELECT id FROM visitors WHERE email = ?').get(visitor_email) as { id: string } | undefined;
            if (checkVisitor) {
                db.prepare('UPDATE visitors SET name = ?, phone = ? WHERE id = ?')
                    .run(visitor_name, visitor_phone || null, checkVisitor.id);
            } else {
                db.prepare('INSERT INTO visitors (id, name, email, phone, registration_date) VALUES (?, ?, ?, ?, ?)')
                    .run(visitorId, visitor_name, visitor_email, visitor_phone || null, saleDate);
            }
        }

        console.log('Sale processed successfully. Response:', { success: true, id: saleId });
        res.json({ success: true, id: saleId, ...keysToCamel(data) });
    } catch (error: any) {
        console.error('Error adding ticket sale:', error);
        res.status(500).json({ error: `Failed to add ticket sale: ${error.message}` });
    }
});

// Visitors
app.get('/api/visitors', (req, res) => {
    const visitors = db.prepare('SELECT * FROM visitors').all();
    res.json(keysToCamel(visitors));
});

app.post('/api/visitors', (req, res) => {
    const data = keysToSnake(req.body);
    const { id, name, email, phone, registration_date } = data;
    try {
        db.prepare('INSERT INTO visitors (id, name, email, phone, registration_date) VALUES (?, ?, ?, ?, ?)')
            .run(id, name, email, phone, registration_date || new Date().toISOString().split('T')[0]);
        res.json(req.body);
    } catch (error) {
        console.error('Error adding visitor:', error);
        res.status(500).json({ error: 'Failed to add visitor' });
    }
});

// Inventory
app.get('/api/inventory', (req, res) => {
    const inventory = db.prepare('SELECT * FROM inventory').all();
    res.json(keysToCamel(inventory));
});

app.post('/api/inventory', (req, res) => {
    const data = keysToSnake(req.body);
    const { id, name, category, quantity, unit, min_threshold, expiry_date, supplier } = data;
    try {
        db.prepare('INSERT INTO inventory (id, name, category, quantity, unit, min_threshold, expiry_date, supplier) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
            .run(id, name, category, quantity, unit, min_threshold, expiry_date, supplier);
        res.json(req.body);
    } catch (error) {
        console.error('Error adding inventory item:', error);
        res.status(500).json({ error: 'Failed to add inventory item' });
    }
});

app.put('/api/inventory/:id', (req, res) => {
    const data = keysToSnake(req.body);
    const { name, category, quantity, unit, min_threshold, expiry_date, supplier } = data;
    const { id } = req.params;
    try {
        db.prepare(`UPDATE inventory SET 
            name = ?, category = ?, quantity = ?, unit = ?, 
            min_threshold = ?, expiry_date = ?, supplier = ? 
            WHERE id = ?`)
            .run(name, category, quantity, unit, min_threshold, expiry_date, supplier, id);
        res.json(req.body);
    } catch (error) {
        console.error('Error updating inventory item:', error);
        res.status(500).json({ error: 'Failed to update inventory item' });
    }
});

app.delete('/api/inventory/:id', (req, res) => {
    const { id } = req.params;
    try {
        db.prepare('DELETE FROM inventory WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting inventory item:', error);
        res.status(500).json({ error: 'Failed to delete inventory item' });
    }
});

// Medical Checks
app.get('/api/medical-checks', (req, res) => {
    const checks = db.prepare('SELECT * FROM medical_checks').all();
    res.json(keysToCamel(checks));
});

app.post('/api/medical-checks', (req, res) => {
    const data = keysToSnake(req.body);
    const { id, animal_id, doctor_id, date, diagnosis, treatment, status, notes } = data;
    try {
        db.prepare('INSERT INTO medical_checks (id, animal_id, doctor_id, date, diagnosis, treatment, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
            .run(id, animal_id, doctor_id, date, diagnosis, treatment, status || 'Completed', notes);
        res.json(req.body);
    } catch (error) {
        console.error('Error adding medical check:', error);
        res.status(500).json({ error: 'Failed to add medical check' });
    }
});

app.put('/api/medical-checks/:id', (req, res) => {
    const data = keysToSnake(req.body);
    const { animal_id, doctor_id, date, diagnosis, treatment, status, notes } = data;
    const { id } = req.params;
    try {
        db.prepare(`UPDATE medical_checks SET 
            animal_id = ?, doctor_id = ?, date = ?, diagnosis = ?, 
            treatment = ?, status = ?, notes = ? 
            WHERE id = ?`)
            .run(animal_id, doctor_id, date, diagnosis, treatment, status, notes, id);
        res.json(req.body);
    } catch (error) {
        console.error('Error updating medical check:', error);
        res.status(500).json({ error: 'Failed to update medical check' });
    }
});

app.delete('/api/medical-checks/:id', (req, res) => {
    const { id } = req.params;
    try {
        db.prepare('DELETE FROM medical_checks WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting medical check:', error);
        res.status(500).json({ error: 'Failed to delete medical check' });
    }
});

// Vaccinations
app.get('/api/vaccinations', (req, res) => {
    const vaccinations = db.prepare('SELECT * FROM vaccinations').all();
    res.json(keysToCamel(vaccinations));
});

app.post('/api/vaccinations', (req, res) => {
    const data = keysToSnake(req.body);
    const { id, animal_id, vaccine_name, date_administered, next_due_date, veterinarian, notes } = data;
    try {
        db.prepare('INSERT INTO vaccinations (id, animal_id, vaccine_name, date_administered, next_due_date, veterinarian, notes) VALUES (?, ?, ?, ?, ?, ?, ?)')
            .run(id, animal_id, vaccine_name, date_administered, next_due_date, veterinarian, notes);
        res.json(req.body);
    } catch (error) {
        console.error('Error adding vaccination:', error);
        res.status(500).json({ error: 'Failed to add vaccination' });
    }
});

app.put('/api/vaccinations/:id', (req, res) => {
    const data = keysToSnake(req.body);
    const { animal_id, vaccine_name, date_administered, next_due_date, veterinarian, notes } = data;
    const { id } = req.params;
    try {
        db.prepare(`UPDATE vaccinations SET 
            animal_id = ?, vaccine_name = ?, date_administered = ?, 
            next_due_date = ?, veterinarian = ?, notes = ? 
            WHERE id = ?`)
            .run(animal_id, vaccine_name, date_administered, next_due_date, veterinarian, notes, id);
        res.json(req.body);
    } catch (error) {
        console.error('Error updating vaccination:', error);
        res.status(500).json({ error: 'Failed to update vaccination' });
    }
});

app.delete('/api/vaccinations/:id', (req, res) => {
    const { id } = req.params;
    try {
        db.prepare('DELETE FROM vaccinations WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting vaccination:', error);
        res.status(500).json({ error: 'Failed to delete vaccination' });
    }
});

// Zoo Info
app.get('/api/zoo-info', (req, res) => {
    const info = db.prepare('SELECT * FROM zoo_info LIMIT 1').get();
    res.json(keysToCamel(info));
});

// Dashboard Stats
app.get('/api/dashboard/stats', (req, res) => {
    const animalCount = db.prepare('SELECT COUNT(*) as count FROM animals').get() as { count: number };
    const employeeCount = db.prepare('SELECT COUNT(*) as count FROM employees').get() as { count: number };
    const cageCount = db.prepare('SELECT COUNT(*) as count FROM cages').get() as { count: number };
    const ticketSales = db.prepare('SELECT SUM(total_amount) as total FROM ticket_sales').get() as { total: number };

    res.json({
        animals: animalCount.count,
        employees: employeeCount.count,
        cages: cageCount.count,
        revenue: ticketSales.total || 0
    });
});

app.get('/api/dashboard/notifications', (req, res) => {
    try {
        const notifications: any[] = [];

        // 1. Health Alerts
        const sickAnimals = db.prepare("SELECT * FROM animals WHERE health_status != 'Healthy'").all() as any[];
        sickAnimals.forEach(animal => {
            notifications.push({
                id: `health-${animal.id}`,
                type: 'Health',
                title: 'Health Alert',
                message: `${animal.name} (${animal.species}) is ${animal.health_status}`,
                severity: 'Critical',
                timestamp: new Date().toISOString(),
                link: `/staff/medical-checks?animalId=${animal.id}`,
                metadata: { entityId: animal.id, entityType: 'Animal' }
            });
        });

        // 2. Low Stock Alerts
        const lowStock = db.prepare("SELECT * FROM inventory WHERE quantity <= min_threshold").all() as any[];
        lowStock.forEach(item => {
            notifications.push({
                id: `stock-${item.id}`,
                type: 'Stock',
                title: 'Low Stock Alert',
                message: `${item.name}: Only ${item.quantity} ${item.unit} remaining`,
                severity: 'Warning',
                timestamp: new Date().toISOString(),
                // No direct link for now, or could link to inventory page
                metadata: { entityId: item.id, entityType: 'Inventory' }
            });
        });

        // 3. New Employee Requests (Pending)
        const pendingEmployees = db.prepare("SELECT * FROM employees WHERE status = 'Pending'").all() as any[];
        pendingEmployees.forEach(emp => {
            notifications.push({
                id: `emp-req-${emp.id}`,
                type: 'System', // Using System or Info
                title: 'New Employee Request',
                message: `${emp.name} has requested to join as employee.`,
                severity: 'Info',
                timestamp: new Date().toISOString(),
                link: `/employees`, // Link to employees page to approve
                metadata: { entityId: emp.id, entityType: 'Employee' }
            });
        });

        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

// --- Employee Portal Endpoints ---

// Attendance
app.post('/api/attendance/check-in', (req, res) => {
    const { employeeId } = req.body;
    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    const id = `att-${Date.now()}`;

    try {
        // Check if already checked in today
        const existing = db.prepare('SELECT * FROM attendance WHERE employee_id = ? AND date = ?').get(employeeId, date);
        if (existing) {
            return res.status(400).json({ error: 'Already checked in today' });
        }

        db.prepare('INSERT INTO attendance (id, employee_id, date, check_in, status) VALUES (?, ?, ?, ?, ?)')
            .run(id, employeeId, date, time, 'Present');
        res.json({ success: true, checkIn: time });
    } catch (error) {
        console.error('Error check-in:', error);
        res.status(500).json({ error: 'Check-in failed' });
    }
});

app.post('/api/attendance/check-out', (req, res) => {
    const { employeeId } = req.body;
    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    try {
        db.prepare('UPDATE attendance SET check_out = ? WHERE employee_id = ? AND date = ?')
            .run(time, employeeId, date);
        res.json({ success: true, checkOut: time });
    } catch (error) {
        console.error('Error check-out:', error);
        res.status(500).json({ error: 'Check-out failed' });
    }
});

app.get('/api/attendance/:employeeId', (req, res) => {
    const { employeeId } = req.params;
    try {
        const history = db.prepare('SELECT * FROM attendance WHERE employee_id = ? ORDER BY date DESC').all(employeeId);
        res.json(keysToCamel(history));
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ error: 'Failed to fetch attendance' });
    }
});

app.get('/api/attendance', (req, res) => {
    const { date } = req.query;
    try {
        let query = 'SELECT a.*, e.name as employee_name FROM attendance a JOIN employees e ON a.employee_id = e.id';
        const params: any[] = [];

        if (date) {
            query += ' WHERE a.date = ?';
            params.push(date);
        }

        query += ' ORDER BY a.date DESC, a.check_in DESC';

        const attendance = db.prepare(query).all(...params);
        res.json(keysToCamel(attendance));
    } catch (error) {
        console.error('Error fetching all attendance:', error);
        res.status(500).json({ error: 'Failed to fetch attendance list' });
    }
});

// Jobs
app.get('/api/jobs', (req, res) => {
    try {
        const jobs = db.prepare(`
            SELECT j.*, e.name as employee_name 
            FROM jobs j 
            JOIN employees e ON j.employee_id = e.id 
            ORDER BY j.due_date DESC
        `).all();
        res.json(keysToCamel(jobs));
    } catch (error) {
        console.error('Error fetching all jobs:', error);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
});

app.get('/api/jobs/:employeeId', (req, res) => {
    const { employeeId } = req.params;
    try {
        const jobs = db.prepare('SELECT * FROM jobs WHERE employee_id = ? ORDER BY assigned_date DESC').all(employeeId);
        res.json(keysToCamel(jobs));
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
});

app.post('/api/jobs', (req, res) => {
    const data = keysToSnake(req.body);
    const { employee_id, title, description, due_date } = data;
    const id = `job-${Date.now()}`;
    const assignedDate = new Date().toISOString().split('T')[0];

    try {
        db.prepare('INSERT INTO jobs (id, employee_id, title, description, status, assigned_date, due_date) VALUES (?, ?, ?, ?, ?, ?, ?)')
            .run(id, employee_id, title, description, 'Pending', assignedDate, due_date);
        res.json({ success: true, id });
    } catch (error) {
        console.error('Error assigning job:', error);
        res.status(500).json({ error: 'Failed to assign job' });
    }
});

app.put('/api/jobs/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        db.prepare('UPDATE jobs SET status = ? WHERE id = ?').run(status, id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating job:', error);
        res.status(500).json({ error: 'Failed to update job' });
    }
});

// Stock Requests
app.post('/api/stock-requests', (req, res) => {
    const data = keysToSnake(req.body);
    const { employee_id, item_name, quantity, unit, reason } = data;
    const id = `req-${Date.now()}`;
    const date = new Date().toISOString().split('T')[0];

    try {
        db.prepare('INSERT INTO stock_requests (id, employee_id, item_name, quantity, unit, reason, status, request_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
            .run(id, employee_id, item_name, quantity, unit, reason, 'Pending', date);
        res.json({ success: true, id });
    } catch (error) {
        console.error('Error creating stock request:', error);
        res.status(500).json({ error: 'Failed to create request' });
    }
});

app.get('/api/stock-requests/my-requests/:employeeId', (req, res) => {
    const { employeeId } = req.params;
    try {
        const requests = db.prepare('SELECT * FROM stock_requests WHERE employee_id = ? ORDER BY request_date DESC').all(employeeId);
        res.json(keysToCamel(requests));
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
});

// Single Employee Profile
app.get('/api/employees/:id', (req, res) => {
    const { id } = req.params;
    try {
        const employee = db.prepare('SELECT * FROM employees WHERE id = ?').get(id);
        if (employee) {
            res.json(keysToCamel(employee));
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).json({ error: 'Failed to fetch employee' });
    }
});

app.put('/api/employees/:id/profile', (req, res) => {
    const { id } = req.params;
    const { phone, email } = req.body; // Only allow updating non-critical fields

    try {
        db.prepare('UPDATE employees SET phone = ?, email = ? WHERE id = ?')
            .run(phone, email, id);
        // Also update users table email if it changed, to keep login in sync
        if (email) {
            db.prepare('UPDATE users SET email = ? WHERE id = ?').run(email, id);
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Initialize DB on startup
initDb();

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

export { app };

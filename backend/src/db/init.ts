import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.resolve(__dirname, '../../zoo.db');

export const db = new Database(dbPath, { verbose: console.log });
db.pragma('foreign_keys = ON');

export const initDb = () => {
    const schema = `
        CREATE TABLE IF NOT EXISTS zoo_info (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            location TEXT,
            description TEXT,
            capacity TEXT,
            start_time TEXT,
            end_time TEXT
        );

        CREATE TABLE IF NOT EXISTS cages (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            type TEXT,
            capacity INTEGER,
            occupancy INTEGER DEFAULT 0,
            location TEXT,
            status TEXT DEFAULT 'Active'
        );

        CREATE TABLE IF NOT EXISTS animals (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            species TEXT NOT NULL,
            age INTEGER,
            gender TEXT,
            health_status TEXT,
            cage_id TEXT,
            notes TEXT,
            FOREIGN KEY (cage_id) REFERENCES cages(id)
        );

        CREATE TABLE IF NOT EXISTS employees (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE,
            role TEXT,
            phone TEXT,
            salary REAL,
            join_date TEXT,
            status TEXT DEFAULT 'Active'
        );

        CREATE TABLE IF NOT EXISTS doctors (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            specialization TEXT,
            email TEXT UNIQUE,
            phone TEXT,
            availability TEXT DEFAULT 'Available',
            experience TEXT
        );

        CREATE TABLE IF NOT EXISTS events (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            date TEXT,
            time TEXT,
            location TEXT,
            capacity INTEGER,
            registered_count INTEGER DEFAULT 0,
            status TEXT DEFAULT 'Upcoming'
        );

        CREATE TABLE IF NOT EXISTS tickets (
            id TEXT PRIMARY KEY,
            type TEXT NOT NULL,
            price REAL NOT NULL,
            description TEXT
        );

        CREATE TABLE IF NOT EXISTS ticket_sales (
            id TEXT PRIMARY KEY,
            ticket_id TEXT,
            quantity INTEGER,
            total_amount REAL,
            date TEXT,
            visitor_name TEXT,
            visitor_email TEXT,
            visitor_phone TEXT,
            FOREIGN KEY (ticket_id) REFERENCES tickets(id)
        );

        CREATE TABLE IF NOT EXISTS visitors (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE,
            phone TEXT,
            registration_date TEXT
        );

        CREATE TABLE IF NOT EXISTS inventory (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            category TEXT,
            quantity REAL,
            unit TEXT,
            min_threshold REAL,
            expiry_date TEXT,
            supplier TEXT
        );

        CREATE TABLE IF NOT EXISTS medical_checks (
            id TEXT PRIMARY KEY,
            animal_id TEXT,
            doctor_id TEXT,
            date TEXT,
            diagnosis TEXT,
            treatment TEXT,
            status TEXT DEFAULT 'Completed',
            notes TEXT,
            FOREIGN KEY (animal_id) REFERENCES animals(id),
            FOREIGN KEY (doctor_id) REFERENCES doctors(id)
        );

        CREATE TABLE IF NOT EXISTS vaccinations (
            id TEXT PRIMARY KEY,
            animal_id TEXT,
            vaccine_name TEXT,
            date_administered TEXT,
            next_due_date TEXT,
            veterinarian TEXT,
            notes TEXT,
            FOREIGN KEY (animal_id) REFERENCES animals(id)
        );

        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'visitor'
        );

        CREATE TABLE IF NOT EXISTS attendance (
            id TEXT PRIMARY KEY,
            employee_id TEXT,
            date TEXT,
            check_in TEXT,
            check_out TEXT,
            status TEXT,
            FOREIGN KEY (employee_id) REFERENCES employees(id)
        );

        CREATE TABLE IF NOT EXISTS jobs (
            id TEXT PRIMARY KEY,
            employee_id TEXT,
            title TEXT,
            description TEXT,
            status TEXT DEFAULT 'Pending',
            assigned_date TEXT,
            due_date TEXT,
            FOREIGN KEY (employee_id) REFERENCES employees(id)
        );

        CREATE TABLE IF NOT EXISTS stock_requests (
            id TEXT PRIMARY KEY,
            employee_id TEXT,
            item_name TEXT,
            quantity REAL,
            unit TEXT,
            reason TEXT,
            status TEXT DEFAULT 'Pending',
            request_date TEXT,
            FOREIGN KEY (employee_id) REFERENCES employees(id)
        );
    `;

    db.exec(schema);
    console.log('Database initialized successfully.');
};

if (require.main === module) {
    initDb();
}

import { Animal, Cage, Doctor, Employee, InventoryItem, MedicalCheck, Ticket, TicketSale, User, Vaccination, Visitor, ZooEvent } from '../types';
export const mockAnimals: Animal[] = [{
  id: '1',
  name: 'Simba',
  species: 'Lion',
  age: 5,
  gender: 'Male',
  cageId: 'C1',
  healthStatus: 'Healthy',
  admissionDate: '2020-05-15',
  notes: 'Dominant male, good appetite'
}, {
  id: '2',
  name: 'Nala',
  species: 'Lion',
  age: 4,
  gender: 'Female',
  cageId: 'C1',
  healthStatus: 'Healthy',
  admissionDate: '2020-06-20',
  notes: 'Playful, interacts well with keepers'
}, {
  id: '3',
  name: 'Dumbo',
  species: 'Elephant',
  age: 12,
  gender: 'Male',
  cageId: 'C2',
  healthStatus: 'Healthy',
  admissionDate: '2018-03-10',
  notes: 'Needs extra hydration in summer'
}, {
  id: '4',
  name: 'Melman',
  species: 'Giraffe',
  age: 7,
  gender: 'Male',
  cageId: 'C3',
  healthStatus: 'Under Observation',
  admissionDate: '2019-11-05',
  notes: 'Mild limp on left front leg'
}, {
  id: '5',
  name: 'Skipper',
  species: 'Penguin',
  age: 3,
  gender: 'Male',
  cageId: 'C4',
  healthStatus: 'Healthy',
  admissionDate: '2021-01-15',
  notes: 'Very active during feeding time'
}];
export const mockCages: Cage[] = [{
  id: 'C1',
  name: 'Savanna Enclosure A',
  type: 'Outdoor',
  capacity: 5,
  occupancy: 2,
  location: 'North Zone',
  status: 'Active'
}, {
  id: 'C2',
  name: 'Elephant Sanctuary',
  type: 'Outdoor',
  capacity: 3,
  occupancy: 1,
  location: 'North Zone',
  status: 'Active'
}, {
  id: 'C3',
  name: 'Giraffe Heights',
  type: 'Mixed',
  capacity: 4,
  occupancy: 1,
  location: 'East Zone',
  status: 'Active'
}, {
  id: 'C4',
  name: 'Arctic Cove',
  type: 'Indoor/Pool',
  capacity: 20,
  occupancy: 12,
  location: 'South Zone',
  status: 'Active'
}, {
  id: 'C5',
  name: 'Reptile House',
  type: 'Indoor',
  capacity: 50,
  occupancy: 45,
  location: 'West Zone',
  status: 'Maintenance'
}];
export const mockEmployees: Employee[] = [{
  id: 'E1',
  name: 'John Doe',
  email: 'john@zoo.com',
  role: 'Zookeeper',
  phone: '555-0101',
  salary: 45000,
  joinDate: '2019-01-15',
  status: 'Active'
}, {
  id: 'E2',
  name: 'Jane Smith',
  email: 'jane@zoo.com',
  role: 'Manager',
  phone: '555-0102',
  salary: 65000,
  joinDate: '2018-05-20',
  status: 'Active'
}, {
  id: 'E3',
  name: 'Mike Johnson',
  email: 'mike@zoo.com',
  role: 'Maintenance',
  phone: '555-0103',
  salary: 40000,
  joinDate: '2020-03-10',
  status: 'On Leave'
}];
export const mockDoctors: Doctor[] = [{
  id: 'D1',
  name: 'Dr. Sarah Wilson',
  specialization: 'Large Mammals',
  email: 'sarah@zoo.com',
  phone: '555-0201',
  availability: 'Available'
}, {
  id: 'D2',
  name: 'Dr. James Chen',
  specialization: 'Avian & Reptiles',
  email: 'james@zoo.com',
  phone: '555-0202',
  availability: 'On Call'
}];
export const mockInventory: InventoryItem[] = [{
  id: 'I1',
  name: 'Premium Meat Mix',
  category: 'Food',
  quantity: 500,
  unit: 'kg',
  expiryDate: '2024-06-30',
  minThreshold: 100
}, {
  id: 'I2',
  name: 'Hay Bales',
  category: 'Food',
  quantity: 200,
  unit: 'bales',
  expiryDate: '2024-12-31',
  minThreshold: 50
}, {
  id: 'I3',
  name: 'Antibiotics Type A',
  category: 'Medicine',
  quantity: 50,
  unit: 'doses',
  expiryDate: '2025-01-15',
  minThreshold: 20
}, {
  id: 'I4',
  name: 'Cleaning Solution',
  category: 'Equipment',
  quantity: 100,
  unit: 'liters',
  minThreshold: 20
}];
export const mockTickets: Ticket[] = [{
  id: 'T1',
  type: 'Adult',
  price: 25,
  description: 'Standard entry for ages 13-64'
}, {
  id: 'T2',
  type: 'Child',
  price: 15,
  description: 'Entry for ages 3-12'
}, {
  id: 'T3',
  type: 'Senior',
  price: 20,
  description: 'Entry for ages 65+'
}, {
  id: 'T4',
  type: 'Group',
  price: 18,
  description: 'Per person, min 10 people'
}];
export const mockEvents: ZooEvent[] = [{
  id: 'EV1',
  title: 'Lion Feeding',
  description: 'Watch our keepers feed the lions',
  date: '2024-06-15',
  time: '14:00',
  location: 'Savanna Enclosure',
  capacity: 50,
  registeredCount: 32,
  status: 'Upcoming'
}, {
  id: 'EV2',
  title: 'Elephant Bath',
  description: 'See the elephants get a scrub',
  date: '2024-06-16',
  time: '11:00',
  location: 'Elephant Sanctuary',
  capacity: 100,
  registeredCount: 85,
  status: 'Upcoming'
}, {
  id: 'EV3',
  title: 'Night Safari',
  description: 'Guided tour after dark',
  date: '2024-06-20',
  time: '20:00',
  location: 'Main Gate',
  capacity: 30,
  registeredCount: 30,
  status: 'Upcoming'
}];
export const mockVisitors: Visitor[] = [{
  id: 'V1',
  name: 'Alice Brown',
  email: 'alice@example.com',
  phone: '555-0301',
  registrationDate: '2024-01-10'
}, {
  id: 'V2',
  name: 'Bob Wilson',
  email: 'bob@example.com',
  phone: '555-0302',
  registrationDate: '2024-02-15'
}];
export const mockMedicalChecks: MedicalCheck[] = [{
  id: 'MC1',
  animalId: '1',
  doctorId: 'D1',
  date: '2024-05-01',
  diagnosis: 'Healthy checkup',
  treatment: 'None',
  status: 'Completed'
}, {
  id: 'MC2',
  animalId: '4',
  doctorId: 'D1',
  date: '2024-05-10',
  diagnosis: 'Mild inflammation',
  treatment: 'Anti-inflammatory meds',
  status: 'Completed'
}];
export const mockVaccinations: Vaccination[] = [{
  id: 'VAC1',
  animalId: '1',
  vaccineName: 'Rabies',
  dateAdministered: '2023-06-15',
  nextDueDate: '2024-06-15',
  veterinarian: 'Dr. Sarah Wilson'
}, {
  id: 'VAC2',
  animalId: '3',
  vaccineName: 'Tetanus',
  dateAdministered: '2023-08-20',
  nextDueDate: '2024-08-20',
  veterinarian: 'Dr. Sarah Wilson'
}];
export const mockSales: TicketSale[] = [{
  id: 'S1',
  ticketId: 'T1',
  quantity: 2,
  totalAmount: 50,
  date: '2024-06-01',
  visitorName: 'Alice Brown'
}, {
  id: 'S2',
  ticketId: 'T2',
  quantity: 3,
  totalAmount: 45,
  date: '2024-06-01',
  visitorName: 'Alice Brown'
}, {
  id: 'S3',
  ticketId: 'T1',
  quantity: 1,
  totalAmount: 25,
  date: '2024-06-02',
  visitorName: 'Bob Wilson'
}];
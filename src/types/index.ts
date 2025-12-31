// Database types based on the ERD schema

export interface Ticket {
  id: string;
  type: string;
  price: number;
  description: string;
  startDate: string;
  discountPercentage: number;
}

export interface TicketSale {
  id: string;
  ticketId: string;
  quantity: number;
  totalAmount: number;
  date: string;
  visitorName: string;
  visitorEmail?: string;
  visitorPhone?: string;
}

export interface Visitor {
  id: string;
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
}

export interface Event {
  eventId: string;
  eventName: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  maxCapacity: number;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  salary: number;
  joinDate: string;
  status: 'Active' | 'Inactive' | 'Pending';
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'employee' | 'visitor';
}

export interface ZooInfo {
  zooId: string;
  name: string;
  location: string;
  description: string;
  capacity: string;
  startTime: string;
  endTime: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  availability: 'Available' | 'On Call' | 'Busy';
  experience?: string;
}

export interface Cage {
  id: string;
  name: string;
  type: string;
  location: string;
  capacity: number;
  occupancy: number;
  status: 'Active' | 'Maintenance' | 'Closed';
}

export interface ZooEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  registeredCount: number;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
}

export interface Animal {
  id: string;
  name: string;
  species: string;
  age: number;
  gender: 'Male' | 'Female';
  healthStatus: 'Healthy' | 'Sick' | 'Under Observation';
  cageId: string;
  notes?: string;
}

export interface MedicalCheck {
  id: string;
  animalId: string;
  doctorId: string;
  date: string;
  diagnosis: string;
  treatment: string;
  status: 'Scheduled' | 'Completed';
  notes?: string;
}

export interface Vaccination {
  id: string;
  animalId: string;
  vaccineName: string;
  dateAdministered: string;
  nextDueDate: string;
  veterinarian: string;
  notes?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Food' | 'Medicine' | 'Equipment' | 'Supplies';
  quantity: number;
  unit: string;
  minThreshold: number;
  expiryDate?: string;
  supplier?: string;
}

export type TicketType = Ticket;
// Form data types
export interface TicketFormData {
  startDate: string;
  price: string;
  discountPercentage: string;
}

export interface EventFormData {
  eventName: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  maxCapacity: string;
}

export interface Notification {
  id: string;
  type: 'Health' | 'Stock' | 'Event';
  title: string;
  message: string;
  severity: 'Critical' | 'Warning' | 'Info';
  timestamp: string;
  link?: string;
  metadata?: {
    entityId: string;
    entityType: 'Animal' | 'Inventory' | 'Event';
  };
}

export interface Attendance {
  id: string;
  employeeId: string;
  employeeName?: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'Present' | 'Absent' | 'Leave';
}

export interface Job {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  assignedDate: string;
  dueDate: string;
}

export interface StockRequest {
  id: string;
  employeeId: string;
  itemName: string;
  quantity: number;
  unit: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestDate: string;
}
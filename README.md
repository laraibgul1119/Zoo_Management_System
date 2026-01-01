# 🦁 Zoo Management System (ZMS)

A comprehensive, full-stack web application for managing zoo operations including animal care, employee management, visitor services, inventory tracking, and event coordination.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Database Management](#database-management)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Zoo Management System (ZMS) is a modern web application designed to streamline zoo operations.  It provides comprehensive tools for managing animals, employees, visitors, inventory, events, and daily operations through an intuitive user interface.

## ✨ Features

### 🐾 Animal Management
- Track animal information (species, age, health status)
- Monitor feeding schedules and medical records
- Habitat management and maintenance
- Animal health tracking and veterinary care coordination

### 👥 Employee Management
- Employee profiles and role management
- Attendance tracking system
- Job assignment and scheduling
- Department organization

### 🎫 Visitor Services
- Visitor registration and tracking
- Ticket sales and pricing management
- Visit history and analytics
- Customer relationship management

### 📦 Inventory Management
- Stock tracking for food, medicine, and supplies
- Automated reorder alerts
- Stock request system for employees
- Inventory categorization and organization

### 📅 Event Management
- Event planning and scheduling
- Visitor event registration
- Event capacity management
- Activity coordination

### 📊 Analytics & Reporting
- Attendance reports
- Revenue tracking
- Operational insights
- Performance metrics

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript** - Type-safe JavaScript
- **React Router DOM 6.26.2** - Client-side routing
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Lucide React 0.522.0** - Icon library
- **Vite 5.2.0** - Build tool and dev server

### Backend
- **Node.js** - JavaScript runtime
- **Express 4.21.1** - Web application framework
- **TypeScript** - Type-safe development
- **Better-SQLite3 11.5.0** - Embedded database
- **CORS 2.8.5** - Cross-origin resource sharing
- **dotenv 16.4.5** - Environment variable management

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **ts-node** - TypeScript execution
- **Nodemon** - Auto-restart development server

## 📁 Project Structure

```
Zoo_Management_System/
├── backend/                  # Backend server
│   ├── src/
│   │   ├── db/              # Database initialization and schemas
│   │   ├── routes/          # API route handlers
│   │   ├── controllers/     # Business logic
│   │   └── index.ts         # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── src/                      # Frontend source
│   ├── components/          # React components
│   ├── contexts/            # React contexts
│   ├── pages/               # Page components
│   ├── types/               # TypeScript types
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Main app component
│   ├── index.tsx            # Entry point
│   └── index.css            # Global styles
├── public/                   # Static assets
├── index. html               # HTML template
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
├── TEST_DATA_CLEANUP_GUIDE.md  # Data cleanup documentation
└── ZMS_Complete_Documentation.pdf  # Complete documentation
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed: 
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Git**

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/laraibgul1119/Zoo_Management_System.git
cd Zoo_Management_System
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### 4. Initialize Database

```bash
cd backend
npm run init-db
cd ..
```

## 💻 Usage

### Development Mode

#### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:3000` (or configured port).

#### Start Frontend Development Server

In a new terminal: 

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`.

### Production Build

#### Build Frontend

```bash
npm run build
```

#### Build Backend

```bash
cd backend
npm run build
npm start
```

## 🗄️ Database Management

### Database Location
The SQLite database file is located at `backend/zoo.db`.

### Initialize/Reset Database

```bash
cd backend
npm run init-db
```

### Clean Test Data

Remove all test data from the database: 

```bash
node cleanup-test-data.cjs
```

For detailed cleanup instructions, see [TEST_DATA_CLEANUP_GUIDE. md](./TEST_DATA_CLEANUP_GUIDE.md).

### Backup Database

```bash
# Windows
copy backend\zoo.db backend\zoo.db.backup

# Linux/Mac
cp backend/zoo. db backend/zoo.db.backup
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Main Endpoints

#### Animals
- `GET /animals` - Get all animals
- `GET /animals/:id` - Get animal by ID
- `POST /animals` - Create new animal
- `PUT /animals/:id` - Update animal
- `DELETE /animals/:id` - Delete animal

#### Employees
- `GET /employees` - Get all employees
- `GET /employees/:id` - Get employee by ID
- `POST /employees` - Create new employee
- `PUT /employees/:id` - Update employee
- `DELETE /employees/:id` - Delete employee

#### Visitors
- `GET /visitors` - Get all visitors
- `GET /visitors/:id` - Get visitor by ID
- `POST /visitors` - Create new visitor
- `PUT /visitors/:id` - Update visitor

#### Events
- `GET /events` - Get all events
- `GET /events/:id` - Get event by ID
- `POST /events` - Create new event
- `PUT /events/:id` - Update event
- `DELETE /events/:id` - Delete event

#### Inventory
- `GET /inventory` - Get all inventory items
- `GET /inventory/:id` - Get item by ID
- `POST /inventory` - Add new item
- `PUT /inventory/:id` - Update item
- `DELETE /inventory/:id` - Delete item

#### Tickets
- `GET /tickets` - Get all ticket sales
- `POST /tickets` - Create ticket sale

#### Attendance
- `GET /attendance` - Get attendance records
- `POST /attendance` - Mark attendance

For complete API documentation, refer to `ZMS_Complete_Documentation.pdf`.

## 📸 Screenshots

### Home Dashboard
<!-- Add screenshot here -->
![Home Dashboard](screenshots/dashboard.png)

### Animal Management
<!-- Add screenshot here -->
![Animal Management](screenshots/animals.png)

### Employee Management
<!-- Add screenshot here -->
![Employee Management](screenshots/employees.png)

### Visitor Services
<!-- Add screenshot here -->
![Visitor Services](screenshots/visitors. png)

### Inventory System
<!-- Add screenshot here -->
![Inventory System](screenshots/inventory. png)

### Event Management
<!-- Add screenshot here -->
![Event Management](screenshots/events.png)

### Ticket Sales
<!-- Add screenshot here -->
![Ticket Sales](screenshots/tickets.png)

### Reports & Analytics
<!-- Add screenshot here -->
![Reports & Analytics](screenshots/reports.png)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Follow TypeScript best practices
- Use ESLint for code linting
- Write meaningful commit messages
- Add comments for complex logic

## 📝 License

This project is licensed under the ISC License. 

## 👥 Authors

- **Laraib Gul** - [@laraibgul1119](https://github.com/laraibgul1119)

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js community
- SQLite for the embedded database
- Tailwind CSS for the styling framework
- All contributors and supporters

## 📞 Support

For questions or support: 
- Open an issue on GitHub
- Email:  [Add your email]
- Documentation: See `ZMS_Complete_Documentation.pdf`

## 🔄 Version History

- **v0.0.1** - Initial release
  - Core animal, employee, and visitor management
  - Inventory tracking system
  - Event management
  - Ticket sales module
  - Attendance tracking

## 🗺️ Roadmap

- [ ] Mobile responsive design improvements
- [ ] Advanced reporting and analytics
- [ ] Email notification system
- [ ] Multi-language support
- [ ] Role-based access control (RBAC)
- [ ] Integration with external payment gateways
- [ ] Mobile application
- [ ] Real-time notifications
- [ ] Export functionality (PDF, Excel)
- [ ] Photo management for animals

## 🐛 Known Issues

See the [Issues](https://github.com/laraibgul1119/Zoo_Management_System/issues) page for known bugs and feature requests.

---

Made with ❤️ for wildlife conservation and zoo management

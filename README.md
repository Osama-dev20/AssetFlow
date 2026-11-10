# AssetFlow

### Smart Asset & Maintenance Management Platform

AssetFlow is a modern web-based Computerized Maintenance Management System (CMMS) designed to help organizations manage their assets, track equipment failures, prioritize maintenance tasks, and optimize resource utilization.

The platform focuses on helping organizations make smarter maintenance decisions, especially when resources, spare parts, and technical teams are limited.

## Project Overview

Many organizations rely on critical equipment such as generators, water pumps, medical devices, and cooling systems.

When multiple failures occur simultaneously, maintenance teams need more than a simple fault-reporting system. They need a way to understand the impact of each failure, determine which issue requires immediate attention, and allocate available resources efficiently.

**AssetFlow provides a centralized platform for managing these challenges.**

## Key Features

- **Authentication & Authorization:** User authentication and role-based access control.
- **Dashboard:** Overview of assets, reported issues, and maintenance activities.
- **Asset Management:** Register, view, and update organizational assets.
- **Site Management:** Organize assets across multiple locations.
- **Issue Management:** Report equipment failures and manage maintenance issues.
- **AI-Assisted Analysis:** Analyze reported issues to support maintenance prioritization.
- **User Management:** Manage system users and technicians.
- **Responsive Interface:** Modern user interface designed for different screen sizes.

### Features Under Development

- Work Order Management
- Preventive Maintenance Scheduling
- Advanced Dashboard Analytics
- Configurable Priority Settings
- Advanced Reporting

## Technologies Used

### Frontend

- React
- TypeScript
- Vite
- CSS
- React Router
- Fetch API

### Backend

- Laravel
- PHP
- RESTful APIs
- Laravel Sanctum
- Relational Database

## Project Repositories

The project is organized into separate frontend and backend repositories.

**Frontend — React + TypeScript**

https://github.com/Osama-dev20/AssetFlow

**Backend — Laravel**

https://github.com/fayezrajab2004/AssetFlow-Backend

The frontend communicates with the Laravel backend through REST APIs, using Laravel Sanctum for authentication.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- PHP
- Composer
- A database supported by Laravel
- Git

### 1. Clone the Frontend Repository

```bash
git clone https://github.com/Osama-dev20/AssetFlow.git
cd AssetFlow/frontend
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Start the Frontend

```bash
npm run dev
```

The frontend development server will be available at:

```text
http://localhost:3000
```

### 4. Clone the Backend Repository

Open a separate terminal:

```bash
git clone https://github.com/fayezrajab2004/AssetFlow-Backend.git
```

### 5. Install Backend Dependencies

```bash
composer install
```

### 6. Configure Laravel

Create your environment file from the example:

```bash
cp .env.example .env
```

Configure your database credentials and application settings in `.env`.

Generate the application key:

```bash
php artisan key:generate
```

Run database migrations:

```bash
php artisan migrate
```

If the backend provides seeders for development data, run them according to the backend documentation.

### 7. Start the Backend Server

```bash
php artisan serve --host=localhost --port=8000
```

Backend URL:

```text
http://localhost:8000
```

Ensure that Laravel Sanctum, CORS, and session settings allow requests from the frontend development server.

## System Workflow

AssetFlow follows a structured maintenance management process:

1. **Issue Reporting:** A user reports an equipment failure.
2. **Issue Analysis:** The system analyzes the reported problem.
3. **Priority Assessment:** Maintenance urgency is evaluated based on the issue's impact.
4. **Resource Evaluation:** Available resources and spare parts are considered.
5. **Task Assignment:** Maintenance work is assigned to the appropriate technician.
6. **Progress Tracking:** Maintenance activities are monitored.
7. **Impact Monitoring:** The organization reviews maintenance outcomes.
8. **Reporting:** Maintenance data supports operational decisions.
9. **Continuous Improvement:** Historical information helps improve future maintenance planning.

Some workflow stages are planned and are not yet fully implemented.

## Target Organizations

AssetFlow is designed for organizations that depend on critical physical assets, including:

- Hospitals and healthcare facilities
- Water and energy providers
- Universities and educational institutions
- Municipalities
- Industrial facilities
- NGOs and field operations

## Project Status

**Status: Active Development**

The main frontend interfaces and core backend integrations have been implemented.

Authentication, asset management, site management, issue management, and user-related integrations are available for testing.

Work orders, preventive maintenance, advanced statistics, and additional configuration features require further backend integration and testing.

## Project Team

AssetFlow is developed as a **Computer Science Graduation Project**.

The development team consists of:

- 2 Frontend Developers — React & TypeScript
- 2 Backend Developers — Laravel
- 1 UI/UX Designer

## Project Goals

- Improve maintenance management efficiency.
- Reduce equipment downtime.
- Support data-driven maintenance decisions.
- Prioritize critical failures.
- Improve resource allocation.
- Provide an accessible and organized maintenance management experience.

---

**AssetFlow — Smarter Maintenance. Better Decisions.**
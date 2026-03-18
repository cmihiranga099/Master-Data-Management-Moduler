# Master Data Management System

A secure full-stack web application for managing departments with JWT-based authentication.

---

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Backend  | Java 17, Spring Boot 3.2, Spring Security, JWT, Spring Data JPA |
| Frontend | ReactJS, Vite, React Router, Axios |
| Database | MySQL 8 |

---

## Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- MySQL 8
- Maven (included via mvnw)

---

## Project Structure

```
Master Data Management Module/
├── mdm-backend/       Spring Boot backend (port 8001)
├── mdm-frontend/      React frontend (port 5173)
├── database.sql       Database setup script
└── README.md          This file
```

---

## Setup Instructions

### Step 1 — Database

Open MySQL Workbench and run the database script:

```sql
source /path/to/database.sql
```

Or open database.sql in MySQL Workbench and click the lightning bolt to execute.

---

### Step 2 — Backend

```bash
cd mdm-backend
```

Open this file and set your MySQL password:

```
src/main/resources/application.properties
```

```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

Start the backend:

```bash
.\mvnw.cmd spring-boot:run
```

Backend runs at: http://localhost:8001

---

### Step 3 — Frontend

```bash
cd mdm-frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

---

## Default Login

| Field    | Value    |
|----------|----------|
| Username | admin    |
| Password | admin123 |

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/login | No | Login and get JWT token |
| GET | /api/departments | Yes | Get all departments |
| GET | /api/departments/{id} | Yes | Get department by ID |
| POST | /api/departments | Yes | Create new department |
| PUT | /api/departments/{id} | Yes | Update department |
| DELETE | /api/departments/{id} | Yes | Delete department |

All protected endpoints require this header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Security

- Passwords hashed using BCrypt
- JWT tokens for stateless authentication
- All API endpoints protected except login
- Frontend routes protected — redirects to login if no token present

---

## Database Schema

**users table**

| Column | Type | Details |
|--------|------|---------|
| id | BIGINT | Primary Key, Auto Increment |
| username | VARCHAR(50) | Unique, Not Null |
| password | VARCHAR(255) | BCrypt hashed |
| role | VARCHAR(20) | Not Null |
| created_at | TIMESTAMP | Auto generated |

**departments table**

| Column | Type | Details |
|--------|------|---------|
| id | BIGINT | Primary Key, Auto Increment |
| name | VARCHAR(100) | Unique, Not Null |
| description | VARCHAR(255) | Optional |
| created_at | TIMESTAMP | Auto generated |
| updated_at | TIMESTAMP | Auto updated on change |

---

## Running the Project

You need two terminals open at the same time.

Terminal 1 — Backend:

```bash
cd mdm-backend
.\mvnw.cmd spring-boot:run
```

Terminal 2 — Frontend:

```bash
cd mdm-frontend
npm run dev
```

Open browser at http://localhost:5173 and login with the default credentials above.

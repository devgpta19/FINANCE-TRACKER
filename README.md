# Finance Tracker - Full-Stack Management & Access Control

Finance Tracker is a comprehensive financial management system designed to evaluate backend engineering excellence. It focuses on robust API design, secure data modeling, multi-tenant isolation, and granular role-based access control (RBAC).

---

## 🎯 Project Objective
To provide a reliable, maintainable, and secure backend for managing financial records, serving real-time analytics to a frontend dashboard, and enforcing strict access boundaries between different user roles.

---

## 🏗️ Backend Architecture

The backend is built with **Java 17** and **Spring Boot**, following a layered architecture for maximum separation of concerns:

- **Controllers**: RESTful endpoints with request validation.
- **Services**: Business logic layer (e.g., net balance calculations, record filtering).
- **Repositories**: Data access layer using Spring Data JPA.
- **DTOs**: Data Transfer Objects to decouple internal entities from the API contract.
- **Security**: Custom Spring Security configuration with JWT-based authentication.

### Core Features

#### 1. User & Role Management
- **Hierarchical Access**: Supports `ADMIN` and `VIEWER` roles.
- **User Lifecycle**: Register, login, and manage user status (`ACTIVE`/`INACTIVE`).
- **Authorization**: Granular method-level security using `@PreAuthorize`.

#### 2. Financial Records (Multi-Tenant Isolation)
- **Data Isolation**: Users only have access to records they created.
- **Attributes**: Amount, Type (Income/Expense), Category, Date, and Description.
- **Operations**: Full CRUD with **integrated frontend filtering** (by type, date range, or category) that leverages server-side logic.

#### 3. Dashboard Analytics
- **Aggregated Data**: Real-time calculation of Total Income, Total Expenses, and Net Balance.
- **Visual Insights**: Category-wise distribution and monthly spending trends.

#### 4. GenAI (Generative AI) Integration
- **AI Financial Advisor**: An intelligent chatbot that provides context-aware financial advice.
- **Natural Language Insights**: Users can ask questions about their spending patterns directly to the AI.

#### 5. Robust Validation & Error Handling
- **Input Validation**: Enforced at the API level via `jakarta.validation`.
- **Global Exception Handling**: A centralized `@RestControllerAdvice` ensures consistent error responses and appropriate HTTP status codes.

---

## 🛠️ Tech Stack

- **Backend**: Spring Boot 3.4.1, Spring Security, Spring Data JPA, Hibernate, JJWT, Spring AI (Gemini).
- **Database**: MySQL (Production-ready relational storage).
- **Frontend**: React (Vite), MUI (Material UI), Chart.js, Axios.
- **AI**: Google Gemini API via Spring AI.
- **Language**: Java 17, JavaScript (ES6+).

---

## 🚀 API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Create a new account.
- `POST /api/auth/login` - Authenticate and receive a JWT.

### Dashboard (Analytics)
- `GET /api/dashboard/summary` - Retrieve high-level financial totals.
- `GET /api/dashboard/category-summary` - Get breakdown by category.
- `GET /api/dashboard/monthly-trends` - Monthly trend data for charts.

### Records
- `GET /api/records` - List records (with optional filters).
- `POST /api/records` - Create a new entry (**Admin only**).
- `PUT /api/records/{id}` - Update existing entry (**Admin only**).
- `DELETE /api/records/{id}` - Remove an entry (**Admin only**).

### Users (Admin Only)
- `GET /api/users` - List all system users.
- `PATCH /api/users/{id}/status` - Activate/Deactivate a user.

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- JDK 17+
- MySQL Server 8.0+
- Node.js & npm

### 2. Backend Setup
1. Create a MySQL database named `fintrack_db`.
2. Configure your credentials in `fintrack/src/main/resources/application.properties`.
   - Ensure you add your `spring.ai.google.api-key` from [Google AI Studio](https://aistudio.google.com/).
3. Run the application:
   ```bash
   cd fintrack
   ./mvnw spring-boot:run
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd FinFront
   npm install
   npm run dev
   ```

---

## 📝 Assumptions & Trade-offs
- **JWT Authentication**: Chose stateless JWT over sessions for better scalability and modern frontend compatibility.
- **Multi-Tenant Logic**: Implemented data isolation at the service layer by always filtering queries by the `getCurrentUser()` context.
- **Role Scoping**: Simplified the initial role set to `ADMIN` and `VIEWER` to demonstrate core RBAC functionality clearly, with structural support to add more roles easily.


# FinTrack API Documentation

Welcome to the **FinTrack** API documentation. This document provides a detailed overview of all available endpoints, authentication mechanisms, and data structures used in the Finance Tracker backend.

---

## 🚀 Getting Started

- **Base URL**: `http://localhost:8080`
- **Content-Type**: `application/json`
- **Authentication**: JWT (JSON Web Token) via Bearer Auth Header.

### Authentication Flow
1. Register a new account via `/api/auth/register`.
2. Login via `/api/auth/login` to receive a `token`.
3. Include the token in the header of all subsequent requests:
   `Authorization: Bearer <your_jwt_token>`

---

## 🔐 Role-Based Access Control (RBAC)

The system enforces strict role-based access to ensure data security and integrity:

| Role | Permissions |
| :--- | :--- |
| **ADMIN** | Full access to create, update, and delete records and users. |
| **VIEWER** | Read-only access to dashboard and records. Cannot modify any data. |

---

## 🛠️ API Endpoints

### 1. Authentication (`/api/auth`)

#### **Register a New User**
- **Endpoint**: `POST /api/auth/register`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "strongPassword123"
  }
  ```
- **Success Response** (200 OK):
  ```json
  {
    "token": "eyJhbGci...",
    "message": "User registered successfully",
    "role": "ADMIN",
    "email": "john@example.com"
  }
  ```

#### **Login**
- **Endpoint**: `POST /api/auth/login`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "strongPassword123"
  }
  ```
- **Success Response** (200 OK):
  ```json
  {
    "token": "eyJhbGci...",
    "message": "Login successful",
    "role": "ADMIN",
    "email": "john@example.com"
  }
  ```

---

### 2. Dashboard (`/api/dashboard`)

#### **Get Dashboard Summary**
- **Endpoint**: `GET /api/dashboard/summary`
- **Auth Required**: Yes (`ADMIN` or `VIEWER`)
- **Success Response** (200 OK):
  ```json
  {
    "totalIncome": 5000.00,
    "totalExpenses": 2000.00,
    "netBalance": 3000.00,
    "recentActivity": []
  }
  ```

#### **Get Category Breakdown**
- **Endpoint**: `GET /api/dashboard/category-summary`
- **Auth Required**: Yes (`ADMIN` or `VIEWER`)
- **Success Response** (200 OK):
  ```json
  [
    { "category": "Salary", "amount": 5000.00, "percentage": 71.4 },
    { "category": "Rent", "amount": 1000.00, "percentage": 14.3 }
  ]
  ```

#### **Get Monthly Trends**
- **Endpoint**: `GET /api/dashboard/monthly-trends`
- **Auth Required**: Yes (`ADMIN` or `VIEWER`)
- **Success Response** (200 OK):
  ```json
  [
    { "month": "January", "income": 5000, "expenses": 1200 },
    { "month": "February", "income": 4500, "expenses": 1500 }
  ]
  ```

---

### 3. Financial Records (`/api/records`)

#### **List & Filter Records**
- **Endpoint**: `GET /api/records`
- **Auth Required**: Yes (`ADMIN` or `VIEWER`)
- **Query Parameters**:
  - `type` (Optional): `INCOME` or `EXPENSE`
  - `categoryId` (Optional): ID of the category
  - `startDate` (Optional): `YYYY-MM-DD`
  - `endDate` (Optional): `YYYY-MM-DD`
- **Success Response** (200 OK):
  ```json
  [
    {
      "id": 1,
      "amount": 1200.50,
      "type": "INCOME",
      "category": "Freelance",
      "date": "2024-04-05",
      "description": "Project payment",
      "createdBy": "John Doe",
      "createdAt": "2024-04-05T10:00:00"
    }
  ]
  ```

#### **Create Record**
- **Endpoint**: `POST /api/records`
- **Auth Required**: Yes (**ADMIN ONLY**)
- **Request Body**:
  ```json
  {
    "amount": 50.00,
    "type": "EXPENSE",
    "categoryId": 2,
    "date": "2024-04-05",
    "description": "Lunch"
  }
  ```
- **Success Response** (200 OK): `FinancialRecordResponse` object.

#### **Update Record**
- **Endpoint**: `PUT /api/records/{id}`
- **Auth Required**: Yes (**ADMIN ONLY**)
- **Request Body**: Same as Create.

#### **Delete Record**
- **Endpoint**: `DELETE /api/records/{id}`
- **Auth Required**: Yes (**ADMIN ONLY**)

---

### 4. User Management (`/api/users`) - **ADMIN ONLY**

#### **List All Users**
- **Endpoint**: `GET /api/users`
- **Success Response**: List of `UserResponse` objects.

#### **Update User Status**
- **Endpoint**: `PATCH /api/users/{id}/status`
- **Request Body**:
  ```json
  { "status": "INACTIVE" }
  ```

---

## 🛑 Error Handling

The API returns a consistent error format for all failed requests:

| Status Code | Description |
| :--- | :--- |
| **400 Bad Request** | Invalid input data or validation failure. |
| **401 Unauthorized** | Missing or invalid JWT token. |
| **403 Forbidden** | User does not have the required role for the action. |
| **404 Not Found** | Resource with the specified ID does not exist. |

**Error Format**:
```json
{
  "message": "Resource not found",
  "status": 404,
  "timestamp": "2024-04-05T12:00:00.000"
}
```

---
**Document Status**: Final Version (v1.0)

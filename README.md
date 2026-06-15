# Vehicle Service Booking System

A MEAN-stack web application for a single auto workshop. Customers book vehicle services online, staff review and schedule appointments, and admin manages services, users, and analytics.

## Tech Stack

- MongoDB — database
- Express.js — REST API
- Angular 21 — frontend
- Node.js — backend runtime

## Project Structure

```
ServicesBooking System/
├── Booking-Services/    # Angular frontend
└── backend/             # Express API
```

## Prerequisites

- Node.js 18+
- MongoDB running locally on `mongodb://localhost:27017`

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # or use the included .env
npm run seed           # creates admin + sample services
npm start              # runs on http://localhost:5000
```

**Default admin credentials:**
- Email: `admin@workshop.com`
- Password: `admin123`

### 2. Frontend

```bash
cd Booking-Services
npm install
npm start              # runs on http://localhost:4200
```

## Roles

| Role | Capabilities |
|------|-------------|
| **Customer** | Browse services, book with vehicle details, track/cancel pending bookings |
| **Staff** | Approve/reject requests, assign time slots, update status |
| **Admin** | Manage services, staff, customers, view monthly analytics |

## Booking Status Flow

```
Pending → Approved → In Progress → Completed
   ↓
Rejected / Cancelled (customer can cancel while Pending)
```

## API Endpoints

| Group | Base Path |
|-------|-----------|
| Auth | `/api/auth` |
| Services | `/api/services` |
| Bookings | `/api/bookings` |
| Users | `/api/users` |
| Analytics | `/api/analytics` |

## Demo Flow

1. Login as admin → manage services and create a staff account
2. Register as customer → book a service
3. Login as staff → approve booking with date/time
4. Staff marks In Progress → Completed
5. Admin views analytics for revenue

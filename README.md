# KOMAL Juice Restaurant

A full-stack restaurant ordering application built with React, Vite, Tailwind CSS, Node.js, Express, and MongoDB.

## Project Structure

- `/backend`: Node.js, Express, MongoDB API
- `/frontend`: React, Vite, Tailwind CSS, Zustand client

## Prerequisites

- Node.js (v18+)
- MongoDB Atlas Account (or Local MongoDB)
- Razorpay Account (for payments)
- Twilio Account (for OTP verification)

## Setup & Running Locally

### 1. Backend Setup

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file (one has been provided during development, but verify it has your real keys for production).
4. **Seed the Database** (Run this only once to populate the menu items, categories, settings, and the default admin user):
   ```bash
   npm run seed
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`.

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

### 3. Admin Access
After seeding the database, you can log into the Admin Dashboard using:
- **Email:** `admin@komal.com`
- **Password:** `Admin@1234`

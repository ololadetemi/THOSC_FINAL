# THOSC HMS — Trinity Hospital & Orthopaedic Spine Centre

Hospital Management System built with Node.js, MongoDB, React, and Tailwind CSS.

---

## Project Structure

```
THOSC/
├── backend/     ← Node.js + Express + MongoDB API
└── frontend/    ← React + Vite + Tailwind CSS
```

---

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your MONGODB_URI and JWT_SECRET in .env
npm run dev
```

Backend runs on: `http://localhost:5080`

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## First Time Setup

1. Start the backend
2. Create your first admin account by calling the register endpoint once:

```
POST http://localhost:5080/auth/register
Body: { "name": "Admin", "email": "admin@thosc.com", "role": "admin", "password": "yourpassword" }
```

> ⚠️ Remove the /auth/register route from authroutes.js after creating your admin account for security.

3. Log in as admin and create staff accounts from the Staff Management page.

---

## Roles

| Role | Access |
|------|--------|
| Admin | Full access — staff, payments, appointments |
| Doctor | All patients, notes, prescriptions, lab requests |
| Receptionist | Register patients, assign doctors, appointments |
| Lab Technician | Pending requests, upload results |
| Pharmacist | Pending prescriptions, drug inventory |

---

## AI Features

The AI consultation summary uses the Anthropic API directly from the frontend.
You will need to add your Anthropic API key to the fetch call in `DoctorPages.jsx`.

> ⚠️ For production, move the AI API call to your backend to protect your API key.

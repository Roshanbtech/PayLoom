# PayLoom — Payroll Management System (MERN + Ant Design)

A full-stack payroll app with **Admin** and **Employee** roles.

- **Admin**: Create/update **salary slips**, review/approve/reject **expenses**, manage **employees**, email notifications.
- **Employee**: View/filter **salary slips**, **download PDF** (INR format), submit **expenses** (modal).

---

## 🌐 Live Demo

- **Frontend (Vercel):** _<your-frontend-url-here>_
- **Backend (Render):** _<your-backend-url-here>_

**Demo Login (required by assignment)**
Email: hire-me@anshumat.org
Password: HireMe@2025!

markdown
Copy code

---

## ✅ Features

- Auth (Login/Signup) with **role-based** access (Admin / Employee)
- **Admin**
  - Create/Update **Salary Slips** (net pay auto-computed)
  - **Review Expenses**: approve/reject (workflow & toasts)
  - **Employees**: list + **Add Employee** (modal)
  - **Emails**: slip created, expense status updated (Nodemailer + branded HTML)
- **Employee**
  - **My Slips**: list, month filter, **PDF download** (styled, INR currency)
  - **My Expenses**: list + **Submit Expense** modal
- **UI/UX**
  - Atlas-like **dark theme**, **green table headers**, custom scrollbars
  - Responsive tables, sticky header safety fixes
- **PDF**
  - pdfkit with PayLoom brand: green header, meta card, banded rows, INR formatting

---

## 🧭 Screenshots

### Auth
<img src="./backend/docs/screenshots/employee/e1.png" alt="Login" width="640" />

### Admin
<img src="./backend/docs/screenshots/admin/a1.png" alt="Admin - Slips" width="640" />
<img src="./backend/docs/screenshots/admin/a6.png" alt="Admin - Review Expenses" width="640" />
<img src="./backend/docs/screenshots/admin/a12.png" alt="Admin - Employees" width="640" />

### Employee
<img src="./backend/docs/screenshots/employee/e3.png" alt="Employee - My Slips" width="640" />
<img src="./backend/docs/screenshots/employee/e6.png" alt="Employee - Submit Expense Modal" width="640" />

> More images live in `backend/docs/screenshots/admin` and `backend/docs/screenshots/employee`.

---

## 🧩 Tech Stack & Rationale

- **Frontend:** React + Ant Design  
  Fast for data-heavy dashboards and consistent components (tables, modals, forms).
- **Backend:** Node / Express + Mongoose (MongoDB Atlas)  
  Simple schemas, quick CRUD, role-based guards, great demo velocity.
- **Auth:** JWT + role guard middleware
- **Mail:** Nodemailer (SMTP) + HTML templates (PayLoom branding)
- **PDF:** pdfkit styled with INR currency
- **Deploy:** Frontend on **Vercel**, Backend on **Render**

---

## 📁 Project Structure

.
├── frontend/ # React + Ant Design (Vite)
│ └── src/
│ ├── pages/admin/ # Slips, ExpensesReview, Employees
│ ├── pages/employee/ # MySlips, MyExpenses (+ SubmitExpense modal)
│ ├── components/ # EmployeeSelect, modals
│ ├── context/ # AuthContext
│ ├── routes/ # ProtectedRoute
│ ├── lib/ # axios api client
│ ├── ui/ # toast host
│ ├── theme.ts, index.css # dark theme + atlas table header
│ └── types.ts
├── backend/ # Express + Mongoose
│ └── src/
│ ├── modules/
│ │ ├── auth/ # controller, service, routes
│ │ ├── users/ # model, repo
│ │ ├── expenses/ # model, repo, service (workflow + emails)
│ │ └── salary-slips/ # model, repo, service (netPay calc)
│ ├── mailer/ # nodemailer, baseLayout, templates
│ ├── pdf/ # slipPdf.ts (styled PDF, INR)
│ ├── middleware/ # authGuard, roleGuard, validate
│ ├── core/ # error, security (hash/jwt)
│ └── config/ # env
└── backend/docs/screenshots/ # images used in README

yaml
Copy code

---

## ⚙️ Environment

Create `.env` files before running.

**backend/.env**
PORT=4000
MONGODB_URI=<your-mongodb-atlas-uri>
JWT_SECRET=<strong-secret>
JWT_COOKIE_NAME=payloom_jwt
COOKIE_DOMAIN=localhost
FRONTEND_ORIGIN=http://localhost:5173

SMTP_HOST=<smtp-host>
SMTP_PORT=587
SMTP_USER=<smtp-user>
SMTP_PASS=<smtp-pass>
MAIL_FROM="PayLoom no-reply@payloom.app"

bash
Copy code

**frontend/.env**
VITE_API_BASE_URL=http://localhost:4000

yaml
Copy code

---

## 🧪 Run Locally

```bash
# backend
cd backend
npm i
npm run dev

# frontend
cd ../frontend
npm i
npm run dev
Open http://localhost:5173.

🔐 API (quick reference)
Auth

POST /auth/signup

POST /auth/login

GET /auth/me

Admin

POST /salary-slip

PUT /salary-slip/:id

GET /expense/admin/all

PUT /expense/admin/:id/status

Employee

GET /salary-slip?month=YYYY-MM

POST /expense

GET /expense

🚀 Deployment
Backend (Render)
New Web Service → pick backend/.

Env vars = from backend/.env.

Build: npm i

Start: npm run start (or your prod script)

CORS: allow your Vercel domain.

Frontend (Vercel)
Import repo → set project root to frontend/.

Env var VITE_API_BASE_URL → your Render backend URL.

Deploy.

Update “Live Demo” links at the top of this README after deploy.

🔔 Email Templates
Expense status and Slip created emails use a shared baseLayout with PayLoom branding.
Templates live in backend/src/mailer/templates.


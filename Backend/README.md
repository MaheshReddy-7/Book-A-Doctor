# Book a Doctor Backend API

A complete, secure, modular, and enterprise-grade RESTful backend for **Book a Doctor** (a healthcare appointment booking platform) built using Node.js, Express.js, and MongoDB.

## Features

- **Role-Based Authentication & Authorization**: Secure registration, login, and access controls for Patients, Doctors, and Administrators using JSON Web Tokens (JWT) and `bcryptjs`.
- **Doctor Profile Management**: Profile workflows for qualifications, specializations, consultation fees, and custom weekly availability slots.
- **Appointment Booking Flow**: Conflict-free booking validations (preventing overlapping times for both patient and doctor), cancellations, and accepting/rejecting scheduling requests.
- **Prescription Uploads & Medical Reports**: Managed file uploads (PDF, PNG, JPG, JPEG) up to 10 MB with unique secure filenames using Multer.
- **Seeded Admin Account**: Automatic creation of a default administrator profile upon initial database connection.
- **Centralized Error Bounds**: Harmonized error logging, CastError handler, Mongoose ValidationError parser, and duplicate key parser.
- **Security Protocols**: Helmet security headers, CORS enablement, input sanitization via `express-validator`, and request rate-limiting.
- **System Activity Logging**: Morgan request logging based on staging profiles.

---

## Technical Stack

- **Runtime**: Node.js (ES Modules syntax)
- **Framework**: Express.js
- **Database**: MongoDB (utilizing Mongoose ODM)
- **Authentication**: `jsonwebtoken` & `bcryptjs`
- **File Uploads**: `multer`
- **Validation**: `express-validator`
- **Security**: `helmet`, `cors`, `express-rate-limit`
- **Logging**: `morgan`
- **Development**: `nodemon`

---

## Folder Structure

```text
backend/
├── config/
│   └── db.js                 # MongoDB connection configuration
├── constants/
│   └── roles.js              # Roles and system status enums
├── controllers/
│   ├── adminController.js    # Administrator dashboard and management APIs
│   ├── appointmentController.js # Appointment scheduling and actions APIs
│   ├── authController.js     # User registration, login, and password resets
│   ├── doctorController.js   # Doctor profile searches and setting updates
│   ├── notificationController.js # Read/delete user notifications
│   ├── prescriptionController.js # Doctor prescription uploads
│   ├── reportController.js   # Patient report uploads
│   └── userController.js     # Profile editing and account actions
├── middleware/
│   ├── auth.js               # JWT verification and role authorization
│   ├── errorHandler.js       # Centralized global error handling
│   ├── upload.js             # Multer upload limits and file extensions filtering
│   └── validation.js         # express-validator request filter checker
├── models/
│   ├── Appointment.js        # Bookings schema
│   ├── Doctor.js             # Doctor qualifications & availability details
│   ├── MedicalReport.js      # Patient-uploaded medical history documents
│   ├── Notification.js       # Event notifications
│   ├── Prescription.js       # Doctor prescriptions
│   └── User.js               # Basic user credentials and demography
├── routes/
│   ├── adminRoutes.js        # Admin endpoints
│   ├── appointmentRoutes.js  # Booking endpoints
│   ├── authRoutes.js         # Authorization endpoints
│   ├── doctorRoutes.js       # Doctor profiles endpoints
│   ├── notificationRoutes.js # Notifications endpoints
│   ├── prescriptionRoutes.js # Prescription endpoints
│   ├── reportRoutes.js       # Reports endpoints
│   └── userRoutes.js         # General user endpoints
├── services/
│   ├── adminService.js       # Admin database aggregations and actions
│   ├── appointmentService.js # Booking validation logic and updates
│   ├── authService.js        # Password hashing and token issuing
│   ├── doctorService.js      # Doctor profile searches and filters
│   └── notificationService.js # Notification creation utility
├── uploads/                  # Uploaded files (PDFs, Images) - gitignored
├── validations/
│   └── schema.js             # express-validator schema specifications
├── app.js                    # Express application setup
├── server.js                 # Server entry point
└── .env                      # Environment configurations
```

---

## Environment Variables Guide

Create a `.env` file in the root `Backend` directory (a template `.env.example` is provided):

| Key | Description | Example Value |
| :--- | :--- | :--- |
| `PORT` | Local server port | `5000` |
| `MONGO_URI` | MongoDB Atlas / Local URI connection string | `mongodb://127.0.0.1:27017/book-a-doctor` |
| `JWT_SECRET` | Secret key for signing authorization JSON Web Tokens | `your_secret_signing_key` |
| `JWT_EXPIRES_IN` | Duration of JWT token validity | `7d` |
| `NODE_ENV` | Application environment phase | `development` |
| `UPLOAD_PATH` | Path where Multer stores uploads | `uploads` |
| `DEFAULT_ADMIN_EMAIL` | Credentials for automated Admin seeder | `admin@bookadoctor.com` |
| `DEFAULT_ADMIN_PASSWORD`| Password for automated Admin seeder | `Admin123!` |

---

## Installation & Running Steps

### Prerequisites
- Node.js (Latest LTS version recommendation)
- MongoDB instance (Atlas Cloud Cluster or Local Server)

### Setup Steps
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` variables using the example template:
   ```bash
   copy .env.example .env
   ```
4. Start the application:
   - **Development mode** (with hot reloading):
     ```bash
     npm run dev
     ```
   - **Production mode**:
     ```bash
     npm start
     ```

---

## API Endpoints Reference

All routing parameters utilize the base prefix: `/api`

### 1. Authentication (`/api/auth`)

* **POST `/register`**
  - Description: Register a new patient or doctor.
  - Body:
    ```json
    {
      "fullName": "Jane Doe",
      "email": "jane@example.com",
      "password": "Password123!",
      "phone": "+1234567890",
      "gender": "female",
      "dob": "1995-05-15",
      "address": {
        "street": "123 Patient Lane",
        "city": "CareCity",
        "state": "HealthState",
        "zipCode": "12345"
      },
      "role": "patient"
    }
    ```
  - Response (201 Created):
    ```json
    {
      "success": true,
      "message": "Registration successful",
      "data": {
        "user": { ... },
        "token": "JWT_TOKEN"
      }
    }
    ```

* **POST `/login`**
  - Description: Authentication endpoint. Returns user details and token.
  - Body:
    ```json
    {
      "email": "jane@example.com",
      "password": "Password123!"
    }
    ```

* **POST `/logout`**
  - Description: Resets access validation.

* **POST `/change-password`** *(Protected)*
  - Body: `{ "currentPassword": "...", "newPassword": "..." }`

* **POST `/forgot-password`**
  - Description: Requests verification code or password reset token.
  - Body: `{ "email": "jane@example.com" }`

* **POST `/reset-password`**
  - Description: Resets password using valid reset token.
  - Body: `{ "token": "RESET_TOKEN", "password": "NewPassword123!" }`

---

### 2. User Profiles (`/api/users`)

* **GET `/profile`** *(Protected)*
  - Returns current user details and linked doctor profile if applicable.

* **PUT `/profile`** *(Protected)*
  - Description: Updates profile settings (supports multipart/form-data for `profileImage` upload).

* **DELETE `/profile`** *(Protected)*
  - Description: Self-deletes account (Admins cannot self-delete).

---

### 3. Doctors (`/api/doctors`)

* **GET `/`** *(Public)*
  - Description: Lists all approved doctors.
  - Query parameters (optional): `search`, `specialization`, `minFee`, `maxFee`, `availableDay`, `page`, `limit`

* **GET `/:id`** *(Public)*
  - Description: Exposes detailed profile settings for a doctor.

* **POST `/`** *(Protected, Doctor only)*
  - Description: Populates/updates doctor-specific settings (`qualification`, `specialization`, `hospital`, etc.).

* **PUT `/:id`** *(Protected, Doctor or Admin)*
  - Description: Updates profile parameters.

* **DELETE `/:id`** *(Protected, Admin only)*
  - Description: Deletes doctor record and linked user profile.

---

### 4. Appointments (`/api/appointments`)

* **GET `/`** *(Protected)*
  - Description: Returns scheduled appointments. Filtered dynamically by user roles.
  - Query filters: `status`, `page`, `limit`

* **POST `/`** *(Protected, Patient only)*
  - Description: Request booking with a doctor.
  - Body:
    ```json
    {
      "doctor": "DOCTOR_OBJECT_ID",
      "date": "2026-07-15",
      "time": "10:30",
      "symptoms": "Mild fever"
    }
    ```

* **GET `/:id`** *(Protected)*
  - Description: Fetch appointment details. Accessible only to linked patient, doctor, or Admin.

* **PUT `/:id`** *(Protected)*
  - Description: Doctor accepts, rejects, or completes the slot; Patients or doctors can cancel.
  - Body: `{ "status": "accepted" }` or `{ "status": "cancelled" }`

* **DELETE `/:id`** *(Protected, Admin only)*
  - Description: Delete appointment record.

---

### 5. Medical Reports (`/api/reports`)

* **POST `/upload`** *(Protected, Patient only)*
  - Description: Upload file (Form-data: `report` file boundary, optional `appointmentId`).

* **GET `/:id`** *(Protected)*
  - Description: Retrieve uploaded medical report. Accessible to uploading patient, their doctor, or Admin.

* **DELETE `/:id`** *(Protected)*
  - Description: Delete file and database record.

---

### 6. Prescriptions (`/api/prescriptions`)

* **POST `/`** *(Protected, Doctor only)*
  - Description: Upload prescription file for an appointment (Form-data: `prescription` file boundary, `appointment` ID, `notes`).

* **GET `/:id`** *(Protected)*
  - Description: Retrieve prescription details. Accessible to patient, doctor, or Admin.

* **PUT `/:id`** *(Protected, Doctor only)*
  - Description: Update prescription notes or replace prescription file.

---

### 7. Notifications (`/api/notifications`)

* **GET `/`** *(Protected)*
  - Description: Retrieve user alerts.

* **PUT `/read/:id`** *(Protected)*
  - Description: Mark notification as read.

* **DELETE `/:id`** *(Protected)*
  - Description: Clear notification.

---

### 8. Administration (`/api/admin`)

* **GET `/dashboard`**
  - Description: Aggregate statistics: total users count, pending doctor list, status arrays, estimated revenues.

* **GET `/users`**
  - Description: List all user records with searching and paging.

* **PUT `/users/:id/block`**
  - Description: Block user login status.

* **PUT `/users/:id/activate`**
  - Description: Restore user login status.

* **GET `/doctors/pending`**
  - Description: List doctors awaiting onboarding approval.

* **PUT `/doctors/:id/approve`**
  - Description: Approve pending application.

* **PUT `/doctors/:id/reject`**
  - Description: Reject pending application.

---

## Verification Testing (Self-Contained in-memory Test Suite)

To test the full API lifecycle programmatically without needing a pre-configured database:
```bash
node scratch/verify_server.js
```
This runs the in-memory MongoDB environment, seeds the database, initializes the API listeners, executes register, login, approval, booking, and notification endpoints, and shuts down resources cleanly.

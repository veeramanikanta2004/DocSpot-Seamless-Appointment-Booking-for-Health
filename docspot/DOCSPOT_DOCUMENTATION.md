
# DocSpot - Project Documentation

## 1. Project Overview

**DocSpot** is a frontend web application designed to simulate a platform where patients can seamlessly book appointments with doctors. The system includes functionalities for three main user roles:

*   **Patient**: Can register, log in, browse doctors, book appointments, and manage their bookings.
*   **Doctor**: Can register (pending admin approval), log in, manage their appointments, and update consultation statuses.
*   **Admin**: Can log in, manage doctor registrations (approve/reject), oversee patient accounts, and view all appointments on the platform.

The application currently uses mock data for all operations, simulating backend interactions.

## 2. Core Features

### For Patients:
*   **Authentication**: Register and log in using email and password.
*   **Browse Doctors**: View a list of available doctors.
    *   Filter doctors by specialty.
    *   Search doctors by name.
*   **Book Appointment**:
    *   Select a doctor.
    *   Choose an appointment date and time.
    *   Provide a reason for the visit.
    *   Simulate document upload (files are listed but not stored).
*   **Manage Appointments**:
    *   View booking history (upcoming and past appointments).
    *   Cancel pending or scheduled appointments.
    *   Simulate rescheduling requests.
*   **Apply to be a Doctor**: Patients can submit an application to become a doctor on the platform.

### For Doctors:
*   **Registration**: Register as a doctor; registration requires admin approval.
*   **Login**: Access a dedicated doctor dashboard.
*   **Pending Approval Page**: If registration is pending, a specific page informs the doctor.
*   **Manage Appointments**:
    *   View appointments assigned to them.
    *   Approve or reject pending appointment requests.
    *   Mark appointments as completed.
    *   Simulate rescheduling.
    *   Add visit summaries and prescriptions to completed appointments.

### For Admin:
*   **Login**: Access a dedicated admin dashboard.
*   **Dashboard Overview**: View key platform statistics (total patients, doctors, appointments, pending applications).
*   **Manage Doctor Registrations**:
    *   View pending doctor applications.
    *   Approve or reject applications.
*   **Manage Doctors**: View list of approved doctors.
*   **Manage Patients**: View list of registered patients (with options to simulate view/flag/delete).
*   **Manage Appointments**:
    *   View all appointments in the system.
    *   Filter appointments by status or search term.
    *   Simulate flagging or resolving disputes for appointments.

## 3. Technical Stack

*   **Frontend Library**: React (v19)
*   **Routing**: React Router DOM (v7) for client-side navigation (`HashRouter`).
*   **Styling**: Tailwind CSS (v3 via CDN) for utility-first styling.
    *   Custom theme configured in `index.html`.
    *   Google Fonts (`Inter`).
*   **Language**: TypeScript
*   **Icons**: Heroicons (v2)
*   **Module Management**: ES Modules with Import Maps (via `esm.sh` CDN for React, React Router, Heroicons).
*   **Local Development**: VS Code with "Live Server" extension recommended.

## 4. Key Components & Concepts

### 4.1. Authentication & Authorization
*   **`hooks/useAuth.tsx`**:
    *   Provides an `AuthProvider` context for managing user authentication state (login, logout, register).
    *   Stores user data in `localStorage` to persist login sessions.
    *   Handles role-based redirection after login.
    *   Manages doctor application status for doctors.
*   **`App.tsx` - `ProtectedRoute`**: A higher-order component that protects routes based on user authentication status and allowed roles. It also handles redirection for doctors whose applications are pending approval.

### 4.2. Routing
*   **`App.tsx`**: Defines all application routes using `<Routes>` and `<Route>` from `react-router-dom`.
*   **`constants.ts` - `ROUTES`**: Centralized object for all route paths.
*   `HashRouter` is used, meaning URLs will have a `#` (e.g., `/#/login`).

### 4.3. State Management
*   **React Context API**: Used for global authentication state (`useAuth`).
*   **`useState` Hook**: Used extensively for local component state management (forms, filters, UI toggles).
*   **`useEffect` Hook**: Used for side effects like fetching data (simulated) on component mount or when dependencies change.
*   **`useCallback` Hook**: Used in `useAuth` for memoizing functions like `login`, `logout`, `register`.

### 4.4. Mock Data
*   **`constants.ts`**:
    *   `MOCK_USERS`: Array of predefined users (patients, doctors, admin) with credentials and profiles.
    *   `MOCK_APPOINTMENTS`: Array of predefined appointments.
    *   `MOCK_DOCTOR_APPLICATIONS`: Array of doctor applications.
    *   `SPECIALIZATIONS`: List of medical specializations.
*   Data manipulation (create, update) happens directly on these in-memory arrays, simulating backend operations.

### 4.5. UI Components
*   **Common Components (`components/common/`)**:
    *   `Button.tsx`: Reusable button with variants, sizes, loading state.
    *   `Input.tsx`: Reusable text input, textarea, and select components with label and error display.
    *   `Card.tsx`: Reusable card component for content grouping.
    *   `PageTitle.tsx`: Standardized page title component.
    *   `Alert.tsx`: Component for displaying success, error, warning, or info messages.
*   **Layout Components (`components/layout/`)**:
    *   `Navbar.tsx`: Top navigation bar, changes based on auth state.
    *   `Footer.tsx`: Application footer.
    *   `Sidebar.tsx`: Role-based sidebar for dashboard views.
    *   `DashboardLayout.tsx`: Wraps dashboard pages, including the `Sidebar`.
*   **Domain-Specific Components**:
    *   `components/Doctor/DoctorCard.tsx`: Displays doctor information for browsing.
    *   `components/Appointment/AppointmentCard.tsx`: Displays appointment details for patient/doctor lists.

## 5. File Structure Overview

```
/
├── public/                  # (Not explicitly shown, but typical for static assets)
├── components/
│   ├── common/              # Reusable UI elements (Button, Card, Input, etc.)
│   ├── layout/              # Structural components (Navbar, Sidebar, Footer, DashboardLayout)
│   ├── Doctor/              # Doctor-specific components (DoctorCard)
│   └── Appointment/         # Appointment-specific components (AppointmentCard)
├── hooks/
│   └── useAuth.tsx          # Authentication context and logic
├── pages/
│   ├── Admin/               # Admin-specific pages (Dashboard, ManageDoctors, etc.)
│   ├── Doctor/              # Doctor-specific pages (Dashboard, RegistrationPending)
│   ├── Patient/             # Patient-specific pages (BrowseDoctors, BookAppointment, etc.)
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── NotFoundPage.tsx
├── App.tsx                  # Main application component with routing setup
├── constants.ts             # Global constants, routes, mock data
├── index.html               # Main HTML entry point, CDN links, import maps
├── index.tsx                # React application root, mounts App
├── metadata.json            # Application metadata
└── types.ts                 # TypeScript type definitions and enums
```

## 6. Running the Application

This project is set up to run directly in a modern browser without a Node.js build step.

1.  **Prerequisites**:
    *   Visual Studio Code (or any code editor).
    *   A modern web browser (Chrome, Firefox, Edge).
2.  **VS Code Extension**:
    *   Install the **"Live Server"** extension by Ritwick Dey in VS Code.
3.  **Procedure**:
    *   Ensure all project files are in a local directory.
    *   Open the project folder in VS Code.
    *   In the VS Code Explorer, right-click on `index.html`.
    *   Select "Open with Live Server".
    *   The application will open in your default browser (e.g., at `http://127.0.0.1:5500/`).

## 7. Data Flow (Mocked)

*   All data (users, doctors, appointments, applications) is sourced from arrays defined in `constants.ts`.
*   When a user performs an action that would typically involve a backend API call (e.g., booking an appointment, registering, updating status), the application:
    1.  Simulates a delay using `setTimeout`.
    2.  Directly modifies the in-memory mock arrays (e.g., pushing a new appointment to `MOCK_APPOINTMENTS`).
    3.  Updates the component state (and `localStorage` for authentication) to reflect the changes.
*   There is no persistent database; data will reset if the browser is refreshed and local storage is cleared, or if the mock arrays are not re-initialized from `localStorage` where applicable (primarily for `authUser`).

## 8. Future Enhancements & Considerations

*   **Real Backend**: Implement a proper backend (e.g., Node.js with Express.js) to handle business logic and API requests.
*   **Database**: Integrate a database (e.g., MongoDB, PostgreSQL) for persistent data storage.
*   **Real API Calls**: Replace mock data interactions with actual `fetch` or `axios` calls to the backend API.
*   **File Uploads**: Implement actual file storage (e.g., using services like AWS S3 or a local backend solution with Multer).
*   **Notifications**: Add real-time in-app or email notifications (e.g., for appointment confirmations, status changes).
*   **Advanced State Management**: For a larger scale, consider libraries like Redux, Zustand, or Recoil if React Context becomes cumbersome.
*   **Testing**: Implement unit, integration, and end-to-end tests.
*   **Build System**: For production, implement a build system (e.g., Vite, Create React App) for optimization, transpilation, and bundling.
*   **Security**: Address API key management securely on the backend, input validation, XSS prevention, etc.

This documentation provides a comprehensive overview of the DocSpot project in its current state.

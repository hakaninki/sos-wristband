# SOS Wristband – Multi-tenant School Emergency & Medical Info Platform

**A secure, role-based system for managing student emergency data, accessible via QR wristbands.**

## 🚀 Problem & Solution

**The Problem:** In school emergencies (allergic reactions, accidents), teachers and medical staff need instant access to a student's critical medical information and emergency contacts. Paper records are slow, and locked databases are inaccessible to first responders.

**The Solution:** The SOS Wristband system provides a secure, multi-tenant platform where:
1.  **Schools** manage their staff and student records.
2.  **Students** wear a wristband with a unique QR code.
3.  **First Responders/Teachers** scan the QR code to view a public, read-only profile with essential medical info (allergies, blood type) and emergency contacts—without needing a login.

## ✨ Core Features

### 👑 Owner (Super Admin)
-   **Multi-tenancy Management:** Create and manage multiple schools.
-   **School Admin Provisioning:** Onboard school administrators.
-   **System Oversight:** View high-level stats across all tenants.

### 🏫 School Admin
-   **Staff Management:** Create and manage teachers.
-   **Class Management:** Organize students into classes and assign teachers.
-   **Student Oversight:** Full CRUD access to all student records within their school.

### 👩‍🏫 Teacher
-   **My Classes:** View only students in their assigned classes.
-   **Student Management:** Add/Edit students, including medical details and photos.
-   **QR Generation:** Generate and print QR codes for their students.

### 🏥 Public Student Profile (QR View)
-   **Instant Access:** Accessible via a unique, URL-safe slug (e.g., `/s/john-doe-x9z2`).
-   **Privacy-Focused:** Displays only essential emergency info (Photo, Name, School, Teacher, Class, Medical Conditions, Emergency Contacts). No internal IDs or sensitive academic records are exposed.

## 🔒 Security & RBAC

This project implements a robust **Role-Based Access Control (RBAC)** system using **Firebase Authentication** and **Firestore Security Rules**:

*   **Data Isolation:** Schools cannot access each other's data.
*   **Least Privilege:**
    *   **Owners** have full system access.
    *   **Admins** are restricted to their `schoolId`.
    *   **Teachers** are restricted to students in their assigned `classIds`.
    *   **Public** access is strictly read-only and limited to specific fields on the `students` collection via the public slug.

## 🛠️ Tech Stack

*   **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
*   **Language:** TypeScript
*   **Database:** Google Firestore (NoSQL)
*   **Auth:** Firebase Authentication
*   **Server-Side:** Firebase Admin SDK (for privileged operations like user creation)
*   **Styling:** Tailwind CSS + Shadcn UI
*   **Deployment:** Vercel (compatible)

## 💾 Data Model

The system uses a relational-like structure within Firestore NoSQL documents:

```typescript
// Core Interfaces

interface School {
  id: string;
  name: string;
  slug: string;
  active: boolean;
}

interface Staff {
  id: string; // Firebase Auth UID
  role: 'owner' | 'admin' | 'teacher';
  schoolId?: string;
  classIds?: string[]; // For teachers
  name: string;
  email: string;
}

interface Student {
  id: string;
  schoolId: string;
  classId: string;
  slug: string; // Public URL identifier
  
  firstName: string;
  lastName: string;
  photoUrl?: string;
  
  medical: {
    bloodType?: string;
    allergies?: string;
    chronicConditions?: string;
    medications?: string;
  };
  
  emergencyContacts: {
    name: string;
    relation: string;
    phone: string;
  }[];
}
```

## 📱 Public QR Profile

The public profile route `/s/[slug]` is designed for speed and accessibility.
*   **Server-Side Rendering (SSR):** Fetches student, school, and teacher data on the server for fast initial load.
*   **Privacy:** Does not expose the internal Firestore document ID.
*   **Fallback:** Gracefully handles missing data (e.g., if a teacher is unassigned).

## 🚀 Getting Started

### Prerequisites
*   Node.js 18+
*   A Firebase Project

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/sos-wristband.git
    cd sos-wristband
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    Create a `.env.local` file in the root directory:
    ```env
    # Client-side Firebase Config
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

    # Server-side Firebase Admin (Service Account)
    FIREBASE_PROJECT_ID=your_project_id
    FIREBASE_CLIENT_EMAIL=your_client_email
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the app:**
    Visit [http://localhost:3000](http://localhost:3000)

## 💡 Why This Project?

This project demonstrates production-level engineering practices:
*   **Complex State Management:** Handling multi-step forms for student creation and editing.
*   **Secure Architecture:** enforcing strict data boundaries between tenants (schools).
*   **Hybrid Rendering:** Utilizing Next.js Server Components for performance and Client Components for interactivity.
*   **Real-world Utility:** Solving a genuine problem with a practical, user-friendly solution.

## 👨‍💻 Author

**Hakan Küçükdoğan**

[GitHub](https://github.com/YOUR_USERNAME) | [LinkedIn](https://linkedin.com/in/YOUR_PROFILE)

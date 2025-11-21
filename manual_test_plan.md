# SOS Wristband System - Manual Test Plan

Follow these steps to verify the end-to-end functionality of the application.

## Prerequisites
1. Ensure `npm run dev` is running.
2. Open your browser to `http://localhost:3000`.
3. Ensure you have the Firebase credentials in `.env.local`.

## Test Cases

### 1. Admin Authentication
- [ ] **Navigate to Root**: Go to `http://localhost:3000/admin/students`.
    - **Expected**: Redirected to `/admin/login`.
- [ ] **Login Failure**: Enter invalid credentials (e.g., `test@test.com` / `wrongpass`).
    - **Expected**: Error message "Invalid email or password".
- [ ] **Login Success**: Enter `admin@mail.com` / `admin123`.
    - **Expected**: Redirected to `/admin/students`.

### 2. Student Management (CRUD)
- [ ] **List View**: Verify the "Students" page loads and shows a table (empty initially or with data).
- [ ] **Create Student**:
    - Click "Add Student".
    - Fill form: Name="Test Student", Class="5A", Parent="John Doe", Phone="1234567890".
    - Upload a photo (optional but recommended).
    - Click "Create Student".
    - **Expected**: Redirected to list view. New student appears in the table.
- [ ] **Edit Student**:
    - Click the "Edit" (pencil) icon for the student.
    - Change Name to "Test Student Updated".
    - Click "Update Student".
    - **Expected**: Redirected to list view. Name is updated.
- [ ] **Delete Student**:
    - Click the "Delete" (trash) icon.
    - Confirm the dialog.
    - **Expected**: Student is removed from the list.

### 3. Public Profile & QR Code
- [ ] **Generate QR**:
    - Click the "QR Code" icon for a student.
    - **Expected**: A dialog opens showing a QR code.
- [ ] **Public Link**:
    - In the QR dialog, click "Open Public Page".
    - **Expected**: New tab opens `http://localhost:3000/s/[slug]`.
- [ ] **Verify Public Page**:
    - Check that the photo, name, class, and parent contact match.
    - Click "Call [Phone]" button (it should try to open tel link).
    - Verify "Student not found" by changing the URL slug to a random string.

## Troubleshooting
- If images don't load, check `next.config.ts` `remotePatterns` and your internet connection.
- If login fails, verify the user exists in Firebase Auth console.

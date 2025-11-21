# SOS Wristband System – NFC & QR Emergency Profile Platform

## Overview
The **SOS Wristband System** is a comprehensive emergency profile platform designed for schools and organizations. It allows administrators to manage student safety profiles and provides instant access to critical medical and contact information via NFC wristbands or QR codes.

The system features a modern, responsive "Blue-Green" (Teal/Cyan) UI, a secure admin panel, and a mobile-first public emergency card view.

## Features
- **Student Management**: CRUD operations for student records.
- **Medical Profiles**: Detailed tracking of blood type, allergies, chronic conditions, and medications.
- **Emergency Contacts**: Support for multiple emergency contacts with one-tap calling.
- **Photo Upload**: Secure storage and display of student photos.
- **Public Emergency Card**: A read-only, mobile-optimized profile page accessible via unique URL/QR code.
- **QR Code Generation**: Built-in QR code generator for each student profile.
- **Responsive Design**: Fully responsive UI built with Tailwind CSS and Shadcn UI.
- **Secure**: Firebase Authentication and Firestore security rules.

## Tech Stack
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **Backend / Database**: [Firebase](https://firebase.google.com/) (Auth, Firestore, Storage)
- **Icons**: [Lucide React](https://lucide.dev/)

## Environment Variables
To run this project, you will need to add the following environment variables to your `.env.local` file. Do **NOT** commit this file to version control.

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/hakaninki/sos-wristband.git
    cd sos-wristband
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open the app:**
    Navigate to [http://localhost:3000](http://localhost:3000).

## Admin Login (Local Only)
Since user registration is restricted, you must create your first admin user directly in the **Firebase Console** under **Authentication** > **Users**.

Once created, you can log in at `/admin/login`.

## Firebase Setup Guide
1.  Create a new project at [Firebase Console](https://console.firebase.google.com/).
2.  **Authentication**: Enable **Email/Password** provider.
3.  **Firestore Database**: Create a database (start in test mode for development, but secure rules for production).
4.  **Storage**: Enable Storage for photo uploads.
5.  **Project Settings**: Register a web app and copy the configuration keys to your `.env.local` file.

## Deployment
This project is optimized for deployment on [Vercel](https://vercel.com/).

1.  Push your code to a GitHub repository.
2.  Import the project into Vercel.
3.  Add the **Environment Variables** from your `.env.local` file to the Vercel project settings.
4.  Deploy!

## Screenshots
*(Add your screenshots here)*

## License
[MIT License](LICENSE)


# Social Media App

A full-featured social media app built with React and TypeScript using Firebase, where users can post content, upload media, and view real-time feeds and profiles.



## Project Overview

VibeSnap is a social media platform that allows users to:
- Create and manage user profiles with images and banners
- Post text, images (multiple), and videos
- Like and share posts
- View a personalized feed with infinite scrolling
## Tech Stack

- Frontend: React 18, TypeScript, Vite
- State Management: Zustand
- Data Fetching & Caching: TanStack Query
- Styling: Tailwind CSS
- Routing: React Router
- Backend: Firebase (Authentication, Firestore, Storage)
- Build Tool: Vite

## Project Structure

```
client/
├── src/
│   ├── app/                    # App-level components
│   │   ├── App.tsx            # Root component with routing
│   │   ├── ProtectedRoute.tsx # Auth guard wrapper
│   │   └── RootRedirect.tsx   # Root path redirect logic
│   │
│   ├── components/            # Reusable UI components
│   │   ├── create-post/       # Post creation components
│   │   ├── feed/              # Feed-related components
│   │   ├── profile/           # Profile-related components
│   │   └── skeletons/         # Loading skeleton components
│   │
│   ├── pages/                 # Page-level components (routes)
│   │   ├── Feed.tsx
│   │   ├── Profile.tsx
│   │   ├── CreatePost.tsx
│   │   ├── Login.tsx
│   │   └── ProfileSetup.tsx
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.ts         # Authentication hook
│   │   ├── useCreatePost.ts   # Post creation logic
│   │   ├── useMediaUpload.ts  # Media handling logic
│   │   └── useQueries.ts      # React Query hooks
│   │
│   ├── firebase/              # Firebase configuration & services
│   │   ├── firebase.config.ts # Firebase initialization
│   │   ├── auth.ts            # Authentication methods
│   │   ├── database.ts        # Realtime Database operations
│   │   ├── storage.ts         # Storage operations
│   │   └── firestore.ts       # (if used)
│   │
│   ├── store/                 # Global state (Zustand)
│   │   ├── authStore.ts       # Auth state management
│   │   └── uiStore.ts         # UI state (if any)
│   │
│   ├── utils/                 # Utility functions
│   │   ├── compressImage.ts   # Image compression
│   │   ├── compressVideo.ts   # Video compression
│   │   ├── formatDate.ts      # Date formatting
│   │   ├── hashtagUtils.ts    # Hashtag extraction
│   │   └── shareUtils.ts      # Share functionality
│   │
│   ├── types/                 # TypeScript type definitions
│   │   └── media.ts           # Media-related types
│   │
│   ├── main.tsx               # Application entry point
│   └── index.css              # Global styles
│
├── public/                    # Static assets
├── dist/                      # Build output
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Quick Start Guide

1. Clone the Git repository:

```bash
git clone https://github.com/dinesht2000/Kleo.git 
cd client
```

2. Installation:
```bash
npm install
```

3. Create a .env file in the project root and add the required credentials from .env.example.
```bash
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
VITE_FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.region.firebasedatabase.app/

```

4. Running the Project
```bash
npm run dev
```

***
Thank you for checking out this project! Feel free to open an issue if you have any questions or suggestions.

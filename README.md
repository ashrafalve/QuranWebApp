# Quran Mazid Web Application

A professional and modern web application for reading, studying, and searching the Holy Quran. The project is architecture-driven, separating the concern between a high-performance Express backend and a dynamic Next.js frontend.

---

## Backend Application

The backend serves as a robust REST API providing Quranic data, including Surahs, Ayahs, and Juz information, with built-in search and caching.

### Core Technologies
- Language: TypeScript
- Framework: Express.js
- Caching: node-cache
- Security: Helmet, CORS, Express Rate Limit
- Logging: Morgan
- Compression: compression middleware

### API Documentation
All endpoints are prefixed with /api and return JSON data.

- GET /api/surah: Retrieves the complete list of 114 Surahs with metadata.
- GET /api/surah/:id: Retrieves a specific Surah including all its Ayahs (Arabic text and translations).
- GET /api/juz: Retrieves the list of 30 Juz with surah counts and surah range info.
- GET /api/juz/:id: Retrieves all Ayahs belonging to a specific Juz.
- GET /api/search?q=QUERY: Performs a keyword search across both Arabic text and translations.

### Run Instructions
1. Navigate to the backend directory:
   cd backend
2. Install dependencies:
   npm install
3. Environment Configuration:
   Create a .env file in the root of the backend directory (refer to .env.example if present).
4. Data Seeding:
   Populate the database/cache with Quranic data:
   npm run seed
5. Development Mode:
   Start the server with hot-reload:
   npm run dev
6. Production Mode:
   Build and start the server:
   npm run build
   npm start

---

## Frontend Application

The frontend is a modern Next.js 16 application featuring a premium UI, multiple themes, and a highly interactive reading experience.

### Core Technologies
- Framework: Next.js 16 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS 4
- State Management: Zustand
- Icons: Custom SVG components and Lucide React
- Theme Management: next-themes

### Key Features and Implementation
- Reading Modes: A toggle in the right sidebar allows switching between Translation (list view) and Reading (mushaf flow) modes.
- Theme Customization: Support for Light, Dark, and a curated Sepia mode. The Sepia mode uses a custom .theme-sepia class to maintain image clarity.
- Sidebar Navigation: A comprehensive left sidebar with tabs for Surah and Juz navigation. The Juz tab features redesigned info cards with manual data overrides for 100% accuracy.
- Custom Icons: Five unique SVG icons (Home, Read Quran, Go to Ayah, Bookmarks, More) are integrated into the sidebar.
- Audio Integration: Recitation audio is streamed directly from a high-quality CDN.
- Global Store: Zustand manages UI states like sidebar visibility, font settings, and reading modes globally.

### Run Instructions
1. Navigate to the frontend directory:
   cd frontend
2. Install dependencies:
   npm install
3. Environment Configuration:
   The application defaults to http://127.0.0.1:5000/api for the backend. Override this by setting NEXT_PUBLIC_API_URL in your .env file.
4. Development Mode:
   Start the development server:
   npm run dev
5. Production Mode:
   Build and start the application:
   npm run build
   npm start

---

## Project Structure Highlights
- /frontend/src/components: Contains modular UI components like AyahCard, SurahReader, and Sidebar.
- /frontend/src/store: Centralized state management with Zustand.
- /frontend/src/utils/juzInfo.ts: Manual data overrides for traditional Juz divisions.
- /backend/src/scripts: Scripts for data processing and seeding.

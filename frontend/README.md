# Quran Mazid Frontend

A modern Next.js 16 application for reading and studying the Holy Quran. This frontend provides a high-performance, responsive interface with multiple themes and reading modes.

## Technologies
- Framework: Next.js 16 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS 4
- State Management: Zustand
- Icons: Custom SVG components and Lucide React
- Theming: next-themes

## Features

### Reading Modes
The application supports two distinct reading modes, toggled via the settings sidebar:
- Translation Mode: A traditional list view showing Arabic text followed by translation and transliteration.
- Reading Mode: A mushaf-style flowing layout optimized for continuous recitation.

### Theme System
Custom theme support including:
- Light Mode: Clean white interface.
- Dark Mode: Eye-friendly dark interface.
- Sepia Mode: A premium yellowish background mode. Note: This uses the .theme-sepia class to avoid conflicts with CSS image filters.

### Navigation
- Sidebar Tabs: Quickly switch between Surah, Juz, and Page navigation.
- Juz Cards: Specially designed cards that list all surahs within each Juz, with manual data overrides for 100% accuracy.
- Custom Icons: Hand-crafted SVG icons for the main navigation.

### Settings Sidebar
- Font Scaling: Real-time adjustment of Arabic and Translation font sizes.
- Mushaf Selection: Option to change the Arabic font/mushaf style (Amiri vs Scheherazade).

## Getting Started

### Prerequisites
- Node.js (v18 or later recommended)
- The Backend API should be running at http://127.0.0.1:5000/api

### Installation
1. Install dependencies:
   npm install

2. Configure environment:
   Create a .env.local file if you need to override the API URL:
   NEXT_PUBLIC_API_URL=your_api_url

3. Run development server:
   npm run dev

4. Open the application:
   Navigate to http://localhost:3000

## Directory Structure
- /src/app: Next.js App Router pages and layouts.
- /src/components: Reusable UI components.
- /src/store: Zustand global state management.
- /src/utils: API services and helper functions.
- /src/contexts: React contexts for audio and other providers.
- /public: Static assets including brand logos and watermark icons.

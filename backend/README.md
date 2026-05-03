# Quran Mazid Backend API

A robust RESTful API built with Node.js and Express to provide Quranic data, including Surah information, Juz structures, and advanced search functionality.

## Technologies
- Language: TypeScript
- Framework: Express.js
- Caching: node-cache
- Security: Helmet, CORS, Express Rate Limit
- Logging: Morgan
- Data Fetching: Axios

## Features
- Performance Optimized: Integrated caching layer to reduce data source load and improve response times.
- Search Engine: Keyword search capability across Arabic text and multiple translations.
- Structured Data: Provides detailed metadata for all 114 Surahs and 30 Juz.
- Secure by Default: Implements standard security headers, rate limiting, and CORS protection.
- Automated Seeding: Scripts included for populating and maintaining the Quranic dataset.

## API Endpoints

All responses are returned in JSON format.

### Surahs
- GET /api/surah: Fetch list of all Surahs.
- GET /api/surah/:id: Fetch specific Surah details including Ayahs.

### Juz
- GET /api/juz: Fetch list of all 30 Juz with metadata.
- GET /api/juz/:id: Fetch specific Juz details.

### Search
- GET /api/search?q=QUERY: Search the Quran for specific keywords or phrases.

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- TypeScript installed globally or via dev dependencies

### Installation
1. Install dependencies:
   npm install

2. Environment Setup:
   Create a .env file and configure the PORT (default is 5000).

3. Data Seeding:
   Ensure the data is populated before starting the server:
   npm run seed

4. Run Development Server:
   npm run dev

5. Build for Production:
   npm run build
   npm start

## Directory Structure
- /src/index.ts: Application entry point and configuration.
- /src/routes: API route definitions.
- /src/controllers: Request handling and business logic.
- /src/scripts: Utility scripts for data seeding and processing.
- /src/types: TypeScript interface and type definitions.

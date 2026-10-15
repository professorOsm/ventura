# SETUP & INSTALLATION GUIDE — VENTURA

## 1. Quick Start

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Installation
```bash
npm install
```

### Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Ensure your `.env` contains:
```env
GEMINI_API_KEY="YOUR_KEY_HERE"  # Injected automatically by Google AI Studio
PORT="3000"
OLLAMA_BASE_URL="http://127.0.0.1:11434"
```

### Launch Development Server
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000).

## 2. Production Build
```bash
npm run build
npm start
```
Vite compiles the frontend into `dist/`, which is served statically by `server.ts` alongside all API endpoints on port 3000.

# BenefitLens AI

> Understand Employee Benefits Documents in Seconds.

BenefitLens AI is an AI-powered document assistant that analyzes employee benefits PDFs (COBRA, HSA, FSA, HRA, ICHRA, Benefits Guides, Insurance Documents) and explains them in plain English using Google Gemini.

## Features

- **Drag & Drop Upload** — PDF only, max 20MB, no login required
- **AI Analysis** — Gemini extracts and structures: document type, summary, key deadlines, important dates, plan type, coverage, employee/employer responsibilities, warnings, next steps, and common Q&A
- **AI Chat** — Ask follow-up questions about your specific document with source citations and confidence levels
- **Export** — Copy summary or export as PDF
- **Beautiful UI** — Framer Motion animations, healthcare-inspired enterprise design (white/blue/teal)

## Tech Stack

**Frontend:** React, TypeScript, Vite, TailwindCSS, Framer Motion, React Dropzone, Lucide React

**Backend:** Node.js, Express, Multer, pdf-parse, Google Gemini API

## Getting Started

### Prerequisites

- Node.js 20+
- A Google Gemini API key (get one at https://aistudio.google.com/app/apikey)

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Add your Gemini API key to .env
# GEMINI_API_KEY=your_key_here
```

### Development

```bash
# Run frontend only
npm run dev

# Run backend only (in a separate terminal)
npm run dev:server

# Or run both together
npm run dev:all
```

The frontend runs on http://localhost:5173 and the backend on http://localhost:3001.

### Build

```bash
npm run build
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze` | Upload a PDF and get structured analysis |
| POST | `/api/chat` | Ask a question about the uploaded document |
| GET | `/health` | Health check |

## Deployment

### Frontend → Vercel

The frontend is configured for Vercel deployment. Set the `VITE_API_URL` environment variable to your backend URL.

### Backend → Render

The backend is configured for Render deployment via `render.yaml`. Set the `GEMINI_API_KEY` environment variable in your Render dashboard.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google Gemini API key (backend) |
| `PORT` | Backend port (default: 3001) |
| `VITE_API_URL` | Backend URL for frontend (optional in dev) |

## Project Structure

```
client/          # Frontend (src/)
  components/     # Reusable UI components
  pages/          # Page-level views
  services/       # API service layer
  types/          # TypeScript types
server/           # Backend
  controllers/    # Route controllers
  routes/         # Express routes
  utils/          # Gemini AI, upload config
  index.ts        # Server entry point
uploads/          # Temporary file storage (auto-cleaned)
```

## License

MIT

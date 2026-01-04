# PathMind

AI-powered learning roadmap generator that helps learners understand what to learn, in what order, and why.

## Project Structure

```
PathMind/
├── frontend/          # Next.js frontend application
│   ├── app/          # Next.js app directory
│   ├── components/   # React components
│   └── package.json
├── backend/          # Express.js backend API
│   ├── server.js     # Main server file
│   └── package.json
└── package.json      # Root package.json for running both
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install all dependencies (root, frontend, and backend):
```bash
npm run install:all
```

Or install them separately:
```bash
# Root dependencies
npm install

# Frontend dependencies
cd frontend
npm install

# Backend dependencies
cd ../backend
npm install
```

### Running the Application

From the root directory, run both frontend and backend:
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

Or run them separately:
```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

## Current Features

### Milestone 1 ✅
- ✅ Project structure with frontend/backend separation
- ✅ Landing page with hero, features, and CTA sections
- ✅ Login and Signup pages (UI only)
- ✅ Dashboard page with roadmap visualization
- ✅ Basic backend API structure

## Next Steps

- Milestone 2: Authentication system (backend + frontend integration)
- Milestone 3: AI roadmap generation
- Milestone 4: Topic documentation/video links
- Milestone 5: AI chatbot sidebar

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, React Flow
- **Backend**: Node.js, Express.js
- **Styling**: CSS Modules

# PathMind Frontend Structure

## 📁 Folder Organization

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page (Landing Page)
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── dashboard/         # Dashboard page (protected)
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   └── how-it-works/       # How It Works page
│
├── components/            # React components
│   ├── landing/           # Landing page components
│   │   ├── LandingPage.tsx
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── CTA.tsx
│   │   ├── HowItWorks.tsx
│   │   └── AnimatedBackground.tsx
│   │
│   ├── dashboard/         # Dashboard components
│   │   ├── RoadmapFlow.tsx
│   │   └── Sidebar.tsx
│   │
│   ├── layout/            # Layout components (shared)
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   │
│   └── auth/              # Authentication components
│       └── ProtectedRoute.tsx
│
├── lib/                   # Utility functions
│   └── auth.ts            # Authentication utilities
│
├── middleware.ts          # Next.js middleware for route protection
└── ROUTES.md             # Route documentation
```

## 📂 Component Categories

### 1. **Landing Components** (`components/landing/`)
All components used on the landing/home page:
- `LandingPage.tsx` - Main landing page container
- `Hero.tsx` - Hero section
- `Features.tsx` - Features section
- `CTA.tsx` - Call-to-action section
- `HowItWorks.tsx` - How It Works page component
- `AnimatedBackground.tsx` - Animated background effects

### 2. **Dashboard Components** (`components/dashboard/`)
Components specific to the dashboard:
- `RoadmapFlow.tsx` - React Flow roadmap visualization
- `Sidebar.tsx` - AI Assistant sidebar

### 3. **Layout Components** (`components/layout/`)
Shared layout components used across multiple pages:
- `Navbar.tsx` - Navigation bar (used on all pages)
- `Footer.tsx` - Footer (used on landing and other pages)

### 4. **Auth Components** (`components/auth/`)
Authentication-related components:
- `ProtectedRoute.tsx` - Route protection wrapper

## 🗂️ Pages (`app/`)

### Public Pages (No authentication required)
- `/` - Home/Landing page
- `/login` - Login page
- `/signup` - Signup page
- `/how-it-works` - How It Works page

### Protected Pages (Authentication required)
- `/dashboard` - User dashboard with roadmap

## 📝 Key Files

- `lib/auth.ts` - Authentication utility functions
- `middleware.ts` - Next.js middleware for route protection
- `ROUTES.md` - Detailed route documentation

## 🎯 Import Paths

Use these import paths:

```typescript
// Landing components
import LandingPage from '@/components/landing/LandingPage'
import Hero from '@/components/landing/Hero'

// Dashboard components
import RoadmapFlow from '@/components/dashboard/RoadmapFlow'
import Sidebar from '@/components/dashboard/Sidebar'

// Layout components
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

// Auth components
import ProtectedRoute from '@/components/auth/ProtectedRoute'
```

## 🔄 Structure Benefits

1. **Clear Organization** - Components grouped by feature/purpose
2. **Easy Navigation** - Know exactly where to find components
3. **Scalable** - Easy to add new features
4. **Maintainable** - Related files are together
5. **Reusable** - Layout components shared across pages


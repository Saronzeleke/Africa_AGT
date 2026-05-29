# AfyaMetrix - Last-Mile Health Surveillance Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.0.3-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Digitizing community health reporting from the last mile to the decision table.**

AfyaMetrix is an offline-first health surveillance platform designed for community health workers (CHWs) and health leaders (CHLs) in remote African regions. It enables real-time disease case reporting, outbreak detection, and data-driven decision-making—even without internet connectivity.

---

## 🎯 Problem Statement

In remote African communities, disease outbreaks often go undetected for days or weeks due to:
- **Paper-based reporting** that delays data transmission
- **Lack of internet connectivity** in rural health centers
- **Manual data aggregation** prone to errors and delays
- **Slow response times** that allow outbreaks to spread unchecked

**AfyaMetrix solves this** by providing an offline-first mobile platform that syncs automatically when connectivity is restored, enabling health authorities to detect and respond to outbreaks within hours instead of weeks.

---

## ✨ Key Features

### 🔌 Offline-First Architecture
- Submit case reports without internet connectivity
- Data stored locally and synced automatically when online
- Visual sync status indicators and pending count tracking

### 👥 Role-Based Access Control
- **CHW (Community Health Worker)**: Submit case reports, view personal dashboard
- **CHL (Community Health Leader)**: View aggregated data, manage alerts, oversee team reports

### 📊 Real-Time Dashboard
- Live statistics (today's cases, pending sync, weekly trends)
- Disease breakdown charts with visual analytics
- Recent entries table with filtering capabilities
- Automated outbreak alerts

### 📝 Multi-Row Case Entry Form
- Spreadsheet-style interface for bulk data entry
- Disease type selection with searchable dropdown
- Photo attachments with preview and upload status
- Draft saving functionality for incomplete reports

### 🗺️ Advanced Analytics (Planned)
- Interactive disease heatmap
- Trends and forecasting
- AI-powered recommendations for resource allocation

---

## 🏗️ Tech Stack

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.0.3 | React framework with App Router |
| **React** | 18.3.1 | UI library |
| **TypeScript** | 5.6.3 | Type-safe development |

### UI & Styling
| Technology | Version | Purpose |
|------------|---------|---------|
| **Tailwind CSS** | 3.4.15 | Utility-first CSS framework |
| **shadcn/ui** | Latest | Accessible component library |
| **Radix UI** | Latest | Headless UI primitives |
| **Lucide React** | 0.454.0 | Icon library |
| **Recharts** | 2.13.3 | Data visualization |

### State Management & Data
| Technology | Version | Purpose |
|------------|---------|---------|
| **Zustand** | 5.0.1 | Lightweight state management |
| **TanStack Query** | 5.59.20 | Server state & caching |
| **LocalForage** | 1.10.0 | Offline storage (IndexedDB) |

### Forms & Validation
| Technology | Version | Purpose |
|------------|---------|---------|
| **React Hook Form** | 7.53.2 | Performant form handling |
| **Zod** | 3.23.8 | Schema validation |
| **@hookform/resolvers** | 3.9.1 | Form validation integration |

### Theming
| Technology | Version | Purpose |
|------------|---------|---------|
| **next-themes** | 0.4.3 | Dark/light mode support |

---

## 📁 Project Structure

```
afyametrix/
├── app/                              # Next.js App Router
│   ├── (auth)/
│   │   ├── login/                   # Role-based login (CHW/CHL)
│   │   ├── signup/                  # User registration
│   │   ├── forgot-password/         # Password recovery
│   │   └── verify-email/            # Email verification
│   ├── dashboard/                   # Main dashboard (role-specific)
│   │   ├── layout.tsx              # Dashboard layout with sidebar
│   │   └── page.tsx                # Dashboard home
│   ├── data-clock-in/              # Case reporting
│   │   ├── page.tsx                # Case list view
│   │   └── new/                    # New case entry form
│   ├── heatmap/                    # Disease heatmap (planned)
│   ├── trends-forecast/            # Trends & forecasting (planned)
│   ├── ai-recommendations/         # AI insights (planned)
│   ├── onboarding/                 # Multi-step onboarding
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Landing page
│   ├── providers.tsx               # App providers (Query, Theme)
│   └── globals.css                 # Global styles
│
├── components/
│   ├── ui/                         # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── tabs.tsx
│   ├── layout/
│   │   └── sidebar.tsx             # Navigation sidebar
│   ├── dashboard/
│   │   ├── stat-card.tsx           # Statistics cards
│   │   ├── disease-chart.tsx       # Bar chart component
│   │   ├── recent-entries.tsx      # Recent entries table
│   │   └── sync-banner.tsx         # Offline/sync status banner
│   └── logo.tsx                    # AfyaMetrix logo
│
├── lib/
│   └── utils.ts                    # Utility functions (cn, formatDate)
│
├── types/
│   └── index.ts                    # TypeScript type definitions
│
├── public/                         # Static assets
│
├── .env.local.example              # Environment variables template
├── tailwind.config.ts              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
├── next.config.ts                  # Next.js configuration
└── package.json                    # Dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm**, **yarn**, or **pnpm**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Africa_AGT.git
   cd Africa_AGT/afyametrix
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables** (optional for frontend-only)
   ```bash
   cp .env.local.example .env.local
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📱 Application Flow

### 1. **Landing Page** (`/`)
- Hero section with AfyaMetrix branding
- Call-to-action buttons (Get Started, Login, Signup)

### 2. **Onboarding** (`/onboarding`)
- 4-step carousel introducing key features:
  - Health Data, Simplified
  - Live Outbreak Detection
  - Two Roles, One Platform
  - Works Without Internet

### 3. **Authentication** (`/login`, `/signup`)
- Two-tab interface for CHW and CHL roles
- Email/password authentication (currently mock)
- Password recovery and email verification flows

### 4. **Dashboard** (`/dashboard`)
- **Statistics Cards**: Today's cases, pending sync, weekly trends
- **Disease Breakdown Chart**: Visual case distribution
- **Alert System**: Automated outbreak notifications
- **Recent Entries**: Latest case submissions with status
- **Sync Status Banner**: Online/offline indicator

### 5. **Case Reporting** (`/data-clock-in`)
- List view of all case entries (pending & synced)
- Filter and search functionality
- Draft management
- Quick access to new case entry

### 6. **New Case Entry** (`/data-clock-in/new`)
- Multi-row spreadsheet-style form
- Fields per row:
  - Disease type (searchable dropdown)
  - Number of cases
  - Date of report
  - Case details
  - Comments/notes
  - Photo attachments (multiple files)
- Add/remove rows dynamically
- Photo preview with upload status
- Save draft or submit report

### 7. **Advanced Features** (Placeholder Pages)
- **Heatmap** (`/heatmap`): Geographic disease visualization
- **Trends & Forecast** (`/trends-forecast`): Predictive analytics
- **AI Recommendations** (`/ai-recommendations`): Resource allocation insights

---

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--primary-blue: #2563eb;
--primary-blue-dark: #1e40af;
--secondary-teal: #14b8a6;

/* Status Colors */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
--info: #3b82f6;

/* Neutral Colors */
--gray-50: #f9fafb;
--gray-900: #111827;
```

### Typography
- **Font Family**: Inter (sans-serif)
- **Heading Sizes**: `text-2xl`, `text-xl`, `text-lg`
- **Body Text**: `text-base`, `text-sm`
- **Font Weights**: `font-bold`, `font-semibold`, `font-medium`

### Spacing & Layout
- **Grid System**: 4px base unit
- **Border Radius**: `rounded-lg` (8px), `rounded-xl` (12px)
- **Shadows**: `shadow-sm`, `shadow-md`, `shadow-lg`
- **Breakpoints**: Mobile-first (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)

---

## 🔐 Authentication (Current Implementation)

### Mock Authentication
The current implementation uses **localStorage** for demonstration purposes:

```typescript
// Stored in localStorage
{
  userRole: "CHW" | "CHL",
  userName: string,
  userEmail: string
}
```

### Production Requirements
For production deployment, integrate a secure authentication provider:
- **Recommended**: [Supabase Auth](https://supabase.com/auth) or [Clerk](https://clerk.com/)
- **Features Needed**:
  - JWT-based authentication
  - Role-based access control (RBAC)
  - Email verification
  - Password reset
  - Session management
  - Multi-factor authentication (MFA)

---

## 📊 Data Models

### TypeScript Interfaces

```typescript
// User
interface User {
  id: string;
  email: string;
  name: string;
  role: "CHW" | "CHL";
  location?: string;
}

// Case Entry
interface CaseEntry {
  id: string;
  diseaseType: string;
  cases: number;
  date: string;
  worker: string;
  status: "pending" | "synced";
  caseDetails?: string;
  comments?: string;
  photos?: string[];
  createdAt: string;
  updatedAt: string;
}

// Dashboard Stats
interface DashboardStats {
  todayCases: number;
  pendingSync: number;
  thisWeek: number;
  trend?: {
    value: number;
    direction: "up" | "down";
    label: string;
  };
}

// Sync Status
interface SyncStatus {
  isOnline: boolean;
  lastSync: string | null;
  pendingCount: number;
}
```

---

## 🧪 Testing & Quality Assurance

### Linting
```bash
npm run lint
```

### Build Verification
```bash
npm run build
```

### Production Server
```bash
npm run start
```

---

## 📱 Responsive Design

The application is fully responsive across all device sizes:

| Device | Breakpoint | Optimization |
|--------|------------|--------------|
| **Mobile** | < 640px | Touch-friendly, simplified navigation |
| **Tablet** | 768px - 1024px | Primary target device for field workers |
| **Desktop** | > 1024px | Full dashboard experience with sidebar |

---

## ♿ Accessibility

AfyaMetrix follows **WCAG 2.1 Level AA** guidelines:

- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support
- ✅ High contrast color ratios (4.5:1 minimum)
- ✅ Focus indicators on all interactive elements
- ✅ Screen reader friendly markup
- ✅ Semantic HTML structure

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Production Deployment**
   ```bash
   vercel --prod
   ```

### Alternative Platforms

- **Netlify**: Connect GitHub repository via Netlify dashboard
- **AWS Amplify**: Deploy via AWS Console
- **Docker**: Use containerized deployment (Dockerfile required)

### Environment Variables

For production deployment, configure the following environment variables:

```env
# API Configuration (when backend is ready)
NEXT_PUBLIC_API_URL=https://api.afyametrix.health
NEXT_PUBLIC_API_KEY=your_api_key

# Authentication (Supabase example)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# File Storage (AWS S3 example)
NEXT_PUBLIC_S3_BUCKET=afyametrix-photos
NEXT_PUBLIC_S3_REGION=us-east-1
```

---

## 🔮 Roadmap

### Phase 1: Frontend Foundation ✅ (Current)
- [x] Landing page and onboarding
- [x] Authentication UI (mock)
- [x] Dashboard with statistics
- [x] Case entry form
- [x] Offline support (localStorage)
- [x] Responsive design

### Phase 2: Backend Integration 🚧 (In Progress)
- [ ] Real authentication (Supabase/Clerk)
- [ ] REST API integration
- [ ] PostgreSQL database
- [ ] Photo upload to S3
- [ ] Service Worker for true offline support
- [ ] IndexedDB for larger datasets

### Phase 3: Advanced Features 📅 (Planned)
- [ ] Interactive disease heatmap (Mapbox/Leaflet)
- [ ] Trends and forecasting charts
- [ ] AI-powered recommendations
- [ ] Push notifications
- [ ] Real-time WebSocket updates
- [ ] Export reports (PDF/Excel)

### Phase 4: Mobile & Scale 🔮 (Future)
- [ ] React Native mobile app
- [ ] Multi-language support (Swahili, French, etc.)
- [ ] Biometric authentication
- [ ] Voice input for low-literacy users
- [ ] Offline maps integration
- [ ] SMS fallback for zero connectivity

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow TypeScript strict mode
- Use ESLint configuration
- Write meaningful commit messages
- Add comments for complex logic

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**Project Lead**: Senior Full-Stack Engineer  
**Organization**: Africa AGT  
**Contact**: [support@afyametrix.health](mailto:support@afyametrix.health)

---

## 🙏 Acknowledgments

- **Community Health Workers** across Africa for their invaluable feedback
- **shadcn/ui** for the excellent component library
- **Vercel** for Next.js and hosting platform
- **Open Source Community** for the amazing tools and libraries

---

## 📞 Support

For issues, questions, or feature requests:

- **GitHub Issues**: [Create an issue](https://github.com/yourusername/Africa_AGT/issues)
- **Email**: support@afyametrix.health
- **Documentation**: See `QUICKSTART.md` and `PROJECT_SUMMARY.md`

---

## 🌍 Impact

AfyaMetrix aims to:
- **Reduce outbreak response time** from weeks to hours
- **Save lives** through early detection and intervention
- **Empower health workers** with modern digital tools
- **Improve data quality** by eliminating manual transcription errors
- **Enable data-driven decisions** for health authorities

---

**Built with ❤️ for community health workers in Africa**

---

## 📸 Screenshots

### Landing Page
![Landing Page](docs/screenshots/landing.png)

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Case Entry Form
![Case Entry](docs/screenshots/case-entry.png)

---

## 🔗 Related Documentation

- [Quick Start Guide](afyametrix/QUICKSTART.md)
- [Project Summary](afyametrix/PROJECT_SUMMARY.md)
- [Authentication Guide](afyametrix/AUTHENTICATION_GUIDE.md)
- [Deployment Guide](afyametrix/DEPLOYMENT.md)
- [Implementation Notes](afyametrix/IMPLEMENTATION_NOTES.md)

---

**Version**: 0.1.0  
**Last Updated**: May 29, 2026  
**Status**: Frontend Complete | Backend In Development

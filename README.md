# AfyaMetrix - Last-Mile Health Surveillance Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.0.3-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://react.dev/)
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

**AfyaMetrix solves this** by providing an offline-first platform that syncs automatically when connectivity is restored, enabling health authorities to detect and respond to outbreaks within hours instead of weeks.

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
- Recent entries with filtering capabilities
- Automated outbreak alerts

### 📝 Case Reporting
- Intuitive form interface for disease case entry
- Photo attachments with preview capabilities
- Draft saving functionality for incomplete reports
- Bulk data entry support

---

## 🏗️ Tech Stack

- **Framework**: Next.js 15.0.3 with App Router
- **Language**: TypeScript 5.6.3
- **UI Library**: React 18.3.1
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query + Zustand
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Authentication**: JWT-based with email verification
- **Database**: PostgreSQL (Supabase)
- **Deployment**: Netlify (Frontend) + Railway (Backend)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Saronzeleke/Africa_AGT.git
   cd Africa_AGT/afyametrix
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
afyametrix/
├── app/                          # Next.js App Router pages
│   ├── dashboard/               # Main dashboard
│   ├── data-clock-in/          # Case reporting
│   ├── login/                  # Authentication
│   ├── signup/                 # User registration  
│   ├── verify-email/           # Email verification
│   ├── settings/               # User settings
│   └── notifications/          # Notifications
├── components/                  # React components
│   ├── ui/                     # shadcn/ui components
│   ├── layout/                 # Layout components
│   └── dashboard/              # Dashboard-specific components
├── lib/                        # Utilities and configurations
│   ├── api/                    # API client and services
│   ├── hooks/                  # Custom React hooks
│   └── utils.ts                # Helper functions
├── types/                      # TypeScript type definitions
└── middleware.ts               # Next.js middleware for auth
```

---

## 🔐 Authentication Flow

1. **Registration**: User signs up with email, name, and role (CHW/CHL)
2. **Email Verification**: Verification code sent to user's email
3. **Login**: JWT-based authentication with secure token storage
4. **Session Management**: Automatic token refresh and secure logout
5. **Route Protection**: Middleware guards protected routes

---

## 📊 Data Models

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: "CHW" | "CHL";
  location?: string;
}

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
```

---

## 🚀 Deployment

### Frontend (Netlify)
```bash
# Build settings
Build command: cd afyametrix && npm run build
Publish directory: afyametrix/.next
```

### Backend (Railway/Render)
The backend API handles authentication, data storage, and sync operations.

### Environment Variables
```env
# Frontend
NEXT_PUBLIC_API_URL=https://your-backend-url/api

# Backend  
DATABASE_URL=postgresql://...
JWT_SECRET_KEY=your-secret-key
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

---

## 📱 Key Pages

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Landing page | Public |
| `/login` | User authentication | Public |
| `/signup` | User registration | Public |
| `/verify-email` | Email verification | Public |
| `/dashboard` | Main dashboard | Protected |
| `/data-clock-in` | Case management | Protected |
| `/settings` | User settings | Protected |
| `/notifications` | User notifications | Protected |

---

## 🔮 Roadmap

- [x] **Phase 1**: Frontend foundation with authentication
- [x] **Phase 2**: Backend integration with real API
- [ ] **Phase 3**: Advanced analytics and heatmaps
- [ ] **Phase 4**: Mobile app and offline enhancements

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

- **GitHub Issues**: [Create an issue](https://github.com/Saronzeleke/Africa_AGT/issues)
- **Documentation**: See project documentation files

---

## 🌍 Impact

AfyaMetrix aims to reduce outbreak response time from weeks to hours, saving lives through early detection and intervention while empowering health workers with modern digital tools.

---

**Built with ❤️ for community health workers in Africa**

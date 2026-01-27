# Sage Report

AI-powered student report generation platform for educators. Built with Vue 3, TypeScript, Tailwind CSS, and Supabase.

**Live Demo:** [https://sagereport.netlify.app](https://sagereport.netlify.app/login)

Created by Nick Blain

## Features

- **AI Report Generation** - Generate professional student reports with a single click
- **Multiple Report Types** - Progress, behavioral, academic, and IEP reports
- **Student Management** - Manage your student roster
- **Report Editing** - Edit and customize generated reports
- **Status Tracking** - Track reports through draft, reviewed, and sent stages
- **Interactive Dashboard** - Charts and analytics for report activity, status distribution, and grade breakdown
- **Notifications System** - Real-time alerts for report generation, parent feedback, and more
- **Responsive Design** - Fully responsive with mobile-friendly overlay navigation

## Tech Stack

- **Frontend**: Vue 3 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom Sage color palette
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Charts**: Chart.js + vue-chartjs
- **Backend**: Supabase (authentication & database)
- **Fonts**: Instrument Sans (body), Lora (headings)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file with your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Demo Mode

The app includes a **Demo Mode** that works without Supabase configuration. Click "Try Demo Account" on the login page to explore all features with mock data.

## Project Structure

```
src/
├── assets/          # CSS and static assets
├── components/      # Reusable Vue components
│   ├── AppHeader.vue    # Top navigation with notifications
│   └── AppSidebar.vue   # Side navigation
├── layouts/         # Page layouts
│   ├── AuthLayout.vue       # Login/register layout
│   └── DashboardLayout.vue  # Main app layout
├── lib/             # External service clients (Supabase)
├── router/          # Vue Router configuration
├── stores/          # Pinia stores
│   ├── auth.ts      # Authentication state
│   └── reports.ts   # Reports and students state
├── types/           # TypeScript type definitions
└── views/           # Page components
    ├── DashboardView.vue      # Dashboard with charts
    ├── ReportsView.vue        # Reports listing
    ├── NewReportView.vue      # AI report generation
    ├── StudentsView.vue       # Student management
    ├── NotificationsView.vue  # All notifications
    └── SettingsView.vue       # User settings
```

## Dashboard Features

- **Stats Cards** - Total students, reports generated, pending review, sent to parents
- **Report Activity Chart** - Line chart with weekly/monthly/quarterly view
- **Report Status Distribution** - Doughnut chart showing draft/generated/reviewed/sent
- **Students by Grade** - Bar chart showing class distribution
- **Recent Reports** - Quick access to latest reports
- **Quick Actions** - Generate new report, add student

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Deployment

Build the project and deploy the `dist` folder to any static hosting:

```bash
npm run build
```

Compatible with: Vercel, Netlify, Cloudflare Pages, etc.

## License

Private - For interview demonstration purposes.

# Sage Report

AI-powered student report generation platform for educators. Built with Vue 3, TypeScript, Tailwind CSS, and Supabase.

## Features

- **AI Report Generation** - Generate professional student reports with a single click
- **Multiple Report Types** - Progress, behavioral, academic, and IEP reports
- **Student Management** - Manage your student roster
- **Report Editing** - Edit and customize generated reports
- **Status Tracking** - Track reports through draft, reviewed, and sent stages

## Tech Stack

- **Frontend**: Vue 3 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom Sage color palette
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **Backend**: Supabase (authentication & database)

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

The app includes a **Demo Mode** that works without Supabase configuration. Click "Continue with Demo Account" on the login page to explore all features with mock data.

## Project Structure

```
src/
├── assets/          # CSS and static assets
├── components/      # Reusable Vue components
├── layouts/         # Page layouts
├── lib/             # External service clients (Supabase)
├── router/          # Vue Router configuration
├── stores/          # Pinia stores
├── types/           # TypeScript type definitions
└── views/           # Page components
```

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

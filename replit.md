# CodeMaster - Coding Challenge Platform

## Overview

CodeMaster is a web-based coding challenge platform inspired by LeetCode and HackerRank. It allows users to practice coding problems, submit solutions, track progress, and compete on leaderboards. The application provides an interactive code editor with instant feedback, problem categorization by difficulty, and comprehensive user progress tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI Components**: 
- Shadcn UI component library with Radix UI primitives
- Tailwind CSS for styling with a custom design system
- "New York" style variant with CSS variables for theming

**Routing**: 
- Wouter for client-side routing
- Key routes include: home, problems list, problem detail, dashboard, leaderboard, login/signup

**State Management**:
- TanStack Query (React Query) for server state management and caching
- React Context API for authentication state
- Local component state with React hooks

**Design System**:
- Typography: Inter (UI), DM Sans (body), JetBrains Mono (code)
- Difficulty badges: Green (easy), Amber (medium), Red (hard)
- Responsive design with mobile-first approach
- Dark mode support through CSS variables

### Backend Architecture

**Server Framework**: Express.js on Node.js

**API Design**: RESTful API with the following endpoint groups:
- `/api/auth/*` - Authentication (signup, login)
- `/api/problems/*` - Problem CRUD operations, code execution, submission
- `/api/dashboard` - User statistics and recent submissions
- `/api/leaderboard` - User rankings

**Code Execution**: 
- Uses Node.js VM module for sandboxed JavaScript execution
- Runs user code against predefined test cases
- Returns pass/fail results with execution details

**Authentication**:
- JWT-based authentication with 7-day token expiration
- Bcrypt for password hashing
- Token stored in localStorage on client
- Authorization header with Bearer token scheme
- Middleware for protected routes (authMiddleware) and optional auth (optionalAuthMiddleware)

**Validation**: 
- Express-validator for request validation
- Input sanitization and error handling

### Data Storage

**Database**: PostgreSQL (configured via Drizzle ORM)

**ORM**: Drizzle ORM with TypeScript schema definitions

**Schema**:
- **users**: id, username, email, password (hashed), createdAt
- **problems**: id, title, slug, description, difficulty, category, tags, starterCode, testCases, constraints, examples, acceptanceRate, totalSubmissions, createdAt
- **submissions**: userId, problemId, code, status (accepted/rejected), testResults, submittedAt
- **userProgress**: userId, problemId, status (solved/attempted), attempts, lastAttempted, solvedAt

**Storage Abstraction**: 
- IStorage interface allows switching between in-memory (MemStorage) and database implementations
- Supports future scalability and testing

### External Dependencies

**Core Dependencies**:
- `@neondatabase/serverless` - Neon PostgreSQL serverless driver
- `drizzle-orm` and `drizzle-kit` - Database ORM and migrations
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token generation and verification
- `express-validator` - Request validation

**Frontend Libraries**:
- `@tanstack/react-query` - Server state management
- `wouter` - Lightweight routing
- `@radix-ui/*` - Headless UI components (40+ component packages)
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority` and `clsx` - Conditional styling utilities
- `react-hook-form` and `@hookform/resolvers` - Form management
- `zod` - Schema validation

**Development Tools**:
- `vite` - Build tool and dev server
- `tsx` - TypeScript execution for development
- `esbuild` - Production bundling
- `@replit/*` packages - Replit-specific development plugins (cartographer, dev-banner, runtime-error-modal)

**Build Process**:
- Development: Vite dev server with HMR
- Production: Vite builds frontend, esbuild bundles backend
- Separate build outputs: `dist/public` (frontend) and `dist` (backend)
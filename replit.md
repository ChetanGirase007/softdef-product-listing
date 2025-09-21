# Overview

This is a SoftDef Sneakers e-commerce product listing application built as a full-stack React/TypeScript project. The application provides a complete product browsing experience with advanced filtering, sorting, pagination, and responsive design. It features a React frontend with TypeScript, Tailwind CSS styling, and an Express.js backend serving product data through RESTful APIs.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React 18 with TypeScript**: Modern functional components using hooks (useState, useEffect, useCallback) for state management
- **Component-based design**: Modular architecture with reusable components (Header, Sidebar, ProductGrid, ProductCard, Footer)
- **Client-side routing**: Uses Wouter for lightweight routing with URL parameter synchronization
- **State management**: Local state with React hooks, no external state management library
- **UI framework**: Shadcn/ui components built on Radix UI primitives for accessibility and consistency
- **Styling approach**: Tailwind CSS for utility-first styling with custom CSS variables for theming

## Backend Architecture
- **Express.js with TypeScript**: RESTful API server handling product filtering and pagination
- **In-memory storage**: MemStorage class implementing IStorage interface for product data management
- **Input validation**: Zod schemas for API request validation and type safety
- **Middleware setup**: CORS handling, JSON parsing, request logging, and error handling

## Data Management
- **Database integration**: Drizzle ORM configured for PostgreSQL with schema definitions
- **Type safety**: Shared TypeScript types between frontend and backend via shared schema
- **Query optimization**: TanStack Query for data fetching, caching, and synchronization
- **Pagination**: Server-side pagination with configurable page sizes

## User Interface Design
- **Responsive design**: Mobile-first approach with breakpoints for tablets and desktops
- **Interactive elements**: Hover effects, color swatches, expandable filters, and loading states
- **Accessibility**: ARIA labels, keyboard navigation, focus management, and semantic HTML
- **Visual feedback**: Toast notifications for user actions, loading indicators, and error states

## Development Workflow
- **Build system**: Vite for fast development and optimized production builds
- **Code quality**: ESLint with TypeScript configuration and Prettier for formatting
- **Asset handling**: Path aliases for clean imports (@/, @shared/, @assets/)
- **Development tools**: Hot module replacement, runtime error overlay, and development banners

# External Dependencies

## Core Framework Dependencies
- **React ecosystem**: React 18, ReactDOM, React Router (Wouter)
- **TypeScript**: Full type safety across frontend and backend
- **Build tools**: Vite for frontend bundling, ESBuild for backend compilation

## UI and Styling
- **Tailwind CSS**: Utility-first CSS framework with PostCSS and Autoprefixer
- **Radix UI**: Headless UI components for accessibility (@radix-ui/react-*)
- **Shadcn/ui**: Pre-built component library built on Radix UI
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Utility for component variant styling

## Backend Services
- **Express.js**: Web application framework for Node.js
- **Drizzle ORM**: TypeScript ORM for database operations
- **Neon Database**: PostgreSQL database service (@neondatabase/serverless)
- **Zod**: Schema validation library for TypeScript

## Data Fetching and State
- **TanStack Query**: Data fetching, caching, and synchronization
- **React Hook Form**: Form handling with validation (@hookform/resolvers)

## Development and Deployment
- **Replit integration**: Development environment plugins and runtime utilities
- **ESLint and Prettier**: Code formatting and linting
- **TypeScript compiler**: Type checking and compilation
# SoftDef Sneakers - E-commerce Product Listing

A pixel-perfect, responsive e-commerce product listing page for sneakers built with React, TypeScript, and Tailwind CSS. This project was created as part of a frontend internship test for SoftDef.

## 🚀 Features

### Complete E-commerce Functionality
- **Header Navigation**: Complete navigation with cart icon and mobile-responsive menu
- **Product Filtering**: Advanced sidebar filters with expandable/collapsible sections
- **Product Grid**: Responsive grid layout with detailed product cards
- **Sorting Options**: Multiple sorting options (Name, Price, Popularity)
- **Pagination**: Client-side pagination with URL parameter synchronization
- **Search & Filter**: Real-time filtering by brand, color, and price range

### User Experience
- **Responsive Design**: Mobile-first approach with breakpoints for all devices
- **Interactive Elements**: Hover effects, color swatches, and visual feedback
- **Accessibility**: Full keyboard navigation, ARIA labels, and focus management
- **Loading States**: Proper loading indicators and error handling
- **Toast Notifications**: User feedback for cart and wishlist actions

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **React Hooks**: Modern state management with useState, useEffect, useCallback
- **URL State Sync**: Filter and pagination state synced with URL parameters
- **Image Optimization**: Lazy loading and responsive images
- **Component Architecture**: Modular, reusable components

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling (no UI kits)
- **Lucide React** for consistent iconography
- **Wouter** for client-side routing
- **TanStack Query** for data fetching and caching
- **Shadcn/ui** components for UI primitives

### Backend
- **Express.js** with TypeScript
- **In-memory storage** for product data
- **RESTful API** for product filtering and pagination
- **Zod** for input validation

### Development Tools
- **Vite** for fast development and building
- **ESLint** with TypeScript configuration
- **Prettier** for code formatting
- **PostCSS** with Autoprefixer

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd softdef-sneakers

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

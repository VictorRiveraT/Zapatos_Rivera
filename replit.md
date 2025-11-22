# Calzados Rivera E-commerce Platform

## Overview

Calzados Rivera is an e-commerce platform for a Peruvian artisanal shoe company with 20 years of tradition. The application features a customer-facing storefront for browsing and purchasing handcrafted leather shoes, and an admin dashboard for inventory management and sales analytics.

The platform showcases products with a focus on craftsmanship and quality, using a modern design inspired by artisanal e-commerce platforms like Etsy, with a clean teal/turquoise and coral/orange color scheme.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**: React 18 with TypeScript, built using Vite for fast development and optimized production builds.

**UI Framework**: shadcn/ui component library with Radix UI primitives, styled with Tailwind CSS. This provides accessible, customizable components following modern design patterns.

**Routing**: Wouter for lightweight client-side routing. The application has two main routes:
- `/` - Customer storefront (Home page)
- `/admin` - Administrative dashboard

**State Management**: TanStack Query (React Query) for server state management, handling data fetching, caching, and synchronization. No global client state management library is used - component state is managed locally with React hooks.

**Design System**: Custom design tokens defined in CSS variables (Tailwind config) following the "New York" shadcn style. The color palette uses:
- Primary (Teal/Turquoise): `--primary` - for branding, CTAs, links
- Accent (Coral/Orange): `--accent` - for important actions and highlights
- Neutral grays for backgrounds, borders, and secondary elements

### Backend Architecture

**Runtime**: Node.js with Express server

**Development Mode**: Uses Vite dev server with middleware mode for HMR (Hot Module Replacement) and seamless development experience

**Production Mode**: Static file serving of pre-built Vite bundle

**API Design**: RESTful endpoints under `/api` prefix:
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get single product
- `GET /api/cart` - Get cart items with populated product data
- `POST /api/cart` - Add item to cart
- `PATCH /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove cart item
- `POST /api/checkout` - Process checkout
- `GET /api/admin/stats` - Get admin dashboard statistics
- `PATCH /api/admin/inventory/:id` - Update product inventory

**Data Layer**: Currently using in-memory storage (MemStorage class) for development. The architecture is abstracted through an `IStorage` interface, allowing easy transition to database persistence.

### Data Storage Solutions

**Current Implementation**: In-memory storage with Map-based collections for products, cart items, and orders. This is suitable for development and demonstration but not production-ready.

**Planned Database**: PostgreSQL via Neon serverless driver, configured with Drizzle ORM. The schema is already defined in `shared/schema.ts`:
- `products` - Product catalog with SKU, name, price, stock, and image path
- `cart_items` - Shopping cart entries with product references and quantities  
- `orders` - Order records with total amount and payment method

**ORM Choice**: Drizzle ORM provides type-safe database queries with minimal overhead. Schema definitions use `drizzle-zod` for automatic validation schema generation.

**Migration Strategy**: Drizzle Kit configured for schema migrations to PostgreSQL, though migrations are not yet created since in-memory storage is currently active.

### External Dependencies

**UI Component Libraries**:
- Radix UI - Comprehensive set of unstyled, accessible component primitives
- shadcn/ui - Pre-built component patterns built on Radix UI
- Lucide React - Icon library for consistent iconography

**Form Handling**:
- React Hook Form - Form state management
- @hookform/resolvers - Validation resolver integrations
- Zod - Runtime type validation and schema definition

**Styling**:
- Tailwind CSS - Utility-first CSS framework
- class-variance-authority - Type-safe variant styling
- clsx/tailwind-merge - Conditional class merging

**Database & ORM**:
- @neondatabase/serverless - Serverless PostgreSQL client
- Drizzle ORM - TypeScript ORM for type-safe queries
- drizzle-zod - Schema to Zod validation generator

**Build Tools**:
- Vite - Frontend build tool and dev server
- esbuild - Backend bundling for production
- TypeScript - Type safety across the stack

**Replit Integration**:
- @replit/vite-plugin-runtime-error-modal - Development error overlay
- @replit/vite-plugin-cartographer - Enhanced debugging in Replit
- @replit/vite-plugin-dev-banner - Development environment indicators

**Assets**: Product images stored in `/attached_assets/generated_images/` directory, referenced through path mappings in Vite config. Images feature artisanal leather shoes in various styles (loafers, boots, sandals, etc.).
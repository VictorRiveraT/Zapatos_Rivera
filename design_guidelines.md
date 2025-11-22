# Calzados Rivera E-commerce Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern e-commerce platforms like Etsy (artisanal focus) and established Peruvian e-commerce sites, combined with clean dashboard patterns from Shopify Admin.

## Core Design Elements

### Typography
- **Primary Font**: Inter or DM Sans via Google Fonts for clean, professional readability
- **Headings**: font-bold, text-4xl (Hero), text-2xl (Section headers), text-xl (Product names)
- **Body Text**: font-normal, text-base (Product descriptions, forms), text-sm (Labels, metadata)
- **Price Display**: font-semibold, text-lg with "S/" prefix

### Color Palette (User-Specified)
- **Primary (Teal/Turquoise)**: Use for navbar, primary buttons, links, active states
- **Background (White)**: Clean white (#FFFFFF) for main backgrounds
- **Accent (Soft Coral/Orange)**: CTA buttons, badges, sale indicators, important highlights
- **Neutrals**: Gray-100 to Gray-800 for borders, secondary text, card backgrounds

### Layout System
**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Container: max-w-7xl mx-auto
- Section padding: py-12 md:py-20
- Card padding: p-4 to p-6
- Grid gaps: gap-6 md:gap-8

## Component Library

### Customer Front-End Components

**Navbar**
- Sticky top navigation with white background, subtle shadow
- Logo "Calzados Rivera" (left), navigation links (center), cart icon with badge (right)
- Height: h-16 md:h-20
- Mobile: Hamburger menu collapsing links

**Hero Section**
- Full-width banner with background image showing artisan craftsmanship or leather texture
- Centered text overlay: "20 años de tradición a tus pies" (text-4xl md:text-6xl, font-bold)
- Primary CTA button "Ver Catálogo" (coral/orange accent, px-8 py-3, rounded-lg with backdrop blur if on image)
- Height: 60vh to 70vh

**Product Catalog Grid**
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Product Cards:
  - White background with subtle shadow, rounded-lg, hover:shadow-xl transition
  - Image: aspect-square, object-cover, rounded-t-lg
  - Content padding: p-4
  - Product name: font-semibold, text-lg
  - Price: font-semibold, text-xl, teal color
  - "Añadir al Carrito" button: full-width, teal background, white text, rounded-md

**Cart Drawer/Modal**
- Slide-in from right (w-full md:w-96)
- Header with "Carrito de Compras" and close button
- Scrollable item list with product image, name, price, quantity controls
- Footer: Total price display (text-2xl, font-bold) and "Checkout" button (coral accent)
- Mock payment screen: Card layout with two payment options as buttons (Tarjeta: Niubiz/Culqi, Billetera Digital: Yape/Plin)

### Admin Dashboard Components

**Dashboard Overview Cards**
- Grid: grid-cols-1 md:grid-cols-3
- Stat cards: White background, rounded-lg, p-6, border-l-4 with color coding
  - Total Sales: teal border
  - Orders Pending: orange border
  - Low Stock Alerts: red border
- Each card: Icon (top), Value (text-3xl, font-bold), Label (text-sm, text-gray-600)

**Inventory Management Table**
- Responsive table with striped rows (odd:bg-gray-50)
- Columns: SKU (text-sm, font-mono), Name, Price (font-semibold), Stock Level
- Stock level with color indicators: green (>10), yellow (5-10), red (<5)
- Inline edit functionality: Click stock number to edit, save/cancel buttons appear
- Headers: bg-teal-50, font-semibold, sticky top

## Navigation & Routing
- Front-end routes: / (home with hero + catalog), /nosotros
- Admin route: /admin (protected view toggle or separate access)
- Smooth transitions between views

## Images

### Hero Section
**Large Hero Image**: Full-width background showing artisan hands crafting leather shoes or close-up of premium leather texture. The image should convey craftsmanship, tradition, and quality. Overlay with semi-transparent gradient (dark to transparent) for text readability.

### Product Catalog
**Product Images**: High-quality placeholder images of handmade leather shoes:
- Mocasín Clásico: Traditional brown leather loafers
- Botín Cuero: Ankle boots in dark leather
- Zapato Formal: Elegant dress shoes
- Sandalia Artesanal: Handcrafted leather sandals
Each image should be well-lit, neutral background, showing shoe at 45-degree angle.

### Admin Dashboard
No decorative images needed. Focus on data visualization and clean interface.

## Interaction Patterns
- Hover states: Scale product cards slightly (hover:scale-105), button brightness changes
- Cart icon: Animate badge when items added (scale pulse)
- Loading states: Skeleton loaders for product grid
- Form validation: Inline error messages in red-500
- Success feedback: Toast notifications (teal background)

## Responsive Behavior
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Mobile: Single-column layouts, bottom navigation consideration for cart
- Desktop: Multi-column grids, sidebar potential for filters
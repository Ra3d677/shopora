# Shopora (Multo) - Multi-Tenant E-Commerce Platform

**Shopora** is a powerful multi-tenant SaaS e-commerce platform built with **Next.js 16**, **React 19**, **PostgreSQL**, and **TypeScript**. It allows merchants to create and manage fully customizable online stores with a rich admin dashboard, multiple templates, analytics, and payment integrations.

---

## ✨ Features

### 🏪 For Store Owners
- **Multi-Store Management** - Create and manage multiple stores from one account
- **Custom Templates** - Modern, Signature, Fitness (برعي), Tourism, Zenith templates
- **Visual Editor** - Drag & drop page builder with editable text, images, and buttons
- **Product Management** - Unlimited products with variants (sizes, colors), categories, and inventory
- **Order Management** - Full order lifecycle: pending → paid → shipped → delivered
- **Coupon System** - Percentage/fixed discounts with usage limits and expiry
- **Blog Engine** - SEO-friendly blog posts with categories
- **Media Library** - Cloudinary integration for image management
- **Customer Reviews** - Product reviews and ratings

### 💳 Payments
- **Stripe** - Credit/debit cards, Payment Intents
- **PayPal** - Express checkout
- **Paymob** - Local Egyptian payment gateway (Cards + Wallets)
- **Manual Methods** - Bank transfer, cash on delivery
- **Subscription Plans** - Monthly, quarterly, semi-annual, annual billing

### 📊 Analytics & Tracking
- **Revenue Dashboard** - Charts and metrics with Recharts
- **Facebook Pixel** - Event tracking (ViewContent, AddToCart, Purchase)
- **TikTok Pixel** - Conversion tracking
- **Snapchat Pixel** - Ad conversion tracking
- **Google Analytics** - Visitor analytics
- **Export Reports** - XLSX and PDF export

### 🌐 Localization
- **Full Arabic Support** - RTL layout, Arabic translations, Arabic numerals
- **English/Arabic Toggle** - Language switcher with persistence

### 🔐 Security
- **Firebase Authentication** - Email/password + Google OAuth
- **Rate Limiting** - In-memory rate limiter per IP (configurable)
- **Security Headers** - X-Frame-Options, XSS Protection, HSTS, CSP
- **Input Validation** - Zod schemas for all API endpoints
- **Password Hashing** - bcryptjs for secure password storage

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16+
- npm or yarn

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/shopora?pgbouncer=true"
DIRECT_URL="postgresql://user:password@localhost:5432/shopora"

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email (Resend)
RESEND_API_KEY=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3005
```

### Installation

```bash
# Clone the repository
git clone https://github.com/Ra3d677/shopora.git
cd shopora

# Install dependencies
npm install

# Set up the database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

Open [http://localhost:3005](http://localhost:3005) in your browser.

---

## 🐳 Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build -d

# Or build manually
docker build -t shopora .
docker run -p 3000:3000 --env-file .env shopora
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

---

## 🏗️ Project Structure

```
src/
├── actions/           # Server actions
├── app/
│   ├── (marketing)/   # Landing, pricing pages
│   ├── admin/         # Super admin panel
│   ├── api/           # REST API routes
│   ├── auth/          # Authentication pages
│   ├── store/         # Store routes
│   │   └── [slug]/
│   │       ├── (storefront)/  # Public store pages
│   │       └── admin/         # Store admin dashboard
│   └── ...
├── components/
│   ├── checkout/      # Payment forms
│   ├── editor/        # Visual page editor
│   ├── layout/        # Navbar, Footer, Trackers
│   ├── products/      # Product cards
│   ├── providers/     # React context providers
│   ├── store/         # Store-specific components
│   ├── templates/     # Store templates (Modern, Fitness, etc.)
│   └── ui/            # Reusable UI components
├── lib/
│   ├── cache.ts       # Caching utilities
│   ├── validations.ts # Zod schemas
│   ├── auth.ts        # Authentication helpers
│   ├── prisma.ts      # Database client
│   ├── types.ts       # TypeScript types
│   └── ...
├── store/             # Zustand state management
└── middleware.ts      # Security & rate limiting
```

---

## 📦 Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | Next.js 16, React 19, Tailwind CSS 4, Framer Motion |
| **Backend** | Next.js API Routes, Server Actions |
| **Database** | PostgreSQL + Prisma ORM |
| **Auth** | Firebase Auth + Google OAuth + bcryptjs |
| **Payments** | Stripe, PayPal, Paymob |
| **Media** | Cloudinary |
| **Charts** | Recharts |
| **Email** | Resend |
| **Validation** | Zod |
| **State** | Zustand |
| **Testing** | Vitest |
| **Container** | Docker + Docker Compose |
| **CI/CD** | GitHub Actions |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## ⚡ Performance Optimizations

- ✅ **Prisma Singleton** - Connection pooling and reuse
- ✅ **Standalone Output** - Optimized Docker builds
- ✅ **Cache Headers** - Static assets caching
- ✅ **ISR Ready** - `cachedFetch` utility with Next.js unstable_cache
- ✅ **Rate Limiting** - Per-IP request limiting
- ✅ **Security Headers** - HSTS, XSS, CSP protection

## 🔜 Roadmap

- [x] Input validation (Zod)
- [x] Rate limiting & security headers
- [x] Docker support
- [x] CI/CD pipeline
- [x] Test suite (Vitest)
- [ ] Sentry error tracking
- [ ] Audit log system (ActivityLog)
- [ ] Redis-based rate limiting
- [ ] E2E tests (Playwright)
- [ ] API documentation (Swagger/OpenAPI)
- [ ] PWA support
# 🚀 ShopSmart - Premium E-Commerce Platform

<div align="center">

<!-- Glass morphism themed badges -->
<img src="https://img.shields.io/badge/✨_ShopSmart-Glass_Morphism-8B5CF6?style=for-the-badge&logo=sparkles&logoColor=white&labelColor=1E293B&color=8B5CF6" />
<img src="https://img.shields.io/badge/🚀_Next.js_15-Latest_Features-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
<img src="https://img.shields.io/badge/⚛️_React_19-Modern_Hooks-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/🔷_TypeScript-Type_Safe-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/🔥_Firebase-Backend-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
<img src="https://img.shields.io/badge/🎯_Tailwind-Utility_First-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />

**Where Modern Design Meets Seamless Shopping Experience**

[🌐 Live Demo](https://full-stack-ecommerce-website-five.vercel.app/) • [🛠️ Features](#-features) • [⚡ Quick Start](#-installation)

</div>

## ✨ Project Overview

ShopSmart is a complete e-commerce solution built with cutting-edge technologies, featuring a stunning glass morphism design, secure authentication, and seamless shopping experience.

## 🚀 Core Features

### 🛍️ Shopping Experience
- **Product Catalog** - Browse and view products with beautiful layouts
- **Shopping Cart** - Persistent cart with real-time updates
- **Wishlist** - Save favorite products for later
- **Order Management** - Track and view order history
- **User Profiles** - Personalized user accounts

### 🎨 Premium Design
- **Glass Morphism UI** - Stunning translucent effects with backdrop blur
- **Dynamic Gradients** - Beautiful color transitions throughout
- **Smooth Animations** - Fluid transitions and hover effects
- **Mobile-First** - Responsive design for all devices
- **Modern Components** - Custom UI components with Tailwind CSS

### 🔐 Authentication & Security
- **Firebase Authentication** - Secure email/password authentication
- **Role-Based Access** - Admin and customer permissions
- **Stripe Payments** - Secure payment processing
- **Protected Routes** - Secure access to user-specific features

### 👑 Admin Features
- **Admin Dashboard** - Complete store management
- **Product Management** - Add, edit, and manage products
- **Order Management** - View and process customer orders
- **User Management** - Monitor user accounts and activities

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Layer                          │
├─────────────────────────────────────────────────────────────┤
│  Next.js 15 │ React 19 │ TypeScript │ Tailwind CSS │ Redux  │
└─────────────────────────────────────────────────────────────┘
                             │
┌─────────────────────────────────────────────────────────────┐
│                    Serverless Layer                         │
├─────────────────────────────────────────────────────────────┤
│           API Routes │ Server Actions │ Middleware          │
└─────────────────────────────────────────────────────────────┘
                             │
┌─────────────────────────────────────────────────────────────┐
│                     Service Layer                           │
├─────────────────────────────────────────────────────────────┤
│          Firebase Auth │ Firestore │ Storage │ Stripe       │
└─────────────────────────────────────────────────────────────┘
```

## 💻 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React features
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **Lucide React** - Beautiful icons

### Backend & Services
- **Firebase Auth** - User authentication
- **Firestore** - Real-time database
- **Cloud Storage** - File storage
- **Stripe** - Payment processing
- **Vercel** - Deployment platform

### Development
- **ESLint** - Code linting
- **TypeScript** - Static type checking

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17+ 
- Firebase Account
- Stripe Account

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/shopsmart.git
cd shopsmart

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Configure your environment variables
# Add Firebase and Stripe keys to .env.local

# Run the development server
npm run dev
```

### Environment Setup

Create `.env.local`:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
STRIPE_SECRET_KEY=your_secret_key
```

## 🎨 Project Structure

```
shopsmart/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   ├── products/          # Product pages
│   │   ├── cart/              # Shopping cart
│   │   ├── checkout/          # Checkout process
│   │   ├── admin/             # Admin dashboard
│   │   ├── auth/              # Authentication
│   │   ├── profile/           # User profiles
│   │   ├── orders/            # Order management
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── ui/                # Base UI components
│   │   ├── layout/            # Layout components
│   │   └── shared/            # Shared components
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.ts         # Authentication hook
│   │   ├── useAdmin.ts        # Admin permissions hook
│   │   └── useCart.ts         # Cart management hook
│   ├── lib/                   # Utility libraries
│   │   ├── firebase.ts        # Firebase configuration
│   │   └── stripe.ts          # Stripe configuration
│   ├── redux/                 # State management
│   │   ├── store.ts           # Redux store
│   │   └── slices/            # Redux slices
│   └── contexts/              # React contexts
│       └── AuthContext.tsx    # Authentication context
├── public/                    # Static assets
└── package.json              # Dependencies
```

## 🔥 Key Components

### Premium Navigation
```tsx
export default function Navbar() {
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const [isScrolled, setIsScrolled] = useState(false);
  
  return (
    <nav className={`fixed top-0 z-50 w-full transition-all duration-500 ${
      isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-2xl' : 'bg-white/90'
    }`}>
      {/* Navigation content */}
    </nav>
  );
}
```

### Authentication System
```tsx
export function useAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        setIsAdmin(adminDoc.exists());
      }
      setChecking(false);
    };
    
    checkAdminStatus();
  }, [user]);
  
  return { isAdmin, checking };
}
```

### Cart Management
```tsx
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find(i => i.id === item.id);
      
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.items.push(item);
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    }
  },
});
```

## 🚀 Deployment

### Vercel Deployment
```bash
# Build and deploy
npm run build
vercel --prod
```

### Environment Variables on Vercel
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add all Firebase and Stripe environment variables
3. Redeploy your project

## 📱 Pages & Routes

- **/** - Home page with featured products
- **/products** - Product catalog
- **/products/[id]** - Individual product pages
- **/cart** - Shopping cart
- **/checkout** - Checkout process with Stripe
- **/order-success** - Order confirmation
- **/auth/login** - User login
- **/auth/register** - User registration
- **/profile** - User profile and orders
- **/orders** - Order history
- **/wishlist** - Saved products
- **/admin** - Admin dashboard
- **/admin/products** - Product management
- **/admin/orders** - Order management

## 🛠️ Development

### Running the Project
```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Code Structure
The project follows Next.js 15 best practices with:
- App Router for routing
- Server and Client components
- API routes for backend functionality
- Middleware for route protection

## 🤝 Contributing

We welcome contributions! Please feel free to submit pull requests or open issues for bugs and feature requests.

### Contribution Guidelines
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 👨‍💻 Author

**Aquib Khan**
- Full-stack developer passionate about creating amazing user experiences
- 
---

<div align="center">

## ⭐ Support the Project

If you find this project helpful, please give it a star on GitHub!

```bash
# Clone and start building
git clone https://github.com/KAquib24/E-Commerce-With-NextJS.git
cd full-stack-ecommerce-webiste
npm install
npm run dev
```

**Happy coding! 🚀**

</div>

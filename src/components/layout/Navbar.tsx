// src/components/layout/Navbar.tsx - UPDATED VERSION
"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  Shield,
  LogOut,
  Home,
  Package,
  Heart,
  History,
  X,
  Bell,
  Store
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isAdmin, checking, needsUserDoc } = useAdmin(); // Add needsUserDoc
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  // Mock cart items count - replace with actual cart context
  useEffect(() => {
    // This would come from your cart context
    setCartItemsCount(3); // Mock data
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMenuOpen(false);
      setIsSearchOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // SMART ADMIN NAVIGATION FUNCTION
  const handleAdminNavigation = () => {
    console.log("🔄 Admin navigation clicked:", {
      isAdmin,
      needsUserDoc,
      checking,
    });

    if (checking) {
      console.log("⏳ Still checking admin status...");
      return;
    }

    if (needsUserDoc) {
      console.log("📄 No admin document found, redirecting to create-user-doc");
      router.push("/create-user-doc");
    } else if (isAdmin) {
      console.log("✅ User is admin, redirecting to admin panel");
      router.push("/admin");
    } else {
      console.log("❌ User is not admin, showing access denied");
      alert("You need admin privileges to access this section.");
    }

    setIsMenuOpen(false);
    setIsSearchOpen(false);
  };

  const navigateTo = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  };

  const isActivePath = (path: string) => {
    return pathname === path;
  };

  // Quick actions for mobile
  const quickActions = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Package, label: "Products", path: "/products" },
    { icon: ShoppingCart, label: "Cart", path: "/cart", badge: cartItemsCount },
    { icon: Heart, label: "Wishlist", path: "/wishlist" },
    { icon: History, label: "Orders", path: "/orders" },
  ];

  // Show admin link to all logged-in users, but handle navigation smartly
  const shouldShowAdminLink = user && !checking;

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2"
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="font-bold text-xl text-gray-900 hidden sm:block">
                  ShopSmart
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <Button
                variant={isActivePath("/") ? "secondary" : "ghost"}
                onClick={() => navigateTo("/")}
                className="flex items-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Button>

              <Button
                variant={isActivePath("/products") ? "secondary" : "ghost"}
                onClick={() => navigateTo("/products")}
                className="flex items-center space-x-2"
              >
                <Package className="h-4 w-4" />
                <span>Products</span>
              </Button>

              {user && (
                <>
                  <Button
                    variant={isActivePath("/orders") ? "secondary" : "ghost"}
                    onClick={() => navigateTo("/orders")}
                    className="flex items-center space-x-2"
                  >
                    <History className="h-4 w-4" />
                    <span>Orders</span>
                  </Button>

                  <Button
                    variant={isActivePath("/wishlist") ? "secondary" : "ghost"}
                    onClick={() => navigateTo("/wishlist")}
                    className="flex items-center space-x-2"
                  >
                    <Heart className="h-4 w-4" />
                    <span>Wishlist</span>
                  </Button>
                </>
              )}
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="flex w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 w-full"
                  />
                </div>
                <Button type="submit" className="ml-2">
                  Search
                </Button>
              </form>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              {/* Mobile Search Button */}
              <Button
                variant="ghost"
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden p-2"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center space-x-2">
                {/* Admin Panel - Show to all logged-in users */}
                {shouldShowAdminLink && (
                  <Button
                    variant={
                      isActivePath("/admin") || isActivePath("/create-user-doc")
                        ? "secondary"
                        : "ghost"
                    }
                    onClick={handleAdminNavigation}
                    className={`flex items-center space-x-2 ${
                      needsUserDoc
                        ? "text-orange-600 hover:text-orange-700"
                        : isAdmin
                        ? "text-blue-600 hover:text-blue-700"
                        : "text-gray-600 hover:text-gray-700"
                    }`}
                  >
                    <Shield className="h-4 w-4" />
                    <span>
                      {checking
                        ? "Checking..."
                        : needsUserDoc
                        ? "Setup Admin"
                        : isAdmin
                        ? "Admin"
                        : "Admin Access"}
                    </span>
                  </Button>
                )}

                {/* Cart */}
                <Button
                  variant={isActivePath("/cart") ? "secondary" : "ghost"}
                  onClick={() => navigateTo("/cart")}
                  className="relative flex items-center space-x-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Cart</span>
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Button>

                {/* User Menu */}
                {user ? (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={isActivePath("/profile") ? "secondary" : "ghost"}
                      onClick={() => navigateTo("/profile")}
                      className="flex items-center space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <span className="hidden lg:block">Profile</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="hidden sm:flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      onClick={() => navigateTo("/auth/login")}
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => navigateTo("/auth/register")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>

              {/* Mobile User Menu */}
              <div className="md:hidden">
                {user ? (
                  <Button
                    variant="ghost"
                    onClick={() => navigateTo("/profile")}
                    className="p-2"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button onClick={() => navigateTo("/auth/login")} size="sm">
                    Login
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isSearchOpen && (
            <div className="md:hidden pb-4 border-t border-gray-200 pt-4">
              <div className="flex items-center space-x-2">
                <form onSubmit={handleSearch} className="flex-1 flex space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4"
                      autoFocus
                    />
                  </div>
                  <Button type="submit" size="sm">
                    Go
                  </Button>
                </form>
                <Button
                  variant="ghost"
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
            <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">S</span>
                    </div>
                    <span className="font-bold text-lg">ShopSmart</span>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setIsMenuOpen(false)}
                    className="p-1"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                {user && (
                  <p className="text-sm text-gray-600 mt-2">{user.email}</p>
                )}
              </div>
              {/* Navigation */}
              <div className="p-4 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                {/* Main Navigation */}
                <div className="space-y-1">
                  <Button
                    variant={isActivePath("/") ? "secondary" : "ghost"}
                    onClick={() => navigateTo("/")}
                    className="w-full justify-start"
                  >
                    <Home className="h-4 w-4 mr-3" />
                    Home
                  </Button>

                  <Button
                    variant={isActivePath("/products") ? "secondary" : "ghost"}
                    onClick={() => navigateTo("/products")}
                    className="w-full justify-start"
                  >
                    <Package className="h-4 w-4 mr-3" />
                    Products
                  </Button>

                  <Button
                    variant={isActivePath("/cart") ? "secondary" : "ghost"}
                    onClick={() => navigateTo("/cart")}
                    className="w-full justify-start"
                  >
                    <div className="relative">
                      <ShoppingCart className="h-4 w-4 mr-3" />
                      {cartItemsCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                          {cartItemsCount}
                        </span>
                      )}
                    </div>
                    Cart
                  </Button>
                </div>

                {/* User Sections */}
                {user && (
                  <div className="space-y-1 pt-4 border-t border-gray-200">
                    <Button
                      variant={isActivePath("/orders") ? "secondary" : "ghost"}
                      onClick={() => navigateTo("/orders")}
                      className="w-full justify-start"
                    >
                      <History className="h-4 w-4 mr-3" />
                      Orders
                    </Button>

                    <Button
                      variant={
                        isActivePath("/wishlist") ? "secondary" : "ghost"
                      }
                      onClick={() => navigateTo("/wishlist")}
                      className="w-full justify-start"
                    >
                      <Heart className="h-4 w-4 mr-3" />
                      Wishlist
                    </Button>

                    <Button
                      variant={isActivePath("/profile") ? "secondary" : "ghost"}
                      onClick={() => navigateTo("/profile")}
                      className="w-full justify-start"
                    >
                      <User className="h-4 w-4 mr-3" />
                      Profile
                    </Button>

                    {/* Admin Section in Mobile */}
                    <div className="pt-2 border-t border-gray-200">
                      <Button
                        onClick={handleAdminNavigation}
                        className={`w-full justify-start ${
                          needsUserDoc
                            ? "text-orange-600 hover:text-orange-700"
                            : isAdmin
                            ? "text-blue-600 hover:text-blue-700"
                            : "text-gray-600 hover:text-gray-700"
                        }`}
                      >
                        <Shield className="h-4 w-4 mr-3" />
                        {checking
                          ? "Checking Admin..."
                          : needsUserDoc
                          ? "Setup Admin Access"
                          : isAdmin
                          ? "Admin Panel"
                          : "Request Admin Access"}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Quick Actions Grid */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-2">
                    {quickActions.map((action) => (
                      <button
                        key={action.path}
                        onClick={() => navigateTo(action.path)}
                        className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="relative">
                          <action.icon className="h-5 w-5 text-gray-600" />
                          {action.badge && action.badge > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                              {action.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-xs mt-1 text-gray-600">
                          {action.label}
                        </span>
                      </button>
                    ))}
                    <button
                      onClick={() => setIsSearchOpen(true)}
                      className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Search className="h-5 w-5 text-gray-600" />
                      <span className="text-xs mt-1 text-gray-600">Search</span>
                    </button>
                  </div>
                </div>
              </div>
              // In your Navbar.tsx - Add vendor link
              {user && (
                <Link href="/vendor/dashboard">
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 text-green-600 hover:text-green-700"
                  >
                    <Store className="h-4 w-4" />
                    <span>My Store</span>
                  </Button>
                </Link>
              )}
              {/* Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
                {user ? (
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full justify-center text-red-600 hover:text-red-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button
                      onClick={() => navigateTo("/auth/login")}
                      variant="outline"
                      className="w-full"
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => navigateTo("/auth/register")}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}

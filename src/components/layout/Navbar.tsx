"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext"; // Make sure this context exists
import { useState } from "react";
import { Button } from "@/components/ui/button"; // your Button component
import { toast } from "@/components/ui/use-toast";
import { Heart } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: "Logged out successfully" });
    } catch (error: any) {
      toast({ title: error.message, variant: "destructive" });
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center relative">
      {/* Logo */}
      <Link
        href="/"
        className="text-xl font-bold text-brand dark:text-brand-light"
      >
        🛍️ ShopSmart
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-4">
        <Link
          href="/products"
          className="hover:text-brand-dark dark:hover:text-brand-light"
        >
          Products
        </Link>

        {user ? (
          <>
            <Link
              href="/cart"
              className="hover:text-brand-dark dark:hover:text-brand-light"
            >
              Cart
            </Link>
            <Link
              href="/profile"
              className="hover:text-brand-dark dark:hover:text-brand-light"
            >
              Profile
            </Link>
            <Link
              href="/wishlist"
              className="hover:text-brand-dark dark:hover:text-brand-light"
            >
              Wishlist
            </Link>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link
              href="/auth/login"
              className="hover:text-brand-dark dark:hover:text-brand-light"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="hover:text-brand-dark dark:hover:text-brand-light"
            >
              Sign Up
            </Link>
          </>
        )}

        {/* Theme Toggle */}
        <Button onClick={toggleTheme} variant="ghost">
          {theme === "light" ? "🌙" : "☀️"}
        </Button>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden flex items-center gap-2">
        <Button onClick={toggleTheme} variant="ghost">
          {theme === "light" ? "🌙" : "☀️"}
        </Button>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md border border-gray-300 dark:border-gray-600"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-16 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-md flex flex-col p-4 gap-2 md:hidden">
          <Link href="/products" onClick={() => setIsOpen(false)}>
            Products
          </Link>
          // In your Navbar component, add:
          <Link href="/orders" className="hover:text-gray-300">
            My Orders
          </Link>
          // Add this to your navbar links
          <Link
            href="/wishlist"
            className="flex items-center gap-1 hover:text-gray-300"
          >
            <Heart className="h-4 w-4" />
            Wishlist
          </Link>
          {user ? (
            <>
              <Link href="/cart" onClick={() => setIsOpen(false)}>
                Cart
              </Link>
              <Link href="/profile" onClick={() => setIsOpen(false)}>
                Profile
              </Link>
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                Login
              </Link>
              <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

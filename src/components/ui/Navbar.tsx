import CurrencySelector from "../CurrencySelector";
import LanguageSwitcher from "../LanguageSwitcher";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ShoppingCart, User, Home, Store, Heart } from "lucide-react";

export default function Navbar() {
  const t = useTranslations("Navigation");
  const authT = useTranslations("Auth");

  return (
    <nav className="w-full border-b bg-gradient-to-r from-blue-600 to-purple-700 shadow-lg p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-white p-2 rounded-lg shadow-md">
            <Store className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Shop<span className="text-yellow-300">Smart</span>
          </h1>
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-6 items-center">
          {/* Currency & Language Selectors */}
          <div className="flex gap-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20">
              <CurrencySelector />
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Navigation Links with Icons */}
          <div className="flex gap-4 items-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-white hover:text-yellow-300 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-white/10"
            >
              <Home className="h-4 w-4" />
              <span className="font-medium">{t("home")}</span>
            </Link>

            <Link 
              href="/shop" 
              className="flex items-center gap-2 text-white hover:text-yellow-300 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-white/10"
            >
              <Store className="h-4 w-4" />
              <span className="font-medium">{t("shop")}</span>
            </Link>

            <Link 
              href="/cart" 
              className="flex items-center gap-2 text-white hover:text-yellow-300 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-white/10"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="font-medium">{t("cart")}</span>
            </Link>

            <Link 
              href="/wishlist" 
              className="flex items-center gap-2 text-white hover:text-yellow-300 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-white/10"
            >
              <Heart className="h-4 w-4" />
              <span className="font-medium">{t("wishlist")}</span>
            </Link>
          </div>

          {/* User Profile/Auth */}
          <div className="flex items-center gap-3">
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg">
              {authT("login")}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
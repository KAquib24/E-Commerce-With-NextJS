// src/app/admin/layout.tsx
import AdminRoute from "@/components/AdminRoute";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  LogOut 
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg border-r">
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
            <p className="text-sm text-gray-600 mt-1">E-Commerce Dashboard</p>
          </div>
          
          <nav className="p-4 space-y-2">
            <Link href="/admin">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            
            <Link href="/admin/products">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Package className="h-4 w-4" />
                Products
              </Button>
            </Link>
            
            <Link href="/admin/orders">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <ShoppingCart className="h-4 w-4" />
                Orders
              </Button>
            </Link>
            
            <Link href="/admin/users">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Users className="h-4 w-4" />
                Users
              </Button>
            </Link>
            
            <Link href="/admin/settings">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </Link>
            
            <div className="pt-4 border-t">
              <Link href="/">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <LogOut className="h-4 w-4" />
                  Back to Store
                </Button>
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </AdminRoute>
  );
}
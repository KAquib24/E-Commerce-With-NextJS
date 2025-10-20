// src/app/admin/page.tsx - UPDATED WITH REAL-TIME FEATURES
"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllOrders, getAllUsers } from "@/lib/firestore";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  TrendingUp,
  Clock,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Eye
} from "lucide-react";
import { useRouter } from "next/navigation";

// Add real-time interface
interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  averageOrderValue: number;
  revenueChange: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    averageOrderValue: 0,
    revenueChange: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const router = useRouter();

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      const [users, orders] = await Promise.all([
        getAllUsers(),
        getAllOrders()
      ]);

      // Calculate revenue and stats
      const revenue = orders.reduce((total, order) => total + (order.total || 0), 0);
      const pending = orders.filter(order => order.status === 'pending').length;
      const completed = orders.filter(order => order.status === 'delivered').length;
      const averageOrderValue = orders.length > 0 ? revenue / orders.length : 0;

      // Calculate revenue change (mock data for demo - in real app, compare with previous period)
      const revenueChange = calculateRevenueChange(orders);

      setStats({
        totalUsers: users.length,
        totalOrders: orders.length,
        totalRevenue: revenue,
        pendingOrders: pending,
        completedOrders: completed,
        averageOrderValue: averageOrderValue,
        revenueChange: revenueChange
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Mock function to calculate revenue change (replace with real comparison logic)
  const calculateRevenueChange = (orders: any[]): number => {
    // In a real app, you'd compare with previous period data
    // For demo, we'll use a random change between -10% and +20%
    return Math.random() * 30 - 10;
  };

  useEffect(() => {
    fetchStats();

    // Set up real-time refresh every 30 seconds
    const interval = setInterval(() => {
      fetchStats();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'products':
        router.push('/admin/products');
        break;
      case 'orders':
        router.push('/admin/orders');
        break;
      case 'users':
        router.push('/admin/users');
        break;
      case 'analytics':
        router.push('/admin/analytics');
        break;
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Loading your store analytics...</p>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Real-time store analytics and management
            {lastUpdated && (
              <span className="text-sm text-gray-500 ml-2">
                • Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <Button 
          onClick={fetchStats} 
          disabled={refreshing}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-gray-600">Registered customers</p>
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-gray-600">All-time orders</p>
          </CardContent>
        </Card>

        {/* Total Revenue - REAL TIME */}
        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              {stats.revenueChange !== 0 && (
                <div className={`flex items-center text-xs ${
                  stats.revenueChange > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stats.revenueChange > 0 ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  {Math.abs(stats.revenueChange).toFixed(1)}%
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-gray-600">Lifetime revenue • Real-time</p>
          </CardContent>
        </Card>

        {/* Pending Orders */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-gray-600">Awaiting processing</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Average Order Value */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.averageOrderValue)}</div>
            <p className="text-xs text-gray-600">Per order average</p>
          </CardContent>
        </Card>

        {/* Completed Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedOrders}</div>
            <p className="text-xs text-gray-600">Successfully delivered</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              className="p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-colors group"
              onClick={() => handleQuickAction('products')}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Manage Products</h3>
                  <p className="text-sm text-gray-600">Add, edit, or remove products</p>
                </div>
              </div>
            </div>
            
            <div 
              className="p-4 border rounded-lg hover:bg-green-50 hover:border-green-200 cursor-pointer transition-colors group"
              onClick={() => handleQuickAction('orders')}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <ShoppingCart className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">View Orders</h3>
                  <p className="text-sm text-gray-600">Process and track orders</p>
                </div>
              </div>
            </div>
            
            <div 
              className="p-4 border rounded-lg hover:bg-purple-50 hover:border-purple-200 cursor-pointer transition-colors group"
              onClick={() => handleQuickAction('users')}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">User Management</h3>
                  <p className="text-sm text-gray-600">Manage customer accounts</p>
                </div>
              </div>
            </div>

            <div 
              className="p-4 border rounded-lg hover:bg-orange-50 hover:border-orange-200 cursor-pointer transition-colors group"
              onClick={() => handleQuickAction('analytics')}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <Eye className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">View Analytics</h3>
                  <p className="text-sm text-gray-600">Detailed reports & insights</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Updates Info */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-5 w-5 text-blue-600" />
          <div>
            <h4 className="font-medium text-blue-900">Real-time Updates</h4>
            <p className="text-sm text-blue-700">
              Data refreshes automatically every 30 seconds. Click "Refresh Data" for immediate updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
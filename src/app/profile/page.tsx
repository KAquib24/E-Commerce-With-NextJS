"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { getOrders } from "@/redux/slices/ordersSlice";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import useAuth from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "lucide-react";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  ShoppingBag,
  Package,
  Truck,
  CheckCircle,
  Clock,
  Settings,
  Edit3,
  Plus,
} from "lucide-react";
import { usePriceFormatter } from "@/lib/utils/priceFormatter";
import { toast } from "@/hooks/use-toast";

// In your ProfilePage component, add these debug logs:
export default function ProfilePage() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state: RootState) => state.orders);
  const { formatPrice } = usePriceFormatter();
  const [activeTab, setActiveTab] = useState<
    "orders" | "addresses" | "settings"
  >("orders");

  // Debug logs
  useEffect(() => {
    console.log("🔄 Profile Page - User:", user);
    console.log("🔄 Profile Page - Orders from Redux:", orders);
    console.log("🔄 Profile Page - Loading:", loading);
  }, [user, orders, loading]);

  useEffect(() => {
    if (user?.uid) {
      console.log("🚀 Dispatching getOrders for user:", user.uid);
      dispatch(getOrders(user.uid) as any);
    } else {
      console.log("❌ No user ID available for fetching orders");
    }
  }, [user, dispatch]);

  // ... rest of your component
  const getOrderStatus = (status: string) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        label: "Pending",
      },
      processing: {
        color: "bg-blue-100 text-blue-800",
        icon: Package,
        label: "Processing",
      },
      shipped: {
        color: "bg-purple-100 text-purple-800",
        icon: Truck,
        label: "Shipped",
      },
      delivered: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        label: "Delivered",
      },
      cancelled: {
        color: "bg-red-100 text-red-800",
        icon: Clock,
        label: "Cancelled",
      },
    };

    return (
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    );
  };

  const formatOrderDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalSpent = orders.reduce(
    (total, order) => total + (order.total || 0),
    0
  );
  const totalOrders = orders.length;

  if (!user) {
    return null; // ProtectedRoute will handle redirection
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My Account
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your profile, orders, and preferences
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* User Profile Card */}
              <Card className="border-0 shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <img
                        src={user?.photoURL || "/default-user.png"}
                        alt="User"
                        className="w-20 h-20 rounded-full border-4 border-white shadow-lg mx-auto"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                      {user?.displayName || "User"}
                    </h2>
                    <p className="text-gray-600 text-sm mb-4 flex items-center justify-center gap-2">
                      <Mail className="h-4 w-4" />
                      {user?.email}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-2">
                      <Calendar className="h-4 w-4" />
                      Member since {new Date().getFullYear()}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation Tabs */}
              <Card className="border-0 shadow-lg bg-white">
                <CardContent className="p-4">
                  <nav className="space-y-2">
                    <button
                      onClick={() => setActiveTab("orders")}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                        activeTab === "orders"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <ShoppingBag className="h-5 w-5" />
                      <div>
                        <div className="font-medium">My Orders</div>
                        <div className="text-sm opacity-75">
                          {totalOrders} orders
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveTab("addresses")}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                        activeTab === "addresses"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <MapPin className="h-5 w-5" />
                      <div>
                        <div className="font-medium">Addresses</div>
                        <div className="text-sm opacity-75">
                          Manage addresses
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveTab("settings")}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                        activeTab === "settings"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Settings className="h-5 w-5" />
                      <div>
                        <div className="font-medium">Settings</div>
                        <div className="text-sm opacity-75">Preferences</div>
                      </div>
                    </button>
                  </nav>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Shopping Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-100">Total Orders</span>
                      <span className="font-bold">{totalOrders}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-100">Total Spent</span>
                      <span className="font-bold">
                        {formatPrice(totalSpent)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-100">Member Since</span>
                      <span className="font-bold text-sm">
                        {new Date().getFullYear()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Orders Tab */}
              {activeTab === "orders" && (
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-2xl font-bold text-gray-900">
                          Order History
                        </CardTitle>
                        <CardDescription>
                          Track and manage your recent purchases
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                        onClick={() => (window.location.href = "/products")}
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Continue Shopping
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex justify-center items-center py-12">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-gray-600">
                            Loading your orders...
                          </p>
                        </div>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                          <ShoppingBag className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          No Orders Yet
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                          You haven't placed any orders yet. Start shopping to
                          see your order history here.
                        </p>
                        <Button
                          onClick={() => (window.location.href = "/products")}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Start Shopping
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => {
                          const statusConfig = getOrderStatus(
                            order.status || "pending"
                          );
                          const StatusIcon = statusConfig.icon;

                          return (
                            <div
                              key={order.id}
                              className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all duration-200 bg-white"
                            >
                              {/* Order Header */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <div>
                                  <div className="flex items-center gap-3 mb-2">
                                    <h4 className="font-semibold text-gray-900">
                                      Order #{order.id?.slice(-8) || "N/A"}
                                    </h4>
                                    <Badge
                                      className={`${statusConfig.color} px-3 py-1 text-xs font-medium`}
                                    >
                                      <StatusIcon className="h-3 w-3 mr-1" />
                                      {statusConfig.label}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600 flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {formatOrderDate(
                                      order.createdAt ||
                                        new Date().toISOString()
                                    )}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-blue-600">
                                    {formatPrice(order.total || 0)}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {order.items?.length || 0} items
                                  </p>
                                </div>
                              </div>

                              {/* Order Items */}
                              <div className="border-t border-gray-100 pt-4">
                                <div className="grid gap-3">
                                  {order.items?.map(
                                    (item: any, index: number) => (
                                      <div
                                        key={index}
                                        className="flex items-center gap-4 py-2"
                                      >
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                          {item.image ? (
                                            <img
                                              src={item.image}
                                              alt={item.name}
                                              className="w-10 h-10 object-cover rounded"
                                            />
                                          ) : (
                                            <Package className="h-6 w-6 text-gray-400" />
                                          )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="font-medium text-gray-900 truncate">
                                            {item.name || `Item ${index + 1}`}
                                          </p>
                                          <p className="text-sm text-gray-600">
                                            Qty: {item.quantity || 1} •{" "}
                                            {formatPrice(item.price || 0)} each
                                          </p>
                                        </div>
                                        <div className="text-right">
                                          <p className="font-semibold text-gray-900">
                                            {formatPrice(
                                              (item.price || 0) *
                                                (item.quantity || 1)
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>

                              {/* Order Actions */}
                              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-gray-300"
                                >
                                  View Details
                                </Button>
                                {/* // In your profile page, fix the status */}
                                {/* comparison: */}
                                {(order.status === 'pending' || order.status === 'paid') && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-red-300 text-red-600 hover:bg-red-50"
                                  >
                                    Cancel Order
                                  </Button>
                                )}
                                {order.status === "delivered" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-green-300 text-green-600 hover:bg-green-50"
                                  >
                                    Reorder
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Addresses Tab */}
              {activeTab === "addresses" && (
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-2xl font-bold text-gray-900">
                          Saved Addresses
                        </CardTitle>
                        <CardDescription>
                          Manage your delivery addresses
                        </CardDescription>
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Address
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <div className="w-24 h-24 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                        <MapPin className="h-10 w-10 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No Saved Addresses
                      </h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        You haven't saved any addresses yet. Add your first
                        address to make checkout faster.
                      </p>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Address
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-2xl font-bold text-gray-900">
                          Account Settings
                        </CardTitle>
                        <CardDescription>
                          Manage your account preferences and notifications
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Notification Settings */}
                      <div className="border border-gray-200 rounded-2xl p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">
                          Notification Preferences
                        </h4>
                        <div className="space-y-4">
                          {[
                            {
                              label: "Order Updates",
                              description:
                                "Get notified about order status changes",
                            },
                            {
                              label: "Promotional Emails",
                              description: "Receive offers and discounts",
                            },
                            {
                              label: "Product Recommendations",
                              description: "Personalized product suggestions",
                            },
                            {
                              label: "Security Alerts",
                              description: "Important security notifications",
                            },
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between"
                            >
                              <div>
                                <p className="font-medium text-gray-900">
                                  {item.label}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {item.description}
                                </p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  defaultChecked
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Account Actions */}
                      <div className="border border-gray-200 rounded-2xl p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">
                          Account Actions
                        </h4>
                        <div className="grid gap-3">
                          <Button
                            variant="outline"
                            className="justify-start border-gray-300"
                          >
                            Change Password
                          </Button>
                          <Button
                            variant="outline"
                            className="justify-start border-gray-300"
                          >
                            Privacy Settings
                          </Button>
                          <Button
                            variant="outline"
                            className="justify-start border-red-300 text-red-600 hover:bg-red-50"
                          >
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

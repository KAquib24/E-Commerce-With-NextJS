// In your ProfilePage component, update the imports and add cancel functionality
"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { getOrders } from "@/redux/slices/ordersSlice";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import useAuth from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
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
  XCircle,
  AlertTriangle,
  History,
  RotateCcw,
  Eye,
} from "lucide-react";
import { usePriceFormatter } from "@/lib/utils/priceFormatter";
import { toast } from "@/hooks/use-toast";

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
type OrderTab = 'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export default function ProfilePage() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state: RootState) => state.orders);
  const { cancelOrder } = useOrders();
  const { formatPrice } = usePriceFormatter();
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "settings">("orders");
  const [activeOrderTab, setActiveOrderTab] = useState<OrderTab>("all");
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState<string | null>(null);

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

  // Add cancel order function
  const handleCancelOrder = async (orderId: string) => {
    if (!user?.uid) {
      toast({
        title: "Error",
        description: "You must be logged in to cancel orders",
        variant: "destructive",
      });
      return;
    }

    setCancellingOrderId(orderId);
    try {
      await cancelOrder(orderId, user.uid);
      toast({
        title: "Order Cancelled",
        description: "Your order has been successfully cancelled",
        variant: "default",
      });
      setShowCancelConfirm(null);
    } catch (error) {
      toast({
        title: "Cancellation Failed",
        description: "Failed to cancel order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCancellingOrderId(null);
    }
  };

  // Filter orders based on active tab
  const filteredOrders = orders?.filter(order => {
    if (activeOrderTab === 'all') return true;
    return order.status === activeOrderTab;
  }) || [];

  // Get order counts for each status
  const orderCounts = {
    all: orders?.length || 0,
    pending: orders?.filter(order => order.status === 'pending').length || 0,
    processing: orders?.filter(order => order.status === 'processing').length || 0,
    shipped: orders?.filter(order => order.status === 'shipped').length || 0,
    delivered: orders?.filter(order => order.status === 'delivered').length || 0,
    cancelled: orders?.filter(order => order.status === 'cancelled').length || 0,
  };

  // Order status helper functions
  const getOrderStatus = (status: string) => {
    const statusConfig = {
      pending: { label: "Pending", icon: Clock, color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
      processing: { label: "Processing", icon: Package, color: "text-blue-600 bg-blue-50 border-blue-200" },
      shipped: { label: "Shipped", icon: Truck, color: "text-purple-600 bg-purple-50 border-purple-200" },
      delivered: { label: "Delivered", icon: CheckCircle, color: "text-green-600 bg-green-50 border-green-200" },
      cancelled: { label: "Cancelled", icon: XCircle, color: "text-gray-600 bg-gray-50 border-gray-200" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <Badge className={`${config.color} px-3 py-1 text-xs font-medium flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatOrderDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Order tab configuration
  const orderTabs: { id: OrderTab; label: string; icon: any; description: string }[] = [
    { id: 'all', label: 'All Orders', icon: History, description: 'View your complete order history' },
    { id: 'pending', label: 'Pending', icon: Clock, description: 'Orders awaiting confirmation' },
    { id: 'processing', label: 'Processing', icon: Package, description: 'Orders being prepared' },
    { id: 'shipped', label: 'Shipped', icon: Truck, description: 'Orders on the way' },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle, description: 'Completed orders' },
    { id: 'cancelled', label: 'Cancelled', icon: XCircle, description: 'Cancelled orders' },
  ];

  // Empty state messages
  const getEmptyStateMessage = (tab: OrderTab) => {
    const messages = {
      all: {
        title: "No orders yet",
        description: "When you place orders, they will appear here.",
        icon: ShoppingBag
      },
      pending: {
        title: "No pending orders",
        description: "You don't have any orders awaiting confirmation.",
        icon: Clock
      },
      processing: {
        title: "No orders in processing",
        description: "All your orders are either completed or awaiting shipment.",
        icon: Package
      },
      shipped: {
        title: "No orders shipped",
        description: "Your orders will appear here once they're on the way.",
        icon: Truck
      },
      delivered: {
        title: "No delivered orders",
        description: "Completed orders will appear here for your reference.",
        icon: CheckCircle
      },
      cancelled: {
        title: "No cancelled orders",
        description: "You haven't cancelled any orders yet.",
        icon: XCircle
      }
    };
    return messages[tab];
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <Card className="mb-8 border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {user?.displayName || "User"}
                    </h1>
                    <p className="text-gray-600 flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {user?.email}
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="border-gray-300">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: "orders", label: "My Orders", icon: ShoppingBag },
                  { id: "addresses", label: "Addresses", icon: MapPin },
                  { id: "settings", label: "Settings", icon: Settings },
                ].map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Orders Tab Content */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              {/* Order Status Tabs */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {orderTabs.map((tab) => {
                      const IconComponent = tab.icon;
                      const isActive = activeOrderTab === tab.id;
                      const count = orderCounts[tab.id];
                      
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveOrderTab(tab.id)}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            isActive
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${
                              isActive ? "bg-blue-100" : "bg-gray-100"
                            }`}>
                              <IconComponent className={`h-4 w-4 ${
                                isActive ? "text-blue-600" : "text-gray-600"
                              }`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`font-semibold ${
                                  isActive ? "text-blue-900" : "text-gray-900"
                                }`}>
                                  {count}
                                </span>
                                <span className={`text-sm ${
                                  isActive ? "text-blue-700" : "text-gray-600"
                                }`}>
                                  {tab.label}
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Orders List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {activeOrderTab === 'all' ? 'All Orders' : orderTabs.find(tab => tab.id === activeOrderTab)?.label}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {orderTabs.find(tab => tab.id === activeOrderTab)?.description}
                    </p>
                  </div>
                  <div className="text-sm text-gray-600">
                    {filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"}
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                ) : error ? (
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-6 text-center">
                      <p className="text-red-600">Error loading orders: {error}</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => user?.uid && dispatch(getOrders(user.uid) as any)}
                      >
                        Try Again
                      </Button>
                    </CardContent>
                  </Card>
                ) : filteredOrders.length === 0 ? (
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-12 text-center">
                      {(() => {
                        const emptyState = getEmptyStateMessage(activeOrderTab);
                        const IconComponent = emptyState.icon;
                        return (
                          <>
                            <IconComponent className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              {emptyState.title}
                            </h3>
                            <p className="text-gray-600 mb-6">
                              {emptyState.description}
                            </p>
                            {activeOrderTab !== 'all' && (
                              <Button 
                                variant="outline"
                                onClick={() => setActiveOrderTab('all')}
                                className="border-gray-300"
                              >
                                View All Orders
                              </Button>
                            )}
                          </>
                        );
                      })()}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <Card key={order.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          {/* Order Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-4 flex-wrap">
                                <h3 className="font-semibold text-gray-900">
                                  Order #{order.id?.slice(-8) || "N/A"}
                                </h3>
                                {getOrderStatus(order.status)}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="h-4 w-4 mr-2" />
                                {formatOrderDate(order.createdAt)}
                                {order.deliveredAt && order.status === 'delivered' && (
                                  <span className="ml-4 flex items-center text-green-600">
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Delivered on {formatOrderDate(order.deliveredAt)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-lg font-bold text-gray-900 mt-2 sm:mt-0">
                              {formatPrice(order.total)}
                            </div>
                          </div>

                          {/* Order Items Preview */}
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-3">
                              <Package className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">Items</span>
                            </div>
                            <div className="space-y-2">
                              {order.items?.slice(0, 3).map((item, index) => (
                                <div key={index} className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                                      <span className="text-xs font-medium text-gray-600">
                                        {item.quantity}x
                                      </span>
                                    </div>
                                    <span className="text-gray-700">{item.name}</span>
                                  </div>
                                  <span className="text-gray-900 font-medium">
                                    {formatPrice(item.price * item.quantity)}
                                  </span>
                                </div>
                              ))}
                              {order.items && order.items.length > 3 && (
                                <div className="text-sm text-gray-500 pt-2">
                                  +{order.items.length - 3} more items
                                </div>
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
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            
                            {/* Status-based Actions */}
                            <div className="flex gap-2">
                              {/* Cancel Order - Only for pending/processing */}
                              {(order.status === 'pending' || order.status === 'processing') && (
                                <>
                                  {showCancelConfirm === order.id ? (
                                    <div className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-gray-300 text-gray-600 hover:bg-gray-50"
                                        onClick={() => setShowCancelConfirm(null)}
                                        disabled={cancellingOrderId === order.id}
                                      >
                                        Keep Order
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-red-300 text-red-600 hover:bg-red-50"
                                        onClick={() => handleCancelOrder(order.id)}
                                        disabled={cancellingOrderId === order.id}
                                      >
                                        {cancellingOrderId === order.id ? (
                                          <>
                                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2" />
                                            Cancelling...
                                          </>
                                        ) : (
                                          <>
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Confirm Cancel
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                  ) : (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-red-300 text-red-600 hover:bg-red-50"
                                      onClick={() => setShowCancelConfirm(order.id)}
                                      disabled={cancellingOrderId === order.id}
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Cancel Order
                                    </Button>
                                  )}
                                </>
                              )}
                              
                              {/* Track Order - For shipped orders */}
                              {order.status === 'shipped' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                                >
                                  <Truck className="h-4 w-4 mr-2" />
                                  Track Order
                                </Button>
                              )}
                              
                              {/* Reorder - For delivered orders */}
                              {order.status === 'delivered' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-green-300 text-green-600 hover:bg-green-50"
                                >
                                  <RotateCcw className="h-4 w-4 mr-2" />
                                  Reorder
                                </Button>
                              )}
                              
                              {/* Cancelled Badge */}
                              {order.status === "cancelled" && (
                                <Badge className="bg-gray-100 text-gray-600 px-3 py-1 text-xs font-medium border-gray-300">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Cancelled
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Other Tab Contents (Addresses & Settings - same as before) */}
          {activeTab === "addresses" && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Addresses
                </CardTitle>
                <CardDescription>
                  Manage your shipping addresses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
                  <p className="text-gray-600 mb-4">
                    Add your first shipping address to make checkout faster.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "settings" && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Settings
                </CardTitle>
                <CardDescription>
                  Manage your account settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Notifications</h4>
                    <p className="text-sm text-gray-600">Manage your email notifications</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Privacy</h4>
                    <p className="text-sm text-gray-600">Control your privacy settings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cancel Order Confirmation Modal */}
          {showCancelConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md border-0 shadow-2xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 text-red-600">
                    <AlertTriangle className="h-6 w-6" />
                    <CardTitle className="text-xl">Cancel Order?</CardTitle>
                  </div>
                  <CardDescription>
                    Are you sure you want to cancel this order? This action cannot be undone.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-700 font-medium">
                        Order #{orders.find(o => o.id === showCancelConfirm)?.id?.slice(-8) || 'N/A'}
                      </p>
                      <p className="text-sm text-red-600">
                        Total: {formatPrice(orders.find(o => o.id === showCancelConfirm)?.total || 0)}
                      </p>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="outline"
                        className="flex-1 border-gray-300"
                        onClick={() => setShowCancelConfirm(null)}
                        disabled={cancellingOrderId === showCancelConfirm}
                      >
                        Keep Order
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                        onClick={() => handleCancelOrder(showCancelConfirm)}
                        disabled={cancellingOrderId === showCancelConfirm}
                      >
                        {cancellingOrderId === showCancelConfirm ? (
                          <>
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2" />
                            Cancelling...
                          </>
                        ) : (
                          'Yes, Cancel Order'
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simple mock data for now
    setStats({
      totalUsers: 150,
      totalOrders: 45,
      totalRevenue: 1250.75
    });
    setLoading(false);
  }, []);

  if (loading) return <p>Loading analytics...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent><p>🧑 Users: {stats.totalUsers}</p></CardContent></Card>
        <Card><CardContent><p>📦 Orders: {stats.totalOrders}</p></CardContent></Card>
        <Card><CardContent><p>💰 Revenue: ${stats.totalRevenue}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent>
          <h2 className="font-semibold mb-2">Analytics Coming Soon</h2>
          <p>Advanced charts and real-time analytics will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
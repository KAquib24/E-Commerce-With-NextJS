// src/app/admin-test/page.tsx
"use client";
import { useEffect } from "react";

export default function AdminTestPage() {
  useEffect(() => {
    console.log("🔄 AdminTestPage mounted");
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-green-600">✅ ADMIN PANEL WORKS!</h1>
      <p className="mt-4 text-gray-600">
        If you can see this page, the admin panel is working correctly.
        The issue is with the authentication redirect logic.
      </p>
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="font-semibold">Next steps:</h2>
        <ol className="list-decimal list-inside mt-2 space-y-1">
          <li>Visit <code>/admin</code> to test the real admin panel</li>
          <li>Check browser console for any errors</li>
          <li>If it redirects, check the AdminRoute component logs</li>
        </ol>
      </div>
    </div>
  );
}
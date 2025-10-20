// src/components/AdminRoute.tsx
"use client";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/hooks/useAdmin";
import { useEffect, useState } from "react";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, checking } = useAdmin();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  console.log("🔐 AdminRoute - Status:", { isAdmin, checking, isClient });

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only redirect when we have a definitive "not admin" answer
  useEffect(() => {
    if (isClient && !checking && isAdmin === false) {
      console.log("❌ Redirecting to home - definitively not admin");
      router.push("/");
    }
  }, [isClient, isAdmin, checking, router]);

  // Show loading during initial check
  if (!isClient || checking) {
    console.log("⏳ AdminRoute - Loading (waiting for definitive answer)");
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Verifying admin access...</p>
          <p className="text-sm text-gray-400 mt-2">Please wait while we check your permissions</p>
        </div>
      </div>
    );
  }

  // Show admin content if authorized
  if (isAdmin === true) {
    console.log("✅ AdminRoute - Rendering admin content");
    return <>{children}</>;
  }

  // Show access denied if not admin
  console.log("🚫 AdminRoute - Access denied");
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <p className="text-red-500 text-lg font-semibold">Admin Access Required</p>
        <p className="text-gray-600 mt-2">You don't have permission to access this page.</p>
        <button 
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
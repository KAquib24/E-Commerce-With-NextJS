// src/components/AdminRoute.tsx
"use client";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/hooks/useAdmin";
import { useEffect } from "react";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, checking } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!checking && !isAdmin) {
      router.push("/");
    }
  }, [isAdmin, checking, router]);

  if (checking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Checking admin permissions...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Redirecting...</p>
      </div>
    );
  }

  return <>{children}</>;
}
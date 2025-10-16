// src/hooks/useAdmin.ts
"use client";
import { useState, useEffect } from "react";
import useAuth from "./useAuth";
import { getUserRole } from "@/lib/firestore";

export function useAdmin() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (user) {
        try {
          const role = await getUserRole(user.uid);
          setIsAdmin(role === "admin");
        } catch (error) {
          console.error("Error checking admin role:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setChecking(false);
    };

    if (!authLoading) {
      checkAdminRole();
    }
  }, [user, authLoading]);

  return { 
    isAdmin, 
    checking: checking || authLoading, 
    user 
  };
}
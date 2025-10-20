// src/hooks/useAdmin.ts - UPDATED VERSION
"use client";
import { useState, useEffect } from "react";
import useAuth from "./useAuth";
import { getUserRole } from "@/lib/firestore";

export function useAdmin() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);
  const [needsUserDoc, setNeedsUserDoc] = useState(false);

  useEffect(() => {
    console.log("🔄 useAdmin - Effect triggered", { 
      user: user?.email, 
      authLoading 
    });

    const checkAdminRole = async () => {
      // Don't proceed if no user or still loading auth
      if (!user || authLoading) {
        console.log("⏳ useAdmin - Waiting for user/auth...");
        setIsAdmin(false);
        setNeedsUserDoc(false);
        setChecking(false);
        return;
      }

      try {
        console.log("🔍 useAdmin - Checking role for:", user.uid);
        const role = await getUserRole(user.uid);
        console.log("🎯 useAdmin - Role result:", role);
        
        if (role === null) {
          // User document doesn't exist
          console.log("📄 useAdmin - No user document found, needs creation");
          setNeedsUserDoc(true);
          setIsAdmin(false);
        } else {
          const adminStatus = role === "admin";
          setIsAdmin(adminStatus);
          setNeedsUserDoc(false);
          console.log("✅ useAdmin - Admin status set to:", adminStatus);
        }
      } catch (error) {
        console.error("🚨 useAdmin - Error checking admin role:", error);
        setIsAdmin(false);
        setNeedsUserDoc(false);
      } finally {
        console.log("🏁 useAdmin - Finished checking");
        setChecking(false);
      }
    };

    checkAdminRole();
  }, [user, authLoading]);

  // Only return checking: false when we have a definitive answer
  const isChecking = checking || authLoading || isAdmin === null;
  
  console.log("📊 useAdmin - Return values:", { 
    isAdmin: isAdmin || false, 
    checking: isChecking,
    needsUserDoc,
    user: user?.email,
    definitiveAnswer: isAdmin !== null
  });
  
  return { 
    isAdmin: isAdmin || false, 
    checking: isChecking, 
    user,
    needsUserDoc 
  };
}
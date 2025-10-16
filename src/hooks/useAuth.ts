"use client";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "@/lib/firebase";
import { setUser, clearUser } from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";
import { getUserRole } from "@/lib/firestore";

export default function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get user role from Firestore
        const role = await getUserRole(firebaseUser.uid);
        
        dispatch(
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: role || "user" // Add role here
          })
        );
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return {
    user,
    loading: false // You might want to keep your loading state logic
  };
}
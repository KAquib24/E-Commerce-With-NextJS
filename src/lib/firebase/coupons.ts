import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export interface Coupon {
  code: string;
  discount: number;
  expiresAt: string;
  isActive: boolean;
}

export const validateCoupon = async (code: string): Promise<Coupon | null> => {
  try {
    const ref = doc(db, "coupons", code.toUpperCase());
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const data = snap.data() as Coupon;
    const expired = new Date(data.expiresAt) < new Date();
    if (expired || !data.isActive) return null;

    return data;
  } catch (err) {
    console.error("Coupon validation error:", err);
    return null;
  }
};

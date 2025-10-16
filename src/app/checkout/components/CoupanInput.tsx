// src/app/checkout/components/CouponInput.tsx
"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { applyCoupon, removeCoupon } from "@/redux/slices/cartSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CouponInput() {
  const [code, setCode] = useState("");
  const dispatch = useDispatch();
  const { couponCode, discount } = useSelector((state: RootState) => state.cart);

  const handleApply = () => {
    if (code.trim() === "") return;

    // Example coupon logic - you can expand this
    const coupons: { [key: string]: number } = {
      "SAVE10": 10,
      "WELCOME15": 15,
      "FREESHIP": 5,
    };

    if (coupons[code.toUpperCase()]) {
      dispatch(applyCoupon({ 
        code: code.toUpperCase(), 
        discount: coupons[code.toUpperCase()] 
      }));
      setCode("");
    } else {
      alert("Invalid coupon code");
    }
  };

  const handleRemove = () => {
    dispatch(removeCoupon());
    setCode("");
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="font-semibold mb-2">Apply Coupon</h3>
      
      {couponCode ? (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-600 font-medium">
              Coupon applied: {couponCode} (-${discount})
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRemove}
          >
            Remove
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter coupon code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleApply}>
            Apply
          </Button>
        </div>
      )}
    </div>
  );
}
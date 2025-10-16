"use client";
import { useCurrency } from "@/context/CurrencyContext";

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value as any)}
      className="border rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-sm"
    >
      <option value="INR">₹ INR</option>
      <option value="USD">$ USD</option>
      <option value="EUR">€ EUR</option>
      <option value="JPY">¥ JPY</option>
    </select>
  );
}

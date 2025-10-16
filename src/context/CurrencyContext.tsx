"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Currency = "INR" | "USD" | "EUR" | "JPY";

interface CurrencyContextType {
  currency: Currency;
  rate: number;
  setCurrency: (c: Currency) => void;
  convert: (price: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "INR",
  rate: 1,
  setCurrency: () => {},
  convert: (p) => p,
});

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>("INR");
  const [rate, setRate] = useState<number>(1);

  useEffect(() => {
    const fetchRate = async () => {
      if (currency === "INR") return setRate(1);
      const res = await fetch(`https://api.exchangerate.host/latest?base=INR&symbols=${currency}`);
      const data = await res.json();
      setRate(data.rates[currency]);
    };
    fetchRate();
  }, [currency]);

  const convert = (price: number) => price * rate;

  return (
    <CurrencyContext.Provider value={{ currency, rate, setCurrency, convert }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);

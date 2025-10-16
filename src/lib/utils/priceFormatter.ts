import { useCurrency } from "@/context/CurrencyContext";

export const usePriceFormatter = () => {
  const { currency, convert } = useCurrency();

  const formatPrice = (amount: number) => {
    const converted = convert(amount);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(converted);
  };

  return { formatPrice };
};

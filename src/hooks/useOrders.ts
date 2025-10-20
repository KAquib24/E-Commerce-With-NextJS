// src/hooks/useOrders.ts
"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { getOrders, cancelOrder } from "@/redux/slices/ordersSlice";
import { useCallback } from "react";

export function useOrders() {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error } = useSelector((state: RootState) => state.orders);

  const fetchOrders = useCallback(
    (userId: string) => dispatch(getOrders(userId)),
    [dispatch]
  );

  const cancelUserOrder = useCallback(
    async (orderId: string, userId: string) => {
      const result = await dispatch(cancelOrder({ orderId, userId })).unwrap();
      return result;
    },
    [dispatch]
  );

  return {
    orders,
    loading,
    error,
    fetchOrders,
    cancelOrder: cancelUserOrder,
  };
}

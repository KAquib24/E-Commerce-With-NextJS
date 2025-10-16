"use client";

import { Provider } from "react-redux";
import { ReactNode } from "react";
import { store } from "@/redux/store";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      {children}
      <Toaster position="top-right" />
    </Provider>
  );
}

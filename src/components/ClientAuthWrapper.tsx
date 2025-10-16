// src/components/ClientAuthWrapper.tsx  ("use client")
"use client";
import { ReactNode } from "react";
import useAuth from "@/hooks/useAuth";

export default function ClientAuthWrapper({ children }: { children: ReactNode }) {
  useAuth(); // runs only on client and only after Providers wrapped it
  return <>{children}</>;
}

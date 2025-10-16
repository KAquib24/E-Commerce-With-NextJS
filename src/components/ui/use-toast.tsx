"use client";
import { toast as reactToastifyToast } from "react-hot-toast";

interface ToastOptions {
  title: string;
  variant?: "default" | "destructive";
}

export const toast = ({ title, variant = "default" }: ToastOptions) => {
  // simple alert for now
  alert(title);
};

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/ui/footer";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { Providers } from "@/redux/Providers";
import { CurrencyProvider } from "@/context/CurrencyContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShopSmart | E-commerce",
  description: "A modern full-stack Next.js e-commerce store.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-background text-foreground")}>
        <Providers>
          <ThemeProvider>
            <AuthProvider>
              <CurrencyProvider>
                <Navbar />
                <main className="min-h-screen">{children}</main>
                <Footer />
              </CurrencyProvider>
            </AuthProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CartNotification from "@/components/ui/CartNotification";

import { CurrencyProvider } from "@/context/CurrencyContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vedika Jewels | Premium Luxury Jewelry",
  description: "A curation of timeless, high-end jewels. The Digital Atelier for premium necklaces, rings, and earrings.",
  metadataBase: new URL("https://vedikajewels.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans selection:bg-[#D4AF37] selection:text-white">
        <CurrencyProvider>
          <CartProvider>
            <CartNotification />
            {children}
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}

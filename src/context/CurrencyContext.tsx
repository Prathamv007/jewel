"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Currency = "INR" | "USD" | "EUR" | "GBP";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (priceInInr: number, overrideCurrency?: string) => string;
}

// Current mid-market approximate rates
const rates: Record<string, number> = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0094,
};

const locales: Record<string, string> = {
  INR: "en-IN",
  USD: "en-US",
  EUR: "en-IE", // English (Ireland) uses Euro but with comma thousands separator
  GBP: "en-GB",
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("INR");

  useEffect(() => {
    const saved = localStorage.getItem("preferred_currency") as Currency;
    if (saved && rates[saved]) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("preferred_currency", c);
  };

  /**
   * Transforms INR prices into the selected currency.
   * Leverages Intl.NumberFormat for premium, local-aware precision.
   */
  const formatPrice = (priceInInr: number, overrideCurrency?: string) => {
    const targetCurrency = (overrideCurrency || currency);
    const rate = rates[targetCurrency] || 1;
    const converted = priceInInr * rate;
    const locale = locales[targetCurrency] || "en-IN";
    
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: targetCurrency,
      minimumFractionDigits: targetCurrency === "INR" ? 0 : 2,
      maximumFractionDigits: targetCurrency === "INR" ? 0 : 2,
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}

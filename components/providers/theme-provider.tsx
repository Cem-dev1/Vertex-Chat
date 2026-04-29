"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { type ThemeProviderProps } from "next-themes";

// 1. Kütüphaneyi sadece client-side'da yüklenecek şekilde ayırıyoruz
const NextThemesProvider = dynamic(
  () => import("next-themes").then((mod) => mod.ThemeProvider),
  { ssr: false }
);

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // 2. Sayfa mount olana kadar (Sunucuda) Provider'ı HİÇ render etmiyoruz
  if (!isMounted) {
    return <>{children}</>;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
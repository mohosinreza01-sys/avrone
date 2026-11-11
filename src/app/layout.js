import { Suspense } from "react";
import "./globals.css";

import { Albert_Sans, Inter, Noto_Serif_Bengali } from "next/font/google";

import SiteChrome from "@/components/layout/SiteChrome";
import { StoreProvider } from "@/components/store/StoreProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const albertSans = Albert_Sans({
  subsets: ["latin"],
  variable: "--font-albert",
});

const bengaliSerif = Noto_Serif_Bengali({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-bengali-serif",
});

export const metadata = {
  title: "AVRONE | Premium Men's Lifestyle",
  description:
    "Discover Panjabi, shirts, pajama, and modern Bangladeshi menswear from AVRONE.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${albertSans.variable} ${bengaliSerif.variable} antialiased`}>
        <StoreProvider>
          <Suspense fallback={children}>
            <SiteChrome>{children}</SiteChrome>
          </Suspense>
        </StoreProvider>
      </body>
    </html>
  );
}
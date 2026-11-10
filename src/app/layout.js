import "./globals.css";

import { Albert_Sans, Inter, Noto_Serif_Bengali } from "next/font/google";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileShopNav from "@/components/layout/MobileShopNav";
import { StoreProvider } from "@/components/store/StoreProvider";
import FloatingCart from "@/components/store/FloatingCart";

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
      <body className={`${inter.variable} ${albertSans.variable} ${bengaliSerif.variable} antialiased pb-[68px] md:pb-0`}>
        <StoreProvider>
          <AnnouncementBar />
          <Navbar />

          <main>{children}</main>

          <FloatingCart />
          <Footer />
          <MobileShopNav />
        </StoreProvider>
      </body>
    </html>
  );
}
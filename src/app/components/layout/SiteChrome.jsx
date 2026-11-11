"use client";

import { usePathname } from "next/navigation";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileShopNav from "@/components/layout/MobileShopNav";
import FloatingCart from "@/components/store/FloatingCart";
import WhatsAppChat from "@/components/layout/WhatsAppChat";

export default function SiteChrome({ children }) {
  const isAdmin = usePathname().startsWith("/admin");

  return (
    <>
      {!isAdmin && (
        <>
          <AnnouncementBar />
          <Navbar />
        </>
      )}
      {isAdmin ? children : <main className="pb-[68px] md:pb-0">{children}</main>}
      {!isAdmin && (
        <>
          <FloatingCart />
          <WhatsAppChat />
          <Footer />
          <MobileShopNav />
        </>
      )}
    </>
  );
}

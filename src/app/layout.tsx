import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Belbin Assessment — Kenali Peran Anda dalam Tim",
  description: "Tes Peran Tim Belbin (Self-Perception Inventory)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={plusJakartaSans.variable}>
      <body className="min-h-screen bg-ivory text-dark font-sans flex flex-col text-[16px] leading-relaxed selection:bg-forest-light selection:text-forest">
        {/* Header Dinamis */}
        <Navbar />

        {/* Konten Utama */}
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>

        {/* Footer Dinamis */}
        <Footer />
      </body>
    </html>
  );
}

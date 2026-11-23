import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

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
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
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

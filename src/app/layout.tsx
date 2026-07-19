import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { AIFixModal } from "@/components/ui/AIFixModal";
import { AIChatDrawer } from "@/components/ui/AIChatDrawer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Website Auditor | Analyze. Understand. Improve.",
  description:
    "Production-grade AI-powered website auditing platform providing instant SEO, Performance, Accessibility, Security, Mobile, Content, and UI insights with Gemini AI recommendations.",
  keywords: ["AI website audit", "SEO analyzer", "Lighthouse performance", "WCAG accessibility", "Security header check"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-blue-600 selection:text-white`}>
        <Navbar />
        <main>{children}</main>
        <AIFixModal />
        <AIChatDrawer />
      </body>
    </html>
  );
}

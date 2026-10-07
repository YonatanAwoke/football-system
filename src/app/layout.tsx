import type { Metadata } from "@/shims/next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "Bulbula Amen FC — Management & CMS Platform",
  description: "Official Football Club Management, Player Registration, Payment Verification, and Content Management System for Bulbula Amen FC, Addis Ababa, Ethiopia.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Noto+Sans+Ethiopic:wght@400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="h-full bg-slate-50 text-slate-900 antialiased selection:bg-brand-orange selection:text-white font-sans">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

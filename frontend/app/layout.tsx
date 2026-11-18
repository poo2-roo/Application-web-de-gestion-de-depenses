import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Suivi des dépenses",
  description: "Application de gestion des dépenses",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" data-theme="dracula">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-base-200`}>
        <Toaster position="top-right" />
        <main className="mx-auto flex min-h-screen w-full max-w-6xl items-start justify-center px-3 py-4 sm:px-6 sm:py-6 lg:py-10">
          {children}
        </main>
      </body>
    </html>
  );
}

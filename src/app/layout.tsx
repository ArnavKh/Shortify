import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shortify",
  description: "Brought to you by Surab Sebait, Aditya Kulkarni, Arnav Khadkatkar, and Khushi Mittal",
};

export default function RootLayout({
  // Add header
  children,
  // Add Footer
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

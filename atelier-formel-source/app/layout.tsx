import type { Metadata } from "next";
import { DemoStoreProvider } from "@/components/storefront";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Atelier Formel — Tailored for the Everyday", template: "%s | Atelier Formel" },
  description: "Considered menswear: formal shirts, casual shirts, tailored trousers and chinos designed for everyday ease."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body><DemoStoreProvider>{children}</DemoStoreProvider></body>
    </html>
  );
}
import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HK Metal House | Trusted Industrial Metal Supplier",
  description: "HK Metal House is a leading trader, stockist, and supplier of high-quality metal components and industrial products.",
  icons: {
    icon: "/images/hk-metal-house-logo.png",
    shortcut: "/images/hk-metal-house-logo.png",
    apple: "/images/hk-metal-house-logo.png",
  },
};

import MobileBottomNav from "@/components/MobileBottomNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "HK Metal House",
    "url": "https://www.hkmetalhouse.com",
    "logo": "https://www.hkmetalhouse.com/images/hk-metal-house-logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-83206-62353",
      "contactType": "customer service"
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} pb-20 lg:pb-0`}>
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}

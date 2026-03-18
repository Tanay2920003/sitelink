import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

import { GlobalSearch } from "@/components/GlobalSearch";
import { getGlobalSearchItems } from "@/lib/search";
import { cn } from "@/lib/utils";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Learning Hub - Premium Learning Resources",
  description: "Access the best learning resources in one beautiful interface - Roadmap.sh, W3Schools, Web.dev, and Microsoft Learn",
  keywords: ["learning", "development", "programming", "tutorials", "courses"],
  icons: {
    icon: [
      { url: '/logo.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchItems = await getGlobalSearchItems();

  return (
    <html lang="en" className={cn("dark", geist.variable)} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground selection:bg-blue-500/30">
          {children}
          <GlobalSearch items={searchItems} />
      </body>
    </html>
  );
}

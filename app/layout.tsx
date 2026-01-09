import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Learning Hub - Premium Learning Resources",
  description: "Access the best learning resources in one beautiful interface - Roadmap.sh, W3Schools, Web.dev, and Microsoft Learn",
  keywords: ["learning", "development", "programming", "tutorials", "courses"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

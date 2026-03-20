import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Dave Loves Denver — Hyperlocal Denver Neighborhood Guide",
    template: "%s | Dave Loves Denver",
  },
  description:
    "A hyperlocal guide to Denver's best neighborhoods, restaurants, hotels, bars, and things to do. Written by a local who actually lives it.",
  metadataBase: new URL("https://davelovesdenver.com"),
  openGraph: {
    siteName: "Dave Loves Denver",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

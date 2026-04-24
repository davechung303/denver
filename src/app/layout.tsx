import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
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
      <head>
        {/* Person + WebSite schema — establishes Dave's authorship sitewide for E-E-A-T */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "@id": "https://davelovesdenver.com/#website",
                name: "Dave Loves Denver",
                url: "https://davelovesdenver.com",
                description: "A hyperlocal guide to Denver's best neighborhoods, restaurants, hotels, bars, and things to do.",
                publisher: {
                  "@type": "Person",
                  "@id": "https://davelovesdenver.com/about#dave",
                  name: "Dave Chung",
                  url: "https://davelovesdenver.com/about",
                  sameAs: [
                    "https://www.youtube.com/@davechung",
                    "https://davelovesdenver.com/about",
                  ],
                  knowsAbout: ["Denver neighborhoods", "Denver restaurants", "Denver travel", "Denver hotels"],
                  description: "Local Denver guide and content creator covering the best restaurants, neighborhoods, bars, and things to do in Denver, CO.",
                },
              },
            ]),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8SMNJJ2RQ8"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8SMNJJ2RQ8');
          `}
        </Script>
        <ScrollToTop />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

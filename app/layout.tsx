import type { Metadata, Viewport } from "next";
import { Manrope, Fraunces } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "opsz", "WONK"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mealplanners.vercel.app"),
  title: {
    default: "Plately - Stop wondering what's for dinner",
    template: "%s | Plately",
  },
  description:
    "Your family's meal plan, in one place. Real-time sync, AI nutrition, and calm organization.",
  icons: {
    icon: "/favicon.svg",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Plately",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Plately",
    description:
      "Stop wondering what's for dinner. Your family's meal plan, synchronized.",
    siteName: "Plately",
    type: "website",
  },
  verification: {
    google: "GTHUG59PIIeNd251f_82y0nAoQi2bake0r9s3NoLhok",
  },
};

export const viewport: Viewport = {
  themeColor: "#F3EEE3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${fraunces.variable} min-h-screen bg-linen dark:bg-background font-sans antialiased text-ink dark:text-foreground`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Plately",
              alternateName: "Plately",
              applicationCategory: "LifestyleApplication",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              description:
                "Your family's meal plan, in one place. Real-time sync, AI nutrition, and calm organization.",
              softwareVersion: "1.0.0",
              author: {
                "@type": "Organization",
                name: "Plately Team",
                url: "https://mealplanners.vercel.app",
                logo: "https://mealplanners.vercel.app/favicon.svg",
              },
            }),
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

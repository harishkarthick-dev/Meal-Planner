import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://mealplanners.vercel.app"),
  title: {
    default: "MealPlan - Stop wondering what's for dinner",
    template: "%s | MealPlan",
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
    title: "MealPlan",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "MealPlan",
    description:
      "Stop wondering what's for dinner. Your family's meal plan, synchronized.",
    siteName: "MealPlan",
    type: "website",
  },
  verification: {
    google: "GTHUG59PIIeNd251f_82y0nAoQi2bake0r9s3NoLhok",
  },
};

export const viewport: Viewport = {
  themeColor: "#FDFBF7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} min-h-screen bg-warm-white dark:bg-background font-sans antialiased text-text-dark dark:text-foreground`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "MealPlan",
              applicationCategory: "LifestyleApplication",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              description:
                "Your family's meal plan, in one place. Real-time sync, AI nutrition, and calm organization.",
              screenshot: "https://mealplanners.vercel.app/hero-mom.png",
              softwareVersion: "1.0.0",
              author: {
                "@type": "Organization",
                name: "MealPlan Team",
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

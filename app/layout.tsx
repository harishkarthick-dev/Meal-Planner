import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "MealPlan - Stop wondering what's for dinner",
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

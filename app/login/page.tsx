import { AuthForm } from "@/components/auth/AuthForm";
import type { Metadata } from "next";
import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

export const metadata: Metadata = {
  title: "Login - Plately",
  description:
    "Sign in to your Plately account to access your family's weekly meal plan and grocery list.",
  alternates: {
    canonical: "https://mealplanners.vercel.app/login",
  },
};

export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-linen dark:bg-background">
      <div className="pointer-events-none absolute inset-0 bg-gingham opacity-70 dark:opacity-20" />
      <div className="absolute left-[-12%] top-[-12%] -z-10 h-[420px] w-[420px] rounded-full bg-tomato/15 blur-[90px]" />
      <div className="absolute bottom-[-12%] right-[-12%] -z-10 h-[420px] w-[420px] rounded-full bg-basil/20 blur-[90px]" />

      <div className="relative grid min-h-screen items-center">
        <div className="mx-auto w-full max-w-md p-6">
          <div className="mb-8 flex flex-col items-center">
            <Link href="/" className="group mb-8 flex items-center gap-2">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-forest text-linen shadow-[0_8px_0_#c45a28] transition-transform group-hover:-rotate-6">
                <UtensilsCrossed className="h-7 w-7" />
              </div>
            </Link>
            <AuthForm />

            <Link
              href="/"
              className="mt-8 text-sm text-muted-foreground transition-colors hover:text-tomato"
            >
              ← Back to the kitchen
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

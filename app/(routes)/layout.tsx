"use client";

import { KitchenHeader } from "@/features/kitchen/KitchenHeader";
import { KitchenDock } from "@/features/kitchen/KitchenDock";
import { CookbookRibbon } from "@/features/kitchen/CookbookRibbon";
import { useAuth } from "@/components/providers/AuthProvider";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, activeFamilyId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!activeFamilyId) {
        router.push("/get-started");
      }
    }
  }, [user, loading, activeFamilyId, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linen text-tomato">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-linen text-ink dark:bg-background dark:text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-gingham opacity-70 dark:opacity-20" />
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.035] mix-blend-multiply dark:opacity-[0.08] dark:mix-blend-screen" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <CookbookRibbon />
        <KitchenHeader />

        <main className="flex-1 overflow-y-auto scroll-smooth px-4 pb-24 pt-6 md:px-8 md:pb-10">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>

        <KitchenDock />
      </div>
    </div>
  );
}

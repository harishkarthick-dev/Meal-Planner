"use client";

import { AppHeader } from "@/components/dashboard/AppHeader";
import { BottomNav } from "@/components/dashboard/BottomNav";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { useAuth } from "@/components/providers/AuthProvider";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, activeFamilyId } = useAuth(); // Ensure useAuth() returns activeFamilyId or get it from store
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
      <div className="min-h-screen flex items-center justify-center bg-warm-white dark:bg-background text-soft-sage">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-warm-white dark:bg-background overflow-hidden flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <div className="hidden md:block w-64 flex-shrink-0 h-full">
        <Sidebar className="w-full h-full" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        <AppHeader />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth pb-20 md:pb-8">
          <div className="max-w-6xl mx-auto w-full">{children}</div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}

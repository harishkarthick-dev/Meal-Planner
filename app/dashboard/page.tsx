"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else {
        router.push("/today");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-white dark:bg-background text-soft-sage">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  );
}

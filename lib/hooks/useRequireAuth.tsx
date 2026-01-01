"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { Loader2 } from "lucide-react";

export function useRequireAuth() {
  const { user, loading, activeFamilyId } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/");
      } else if (!activeFamilyId) {
        router.push("/get-started");
      }
    }
  }, [user, loading, activeFamilyId, router]);

  return {
    user,
    loading: loading || (user && !activeFamilyId),
    activeFamilyId,
  };
}

export function AuthLoadingScreen() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

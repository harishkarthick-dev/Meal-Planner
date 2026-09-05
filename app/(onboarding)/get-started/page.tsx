"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/family/authStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateFamilyForm } from "@/features/family/CreateFamilyForm";
import { JoinFamilyForm } from "@/features/family/JoinFamilyForm";
import { AuthLoadingScreen } from "@/lib/hooks/useRequireAuth";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/AuthProvider";

export default function GetStartedPage() {
  const { user, loading, activeFamilyId } = useAuthStore();
  const { signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
      return;
    }

    if (!loading && user && activeFamilyId) {
      router.push("/today");
    }
  }, [user, loading, activeFamilyId, router]);

  if (loading || !user) {
    return <AuthLoadingScreen />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-linen px-4 py-12 dark:bg-background">
      <div className="pointer-events-none absolute inset-0 bg-gingham opacity-60 dark:opacity-20" />
      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center">
        <div className="mb-10 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-tomato">
            Set the table
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">
            Welcome, {user.displayName?.split(" ")[0] || "cook"}
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-lg text-muted-foreground">
            Every household gets one shared cookbook. Start a new kitchen, or
            join with an invite code.
          </p>
        </div>

        <div className="grid w-full gap-6 md:grid-cols-2">
          <Card className="recipe-card border-tomato/20">
            <CardHeader>
              <CardTitle className="font-display">
                Start a new kitchen
              </CardTitle>
              <CardDescription>
                Create a family cookbook and invite the people you cook with.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateFamilyForm />
            </CardContent>
          </Card>

          <Card className="recipe-card">
            <CardHeader>
              <CardTitle className="font-display">
                Join an existing kitchen
              </CardTitle>
              <CardDescription>
                Have an invite code? Pull up a chair and sync the week.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <JoinFamilyForm />
            </CardContent>
          </Card>
        </div>

        <Button
          variant="ghost"
          onClick={() => signOut()}
          className="mt-10 text-muted-foreground"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

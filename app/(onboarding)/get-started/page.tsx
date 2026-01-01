"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateFamilyForm } from "@/components/onboarding/CreateFamilyForm";
import { JoinFamilyForm } from "@/components/onboarding/JoinFamilyForm";
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-secondary/30">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
        <div className="md:col-span-2 text-center space-y-2 mb-4">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            Welcome, {user.displayName?.split(" ")[0] || "Chef"}!
          </h1>
          <p className="text-muted-foreground text-lg">
            To retrieve your meal plans, we need to know properly which kitchen
            you belong to.
          </p>
        </div>

        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle>Start a New Kitchen</CardTitle>
            <CardDescription>
              Create a new family space and invite others to join you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateFamilyForm />
          </CardContent>
        </Card>

        <Card className="border-transparant hover:bg-card/50 transition-colors">
          <CardHeader>
            <CardTitle>Join an Existing Kitchen</CardTitle>
            <CardDescription>
              Have an invite code? Enter it here to sync up.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <JoinFamilyForm />
          </CardContent>
        </Card>

        <div className="md:col-span-2 flex justify-center mt-8">
          <Button
            variant="ghost"
            onClick={() => signOut()}
            className="text-muted-foreground"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}

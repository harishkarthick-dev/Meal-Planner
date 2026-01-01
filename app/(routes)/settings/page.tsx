"use client";

import { cn } from "@/lib/utils/cn";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, LogOut, Copy, Users } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useRequireAuth, AuthLoadingScreen } from "@/lib/hooks/useRequireAuth";

interface FamilyMember {
  displayName?: string;
  email?: string;
  role?: string;
}

interface FamilyData {
  name?: string;
  inviteCode?: string;
  members?: Record<string, FamilyMember>;
}

export default function SettingsPage() {
  const {
    user: authUser,
    loading: authLoading,
    activeFamilyId,
  } = useRequireAuth();
  const { setTheme, theme } = useTheme();
  const { signOut } = useAuth();
  const router = useRouter();

  const [familyData, setFamilyData] = useState<FamilyData | null>(null);

  useEffect(() => {
    if (!activeFamilyId) return;
    const fetchFamily = async () => {
      try {
        const docRef = doc(db, "families", activeFamilyId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setFamilyData(snap.data());
        }
      } catch (error) {
        console.error("Error fetching family:", error);
      }
    };
    fetchFamily();
  }, [activeFamilyId]);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const copyInviteCode = () => {
    if (familyData?.inviteCode) {
      navigator.clipboard.writeText(familyData.inviteCode);
    }
  };

  if (authLoading || !authUser) {
    return <AuthLoadingScreen />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-20">
      <header className="border-b border-stone-100 dark:border-stone-800 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-text-dark dark:text-foreground">
          Settings
        </h1>
        <p className="text-stone-500 dark:text-stone-400">
          Manage your preferences and family workspace.
        </p>
      </header>

      {activeFamilyId && familyData && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-soft-sage">
            <Users className="w-5 h-5" />
            <h2 className="text-lg font-bold text-text-dark dark:text-foreground">
              Family & Sharing
            </h2>
          </div>

          <Card className="border-stone-100 dark:border-stone-800 shadow-sm">
            <CardHeader>
              <CardTitle>{familyData.name || "My Family"}</CardTitle>
              <CardDescription>Manage your shared kitchen.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-xl flex items-center justify-between border border-stone-100 dark:border-stone-800">
                <div>
                  <p className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-1">
                    Invite Code
                  </p>
                  <p className="text-2xl font-mono tracking-wide font-bold text-text-dark dark:text-foreground select-all">
                    {familyData.inviteCode || "..."}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyInviteCode}
                  className="hover:text-soft-sage hover:border-soft-sage"
                >
                  <Copy className="mr-2 h-4 w-4" /> Copy
                </Button>
              </div>

              <div>
                <h3 className="text-sm font-bold text-text-dark dark:text-foreground mb-3">
                  Members ({Object.keys(familyData.members || {}).length})
                </h3>
                <div className="space-y-2">
                  {Object.entries(familyData.members || {}).map(
                    ([uid, member]: [string, FamilyMember]) => (
                      <div
                        key={uid}
                        className="flex items-center justify-between p-3 rounded-lg border border-stone-100 dark:border-stone-800 text-sm hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-soft-sage/10 flex items-center justify-center text-soft-sage font-bold border border-soft-sage/20">
                            {(
                              member.displayName?.[0] ||
                              member.email?.[0] ||
                              "?"
                            ).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-text-dark dark:text-foreground">
                              {member.displayName || "Unknown"}
                            </p>
                            <p className="text-xs text-stone-500">
                              {member.email}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded-md capitalize font-medium text-stone-600 dark:text-stone-400">
                          {member.role || "Member"}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-soft-sage">
          <Monitor className="w-5 h-5" />
          <h2 className="text-lg font-bold text-text-dark dark:text-foreground">
            Appearance
          </h2>
        </div>
        <Card className="border-stone-100 dark:border-stone-800 shadow-sm">
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            <CardDescription>
              Choose your preferred visual mode.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => setTheme("light")}
              className={cn("flex-1", theme === "light" ? "bg-text-dark" : "")}
            >
              <Sun className="mr-2 h-4 w-4" /> Light
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => setTheme("dark")}
              className={cn("flex-1", theme === "dark" ? "bg-soft-sage" : "")}
            >
              <Moon className="mr-2 h-4 w-4" /> Dark
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              onClick={() => setTheme("system")}
              className={cn("flex-1", theme === "system" ? "bg-text-dark" : "")}
            >
              <Monitor className="mr-2 h-4 w-4" /> System
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-red-500">
          <LogOut className="w-5 h-5" />
          <h2 className="text-lg font-bold text-text-dark dark:text-foreground">
            Account
          </h2>
        </div>
        <Card className="border-red-100 dark:border-red-900/20 shadow-sm">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">
              Session
            </CardTitle>
            <CardDescription>
              Logged in as:{" "}
              <span className="font-mono text-xs font-semibold">
                {authUser?.email}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full sm:w-auto bg-red-500 hover:bg-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

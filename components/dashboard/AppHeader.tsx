"use client";

import { usePathname } from "next/navigation";
import { ChefHat, Menu } from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Simple title logic
  const getTitle = () => {
    if (pathname.includes("/today")) return "Today's Plan";
    if (pathname.includes("/week")) return "Weekly Plan";
    if (pathname.includes("/meals")) return "Meals Library";
    if (pathname.includes("/calendar")) return "Calendar";
    if (pathname.includes("/settings")) return "Settings";
    if (pathname.includes("/grocery")) return "Grocery List";
    return "MealPlanJoy";
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-background/80 backdrop-blur-md border-b border-stone-100 dark:border-stone-800 md:hidden h-14 flex items-center justify-between px-4">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="-ml-2">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="p-0 border-r border-stone-100 w-80"
        >
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <Sidebar onClose={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
        <Link
          href="/today"
          className="w-7 h-7 rounded-lg bg-soft-sage flex items-center justify-center text-white shadow-sm"
        >
          <ChefHat className="w-4 h-4" />
        </Link>
        <h1 className="font-bold text-base text-text-dark dark:text-foreground">
          {getTitle()}
        </h1>
      </div>

      {/* Placeholder for right side icon if needed (e.g. Profile or Notifs) */}
      <div className="w-8" />
    </header>
  );
}

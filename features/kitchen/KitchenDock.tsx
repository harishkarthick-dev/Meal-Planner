"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, ShoppingBasket, Utensils } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function KitchenDock() {
  const pathname = usePathname();

  const routes = [
    { href: "/today", label: "Today", icon: Utensils },
    { href: "/week", label: "Week", icon: CalendarDays },
    { href: "/grocery", label: "Market", icon: ShoppingBasket },
  ];

  return (
    <nav
      aria-label="Kitchen shortcuts"
      className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center border-t border-forest/10 bg-paper/95 px-4 shadow-[0_-8px_24px_-18px_rgba(31,58,46,0.45)] backdrop-blur-lg md:hidden"
    >
      <div className="flex w-full items-center justify-around">
        {routes.map((route) => {
          const isActive = pathname.startsWith(route.href);
          return (
            <Link
              key={route.href}
              href={route.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex h-12 w-16 flex-col items-center justify-center gap-0.5 rounded-xl transition-all active:scale-95",
                isActive
                  ? "text-tomato"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <route.icon
                className={cn("h-5 w-5", isActive && "stroke-[2.4px]")}
              />
              <span
                className={cn(
                  "font-display text-[10px] font-semibold",
                  isActive ? "opacity-100" : "sr-only",
                )}
              >
                {route.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

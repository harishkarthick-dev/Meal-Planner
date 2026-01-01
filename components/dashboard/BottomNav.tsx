"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarDays, ShoppingCart } from "lucide-react";

import { cn } from "@/lib/utils/cn";

export function BottomNav() {
  const pathname = usePathname();

  const routes = [
    {
      href: "/today",
      label: "Today",
      icon: Home,
    },
    {
      href: "/week",
      label: "Week",
      icon: CalendarDays,
    },
    {
      href: "/grocery",
      label: "List",
      icon: ShoppingCart,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center border-t border-stone-100 dark:border-stone-800 bg-white/95 dark:bg-card/95 backdrop-blur-lg px-4 pb- safe-area-inset-bottom md:hidden shadow-[0_-1px_10px_rgba(0,0,0,0.05)]">
      <div className="flex w-full justify-around items-center">
        {routes.map((route) => {
          const isActive = pathname.startsWith(route.href);
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 w-16 h-12 rounded-xl transition-all duration-200 active:scale-95 touch-manipulation",
                isActive
                  ? "text-soft-sage"
                  : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-200",
              )}
            >
              <route.icon
                className={cn(
                  "h-6 w-6 transition-transform duration-200",
                  isActive ? "stroke-[2.5px] scale-110" : "stroke-current",
                )}
              />
              <span
                className={cn(
                  "text-[10px] font-medium transition-opacity duration-200",
                  isActive
                    ? "opacity-100"
                    : "opacity-0 h-0 w-0 overflow-hidden",
                )}
              >
                {route.label}
              </span>
              {isActive && (
                <div className="absolute bottom-2 w-1 h-1 rounded-full bg-soft-sage" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

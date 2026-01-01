"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Home, Utensils, Settings, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Sidebar() {
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
      href: "/calendar",
      label: "Month",
      icon: Calendar,
    },
    {
      href: "/meals",
      label: "Meals",
      icon: Utensils,
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="hidden h-screen w-64 flex-col border-r bg-card px-4 py-6 md:flex">
      <div className="mb-8 px-2">
        <h2 className="text-2xl font-bold tracking-tight text-primary">
          Meal Planner
        </h2>
      </div>
      <nav className="flex-1 space-y-1">
        {routes.map((route) => {
          const isActive = pathname.startsWith(route.href);
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <route.icon className="h-5 w-5" />
              <span>{route.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

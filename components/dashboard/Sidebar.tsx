"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { cn } from "@/lib/utils/cn";
import {
  CalendarDays,
  ChefHat,
  LayoutGrid,
  LogOut,
  Settings,
  UtensilsCrossed,
  User as UserIcon,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";

const navItems = [
  { href: "/today", label: "Today's Plan", icon: LayoutGrid },
  { href: "/week", label: "Weekly Plan", icon: CalendarDays },
  { href: "/grocery", label: "Groceries", icon: ShoppingCart },
  { href: "/meals", label: "Meals Library", icon: UtensilsCrossed },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({
  className,
  onClose,
}: {
  className?: string;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-white dark:bg-card border-r border-stone-100 dark:border-stone-800",
        className,
      )}
    >
      {/* Logo */}
      <div className="p-6">
        <Link href="/today" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-soft-sage flex items-center justify-center text-white shadow-md group-hover:rotate-6 transition-transform">
            <ChefHat className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight text-text-dark dark:text-foreground">
            MealPlan<span className="text-soft-sage">Joy</span>
          </span>
        </Link>
      </div>

      {/* Nav Content */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          // Special case for calendar since it shares icon/logic potentially,
          // but for now unique. Note: duplicate icon imported above fixed by unique items.

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group font-medium",
                isActive
                  ? "bg-soft-sage/10 text-soft-sage"
                  : "text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-text-dark dark:hover:text-foreground",
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-colors",
                  isActive
                    ? "text-soft-sage"
                    : "text-stone-400 group-hover:text-text-dark dark:group-hover:text-foreground",
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-stone-50 dark:bg-stone-900/50">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-stone-800 border border-stone-100 dark:border-stone-700 flex items-center justify-center overflow-hidden shrink-0">
            {user?.photoURL ? (
              <Image
                src={user.photoURL}
                alt={user.displayName || "User"}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            ) : (
              <UserIcon className="w-5 h-5 text-stone-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-text-dark dark:text-foreground truncate">
              {user?.displayName || "My Account"}
            </p>
            <p className="text-xs text-stone-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={() => signOut()}
            className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

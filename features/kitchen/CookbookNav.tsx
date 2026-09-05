"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { cn } from "@/lib/utils/cn";
import {
  BookOpen,
  CalendarDays,
  LogOut,
  Settings,
  ShoppingBasket,
  SunMedium,
  UtensilsCrossed,
} from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const CHAPTERS = [
  { href: "/today", label: "Today's table", short: "Today" },
  { href: "/week", label: "This week", short: "Week" },
  { href: "/grocery", label: "Market list", short: "Market" },
  { href: "/meals", label: "Recipe box", short: "Recipes" },
  { href: "/calendar", label: "Calendar", short: "Dates" },
  { href: "/settings", label: "The kitchen", short: "Kitchen" },
];

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/today" className="group inline-flex items-center gap-2.5">
      <span className="relative grid h-9 w-9 place-items-center rounded-[0.85rem] bg-forest text-linen shadow-[0_6px_0_#c45a28] transition-transform group-hover:-rotate-3">
        <UtensilsCrossed className="h-[18px] w-[18px]" strokeWidth={2.2} />
      </span>
      {!compact && (
        <span className="font-display text-[1.45rem] font-semibold leading-none tracking-[-0.03em] text-foreground">
          Plately
        </span>
      )}
    </Link>
  );
}

export function CookbookNav({
  onClose,
  className,
}: {
  onClose?: () => void;
  className?: string;
}) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <nav
      className={cn("flex h-full flex-col", className)}
      aria-label="Cookbook chapters"
    >
      <div className="px-5 pb-6 pt-7">
        <Wordmark />
        <p className="mt-3 font-display text-[13px] italic text-tomato">
          Family recipes, this week.
        </p>
      </div>

      <ul className="flex-1 space-y-1 px-3">
        {CHAPTERS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center justify-between rounded-2xl px-3 py-2.5 text-[14px] transition-colors",
                  active
                    ? "bg-tomato/12 font-semibold text-tomato"
                    : "text-foreground/70 hover:bg-forest/6 hover:text-foreground",
                )}
              >
                <span className="font-display tracking-tight">
                  {item.label}
                </span>
                {active && (
                  <span className="h-1.5 w-1.5 rounded-full bg-tomato" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto border-t border-dashed border-forest/15 p-4">
        <div className="flex items-center gap-3 rounded-2xl bg-paper px-3 py-2.5 shadow-[inset_0_0_0_1px_rgba(31,58,46,0.08)]">
          <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-yolk/40 text-ink">
            {user?.photoURL ? (
              <Image
                src={user.photoURL}
                alt={user.displayName || "Cook"}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            ) : (
              <SunMedium className="h-5 w-5" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-sm font-semibold text-foreground">
              {user?.displayName || "Head cook"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user?.email}
            </p>
          </div>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => signOut()}
            className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-tomato/10 hover:text-tomato"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}

export function chapterTitle(pathname: string) {
  if (pathname.includes("/today")) return "Today's table";
  if (pathname.includes("/week")) return "This week";
  if (pathname.includes("/meals")) return "Recipe box";
  if (pathname.includes("/calendar")) return "Calendar";
  if (pathname.includes("/settings")) return "The kitchen";
  if (pathname.includes("/grocery")) return "Market list";
  return "Plately";
}

export const chapterIcons = {
  BookOpen,
  CalendarDays,
  Settings,
  ShoppingBasket,
};

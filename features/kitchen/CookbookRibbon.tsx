"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CHAPTERS, Wordmark } from "./CookbookNav";
import { cn } from "@/lib/utils/cn";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/components/providers/AuthProvider";
import { LogOut } from "lucide-react";

export function CookbookRibbon() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <header className="hidden border-b border-forest/10 bg-paper/80 md:block">
      <div className="mx-auto flex max-w-6xl items-end justify-between gap-6 px-6 pt-5">
        <div className="pb-4">
          <Wordmark />
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-tomato">
            The family cookbook
          </p>
        </div>
        <div className="flex items-center gap-2 pb-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => signOut()}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-tomato/10 hover:text-tomato"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-6">
        {CHAPTERS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative whitespace-nowrap rounded-t-2xl px-4 py-3 font-display text-[15px] tracking-tight transition-colors",
                active
                  ? "bg-linen text-foreground shadow-[0_-1px_0_rgba(31,58,46,0.08)] dark:bg-card"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
              {active && (
                <span className="absolute inset-x-3 -bottom-px h-0.5 bg-tomato" />
              )}
            </Link>
          );
        })}
      </div>
    </header>
  );
}

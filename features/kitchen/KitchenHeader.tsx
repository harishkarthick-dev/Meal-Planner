"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { CookbookNav, Wordmark, chapterTitle } from "./CookbookNav";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function KitchenHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-forest/10 bg-linen/90 px-4 backdrop-blur-md md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="-ml-2">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-80 border-r border-forest/10 bg-linen p-0"
        >
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <CookbookNav onClose={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2">
        <Wordmark compact />
        <h1 className="font-display text-base font-semibold">
          {chapterTitle(pathname)}
        </h1>
      </div>

      <div className="w-8" />
    </header>
  );
}

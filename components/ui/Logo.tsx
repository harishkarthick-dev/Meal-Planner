import { cn } from "@/lib/utils/cn";
import { UtensilsCrossed } from "lucide-react";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <div className={cn("group flex items-center gap-3", className)}>
      <div className="grid h-8 w-8 place-items-center rounded-[0.7rem] bg-forest text-linen shadow-[0_4px_0_#c45a28] transition-transform group-hover:-rotate-6">
        <UtensilsCrossed className="h-5 w-5" />
      </div>
      {showText && (
        <span className="font-display text-xl font-semibold tracking-tight text-foreground">
          Plately
        </span>
      )}
    </div>
  );
}

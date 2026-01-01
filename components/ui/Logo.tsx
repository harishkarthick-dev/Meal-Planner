import { cn } from "@/lib/utils/cn";
import { ChefHat } from "lucide-react";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3 group", className)}>
      <div className="w-8 h-8 rounded-lg bg-soft-sage flex items-center justify-center text-white shadow-md group-hover:rotate-6 transition-transform">
        <ChefHat className="w-5 h-5" />
      </div>
      {showText && (
        <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          MealPlan
        </span>
      )}
    </div>
  );
}

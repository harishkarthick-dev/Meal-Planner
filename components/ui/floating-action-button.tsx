import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";

interface FloatingActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label?: string;
}

export function FloatingActionButton({
  className,
  icon,
  label,
  ...props
}: FloatingActionButtonProps) {
  return (
    <Button
      className={cn(
        "fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full shadow-lg md:hidden",
        "flex items-center justify-center p-0",
        className,
      )}
      size="icon"
      {...props}
    >
      {icon}
      <span className="sr-only">{label || "Action"}</span>
    </Button>
  );
}

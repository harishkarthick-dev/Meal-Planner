import { Trash2, CheckCircle2, Circle } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MealEntry } from "@/types";

interface MealCardProps {
  entry: MealEntry;
  onToggle: () => void;
  onRemove: () => void;
}

export function MealCard({ entry, onToggle, onRemove }: MealCardProps) {
  return (
    <Card className="group relative mb-3 overflow-hidden transition-all hover:shadow-md">
      <CardContent className="flex items-center p-4">
        <button
          onClick={onToggle}
          className="mr-3 text-muted-foreground transition-colors hover:text-primary focus:outline-none"
        >
          {entry.completed ? (
            <CheckCircle2 className="h-6 w-6 text-primary" />
          ) : (
            <Circle className="h-6 w-6" />
          )}
        </button>

        <div className="flex-1">
          <h3
            className={cn(
              "font-medium leading-none transition-all",
              entry.completed && "text-muted-foreground line-through",
            )}
          >
            {entry.name}
          </h3>
          {entry.notes && (
            <p className="mt-1 text-xs text-muted-foreground">{entry.notes}</p>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100 mobile:opacity-100"
        >
          <Trash2 className="h-4 w-4 text-destructive/70 hover:text-destructive" />
        </Button>
      </CardContent>
    </Card>
  );
}

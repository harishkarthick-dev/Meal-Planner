"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Meal } from "@/types";

interface MealEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Meal | null;
  onSave: (data: Partial<Meal>) => Promise<void>;
}

export function MealEditor({
  open,
  onOpenChange,
  initialData,
  onSave,
}: MealEditorProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Meal>>({
    name: "",
    notes: "",
    ingredients: [],
    tags: [],
    prepTime: 0,
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({
          name: "",
          notes: "",
          ingredients: [],
          tags: [],
          prepTime: undefined,
        });
      }
    }
  }, [open, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setLoading(true);
    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Meal" : "New Meal"}</DialogTitle>
          <DialogDescription>
            {initialData
              ? "Make changes to your meal details here."
              : "Add a new meal to your personal library."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="col-span-3"
              placeholder="e.g. Grilled Salmon"
              autoFocus
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label
              htmlFor="ingredients"
              className="text-right text-sm font-medium"
            >
              Ingredients
            </label>
            <div className="col-span-3 space-y-1">
              <textarea
                id="ingredients"
                value={formData?.ingredients?.join("\n") || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ingredients: e.target.value.split("\n"),
                  })
                }
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="One ingredient per line&#10;e.g. 2 Eggs&#10;1 cup Milk"
              />
              <p className="text-[10px] text-stone-500">
                Enter one ingredient per line.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="notes" className="text-right text-sm font-medium">
              Notes
            </label>
            <Input
              id="notes"
              value={formData.notes || ""}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="col-span-3"
              placeholder="Optional notes or recipe link"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label
              htmlFor="prepTime"
              className="text-right text-sm font-medium"
            >
              Prep (min)
            </label>
            <Input
              id="prepTime"
              type="number"
              value={formData.prepTime || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  prepTime: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                })
              }
              className="col-span-3"
              placeholder="e.g. 30"
            />
          </div>
          {/* Tags input could be enhanced later */}
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

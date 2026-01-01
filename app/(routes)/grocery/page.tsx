"use client";

import { useGrocery } from "@/lib/hooks/useGrocery";
import { useState } from "react";
import {
  Plus,
  Trash2,
  ShoppingCart,
  RefreshCw,
  Check,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function GroceryPage() {
  const { items, loading, addItem, toggleItem, deleteItem, generateFromRange } =
    useGrocery();
  const [newItemName, setNewItemName] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [rangeType, setRangeType] = useState<"Today" | "Week" | "Month">(
    "Week",
  );

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    addItem(newItemName.trim());
    setNewItemName("");
    setIsAddDialogOpen(false);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    const now = new Date();
    let start = new Date();
    let end = new Date();

    if (rangeType === "Today") {
      start = startOfDay(now);
      end = endOfDay(now);
    } else if (rangeType === "Week") {
      start = startOfWeek(now, { weekStartsOn: 1 });
      end = endOfWeek(now, { weekStartsOn: 1 });
    } else if (rangeType === "Month") {
      // Simple month range: 1st to last day
      start = startOfMonth(now);
      end = endOfMonth(now);
    }

    await generateFromRange(start, end);
    setIsGenerating(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-soft-sage w-8 h-8" />
      </div>
    );
  }

  const pendingItems = items.filter((i) => !i.completed);
  const completedItems = items.filter((i) => i.completed);

  return (
    <div className="space-y-6 pb-24 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-text-dark dark:text-foreground flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-soft-sage" />
          Grocery List
        </h1>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 min-w-[120px]"
              >
                <Calendar className="w-4 h-4 text-stone-500" />
                {rangeType}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setRangeType("Today")}>
                Today
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRangeType("Week")}>
                This Week
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRangeType("Month")}>
                This Month
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="text-soft-sage border-soft-sage/30 hover:bg-soft-sage/10 whitespace-nowrap"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Sync
          </Button>
        </div>
      </div>

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Grocery List</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddItem} className="space-y-4 mt-4">
            <Input
              placeholder="Item name (e.g. Milk, Eggs...)"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!newItemName.trim()}
                className="bg-soft-sage text-white"
              >
                Add Item
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-50">
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg bg-soft-sage hover:bg-soft-sage/90 text-white"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Lists */}
      <div className="space-y-6">
        {/* Pending Items */}
        <div className="space-y-2">
          {pendingItems.length === 0 && completedItems.length === 0 && (
            <div className="text-center py-10 text-stone-400 italic">
              Your list is empty. Add items or sync from your meal plan!
            </div>
          )}

          {pendingItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-white dark:bg-card rounded-xl border border-stone-100 dark:border-stone-800 shadow-sm transition-all hover:shadow-md group"
            >
              <div
                className="flex items-center gap-3 flex-1 cursor-pointer"
                onClick={() => toggleItem(item.id, true)}
              >
                <div className="w-5 h-5 rounded-full border-2 border-stone-300 dark:border-stone-600 flex-shrink-0 group-hover:border-soft-sage transition-colors" />
                <span className="text-text-dark dark:text-foreground font-medium">
                  {item.name}
                </span>
              </div>
              <button
                onClick={() => deleteItem(item.id)}
                className="text-stone-300 hover:text-red-400 p-2 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Completed Items */}
        {completedItems.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-stone-400 uppercase tracking-wider">
              Completed
            </h2>
            {completedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-stone-50/50 dark:bg-stone-900/50 rounded-xl border border-stone-100/50 dark:border-stone-800/50 transition-all group"
              >
                <div
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                  onClick={() => toggleItem(item.id, false)}
                >
                  <div className="w-5 h-5 rounded-full bg-soft-sage flex items-center justify-center flex-shrink-0 text-white">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-stone-400 line-through decoration-stone-400">
                    {item.name}
                  </span>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-stone-300 hover:text-red-400 p-2 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

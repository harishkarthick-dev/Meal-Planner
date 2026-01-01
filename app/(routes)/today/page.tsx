"use client";

import { Suspense, useState } from "react";
import { format, parseISO, isValid, addDays } from "date-fns";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2,
  Circle,
  Loader2,
} from "lucide-react";
import { FloatingActionButton } from "@/components/ui/floating-action-button";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { usePlan } from "@/lib/hooks/usePlan";
import { useRequireAuth, AuthLoadingScreen } from "@/lib/hooks/useRequireAuth";
import { cn } from "@/lib/utils/cn";
import { MealType, Meal } from "@/types";
import { useMeals } from "@/lib/hooks/useMeals";

import { nutritionService } from "@/lib/services/nutrition";

const MEAL_TYPES: MealType[] = ["breakfast", "lunch", "snack", "dinner"];

function TodayContent() {
  const { user: authUser, loading: authLoading } = useRequireAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const dateParam = searchParams.get("date");

  let currentDate = new Date();
  if (dateParam) {
    const parsed = parseISO(dateParam);
    if (isValid(parsed)) {
      currentDate = parsed;
    }
  }

  const dateKey = format(currentDate, "yyyy-MM-dd");
  const {
    dayPlan,
    loading,
    addMealToDay,
    removeMealFromDay,
    toggleMealCompletion,
  } = usePlan(dateKey);

  const displayDate = format(currentDate, "EEEE, MMMM d");

  const changeDate = (days: number) => {
    const newDate = addDays(currentDate, days);
    router.push(`/today?date=${format(newDate, "yyyy-MM-dd")}`);
  };

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [activeMealType, setActiveMealType] = useState<MealType | null>(null);
  const [quickAddName, setQuickAddName] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { meals: familyMeals, addMeal } = useMeals();

  if (authLoading || !authUser) {
    return <AuthLoadingScreen />;
  }

  const filteredSuggestions = quickAddName
    ? familyMeals.filter((m) =>
        m.name.toLowerCase().includes(quickAddName.toLowerCase()),
      )
    : [];

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMealType || !quickAddName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const existingMeal = familyMeals.find(
        (m) => m.name.toLowerCase() === quickAddName.trim().toLowerCase(),
      );

      let finalMealId = existingMeal?.id;
      let nutritionToAdd = existingMeal?.nutrition;
      let prepTimeToAdd = existingMeal?.prepTime || 0;
      let tagsToAdd = existingMeal?.tags || [];
      let notesToAdd = existingMeal?.notes || "";
      let ingredientsToAdd = existingMeal?.ingredients || [];

      if (!finalMealId) {
        try {
          const enrichedData = await nutritionService.searchFood(
            quickAddName.trim(),
          );
          if (enrichedData) {
            nutritionToAdd = enrichedData.nutrition;
            prepTimeToAdd = enrichedData.prepTime;
            tagsToAdd = enrichedData.tags;
            ingredientsToAdd = enrichedData.ingredients;
            if (enrichedData.description) notesToAdd = enrichedData.description;
          }
        } catch (err) {
          console.warn("Nutrition fetch failed", err);
        }

        try {
          const newId = await addMeal({
            name: quickAddName.trim(),
            notes: notesToAdd,
            tags: tagsToAdd,
            prepTime: prepTimeToAdd,
            nutrition: nutritionToAdd,
            ingredients: ingredientsToAdd,
          });
          finalMealId = newId;
        } catch (err) {
          console.error("Failed to create new meal", err);
          finalMealId = crypto.randomUUID();
        }
      }

      await addMealToDay(activeMealType, {
        mealId: finalMealId!,
        name: quickAddName.trim(),
        notes: notesToAdd,
        mealType: activeMealType,
        nutrition: nutritionToAdd,
      });

      setQuickAddName("");
      setAddDialogOpen(false);
      setShowSuggestions(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectSuggestion = (meal: Meal) => {
    setQuickAddName(meal.name);
    setShowSuggestions(false);
  };

  return (
    <div className="mx-auto max-w-3xl pb-24">
      <header className="mb-6 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => changeDate(-1)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">{displayDate}</h1>
          <p className="text-sm text-muted-foreground">
            {dateKey === format(new Date(), "yyyy-MM-dd") ? "Today" : "Plan"}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => changeDate(1)}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </header>

      <div className="space-y-6">
        {MEAL_TYPES.map((type) => {
          const meals = dayPlan?.meals?.[type] || [];
          return (
            <section key={type} className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold capitalize text-primary">
                  {type}
                </h2>
                <Dialog
                  open={addDialogOpen && activeMealType === type}
                  onOpenChange={(open) => {
                    setAddDialogOpen(open);
                    if (open) setActiveMealType(type);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8">
                      <Plus className="mr-1 h-3 w-3" /> Add
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add to {type}</DialogTitle>
                      <DialogDescription>
                        Quickly add a meal to your {type} plan.
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      onSubmit={handleQuickAdd}
                      className="space-y-4 pt-4 relative"
                    >
                      <div className="relative">
                        <Input
                          placeholder="Search or enter new meal..."
                          value={quickAddName}
                          onChange={(e) => {
                            setQuickAddName(e.target.value);
                            setShowSuggestions(true);
                          }}
                          onFocus={() => setShowSuggestions(true)}
                          autoFocus
                        />
                        {showSuggestions &&
                          quickAddName &&
                          filteredSuggestions.length > 0 && (
                            <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md max-h-[200px] overflow-auto">
                              {filteredSuggestions.map((meal) => (
                                <div
                                  key={meal.id}
                                  className="cursor-pointer px-4 py-2 hover:bg-accent hover:text-accent-foreground text-sm"
                                  onClick={() => selectSuggestion(meal)}
                                >
                                  {meal.name}
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : filteredSuggestions.some(
                            (m) =>
                              m.name.toLowerCase() ===
                              quickAddName.trim().toLowerCase(),
                          ) ? (
                          "Add Existing Meal"
                        ) : (
                          "Create & Add Meal"
                        )}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {loading ? (
                <div className="h-20 rounded-xl border border-dashed bg-muted/20 animate-pulse" />
              ) : meals.length === 0 ? (
                <div className="rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground bg-muted/5">
                  No meals planned
                </div>
              ) : (
                <div className="grid gap-3">
                  {meals.map((meal) => (
                    <Card
                      key={meal.id}
                      className={cn(
                        "transition-all group",
                        meal.completed && "opacity-60 bg-muted/50",
                      )}
                    >
                      <CardContent className="p-4 flex items-center gap-3">
                        <button
                          onClick={() => toggleMealCompletion(type, meal)}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {meal.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          ) : (
                            <Circle className="h-5 w-5" />
                          )}
                        </button>
                        <div className="flex-1">
                          <p
                            className={cn(
                              "font-medium",
                              meal.completed && "line-through",
                            )}
                          >
                            {meal.name}
                          </p>
                          {meal.notes && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {meal.notes}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 text-destructive opacity-100 md:opacity-0 md:group-hover:opacity-100"
                          onClick={() => removeMealFromDay(type, meal)}
                        >
                          &times;
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <FloatingActionButton
        icon={<Plus className="h-6 w-6" />}
        onClick={() => {
          const hour = new Date().getHours();
          let type: MealType = "snack";
          if (hour < 11) type = "breakfast";
          else if (hour < 15) type = "lunch";
          else if (hour < 21) type = "dinner";

          setActiveMealType(type);
          setAddDialogOpen(true);
        }}
        label="Quick Add Meal"
      />
    </div>
  );
}

export default function TodayPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-soft-sage" />
        </div>
      }
    >
      <TodayContent />
    </Suspense>
  );
}

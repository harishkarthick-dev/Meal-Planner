"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CalendarPlus,
  Loader2,
} from "lucide-react";

// import { AppShell } from "@/components/layout/AppShell"; // Removed

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MealEditor } from "@/components/meals/MealEditor";
import { useMeals } from "@/lib/hooks/useMeals";
import { usePlannerActions } from "@/lib/hooks/usePlannerActions";
import { Meal, MealType } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { useRequireAuth, AuthLoadingScreen } from "@/lib/hooks/useRequireAuth";
import { FloatingActionButton } from "@/components/ui/floating-action-button";

export default function MealsPage() {
  const { user: authUser, loading: authLoading } = useRequireAuth();
  const { meals, loading, addMeal, updateMeal, deleteMeal } = useMeals();
  const { addMealToDate } = usePlannerActions();

  const [searchTerm, setSearchTerm] = useState("");
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);

  // Planning State
  const [planningMeal, setPlanningMeal] = useState<Meal | null>(null);
  const [isPlanDialogOpen, setPlanDialogOpen] = useState(false);
  const [planDate, setPlanDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [planType, setPlanType] = useState<MealType>("dinner");

  // Auth check after all hooks
  if (authLoading || !authUser) {
    return <AuthLoadingScreen />;
  }

  const filteredMeals = meals.filter((meal) =>
    meal.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleEdit = (meal: Meal) => {
    setEditingMeal(meal);
    setEditorOpen(true);
  };

  const handleCreate = () => {
    setEditingMeal(null);
    setEditorOpen(true);
  };

  const handleSave = async (data: Partial<Meal>) => {
    if (editingMeal) {
      await updateMeal(editingMeal.id, data);
    } else {
      await addMeal({
        name: data.name!,
        notes: data.notes,
        tags: data.tags || [],
        prepTime: data.prepTime,
        imageURL: data.imageURL,
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this meal?")) {
      await deleteMeal(id);
    }
  };

  const openPlanDialog = (meal: Meal) => {
    setPlanningMeal(meal);
    setPlanDialogOpen(true);
  };

  const handleAddToPlan = async () => {
    if (!planningMeal) return;
    await addMealToDate(planDate, planType, {
      mealId: planningMeal.id,
      name: planningMeal.name,
      notes: planningMeal.notes,
      mealType: planType,
    });
    setPlanDialogOpen(false);
    alert("Meal added to plan!");
  };

  return (
    <div className="mx-auto max-w-5xl pb-24">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-dark dark:text-foreground">
            Meals Library
          </h1>
          <p className="text-stone-500 dark:text-stone-400">
            Your personal collection of recipes.
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-soft-sage hover:bg-soft-sage/90 text-white shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Meal
        </Button>
      </header>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
        <Input
          placeholder="Search meals..."
          className="pl-9 bg-white dark:bg-card border-stone-200 dark:border-stone-800"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-soft-sage" />
        </div>
      ) : filteredMeals.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-stone-200 dark:border-stone-800 rounded-2xl bg-stone-50/50 dark:bg-stone-900/20">
          <p className="text-stone-500 mb-4">No meals found.</p>
          <Button variant="outline" onClick={handleCreate}>
            Create one
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {filteredMeals.map((meal) => (
            <Card
              key={meal.id}
              className="group relative hover:shadow-lg transition-all border-stone-100 dark:border-stone-800 bg-white dark:bg-card overflow-hidden"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg text-text-dark dark:text-foreground line-clamp-1 pr-8">
                    {meal.name}
                  </h3>
                </div>

                {meal.prepTime && (
                  <p className="text-xs text-stone-500 flex items-center gap-1 mb-2">
                    <span className="w-4 h-4 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center text-[10px]">
                      ⏱
                    </span>{" "}
                    {meal.prepTime} min
                  </p>
                )}
                {meal.notes && (
                  <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-2 mb-3 h-10 leading-relaxed">
                    {meal.notes}
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {meal.nutrition?.calories ? (
                    <span className="inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-[10px] font-medium text-orange-700 border border-orange-100 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-900/30">
                      🔥 {meal.nutrition.calories}
                    </span>
                  ) : null}
                  {meal.tags?.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-md bg-stone-100 px-2 py-1 text-[10px] font-medium text-stone-600 border border-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="absolute top-2 right-2 flex gap-1 bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded-lg p-1 opacity-0 group-hover:opacity-100 transition-all shadow-sm border border-stone-100 dark:border-stone-800">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-soft-sage hover:bg-soft-sage/10 hover:text-soft-sage"
                    onClick={(e) => {
                      e.stopPropagation();
                      openPlanDialog(meal);
                    }}
                    title="Add to Plan"
                  >
                    <CalendarPlus className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(meal);
                    }}
                    title="Edit"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(meal.id);
                    }}
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Spacing for FAB */}
      <div className="h-20 md:hidden" />

      <FloatingActionButton
        icon={<Plus className="h-6 w-6" />}
        onClick={handleCreate}
        label="Create New Meal"
      />

      <MealEditor
        open={isEditorOpen}
        onOpenChange={setEditorOpen}
        initialData={editingMeal}
        onSave={handleSave}
      />

      <Dialog open={isPlanDialogOpen} onOpenChange={setPlanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Plan</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">Date</label>
              <Input
                type="date"
                className="col-span-3"
                value={planDate}
                onChange={(e) => setPlanDate(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">Meal</label>
              <select
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={planType}
                onChange={(e) => setPlanType(e.target.value as MealType)}
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="snack">Snack</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddToPlan}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

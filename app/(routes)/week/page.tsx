"use client";

import { useState, useEffect, useMemo } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRequireAuth, AuthLoadingScreen } from "@/lib/hooks/useRequireAuth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { DayPlan } from "@/types";
import { cn } from "@/lib/utils/cn";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function WeekPage() {
  const {
    user: authUser,
    loading: authLoading,
    activeFamilyId,
  } = useRequireAuth();
  const { user } = useAuth();
  const router = useRouter();
  const [weekPlans, setWeekPlans] = useState<Record<string, DayPlan>>({});
  const [loading, setLoading] = useState(true);

  const weekDays = useMemo(() => {
    const today = new Date();
    const startDate = startOfWeek(today, { weekStartsOn: 0 });
    return Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));
  }, []);

  useEffect(() => {
    if (!user || !activeFamilyId) {
      setLoading(false);
      return;
    }

    const fetchWeek = async () => {
      setLoading(true);
      try {
        const startStr = format(weekDays[0], "yyyy-MM-dd");
        const endStr = format(weekDays[6], "yyyy-MM-dd");

        const q = query(
          collection(db, "families", activeFamilyId, "dayPlans"),
          where("date", ">=", startStr),
          where("date", "<=", endStr),
        );

        const snapshot = await getDocs(q);
        const plans: Record<string, DayPlan> = {};
        snapshot.forEach((doc) => {
          const data = doc.data();
          const mealsMap = data.meals || {};
          const id = doc.id;

          plans[id] = {
            id: data.id || id,
            date: data.date || id,
            familyId: activeFamilyId,
            updatedAt: data.updatedAt || 0,
            mealCount: data.mealCount || 0,
            meals: {
              breakfast: mealsMap.breakfast || data["meals.breakfast"] || [],
              lunch: mealsMap.lunch || data["meals.lunch"] || [],
              snack: mealsMap.snack || data["meals.snack"] || [],
              dinner: mealsMap.dinner || data["meals.dinner"] || [],
            },
          };
        });
        setWeekPlans(plans);
      } catch (error) {
        console.error("Error fetching week:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeek();
  }, [user, activeFamilyId, weekDays]);

  if (authLoading || !authUser) {
    return <AuthLoadingScreen />;
  }

  const navigateToDay = (dateStr: string) => {
    if (dateStr === format(new Date(), "yyyy-MM-dd")) {
      router.push("/today");
    } else {
      router.push(`/today?date=${dateStr}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-soft-sage" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl pb-12">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-dark dark:text-foreground">
            This Week
          </h1>
          <p className="text-stone-500 dark:text-stone-400">
            {format(weekDays[0], "MMMM d")} -{" "}
            {format(weekDays[6], "MMMM d, yyyy")}
          </p>
        </div>
      </header>

      <div className="grid gap-3 md:gap-4 md:grid-cols-7 sm:grid-cols-2 grid-cols-1 pb-24 md:pb-0">
        {weekDays.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const plan = weekPlans[dateStr];
          const isToday = isSameDay(day, new Date());

          const breakfastCount = plan?.meals?.breakfast?.length || 0;
          const lunchCount = plan?.meals?.lunch?.length || 0;
          const dinnerCount = plan?.meals?.dinner?.length || 0;
          const snackCount = plan?.meals?.snack?.length || 0;
          const total = breakfastCount + lunchCount + dinnerCount + snackCount;

          return (
            <div
              key={dateStr}
              onClick={() => navigateToDay(dateStr)}
              className={cn(
                "flex md:flex-col items-center md:items-start p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all hover:shadow-lg cursor-pointer min-h-[80px] md:h-full md:min-h-[200px] gap-3 md:gap-0",
                isToday
                  ? "bg-soft-sage/10 border-soft-sage/50 ring-1 ring-soft-sage/50"
                  : "bg-white dark:bg-card border-stone-100 dark:border-stone-800 hover:border-soft-sage/30",
              )}
            >
              <div className="flex md:flex-col items-center md:items-start gap-3 md:gap-0 md:mb-4 w-16 md:w-full flex-shrink-0">
                <span
                  className={cn(
                    "text-[10px] md:text-xs font-bold uppercase tracking-wider block md:mb-1 order-2 md:order-1",
                    isToday ? "text-soft-sage" : "text-stone-400",
                  )}
                >
                  {format(day, "EEE")}
                </span>
                <div
                  className={cn(
                    "text-lg md:text-2xl font-bold md:mx-auto md:w-10 md:h-10 flex items-center justify-center rounded-full order-1 md:order-2",
                    isToday
                      ? "md:bg-soft-sage md:text-white md:shadow-md text-soft-sage"
                      : "text-text-dark dark:text-foreground",
                  )}
                >
                  {format(day, "d")}
                </div>
              </div>

              <div className="h-10 w-px bg-stone-100 dark:bg-stone-800 md:hidden" />

              <div className="flex-1 md:space-y-2 md:mt-auto text-xs w-full min-w-0">
                {total === 0 ? (
                  <div className="text-stone-300 dark:text-stone-600 md:h-20 flex items-center md:justify-center md:border-2 md:border-dashed md:border-stone-100 md:dark:border-stone-800 md:rounded-xl md:bg-stone-50/50 md:dark:bg-stone-900/20 italic">
                    <span className="md:hidden">No meals planned</span>
                    <span className="hidden md:inline">Empty</span>
                  </div>
                ) : (
                  <div className="flex flex-row md:flex-col gap-2 md:gap-0 overflow-x-auto md:overflow-visible no-scrollbar">
                    {plan?.meals?.breakfast?.length > 0 && (
                      <div className="space-y-1 min-w-[80px] md:min-w-0">
                        <span className="text-[10px] font-bold text-orange-400 block uppercase tracking-wider">
                          Breakfast
                        </span>
                        {plan.meals.breakfast.map((m) => (
                          <div
                            key={m.id}
                            className="truncate pl-2 border-l-2 border-orange-200 dark:border-orange-900 text-stone-600 dark:text-stone-300 py-0.5"
                          >
                            {m.name}
                          </div>
                        ))}
                      </div>
                    )}
                    {plan?.meals?.lunch?.length > 0 && (
                      <div className="space-y-1 min-w-[80px] md:min-w-0">
                        <span className="text-[10px] font-bold text-green-500 block uppercase tracking-wider">
                          Lunch
                        </span>
                        {plan.meals.lunch.map((m) => (
                          <div
                            key={m.id}
                            className="truncate pl-2 border-l-2 border-green-200 dark:border-green-900 text-stone-600 dark:text-stone-300 py-0.5"
                          >
                            {m.name}
                          </div>
                        ))}
                      </div>
                    )}
                    {plan?.meals?.snack?.length > 0 && (
                      <div className="space-y-1 min-w-[80px] md:min-w-0">
                        <span className="text-[10px] font-bold text-purple-400 block uppercase tracking-wider">
                          Snack
                        </span>
                        {plan.meals.snack.map((m) => (
                          <div
                            key={m.id}
                            className="truncate pl-2 border-l-2 border-purple-200 dark:border-purple-900 text-stone-600 dark:text-stone-300 py-0.5"
                          >
                            {m.name}
                          </div>
                        ))}
                      </div>
                    )}
                    {plan?.meals?.dinner?.length > 0 && (
                      <div className="space-y-1 min-w-[80px] md:min-w-0">
                        <span className="text-[10px] font-bold text-blue-400 block uppercase tracking-wider">
                          Dinner
                        </span>
                        {plan.meals.dinner.map((m) => (
                          <div
                            key={m.id}
                            className="truncate pl-2 border-l-2 border-blue-200 dark:border-blue-900 text-stone-600 dark:text-stone-300 py-0.5"
                          >
                            {m.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

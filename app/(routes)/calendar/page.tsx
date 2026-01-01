"use client";

import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
} from "date-fns";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRequireAuth, AuthLoadingScreen } from "@/lib/hooks/useRequireAuth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { DayPlan } from "@/types";
import { cn } from "@/lib/utils/cn";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export default function CalendarPage() {
  const {
    user: authUser,
    loading: authLoading,
    activeFamilyId,
  } = useRequireAuth();
  const { user } = useAuth();
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthPlans, setMonthPlans] = useState<Record<string, DayPlan>>({});
  const [loading, setLoading] = useState(true);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  useEffect(() => {
    if (!user || !activeFamilyId) {
      setLoading(false);
      return;
    }

    const fetchMonth = async () => {
      setLoading(true);
      try {
        const startStr = format(calendarStart, "yyyy-MM-dd");
        const endStr = format(calendarEnd, "yyyy-MM-dd");

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
        setMonthPlans(plans);
      } catch (error) {
        console.error("Error fetching month:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonth();
  }, [user, currentMonth, activeFamilyId, calendarStart, calendarEnd]);

  const previousMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  const navigateToDay = (dateStr: string) => {
    router.push(`/today?date=${dateStr}`);
  };

  if (authLoading || !authUser) {
    return <AuthLoadingScreen />;
  }

  if (loading && !Object.keys(monthPlans).length) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-soft-sage" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl h-full flex flex-col pb-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-dark dark:text-foreground">
            Calendar
          </h1>
          <p className="text-stone-500 dark:text-stone-400">
            {format(currentMonth, "MMMM yyyy")}
          </p>
        </div>
        <div className="flex gap-2 bg-white dark:bg-card p-1 rounded-xl border border-stone-100 dark:border-stone-800 shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={previousMonth}
            className="h-8 w-8 hover:bg-stone-50 dark:hover:bg-stone-800"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextMonth}
            className="h-8 w-8 hover:bg-stone-50 dark:hover:bg-stone-800"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-7 gap-px rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 overflow-hidden flex-1 shadow-sm">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="bg-stone-50 dark:bg-stone-900 py-3 text-center text-[10px] font-bold text-stone-400 uppercase tracking-widest"
          >
            {day}
          </div>
        ))}

        {calendarDays.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const plan = monthPlans[dateStr];
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date());

          const hasBreakfast = plan?.meals?.breakfast?.length ? true : false;
          const hasLunch = plan?.meals?.lunch?.length ? true : false;
          const hasDinner = plan?.meals?.dinner?.length ? true : false;
          const hasSnack = plan?.meals?.snack?.length ? true : false;

          return (
            <div
              key={dateStr}
              onClick={() => navigateToDay(dateStr)}
              className={cn(
                "relative bg-white dark:bg-card p-2 transition-all hover:z-10 hover:shadow-lg cursor-pointer flex flex-col min-h-[100px] gap-1",
                !isCurrentMonth &&
                  "bg-stone-50/30 dark:bg-stone-900/10 text-stone-300",
              )}
            >
              <time
                dateTime={dateStr}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium transition-colors",
                  isToday
                    ? "bg-soft-sage text-white shadow-sm"
                    : isCurrentMonth
                      ? "text-stone-700 dark:text-stone-300"
                      : "text-stone-300 dark:text-stone-600",
                )}
              >
                {format(day, "d")}
              </time>

              <div className="mt-1 flex flex-col gap-1 overflow-hidden text-[10px]">
                {hasBreakfast &&
                  plan?.meals?.breakfast?.map((m) => (
                    <div
                      key={m.id}
                      className="truncate px-1.5 py-0.5 rounded-md bg-orange-50 text-orange-700 border border-orange-100 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-900/30"
                    >
                      {m.name}
                    </div>
                  ))}
                {hasLunch &&
                  plan?.meals?.lunch?.map((m) => (
                    <div
                      key={m.id}
                      className="truncate px-1.5 py-0.5 rounded-md bg-green-50 text-green-700 border border-green-100 dark:bg-green-900/20 dark:text-green-300 dark:border-green-900/30"
                    >
                      {m.name}
                    </div>
                  ))}
                {hasSnack &&
                  plan?.meals?.snack?.map((m) => (
                    <div
                      key={m.id}
                      className="truncate px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-900/30"
                    >
                      {m.name}
                    </div>
                  ))}
                {hasDinner &&
                  plan?.meals?.dinner?.map((m) => (
                    <div
                      key={m.id}
                      className="truncate px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/30"
                    >
                      {m.name}
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

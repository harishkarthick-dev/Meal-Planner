"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuthStore } from "@/lib/store/authStore";
import { Meal } from "@/types";

export function useMeals() {
  const { user, activeFamilyId } = useAuthStore();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !activeFamilyId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMeals([]);
      setLoading(false);
      return;
    }

    const mealsRef = collection(db, "families", activeFamilyId, "meals");
    const q = query(mealsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMeals = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Meal[];
      setMeals(fetchedMeals);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, activeFamilyId]);

  const addMeal = async (
    mealData: Omit<
      Meal,
      "id" | "userId" | "createdAt" | "createdBy" | "familyId"
    >,
  ) => {
    if (!user || !activeFamilyId) return;
    const docRef = await addDoc(
      collection(db, "families", activeFamilyId, "meals"),
      {
        ...mealData,
        createdBy: user.uid,
        familyId: activeFamilyId,
        createdAt: Date.now(),
      },
    );
    return docRef.id;
  };

  const updateMeal = async (id: string, updates: Partial<Meal>) => {
    if (!user || !activeFamilyId) return;
    const mealRef = doc(db, "families", activeFamilyId, "meals", id);
    await updateDoc(mealRef, updates);
  };

  const deleteMeal = async (id: string) => {
    if (!user || !activeFamilyId) return;
    await deleteDoc(doc(db, "families", activeFamilyId, "meals", id));
  };

  return { meals, loading, addMeal, updateMeal, deleteMeal };
}

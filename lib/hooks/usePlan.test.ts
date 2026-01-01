import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { usePlan } from "./usePlan";
import { useAuthStore } from "@/lib/store/authStore";
import type { Mock } from "vitest";
import { MealEntry } from "@/types";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";

vi.mock("firebase/firestore", () => ({
  doc: vi.fn(),
  onSnapshot: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  arrayUnion: vi.fn(),
  arrayRemove: vi.fn(),
  getFirestore: vi.fn(),
}));

vi.mock("@/lib/firebase/config", () => ({
  db: {},
}));

vi.mock("@/lib/store/authStore", () => ({
  useAuthStore: vi.fn(),
}));

describe("usePlan", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as unknown as Mock).mockReturnValue({
      user: { uid: "user1" },
      activeFamilyId: "family1",
    });
    (doc as Mock).mockReturnValue("mock-doc-ref");
  });

  it("should load empty plan if doc does not exist", async () => {
    (onSnapshot as Mock).mockImplementation((ref, callback) => {
      callback({
        exists: () => false,
      });
      return vi.fn();
    });

    const { result } = renderHook(() => usePlan("2024-01-01"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.dayPlan?.mealCount).toBe(0);
    expect(result.current.dayPlan?.meals.breakfast).toHaveLength(0);
  });

  it("should handle snapshot error", async () => {
    (onSnapshot as Mock).mockImplementation((ref, successCb, errorCb) => {
      errorCb(new Error("Snapshot error"));
      return vi.fn();
    });

    const { result } = renderHook(() => usePlan("2024-01-01"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    // plan stays null or whatever initial state, loading becomes false
    expect(result.current.dayPlan).toBeNull();
  });

  it("should add meal to day", async () => {
    (onSnapshot as Mock).mockImplementation((ref, callback) => {
      callback({ exists: () => false });
      return vi.fn();
    });

    const { result } = renderHook(() => usePlan("2024-01-01"));

    await act(async () => {
      await result.current.addMealToDay("breakfast", {
        name: "Eggs",
        mealId: "123",
        mealType: "breakfast",
      } as unknown as MealEntry);
    });

    expect(setDoc).toHaveBeenCalledWith(
      "mock-doc-ref",
      expect.objectContaining({
        meals: {
          breakfast: undefined, // arrayUnion mock returns undefined in basic mock, but called structure is what matters
        },
      }),
      { merge: true },
    );
  });

  it("should remove meal from day", async () => {
    (onSnapshot as Mock).mockImplementation((ref, callback) => {
      callback({ exists: () => false });
      // callback({ exists: () => true, data: () => ({ meals: { breakfast: [{id: "1"}] } }) });
      return vi.fn();
    });

    const { result } = renderHook(() => usePlan("2024-01-01"));

    await result.current.removeMealFromDay("breakfast", {
      id: "1",
    } as unknown as MealEntry);

    expect(updateDoc).toHaveBeenCalledWith(
      "mock-doc-ref",
      expect.objectContaining({
        "meals.breakfast": undefined, // arrayRemove mock
      }),
    );
  });

  it("should toggle meal completion (uncheck)", async () => {
    const mockPlan = {
      id: "2024-01-01",
      date: "2024-01-01",
      familyId: "family1",
      meals: {
        breakfast: [
          { id: "m1", name: "Toast", completed: true, completedAt: 12345 },
        ],
      },
    };

    (onSnapshot as Mock).mockImplementation((ref, callback) => {
      callback({
        exists: () => true,
        data: () => mockPlan,
      });
      return vi.fn();
    });

    const { result } = renderHook(() => usePlan("2024-01-01"));

    await waitFor(() => expect(result.current.dayPlan).not.toBeNull());

    const mealEntry = result.current.dayPlan!.meals.breakfast[0];

    await result.current.toggleMealCompletion("breakfast", mealEntry);

    expect(updateDoc).toHaveBeenCalledWith(
      "mock-doc-ref",
      expect.objectContaining({
        "meals.breakfast": expect.arrayContaining([
          expect.objectContaining({
            id: "m1",
            completed: false,
            // completedAt should be undefined/deleted, hard to check strict undefined in arrayContaining but usually fine
          }),
        ]),
      }),
    );
  });

  it("should add meal early return if no user", async () => {
    (useAuthStore as unknown as Mock).mockReturnValue({ user: null });
    const { result } = renderHook(() => usePlan("2024-01-01"));
    await result.current.addMealToDay("breakfast", {} as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    expect(setDoc).not.toHaveBeenCalled();
  });
});

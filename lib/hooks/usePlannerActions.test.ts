import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePlannerActions } from "./usePlannerActions";
import { useAuthStore } from "@/lib/store/authStore";
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import type { Mock } from "vitest";

// Mock Firebase
vi.mock("firebase/firestore", () => ({
  doc: vi.fn(),
  setDoc: vi.fn(),
  arrayUnion: vi.fn(),
  getFirestore: vi.fn(),
}));

vi.mock("@/lib/firebase/config", () => ({
  db: {},
}));

// Mock Auth Store
vi.mock("@/lib/store/authStore", () => ({
  useAuthStore: vi.fn(),
}));

describe("usePlannerActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (doc as Mock).mockReturnValue("mock-doc-ref");
  });

  it("should not add meal if user is not authenticated", async () => {
    (useAuthStore as unknown as Mock).mockReturnValue({
      user: null,
      activeFamilyId: null,
    });

    const { result } = renderHook(() => usePlannerActions());

    await result.current.addMealToDate("2024-01-01", "breakfast", {
      name: "Eggs",
      mealType: "breakfast",
    });

    expect(setDoc).not.toHaveBeenCalled();
  });

  it("should add meal if user is authenticated and familyId is present", async () => {
    (useAuthStore as unknown as Mock).mockReturnValue({
      user: { uid: "user1" },
      activeFamilyId: "family1",
    });

    const { result } = renderHook(() => usePlannerActions());

    await result.current.addMealToDate("2024-01-01", "breakfast", {
      name: "Eggs",
      notes: "Boiled",
      mealType: "breakfast",
    });

    expect(doc).toHaveBeenCalledWith(
      expect.anything(),
      "families",
      "family1",
      "dayPlans",
      "2024-01-01",
    );
    expect(setDoc).toHaveBeenCalledWith(
      "mock-doc-ref",
      expect.objectContaining({
        id: "2024-01-01",
        date: "2024-01-01",
        familyId: "family1",
        meals: {
          breakfast: undefined, // arrayUnion result is undefined in mock unless specified
        },
      }),
      { merge: true },
    );

    expect(arrayUnion).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Eggs",
        notes: "Boiled",
        mealType: "breakfast",
        completed: false,
      }),
    );
  });
});

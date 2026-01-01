import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useMeals } from "./useMeals";
import { useAuthStore } from "@/lib/store/authStore";
import type { Mock } from "vitest";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// Mock Firebase
vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  onSnapshot: vi.fn(),
  addDoc: vi.fn(),
  doc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  getFirestore: vi.fn(),
  where: vi.fn(),
}));

vi.mock("@/lib/firebase/config", () => ({
  db: {},
}));

vi.mock("@/lib/store/authStore", () => ({
  useAuthStore: vi.fn(),
}));

describe("useMeals", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as unknown as Mock).mockReturnValue({
      user: { uid: "user1" },
      activeFamilyId: "family1",
    });
    (collection as Mock).mockReturnValue("mock-collection");
  });

  it("should fetch meals and update state", async () => {
    const mockMeals = [
      { id: "1", name: "Pasta" },
      { id: "2", name: "Salad" },
    ];

    (onSnapshot as Mock).mockImplementation((query, callback) => {
      callback({
        docs: mockMeals.map((m) => ({
          id: m.id,
          data: () => m,
        })),
      });
      return vi.fn(); // unsubscribe
    });

    const { result } = renderHook(() => useMeals());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.meals).toHaveLength(2);
    expect(result.current.meals[0].name).toBe("Pasta");
  });

  it("should add a meal", async () => {
    (addDoc as Mock).mockResolvedValue({ id: "new-id" });

    const { result } = renderHook(() => useMeals());

    await result.current.addMeal({
      name: "Pizza",
      ingredients: [],
      tags: [],
    });

    expect(addDoc).toHaveBeenCalledWith(
      "mock-collection",
      expect.objectContaining({
        name: "Pizza",
        familyId: "family1",
        createdBy: "user1",
      }),
    );
  });

  it("should update a meal", async () => {
    (doc as Mock).mockReturnValue("mock-doc-ref");

    const { result } = renderHook(() => useMeals());

    await result.current.updateMeal("1", { name: "Super Pasta" });

    expect(doc).toHaveBeenCalledWith(
      expect.anything(),
      "families",
      "family1",
      "meals",
      "1",
    );
    expect(updateDoc).toHaveBeenCalledWith("mock-doc-ref", {
      name: "Super Pasta",
    });
  });

  it("should delete a meal", async () => {
    (doc as Mock).mockReturnValue("mock-doc-ref");

    const { result } = renderHook(() => useMeals());

    await result.current.deleteMeal("1");

    expect(deleteDoc).toHaveBeenCalledWith("mock-doc-ref");
  });
});

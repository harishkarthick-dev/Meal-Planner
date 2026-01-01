import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useGrocery } from "./useGrocery";
import { useAuthStore } from "@/lib/store/authStore";
import type { Mock } from "vitest";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
} from "firebase/firestore";

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  onSnapshot: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  doc: vi.fn(),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  getFirestore: vi.fn(),
}));

vi.mock("@/lib/firebase/config", () => ({
  db: {},
}));

vi.mock("@/lib/store/authStore", () => ({
  useAuthStore: vi.fn(),
}));

describe("useGrocery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as unknown as Mock).mockReturnValue({
      user: { uid: "user1" },
      activeFamilyId: "family1",
    });
    (collection as Mock).mockReturnValue("mock-collection");
    (query as Mock).mockReturnValue("mock-query");
    (doc as Mock).mockReturnValue("mock-doc-ref");
  });

  // ... existing tests ...
  it("should fetch grocery items and update state", async () => {
    const mockItems = [
      { id: "1", name: "Milk", completed: false, addedAt: 1000 },
      { id: "2", name: "Bread", completed: false, addedAt: 2000 },
    ];

    (onSnapshot as Mock).mockImplementation((query, callback) => {
      const mockSnapshot = {
        forEach: (fn: (doc: { id: string; data: () => unknown }) => void) => {
          mockItems.forEach((item) => {
            fn({ id: item.id, data: () => item });
          });
        },
      };
      callback(mockSnapshot);
      return vi.fn();
    });

    const { result } = renderHook(() => useGrocery());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.items).toHaveLength(2);
  });

  it("should handle no user scenario", async () => {
    (useAuthStore as unknown as Mock).mockReturnValue({
      user: null,
      activeFamilyId: null,
    });

    const { result } = renderHook(() => useGrocery());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it("should add an item", async () => {
    (onSnapshot as Mock).mockImplementation((query, callback) => {
      callback({ forEach: () => {} });
      return vi.fn();
    });
    (addDoc as Mock).mockResolvedValue({ id: "new-id" });

    const { result } = renderHook(() => useGrocery());

    await result.current.addItem("Eggs", "Dairy");

    expect(addDoc).toHaveBeenCalledWith(
      "mock-collection",
      expect.objectContaining({
        name: "Eggs",
        category: "Dairy",
        completed: false,
      }),
    );
  });

  it("should toggle an item", async () => {
    (onSnapshot as Mock).mockImplementation((query, callback) => {
      callback({ forEach: () => {} });
      return vi.fn();
    });

    const { result } = renderHook(() => useGrocery());

    await result.current.toggleItem("item1", true);

    expect(updateDoc).toHaveBeenCalledWith("mock-doc-ref", { completed: true });
  });

  it("should delete an item", async () => {
    (onSnapshot as Mock).mockImplementation((query, callback) => {
      callback({ forEach: () => {} });
      return vi.fn();
    });

    const { result } = renderHook(() => useGrocery());

    await result.current.deleteItem("item1");

    expect(deleteDoc).toHaveBeenCalledWith("mock-doc-ref");
  });

  it("should not add duplicate items", async () => {
    const mockItems = [
      { id: "1", name: "Milk", completed: false, addedAt: 1000 },
    ];

    (onSnapshot as Mock).mockImplementation((query, callback) => {
      const mockSnapshot = {
        forEach: (fn: (doc: { id: string; data: () => unknown }) => void) => {
          mockItems.forEach((item) => {
            fn({ id: item.id, data: () => item });
          });
        },
      };
      callback(mockSnapshot);
      return vi.fn();
    });

    const { result } = renderHook(() => useGrocery());

    await waitFor(() => {
      expect(result.current.items).toHaveLength(1);
    });

    await result.current.addItem("milk");

    expect(addDoc).not.toHaveBeenCalled();
  });

  it("should sort items with pending first", async () => {
    const mockItems = [
      { id: "1", name: "Milk", completed: true, addedAt: 1000 },
      { id: "2", name: "Bread", completed: false, addedAt: 2000 },
    ];

    (onSnapshot as Mock).mockImplementation((query, callback) => {
      const mockSnapshot = {
        forEach: (fn: (doc: { id: string; data: () => unknown }) => void) => {
          mockItems.forEach((item) => {
            fn({ id: item.id, data: () => item });
          });
        },
      };
      callback(mockSnapshot);
      return vi.fn();
    });

    const { result } = renderHook(() => useGrocery());

    await waitFor(() => {
      expect(result.current.items).toHaveLength(2);
    });

    expect(result.current.items[0].name).toBe("Bread");
    expect(result.current.items[1].name).toBe("Milk");
  });

  it("should generate items from date range", async () => {
    // Mock existing items (empty)
    (onSnapshot as Mock).mockImplementation((query, callback) => {
      callback({ forEach: () => {} });
      return vi.fn();
    });

    // Mock day plans
    (getDocs as Mock).mockResolvedValue({
      forEach: (fn: (doc: { data: () => unknown }) => void) => {
        fn({
          data: () => ({
            meals: {
              breakfast: [{ mealId: "meal1" }],
              lunch: [],
              dinner: [],
            },
          }),
        });
      },
    });

    // Mock meal fetch
    (getDoc as Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({
        ingredients: ["Eggs", "Bread"],
      }),
    });

    const { result } = renderHook(() => useGrocery());

    await result.current.generateFromRange(new Date(), new Date());

    expect(addDoc).toHaveBeenCalledTimes(2);
    expect(addDoc).toHaveBeenCalledWith(
      "mock-collection",
      expect.objectContaining({ name: "Eggs", category: "Plan" }),
    );
    expect(addDoc).toHaveBeenCalledWith(
      "mock-collection",
      expect.objectContaining({ name: "Bread", category: "Plan" }),
    );
  });

  it("should skip existing items when generating from range", async () => {
    const mockItems = [
      { id: "1", name: "Eggs", completed: false, addedAt: 1000 },
    ];

    (onSnapshot as Mock).mockImplementation((query, callback) => {
      const mockSnapshot = {
        forEach: (fn: (doc: { id: string; data: () => unknown }) => void) => {
          mockItems.forEach((item) => {
            fn({ id: item.id, data: () => item });
          });
        },
      };
      callback(mockSnapshot);
      return vi.fn();
    });

    (getDocs as Mock).mockResolvedValue({
      forEach: (fn: (doc: { data: () => unknown }) => void) => {
        fn({
          data: () => ({
            meals: { breakfast: [{ mealId: "meal1" }] },
          }),
        });
      },
    });

    (getDoc as Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ ingredients: ["Eggs", "Bread"] }),
    });

    const { result } = renderHook(() => useGrocery());

    // Wait for items to load
    await waitFor(() => {
      expect(result.current.items).toHaveLength(1);
    });

    await result.current.generateFromRange(new Date(), new Date());

    // Eggs exists, so only Bread should be added
    expect(addDoc).toHaveBeenCalledTimes(1);
    expect(addDoc).toHaveBeenCalledWith(
      "mock-collection",
      expect.objectContaining({ name: "Bread" }),
    );
  });
});

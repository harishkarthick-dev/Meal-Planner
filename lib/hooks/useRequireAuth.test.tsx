import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useRequireAuth } from "./useRequireAuth";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";
import type { Mock } from "vitest";

vi.mock("@/lib/store/authStore", () => ({
  useAuthStore: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("useRequireAuth", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush });
  });

  it("should redirect to / if user is not authenticated and not loading", () => {
    (useAuthStore as unknown as Mock).mockReturnValue({
      user: null,
      loading: false,
      activeFamilyId: null,
    });

    const { result } = renderHook(() => useRequireAuth());

    expect(mockPush).toHaveBeenCalledWith("/");
    expect(result.current.user).toBeNull();
  });

  it("should redirect to /get-started if user is authenticated but no family selected", () => {
    (useAuthStore as unknown as Mock).mockReturnValue({
      user: { uid: "1" },
      loading: false,
      activeFamilyId: null,
    });

    const { result } = renderHook(() => useRequireAuth());

    expect(mockPush).toHaveBeenCalledWith("/get-started");
    // loading should be true because we treat "no family" as loading/blocking
    expect(result.current.loading).toBe(true);
  });

  it("should not redirect if user is authenticated and has family", () => {
    (useAuthStore as unknown as Mock).mockReturnValue({
      user: { uid: "1" },
      loading: false,
      activeFamilyId: "family1",
    });

    const { result } = renderHook(() => useRequireAuth());

    expect(mockPush).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it("should not redirect while loading", () => {
    (useAuthStore as unknown as Mock).mockReturnValue({
      user: null,
      loading: true,
      activeFamilyId: null,
    });

    renderHook(() => useRequireAuth());

    expect(mockPush).not.toHaveBeenCalled();
  });
});

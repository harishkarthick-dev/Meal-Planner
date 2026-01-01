import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CreateFamilyForm } from "./CreateFamilyForm";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";
import { addDoc, updateDoc } from "firebase/firestore";

import type { Mock } from "vitest";

// Mocks
vi.mock("@/lib/store/authStore", () => ({
  useAuthStore: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  doc: vi.fn(),
  arrayUnion: vi.fn(),
  serverTimestamp: vi.fn(),
  getFirestore: vi.fn(),
}));

vi.mock("@/lib/firebase/config", () => ({
  db: {},
}));

describe("CreateFamilyForm", () => {
  const mockRouterPush = vi.fn();
  const mockSetActiveFamilyId = vi.fn();
  const mockSetProfile = vi.fn();
  const mockUseAuthStore = useAuthStore as unknown as ReturnType<
    typeof vi.fn
  > & { getState: Mock };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockRouterPush });
    mockUseAuthStore.mockReturnValue({
      user: { uid: "u1", email: "test@example.com", displayName: "User 1" },
      setActiveFamilyId: mockSetActiveFamilyId,
      setProfile: mockSetProfile,
    });
    mockUseAuthStore.getState = vi.fn(() => ({ profile: { familyIds: [] } }));
    (addDoc as Mock).mockResolvedValue({ id: "new-family-id" });
  });

  it("renders correctly", () => {
    render(<CreateFamilyForm />);
    expect(screen.getByPlaceholderText(/My Family Name/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Create Family/i }),
    ).toBeInTheDocument();
  });

  it("creates a family on submit", async () => {
    render(<CreateFamilyForm />);

    fireEvent.change(screen.getByPlaceholderText(/My Family Name/i), {
      target: { value: "The Jetsons" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Create Family/i }));

    await waitFor(() => {
      expect(addDoc).toHaveBeenCalled();
      expect(updateDoc).toHaveBeenCalled();
      expect(mockSetActiveFamilyId).toHaveBeenCalledWith("new-family-id");
      expect(mockSetProfile).toHaveBeenCalled();
      expect(mockRouterPush).toHaveBeenCalledWith("/today");
    });
  });

  it("requires name", async () => {
    render(<CreateFamilyForm />);
    fireEvent.click(screen.getByRole("button", { name: /Create Family/i }));

    // Should not call addDoc if logic prevents empty name
    // The component has: if (!user || !name.trim()) return;
    await waitFor(() => {
      expect(addDoc).not.toHaveBeenCalled();
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { JoinFamilyForm } from "./JoinFamilyForm";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";
import { getDocs, updateDoc } from "firebase/firestore";

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
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(),
  updateDoc: vi.fn(),
  doc: vi.fn(),
  arrayUnion: vi.fn(),
  serverTimestamp: vi.fn(),
  getFirestore: vi.fn(),
}));

vi.mock("@/lib/firebase/config", () => ({
  db: {},
}));

describe("JoinFamilyForm", () => {
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
  });

  it("renders correctly", () => {
    render(<JoinFamilyForm />);
    expect(
      screen.getByPlaceholderText(/Enter Invite Code/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Join Family/i }),
    ).toBeInTheDocument();
  });

  it("joins a family on valid code", async () => {
    (getDocs as Mock).mockResolvedValue({
      empty: false,
      docs: [
        {
          id: "family-id-1",
          data: () => ({ members: {} }),
        },
      ],
    });

    render(<JoinFamilyForm />);

    fireEvent.change(screen.getByPlaceholderText(/Enter Invite Code/i), {
      target: { value: "CODE123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Join Family/i }));

    await waitFor(() => {
      expect(getDocs).toHaveBeenCalled();
      expect(updateDoc).toHaveBeenCalled(); // Should call twice (family and user)
      expect(mockSetActiveFamilyId).toHaveBeenCalledWith("family-id-1");
      expect(mockSetProfile).toHaveBeenCalled();
      expect(mockRouterPush).toHaveBeenCalledWith("/today");
    });
  });

  it("shows error on invalid code", async () => {
    (getDocs as Mock).mockResolvedValue({
      empty: true,
      docs: [],
    });

    render(<JoinFamilyForm />);

    fireEvent.change(screen.getByPlaceholderText(/Enter Invite Code/i), {
      target: { value: "INVALID" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Join Family/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid invite code/i)).toBeInTheDocument();
    });
  });
});

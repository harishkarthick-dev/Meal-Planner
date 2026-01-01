import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthProvider";
import { useAuthStore } from "@/lib/store/authStore";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import type { Mock } from "vitest";

// Mocks
vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn(),
  signInWithPopup: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  GoogleAuthProvider: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  serverTimestamp: vi.fn(),
}));

vi.mock("@/lib/firebase/config", () => ({
  auth: {},
  db: {},
}));

vi.mock("@/lib/store/authStore", () => ({
  useAuthStore: vi.fn(),
}));

interface MockStore extends Mock {
  getState: Mock;
}

// Fix: Mock the static getState method on the store
(useAuthStore as unknown as MockStore).getState = vi.fn(() => ({
  activeFamilyId: null,
}));

// Test component to trigger auth methods
const TestComponent = () => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, signOut } =
    useAuth();
  return (
    <div>
      <button onClick={() => signInWithGoogle()}>Google</button>
      <button onClick={() => signInWithEmail("test@e.com", "pass")}>
        Sign In
      </button>
      <button onClick={() => signUpWithEmail("test@e.com", "pass")}>
        Sign Up
      </button>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
};

describe("AuthProvider", () => {
  const mockSetUser = vi.fn();
  const mockSetProfile = vi.fn();
  const mockSetActiveFamilyId = vi.fn();
  const mockSetLoading = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as unknown as Mock).mockReturnValue({
      user: null, // Default
      profile: null,
      activeFamilyId: null,
      loading: true,
      setUser: mockSetUser,
      setProfile: mockSetProfile,
      setActiveFamilyId: mockSetActiveFamilyId,
      setLoading: mockSetLoading,
    });
    (useAuthStore as unknown as MockStore).getState.mockReturnValue({
      activeFamilyId: null,
    });
    (doc as Mock).mockReturnValue("mock-user-ref");
  });

  it("handles initialization when no user is logged in", async () => {
    (onAuthStateChanged as Mock).mockImplementation((auth, callback) => {
      callback(null);
      return vi.fn();
    });

    render(
      <AuthProvider>
        <div>Child</div>
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith(null);
      expect(mockSetProfile).toHaveBeenCalledWith(null);
      expect(mockSetActiveFamilyId).toHaveBeenCalledWith(null);
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });
  });

  it("handles user login with existing profile", async () => {
    const mockUser = { uid: "u1", email: "test@example.com" };
    const mockProfile = { uid: "u1", familyIds: ["f1"] };

    (onAuthStateChanged as Mock).mockImplementation((auth, callback) => {
      callback(mockUser);
      return vi.fn();
    });

    (getDoc as Mock).mockResolvedValue({
      exists: () => true,
      data: () => mockProfile,
    });

    render(
      <AuthProvider>
        <div>Child</div>
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith(mockUser);
      expect(mockSetProfile).toHaveBeenCalledWith(mockProfile);
      // Should auto-select first family if none active
      expect(mockSetActiveFamilyId).toHaveBeenCalledWith("f1");
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });
  });

  it("creates new profile if none exists", async () => {
    const mockUser = { uid: "u2", email: "new@example.com" };

    (onAuthStateChanged as Mock).mockImplementation((auth, callback) => {
      callback(mockUser);
      return vi.fn();
    });

    (getDoc as Mock).mockResolvedValue({
      exists: () => false,
    });

    render(
      <AuthProvider>
        <div>Child</div>
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(setDoc).toHaveBeenCalledWith(
        "mock-user-ref",
        expect.objectContaining({
          uid: "u2",
          email: "new@example.com",
          familyIds: [],
        }),
      );
      expect(mockSetProfile).toHaveBeenCalled();
      // No families, so null
      expect(mockSetActiveFamilyId).toHaveBeenCalledWith(null);
    });
  });

  it("calls auth methods correctly", async () => {
    (onAuthStateChanged as Mock).mockImplementation((auth, callback) => {
      callback(null);
      return vi.fn();
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    fireEvent.click(screen.getByText("Google"));
    expect(signInWithPopup).toHaveBeenCalled();

    fireEvent.click(screen.getByText("Sign In"));
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      "test@e.com",
      "pass",
    );

    fireEvent.click(screen.getByText("Sign Up"));
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      "test@e.com",
      "pass",
    );

    fireEvent.click(screen.getByText("Sign Out"));
    expect(signOut).toHaveBeenCalled();
  });

  it("handles error fetching user profile", async () => {
    const mockUser = { uid: "u1" };
    (onAuthStateChanged as Mock).mockImplementation((auth, callback) => {
      callback(mockUser);
      return vi.fn();
    });
    (getDoc as Mock).mockRejectedValue(new Error("Fetch failed"));

    render(
      <AuthProvider>
        <div>Child</div>
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(mockSetProfile).toHaveBeenCalledWith(null);
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });
  });
});

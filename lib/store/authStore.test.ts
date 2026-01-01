import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "./authStore";

describe("authStore", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      profile: null,
      activeFamilyId: null,
      loading: true,
    });
  });

  it("should have initial state", () => {
    const state = useAuthStore.getState();

    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.activeFamilyId).toBeNull();
    expect(state.loading).toBe(true);
  });

  it("should set user", () => {
    const mockUser = { uid: "test-uid", email: "test@example.com" };

    useAuthStore.getState().setUser(mockUser as never);

    expect(useAuthStore.getState().user).toEqual(mockUser);
  });

  it("should set profile", () => {
    const mockProfile = {
      uid: "test-uid",
      email: "test@example.com",
      displayName: "Test User",
      photoURL: "",
      familyIds: ["family1"],
      createdAt: Date.now(),
    };

    useAuthStore.getState().setProfile(mockProfile);

    expect(useAuthStore.getState().profile).toEqual(mockProfile);
  });

  it("should set activeFamilyId", () => {
    useAuthStore.getState().setActiveFamilyId("family-123");

    expect(useAuthStore.getState().activeFamilyId).toBe("family-123");
  });

  it("should set loading", () => {
    useAuthStore.getState().setLoading(false);

    expect(useAuthStore.getState().loading).toBe(false);
  });

  it("should return isAuthenticated correctly", () => {
    expect(useAuthStore.getState().isAuthenticated()).toBe(false);

    useAuthStore.getState().setUser({ uid: "test" } as never);

    expect(useAuthStore.getState().isAuthenticated()).toBe(true);
  });

  it("should return hasFamily correctly", () => {
    expect(useAuthStore.getState().hasFamily()).toBe(false);

    useAuthStore.getState().setProfile({
      uid: "test",
      email: "test@example.com",
      displayName: "Test",
      photoURL: "",
      familyIds: ["family1"],
      createdAt: Date.now(),
    });

    expect(useAuthStore.getState().hasFamily()).toBe(true);
  });

  it("should return hasFamily false for empty familyIds", () => {
    useAuthStore.getState().setProfile({
      uid: "test",
      email: "test@example.com",
      displayName: "Test",
      photoURL: "",
      familyIds: [],
      createdAt: Date.now(),
    });

    expect(useAuthStore.getState().hasFamily()).toBe(false);
  });
});

import { describe, it, expect, vi } from "vitest";

// We mock firebase modules to ensure the config file logic executes without
// actually connecting to firebase (which would fail in test env usually).
vi.mock("firebase/app", () => ({
  initializeApp: vi.fn(() => ({})),
  getApps: vi.fn(() => []),
  getApp: vi.fn(() => ({})),
}));

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({})),
  GoogleAuthProvider: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(() => ({})),
  enableMultiTabIndexedDbPersistence: vi.fn(() => Promise.resolve()),
}));

vi.mock("firebase/storage", () => ({
  getStorage: vi.fn(() => ({})),
}));

describe("Firebase Config", () => {
  it("initializes firebase apps", async () => {
    // Import the config file. It executes initialization at top level.
    const config = await import("./config");

    expect(config.app).toBeDefined();
    expect(config.auth).toBeDefined();
    expect(config.db).toBeDefined();
    expect(config.storage).toBeDefined();
  });
});

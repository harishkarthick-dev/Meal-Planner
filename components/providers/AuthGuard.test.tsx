import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthGuard } from "./AuthGuard";
import { useAuth } from "./AuthProvider";
import { useRouter, usePathname } from "next/navigation";
import type { Mock } from "vitest";

vi.mock("./AuthProvider", () => ({
  useAuth: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

describe("AuthGuard", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush });
  });

  it("renders children if user is authenticated", () => {
    (useAuth as Mock).mockReturnValue({ user: { uid: "u1" }, loading: false });
    (usePathname as Mock).mockReturnValue("/dashboard");

    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>,
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects to / if user is not authenticated and path is protected", () => {
    (useAuth as Mock).mockReturnValue({ user: null, loading: false });
    (usePathname as Mock).mockReturnValue("/dashboard");

    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>,
    );

    // AuthGuard has internal mounted check, so useEffect needs to fire
    expect(mockPush).toHaveBeenCalledWith("/");
    expect(screen.queryByText("Protected Content")).toBeNull();
  });

  it("allows access to public paths without user", () => {
    (useAuth as Mock).mockReturnValue({ user: null, loading: false });
    (usePathname as Mock).mockReturnValue("/"); // Public path

    render(
      <AuthGuard>
        <div>Public Content</div>
      </AuthGuard>,
    );

    expect(mockPush).not.toHaveBeenCalled();
    // It returns null instead of children for public paths if no user?
    // Logic: if (!user && public) return null; -> Wait, that logic in AuthGuard seems odd if it returns null?
    // Let's check source:
    // if (!user && pathname && !PUBLIC_PATHS.includes(pathname)) return null;
    // return <>{children}</>;

    // Actually looking at source provided earlier:
    // if (!user && pathname && !PUBLIC_PATHS.includes(pathname)) { return null; }
    // return <>{children}</>;

    // So public path should render children.
    expect(screen.getByText("Public Content")).toBeInTheDocument();
  });
});

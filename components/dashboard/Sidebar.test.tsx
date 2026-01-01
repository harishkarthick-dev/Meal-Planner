import { describe, it, expect, vi, type Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/components/providers/AuthProvider";
import { usePathname } from "next/navigation";

// Mock hooks
const mockSignOut = vi.fn();
const mockUser = {
  displayName: "John Doe",
  email: "john@example.com",
  photoURL: "https://example.com/photo.jpg",
};

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

vi.mock("@/components/providers/AuthProvider", () => ({
  useAuth: vi.fn(),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} /> // eslint-disable-line @next/next/no-img-element
  ),
}));

describe("Sidebar", () => {
  it("renders navigation items", () => {
    (usePathname as unknown as Mock).mockReturnValue("/today");
    (useAuth as unknown as Mock).mockReturnValue({
      user: mockUser,
      signOut: mockSignOut,
    });

    render(<Sidebar />);

    expect(screen.getByText("Today's Plan")).toBeInTheDocument();
    expect(screen.getByText("Weekly Plan")).toBeInTheDocument();
  });

  it("highlights active route", () => {
    (usePathname as unknown as Mock).mockReturnValue("/today");
    (useAuth as unknown as Mock).mockReturnValue({
      user: mockUser,
      signOut: mockSignOut,
    });

    render(<Sidebar />);

    const todayLink = screen.getByText("Today's Plan").closest("a");
    const weekLink = screen.getByText("Weekly Plan").closest("a");

    expect(todayLink).toHaveClass("bg-soft-sage/10");
    expect(weekLink).not.toHaveClass("bg-soft-sage/10");
  });

  it("calls onClose when a link is clicked", () => {
    const onClose = vi.fn();
    (usePathname as unknown as Mock).mockReturnValue("/today");
    (useAuth as unknown as Mock).mockReturnValue({
      user: mockUser,
      signOut: mockSignOut,
    });

    render(<Sidebar onClose={onClose} />);

    fireEvent.click(screen.getByText("Weekly Plan"));
    expect(onClose).toHaveBeenCalled();
  });

  it("renders user info", () => {
    (usePathname as unknown as Mock).mockReturnValue("/today");
    (useAuth as unknown as Mock).mockReturnValue({
      user: mockUser,
      signOut: mockSignOut,
    });

    render(<Sidebar />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      "https://example.com/photo.jpg",
    );
  });

  it("renders default user icon if no photo", () => {
    (usePathname as unknown as Mock).mockReturnValue("/today");
    (useAuth as unknown as Mock).mockReturnValue({
      user: { ...mockUser, photoURL: null },
      signOut: mockSignOut,
    });

    render(<Sidebar />);
    // User icon is rendered when no photo.
    // We can check if img is NOT present or check for generic icon (SVG)
    const img = screen.queryByRole("img");
    expect(img).not.toBeInTheDocument();
  });

  it("calls signOut when logout button is clicked", () => {
    (usePathname as unknown as Mock).mockReturnValue("/today");
    (useAuth as unknown as Mock).mockReturnValue({
      user: mockUser,
      signOut: mockSignOut,
    });

    render(<Sidebar />);
    const logoutBtn = screen.getByTitle("Sign Out");
    fireEvent.click(logoutBtn);
    expect(mockSignOut).toHaveBeenCalled();
  });
});

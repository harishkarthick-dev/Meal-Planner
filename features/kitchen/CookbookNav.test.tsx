import { describe, it, expect, vi, type Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CookbookNav } from "./CookbookNav";
import { useAuth } from "@/components/providers/AuthProvider";
import { usePathname } from "next/navigation";

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

vi.mock("@/components/ui/ThemeToggle", () => ({
  ThemeToggle: () => <button type="button">Theme</button>,
}));

describe("CookbookNav", () => {
  it("renders navigation items", () => {
    (usePathname as unknown as Mock).mockReturnValue("/today");
    (useAuth as unknown as Mock).mockReturnValue({
      user: mockUser,
      signOut: mockSignOut,
    });

    render(<CookbookNav />);

    expect(screen.getByText("Today's table")).toBeInTheDocument();
    expect(screen.getByText("This week")).toBeInTheDocument();
  });

  it("marks the active chapter", () => {
    (usePathname as unknown as Mock).mockReturnValue("/today");
    (useAuth as unknown as Mock).mockReturnValue({
      user: mockUser,
      signOut: mockSignOut,
    });

    render(<CookbookNav />);

    const todayLink = screen.getByText("Today's table").closest("a");
    const weekLink = screen.getByText("This week").closest("a");

    expect(todayLink).toHaveAttribute("aria-current", "page");
    expect(weekLink).not.toHaveAttribute("aria-current");
  });

  it("calls onClose when a link is clicked", () => {
    const onClose = vi.fn();
    (usePathname as unknown as Mock).mockReturnValue("/today");
    (useAuth as unknown as Mock).mockReturnValue({
      user: mockUser,
      signOut: mockSignOut,
    });

    render(<CookbookNav onClose={onClose} />);

    fireEvent.click(screen.getByText("This week"));
    expect(onClose).toHaveBeenCalled();
  });

  it("renders user info", () => {
    (usePathname as unknown as Mock).mockReturnValue("/today");
    (useAuth as unknown as Mock).mockReturnValue({
      user: mockUser,
      signOut: mockSignOut,
    });

    render(<CookbookNav />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      "https://example.com/photo.jpg",
    );
  });

  it("renders default cook icon if no photo", () => {
    (usePathname as unknown as Mock).mockReturnValue("/today");
    (useAuth as unknown as Mock).mockReturnValue({
      user: { ...mockUser, photoURL: null },
      signOut: mockSignOut,
    });

    render(<CookbookNav />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("calls signOut when logout button is clicked", () => {
    (usePathname as unknown as Mock).mockReturnValue("/today");
    (useAuth as unknown as Mock).mockReturnValue({
      user: mockUser,
      signOut: mockSignOut,
    });

    render(<CookbookNav />);
    fireEvent.click(screen.getByTitle("Sign Out"));
    expect(mockSignOut).toHaveBeenCalled();
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthForm } from "./AuthForm";

const mockSignInWithGoogle = vi.fn();
const mockSignInWithEmail = vi.fn();
const mockSignUpWithEmail = vi.fn();
const mockPush = vi.fn();

vi.mock("@/components/providers/AuthProvider", () => ({
  useAuth: () => ({
    signInWithGoogle: mockSignInWithGoogle,
    signInWithEmail: mockSignInWithEmail,
    signUpWithEmail: mockSignUpWithEmail,
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("AuthForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login form by default", () => {
    render(<AuthForm />);

    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });

  it("toggles to signup form", () => {
    render(<AuthForm />);

    fireEvent.click(screen.getByText("Sign up"));

    expect(screen.getByText("Create an Account")).toBeInTheDocument();
    expect(screen.getByText("Create Account")).toBeInTheDocument();
  });

  it("toggles back to login form", () => {
    render(<AuthForm />);

    fireEvent.click(screen.getByText("Sign up"));
    fireEvent.click(screen.getByText("Sign in"));

    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
  });

  it("handles Google sign in", async () => {
    mockSignInWithGoogle.mockResolvedValue({});
    render(<AuthForm />);

    fireEvent.click(screen.getByText("Continue with Google"));

    await waitFor(() => {
      expect(mockSignInWithGoogle).toHaveBeenCalled();
    });
  });

  it("handles Google sign in error", async () => {
    mockSignInWithGoogle.mockRejectedValue(new Error("Google error"));
    render(<AuthForm />);

    fireEvent.click(screen.getByText("Continue with Google"));

    await waitFor(() => {
      expect(
        screen.getByText("Failed to sign in with Google. Please try again."),
      ).toBeInTheDocument();
    });
  });

  it("handles email sign in", async () => {
    mockSignInWithEmail.mockResolvedValue({});
    render(<AuthForm />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByText("Sign In"));

    await waitFor(() => {
      expect(mockSignInWithEmail).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
      );
    });
  });

  it("handles email sign up", async () => {
    mockSignUpWithEmail.mockResolvedValue({});
    render(<AuthForm />);

    fireEvent.click(screen.getByText("Sign up"));
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "new@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "newpassword" },
    });
    fireEvent.click(screen.getByText("Create Account"));

    await waitFor(() => {
      expect(mockSignUpWithEmail).toHaveBeenCalledWith(
        "new@example.com",
        "newpassword",
      );
    });
  });

  it("shows error when fields are empty", async () => {
    render(<AuthForm />);

    fireEvent.click(screen.getByText("Sign In"));

    await waitFor(() => {
      expect(screen.getByText("Please fill in all fields")).toBeInTheDocument();
    });
  });

  it("handles invalid credential error", async () => {
    const firebaseError = { code: "auth/invalid-credential", message: "" };
    mockSignInWithEmail.mockRejectedValue(firebaseError);
    render(<AuthForm />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByText("Sign In"));

    await waitFor(() => {
      expect(
        screen.getByText("Invalid email or password."),
      ).toBeInTheDocument();
    });
  });

  it("handles email already in use error", async () => {
    const firebaseError = { code: "auth/email-already-in-use", message: "" };
    mockSignUpWithEmail.mockRejectedValue(firebaseError);
    render(<AuthForm />);

    fireEvent.click(screen.getByText("Sign up"));
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "existing@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByText("Create Account"));

    await waitFor(() => {
      expect(
        screen.getByText("Email is already registered. Please sign in."),
      ).toBeInTheDocument();
    });
  });

  it("handles weak password error", async () => {
    const firebaseError = { code: "auth/weak-password", message: "" };
    mockSignUpWithEmail.mockRejectedValue(firebaseError);
    render(<AuthForm />);

    fireEvent.click(screen.getByText("Sign up"));
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByText("Create Account"));

    await waitFor(() => {
      expect(
        screen.getByText("Password should be at least 6 characters."),
      ).toBeInTheDocument();
    });
  });

  it("handles generic error with message", async () => {
    const firebaseError = {
      code: "auth/unknown-error",
      message: "Something went wrong",
    };
    mockSignInWithEmail.mockRejectedValue(firebaseError);
    render(<AuthForm />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByText("Sign In"));

    await waitFor(() => {
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });
  });
});

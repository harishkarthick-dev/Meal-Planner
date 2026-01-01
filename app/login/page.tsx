import { AuthForm } from "@/components/auth/AuthForm";
import Link from "next/link";
import { ChefHat } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid items-center bg-warm-white dark:bg-background relative overflow-hidden">
      {/* Background Blobs - Reused from Landing Page */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-soft-sage/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-dusty-rose/20 rounded-full blur-[100px] -z-10" />

      <div className="w-full max-w-md mx-auto p-6">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 group mb-8">
            <div className="w-12 h-12 rounded-2xl bg-soft-sage flex items-center justify-center text-white shadow-md group-hover:rotate-6 transition-transform">
              <ChefHat className="w-7 h-7" />
            </div>
          </Link>
          <AuthForm />

          <Link
            href="/"
            className="mt-8 text-sm text-stone-500 hover:text-soft-sage transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

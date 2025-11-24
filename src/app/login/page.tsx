import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthShell } from "@/features/auth/components/auth-shell";
import { LoginForm } from "@/features/auth/components/login-form";
import { getCurrentUser } from "@/server/auth/get-current-user";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/");
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="Jump back into your spaced repetition flow."
      footer={
        <>
          Need an account?{" "}
          <Link className="text-white hover:text-emerald-400" href="/register">
            Sign up
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}

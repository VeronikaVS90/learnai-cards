import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthShell } from "@/features/auth/components/auth-shell";
import { RegisterForm } from "@/features/auth/components/register-form";
import { getCurrentUser } from "@/server/auth/get-current-user";

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/");
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Set the foundation for smarter studying."
      footer={
        <>
          Already have an account?{" "}
          <Link className="text-white hover:text-emerald-400" href="/login">
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}

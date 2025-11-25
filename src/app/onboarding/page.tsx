import { redirect } from "next/navigation";

import { OnboardingWizard } from "@/features/onboarding/onboarding-wizard";
import { getCurrentUser } from "@/server/auth/get-current-user";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 py-16 text-white">
      <div className="w-full max-w-3xl">
        <OnboardingWizard />
      </div>
    </main>
  );
}

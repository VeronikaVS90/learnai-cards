import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/server/auth/get-current-user";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 py-16 text-white">
      <div className="w-full max-w-2xl rounded-3xl border border-neutral-900 bg-neutral-900/40 p-10">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">
          Onboarding
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Let&apos;s build your first deck
        </h1>
        <p className="mt-3 text-neutral-400">
          The guided wizard will arrive shortly. In the meantime, head to the
          decks area to create your first collection manually.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/decks"
            className="rounded-lg bg-emerald-500 px-5 py-2 font-semibold text-neutral-950 transition hover:bg-emerald-400"
          >
            Go to decks
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-neutral-800 px-5 py-2 font-semibold text-white transition hover:border-emerald-500"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}

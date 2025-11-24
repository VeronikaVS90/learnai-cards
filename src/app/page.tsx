import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/server/auth/get-current-user";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-10 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="flex flex-col gap-3">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">
            Today&apos;s focus
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome back, {user.name ?? user.email} 👋
          </h1>
          <p className="text-neutral-400">
            Finish your scheduled reviews to keep the momentum going.
          </p>
          <div className="mt-4 flex gap-3">
            <Link
              className="rounded-lg bg-emerald-500 px-5 py-2 font-semibold text-neutral-950 transition hover:bg-emerald-400"
              href="/decks"
            >
              View decks
            </Link>
            <Link
              className="rounded-lg border border-neutral-800 px-5 py-2 font-semibold text-white transition hover:border-emerald-500"
              href="/decks/today"
            >
              Today&apos;s review
            </Link>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            { label: "Due today", value: "—" },
            { label: "New cards", value: "—" },
            { label: "Streak", value: "—" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6"
            >
              <p className="text-sm text-neutral-400">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>

        <section className="rounded-3xl border border-neutral-900 bg-neutral-900/40 p-8">
          <h2 className="text-xl font-semibold">Learning timeline</h2>
          <p className="mt-2 text-sm text-neutral-400">
            Charts and insights will live here once stats endpoints are wired.
          </p>
          <div className="mt-6 h-40 rounded-2xl border border-dashed border-neutral-800 bg-neutral-950/60" />
        </section>
      </div>
    </main>
  );
}

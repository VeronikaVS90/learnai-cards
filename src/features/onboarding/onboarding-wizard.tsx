"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { completeOnboarding } from "@/server/decks/actions";

type WizardState = {
  title: string;
  description: string;
  question: string;
  answer: string;
  addCard: boolean;
};

const steps = ["Deck basics", "Add a sample card", "Review"];

function useWizardState() {
  const [state, setState] = useState<WizardState>({
    title: "",
    description: "",
    question: "",
    answer: "",
    addCard: true,
  });

  const canCreate = useMemo(() => {
    if (!state.title.trim()) return false;
    if (!state.addCard) return true;
    return state.question.trim() && state.answer.trim();
  }, [state]);

  return { state, setState, canCreate };
}

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isPending, startTransition] = useTransition();
  const { state, setState, canCreate } = useWizardState();

  function next() {
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  }

  function prev() {
    setStep((prev) => Math.max(prev - 1, 0));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canCreate || isPending) return;

    startTransition(async () => {
      try {
        const deck = await completeOnboarding({
          title: state.title.trim(),
          description: state.description.trim() || undefined,
          firstCard: state.addCard
            ? {
                question: state.question.trim(),
                answer: state.answer.trim(),
              }
            : undefined,
        });

        toast.success("Deck created! Redirecting...");
        router.push(`/decks/${deck.deckId}?created=1`);
      } catch (error) {
        console.error(error);
        toast.error("Could not complete onboarding, please try again");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-3xl border border-neutral-900 bg-neutral-900/40 p-10"
    >
      <header>
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">
          Onboarding
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Let’s build your first deck
        </h1>
        <p className="mt-3 text-neutral-400">
          A guided flow to get you ready in under a minute.
        </p>
      </header>

      <ol className="flex items-center gap-3 text-sm text-neutral-500">
        {steps.map((label, idx) => (
          <li
            key={label}
            className={`flex-1 rounded-full border px-3 py-2 text-center ${
              idx <= step
                ? "border-emerald-400 text-emerald-400"
                : "border-neutral-800"
            }`}
          >
            {label}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <section className="space-y-4">
          <label className="block">
            <span className="text-sm text-neutral-400">Deck title</span>
            <input
              type="text"
              className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2 outline-none focus:border-emerald-400"
              value={state.title}
              onChange={(e) =>
                setState((s) => ({ ...s, title: e.target.value }))
              }
              placeholder="e.g. Machine Learning Fundamentals"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm text-neutral-400">Short description</span>
            <textarea
              className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2 outline-none focus:border-emerald-400"
              rows={3}
              value={state.description}
              onChange={(e) =>
                setState((s) => ({ ...s, description: e.target.value }))
              }
              placeholder="Optional context you’ll remember."
            />
          </label>
        </section>
      )}

      {step === 1 && (
        <section className="space-y-4">
          <label className="flex items-center gap-2 text-sm text-neutral-300">
            <input
              type="checkbox"
              checked={state.addCard}
              onChange={(e) =>
                setState((s) => ({ ...s, addCard: e.target.checked }))
              }
              className="h-4 w-4 rounded border-neutral-700 bg-neutral-950"
            />
            Add a first example card
          </label>

          {state.addCard && (
            <>
              <label className="block">
                <span className="text-sm text-neutral-400">Question</span>
                <textarea
                  className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2 outline-none focus:border-emerald-400"
                  rows={3}
                  value={state.question}
                  onChange={(e) =>
                    setState((s) => ({ ...s, question: e.target.value }))
                  }
                  placeholder="What is the bias–variance trade-off?"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm text-neutral-400">Answer</span>
                <textarea
                  className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2 outline-none focus:border-emerald-400"
                  rows={3}
                  value={state.answer}
                  onChange={(e) =>
                    setState((s) => ({ ...s, answer: e.target.value }))
                  }
                  placeholder="Briefly explain the relationship between model complexity and generalization."
                  required
                />
              </label>
            </>
          )}
        </section>
      )}

      {step === 2 && (
        <section className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-950/40 p-6">
          <div>
            <p className="text-sm text-neutral-500">Deck</p>
            <p className="mt-1 text-lg font-semibold">{state.title}</p>
            {state.description && (
              <p className="text-sm text-neutral-400">{state.description}</p>
            )}
          </div>
          {state.addCard && (
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 text-sm">
              <p className="text-neutral-500">First card</p>
              <p className="mt-2 font-semibold text-white">{state.question}</p>
              <p className="mt-2 text-neutral-300">{state.answer}</p>
            </div>
          )}
        </section>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-lg border border-neutral-800 px-5 py-2 font-semibold text-white transition hover:border-emerald-500"
          onClick={prev}
          disabled={step === 0 || isPending}
        >
          Back
        </button>

        {step < steps.length - 1 ? (
          <button
            type="button"
            className="rounded-lg bg-emerald-500 px-5 py-2 font-semibold text-neutral-950 transition hover:bg-emerald-400 disabled:opacity-50"
            onClick={next}
            disabled={(step === 0 && !state.title.trim()) || isPending}
          >
            Continue
          </button>
        ) : (
          <button
            type="submit"
            className="rounded-lg bg-emerald-500 px-5 py-2 font-semibold text-neutral-950 transition hover:bg-emerald-400 disabled:opacity-50"
            disabled={!canCreate || isPending}
          >
            {isPending ? "Creating…" : "Create deck"}
          </button>
        )}
      </div>
    </form>
  );
}

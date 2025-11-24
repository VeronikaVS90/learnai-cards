"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Use at least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setServerError(payload.error ?? "Unable to register");
      return;
    }

    router.push("/onboarding");
    router.refresh();
  });

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <div>
        <label className="text-sm font-medium text-neutral-300" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          className="mt-2 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2 text-white outline-none transition focus:border-emerald-500"
          {...register("name")}
        />
        {errors.name ? (
          <p className="mt-1 text-sm text-rose-400">{errors.name.message}</p>
        ) : null}
      </div>

      <div>
        <label className="text-sm font-medium text-neutral-300" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="mt-2 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2 text-white outline-none transition focus:border-emerald-500"
          {...register("email")}
        />
        {errors.email ? (
          <p className="mt-1 text-sm text-rose-400">{errors.email.message}</p>
        ) : null}
      </div>

      <div>
        <label
          className="text-sm font-medium text-neutral-300"
          htmlFor="password"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          className="mt-2 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2 text-white outline-none transition focus:border-emerald-500"
          {...register("password")}
        />
        {errors.password ? (
          <p className="mt-1 text-sm text-rose-400">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      {serverError ? (
        <div className="rounded-lg border border-rose-400/40 bg-rose-500/10 px-4 py-2 text-sm text-rose-300">
          {serverError}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-neutral-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}

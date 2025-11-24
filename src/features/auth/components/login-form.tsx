"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setServerError(payload.error ?? "Unable to log in");
      return;
    }

    const redirectTo = searchParams.get("redirectTo") ?? "/";
    router.push(redirectTo);
    router.refresh();
  });

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
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
          autoComplete="current-password"
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
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

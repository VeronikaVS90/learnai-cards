import { PropsWithChildren } from "react";

type AuthShellProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  footer?: React.ReactNode;
}>;

export function AuthShell({
  title,
  subtitle,
  footer,
  children,
}: AuthShellProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-16 text-white">
      <div className="w-full max-w-md rounded-2xl bg-neutral-900 p-8 shadow-2xl shadow-neutral-900/40">
        <div className="mb-8 space-y-2 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">
            LearnAI Cards
          </p>
          <h1 className="text-2xl font-semibold">{title}</h1>
          {subtitle ? (
            <p className="text-sm text-neutral-300">{subtitle}</p>
          ) : null}
        </div>
        {children}
        {footer ? (
          <div className="mt-6 text-sm text-neutral-400">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}

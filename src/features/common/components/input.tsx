import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, id, className = "", ...props }: InputProps) {
  return <div>
    <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">{label}</label>
    <input id={id} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
      className={`w-full rounded-lg border border-zinc-300 bg-transparent px-4 py-3 outline-none focus:border-accent dark:border-zinc-600 ${className}`}
      {...props} />
    {error && <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-rose-600">{error}</p>}
    {!error && hint && <p id={`${id}-hint`} className="mt-1 text-xs text-muted">{hint}</p>}
  </div>;
}

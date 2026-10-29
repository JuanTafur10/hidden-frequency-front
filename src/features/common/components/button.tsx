import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

export function Button({ variant = "primary", className = "", type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-accent text-white hover:bg-rose-700",
    secondary: "border border-zinc-300 hover:border-accent dark:border-zinc-600",
    danger: "bg-rose-700 text-white hover:bg-rose-800"
  };
  return <button type={type} className={`rounded-lg px-5 py-3 font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`} {...props} />;
}

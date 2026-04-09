import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = "", id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm text-surface-400">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`bg-surface-800 border border-surface-700 rounded-lg px-3 py-2 text-sm text-surface-100
          placeholder:text-surface-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
          transition-colors ${className}`}
        {...props}
      />
    </div>
  );
}

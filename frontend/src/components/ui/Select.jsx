import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { classNames } from "../../utils/helpers";

const Select = forwardRef(function Select(
  { label, error, hint, options = [], placeholder, className = "", id, ...props },
  ref
) {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-slate-300"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={inputId}
          className={classNames(
            "w-full appearance-none rounded-xl border bg-slate-900/60 px-3.5 py-2.5 pr-10 text-sm text-slate-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500/60",
            error
              ? "border-red-500/70 focus:ring-red-500/50"
              : "border-slate-700 hover:border-slate-600",
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => {
            const value = typeof opt === "string" ? opt : opt.value;
            const optLabel = typeof opt === "string" ? opt : opt.label;
            return (
              <option key={value} value={value}>
                {optLabel}
              </option>
            );
          })}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
          aria-hidden="true"
        />
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-red-400">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
});

export default Select;

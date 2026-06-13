import { forwardRef } from "react";
import { classNames } from "../../utils/helpers";

const Input = forwardRef(function Input(
  { label, error, hint, icon: Icon, className = "", id, ...props },
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
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
            aria-hidden="true"
          />
        )}
        <input
          ref={ref}
          id={inputId}
          className={classNames(
            "w-full rounded-xl border bg-slate-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500/60",
            Icon && "pl-10",
            error
              ? "border-red-500/70 focus:ring-red-500/50"
              : "border-slate-700 hover:border-slate-600",
            className
          )}
          aria-invalid={Boolean(error)}
          {...props}
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

export default Input;

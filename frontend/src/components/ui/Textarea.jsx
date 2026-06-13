import { forwardRef } from "react";
import { classNames } from "../../utils/helpers";

const Textarea = forwardRef(function Textarea(
  { label, error, hint, className = "", id, rows = 4, ...props },
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
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={classNames(
          "w-full resize-y rounded-xl border bg-slate-900/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500/60",
          error
            ? "border-red-500/70 focus:ring-red-500/50"
            : "border-slate-700 hover:border-slate-600",
          className
        )}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error ? (
        <p className="mt-1.5 text-xs text-red-400">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
});

export default Textarea;

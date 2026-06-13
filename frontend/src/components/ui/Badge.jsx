import { classNames } from "../../utils/helpers";

const VARIANTS = {
  default: "bg-slate-800 text-slate-300 border-slate-700",
  indigo: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  amber: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  red: "bg-red-500/15 text-red-300 border-red-500/30",
  slate: "bg-slate-800/80 text-slate-400 border-slate-700",
};

export default function Badge({
  variant = "default",
  className = "",
  icon: Icon,
  children,
}) {
  return (
    <span
      className={classNames(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        VARIANTS[variant] || VARIANTS.default,
        className
      )}
    >
      {Icon && <Icon className="h-3 w-3" aria-hidden="true" />}
      {children}
    </span>
  );
}

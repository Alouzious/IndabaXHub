import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { classNames } from "../../utils/helpers";

const VARIANTS = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 shadow-sm shadow-indigo-900/40",
  secondary:
    "bg-slate-800 text-slate-100 hover:bg-slate-700 active:bg-slate-800 border border-slate-700",
  ghost:
    "bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white",
  success:
    "bg-emerald-600 text-white hover:bg-emerald-500 active:bg-emerald-700",
  danger:
    "bg-red-600 text-white hover:bg-red-500 active:bg-red-700",
  outline:
    "bg-transparent text-indigo-300 border border-indigo-500/60 hover:bg-indigo-500/10",
};

const SIZES = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-7 text-base gap-2.5",
  icon: "h-10 w-10 justify-center",
};

export default function Button({
  as,
  to,
  href,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  children,
  ...props
}) {
  const classes = classNames(
    "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed select-none",
    VARIANTS[variant],
    SIZES[size],
    className
  );

  const content = (
    <>
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }

  const Component = as || "button";
  return (
    <Component
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </Component>
  );
}

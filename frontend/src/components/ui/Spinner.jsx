import { Loader2 } from "lucide-react";
import { classNames } from "../../utils/helpers";

export default function Spinner({ size = "md", className = "", label }) {
  const sizes = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-10 w-10" };
  return (
    <div
      className={classNames("flex flex-col items-center gap-3", className)}
      role="status"
      aria-live="polite"
    >
      <Loader2
        className={classNames("animate-spin text-indigo-400", sizes[size])}
        aria-hidden="true"
      />
      {label && <span className="text-sm text-slate-400">{label}</span>}
      <span className="sr-only">Loading</span>
    </div>
  );
}

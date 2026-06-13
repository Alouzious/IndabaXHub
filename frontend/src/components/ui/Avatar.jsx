import { getInitials } from "../../utils/helpers";

const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

export default function Avatar({ name = "User", size = "md", className = "" }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 font-semibold text-white ${SIZES[size]} ${className}`}
      aria-hidden="true"
    >
      {getInitials(name) || "U"}
    </span>
  );
}

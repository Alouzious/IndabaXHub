import { Link } from "react-router-dom";
import { Boxes } from "lucide-react";

export default function Logo({ to = "/", className = "" }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2 font-bold tracking-tight text-white ${className}`}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-500 text-white shadow-lg shadow-indigo-900/40">
        <Boxes className="h-5 w-5" />
      </span>
      <span className="text-lg">
        Indaba<span className="text-indigo-400">X</span>Hub
      </span>
    </Link>
  );
}

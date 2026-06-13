import { TrendingUp } from "lucide-react";
import { formatScore } from "../../utils/helpers";

export default function ScoreCard({ label, score, metric, accent = "indigo" }) {
  const accents = {
    indigo: "text-indigo-400 bg-indigo-500/10",
    emerald: "text-emerald-400 bg-emerald-500/10",
  };
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">{label}</span>
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${accents[accent]}`}
        >
          <TrendingUp className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-2 font-mono text-3xl font-bold text-white">
        {formatScore(score, metric)}
      </p>
      {metric && (
        <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
          {metric}
        </p>
      )}
    </div>
  );
}

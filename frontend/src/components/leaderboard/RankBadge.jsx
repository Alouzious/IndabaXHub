import { Medal } from "lucide-react";
import { classNames } from "../../utils/helpers";

export default function RankBadge({ rank }) {
  const styles = {
    1: "bg-amber-400/15 text-amber-300 border-amber-400/30",
    2: "bg-slate-300/15 text-slate-200 border-slate-300/30",
    3: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  };

  if (rank <= 3) {
    return (
      <span
        className={classNames(
          "inline-flex h-7 w-7 items-center justify-center rounded-full border",
          styles[rank]
        )}
        aria-label={`Rank ${rank}`}
      >
        <Medal className="h-4 w-4" />
      </span>
    );
  }

  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-400">
      {rank}
    </span>
  );
}

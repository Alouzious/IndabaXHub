import { ArrowUpDown } from "lucide-react";
import Avatar from "../ui/Avatar";
import RankBadge from "./RankBadge";
import EmptyState from "../ui/EmptyState";
import { formatScore, timeAgo, classNames } from "../../utils/helpers";

export default function LeaderboardTable({ entries = [], metric, currentUserId }) {
  if (!entries.length) {
    return (
      <EmptyState
        icon={ArrowUpDown}
        title="No rankings yet"
        description="Be the first to submit and claim the top spot on the leaderboard."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800">
      <table className="min-w-full divide-y divide-slate-800 text-sm">
        <thead className="bg-slate-900/80">
          <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
            <th className="px-4 py-3 font-medium">Rank</th>
            <th className="px-4 py-3 font-medium">Member</th>
            <th className="px-4 py-3 font-medium">Score</th>
            <th className="hidden px-4 py-3 font-medium sm:table-cell">
              Submissions
            </th>
            <th className="hidden px-4 py-3 font-medium md:table-cell">
              Last updated
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 bg-slate-900/30">
          {entries.map((entry, idx) => {
            const rank = entry.rank ?? idx + 1;
            const isMe = currentUserId && entry.user_id === currentUserId;
            return (
              <tr
                key={entry.user_id ?? entry.username ?? idx}
                className={classNames(
                  "transition-colors hover:bg-slate-800/40",
                  isMe && "bg-indigo-500/5"
                )}
              >
                <td className="px-4 py-3">
                  <RankBadge rank={rank} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={entry.username} size="sm" />
                    <div>
                      <span className="font-medium text-slate-100">
                        {entry.username}
                      </span>
                      {isMe && (
                        <span className="ml-2 text-xs text-indigo-400">
                          (you)
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono font-semibold text-emerald-300">
                  {formatScore(entry.score, metric)}
                </td>
                <td className="hidden px-4 py-3 text-slate-400 sm:table-cell">
                  {entry.submissions ?? entry.submission_count ?? "—"}
                </td>
                <td className="hidden px-4 py-3 text-slate-400 md:table-cell">
                  {timeAgo(entry.last_updated ?? entry.submitted_at)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

import { Link } from "react-router-dom";
import { Trophy, Users, Calendar, Target } from "lucide-react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import { EVALUATION_METRICS } from "../../utils/constants";
import { isDeadlinePassed, timeUntil, formatNumber } from "../../utils/helpers";

export default function CompetitionCard({ competition }) {
  const closed = isDeadlinePassed(competition.deadline) || !competition.is_active;
  const metric = EVALUATION_METRICS.find(
    (m) => m.value === competition.metric
  );

  return (
    <Card
      hover
      as={Link}
      to={`/competitions/${competition.id}`}
      className="group flex flex-col"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
          <Trophy className="h-5 w-5" />
        </div>
        <Badge variant={closed ? "slate" : "emerald"}>
          {closed ? "Closed" : "Active"}
        </Badge>
      </div>

      <h3 className="mt-3 font-semibold text-white transition-colors group-hover:text-indigo-300">
        {competition.title}
      </h3>
      <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-slate-400">
        {competition.description || "No description provided."}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-800 pt-3 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <Target className="h-3.5 w-3.5 text-indigo-400" />
          {metric?.label || competition.metric}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-indigo-400" />
          {formatNumber(competition.participants ?? 0)} players
        </span>
        <span className="col-span-2 inline-flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-indigo-400" />
          {closed ? "Ended" : timeUntil(competition.deadline)}
        </span>
      </div>
    </Card>
  );
}

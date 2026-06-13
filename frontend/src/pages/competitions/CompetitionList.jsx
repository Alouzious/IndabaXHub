import { useMemo, useState } from "react";
import { Trophy } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import { SkeletonCard } from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import CompetitionCard from "../../components/competitions/CompetitionCard";
import { useCompetitions } from "../../hooks/useCompetitions";
import { isDeadlinePassed, classNames } from "../../utils/helpers";

const TABS = [
  { key: "active", label: "Active" },
  { key: "past", label: "Past" },
];

export default function CompetitionList() {
  const [tab, setTab] = useState("active");
  const { data, isLoading, isError, refetch } = useCompetitions();

  const competitions = useMemo(() => {
    if (!data) return [];
    return Array.isArray(data) ? data : data.items ?? [];
  }, [data]);

  const filtered = useMemo(() => {
    return competitions.filter((c) => {
      const closed = isDeadlinePassed(c.deadline) || !c.is_active;
      return tab === "active" ? !closed : closed;
    });
  }, [competitions, tab]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        icon={Trophy}
        title="Competitions"
        description="Benchmark your models against the community and climb the leaderboard."
      />

      <div className="mt-6 inline-flex rounded-xl border border-slate-800 bg-slate-900/60 p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={classNames(
              "rounded-lg px-4 py-1.5 text-sm font-medium transition-colors",
              tab === t.key
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:text-white"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : isError ? (
          <ErrorState
            message="We couldn't load competitions. Check that the API is running."
            onRetry={refetch}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Trophy}
            title={`No ${tab} competitions`}
            description={
              tab === "active"
                ? "There are no active competitions right now. Check back soon!"
                : "No competitions have ended yet."
            }
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((competition) => (
              <CompetitionCard key={competition.id} competition={competition} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

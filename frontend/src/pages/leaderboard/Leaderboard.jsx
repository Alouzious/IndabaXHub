import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Award, BarChart3 } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import Card from "../../components/ui/Card";
import Select from "../../components/ui/Select";
import Spinner from "../../components/ui/Spinner";
import ErrorState from "../../components/ui/ErrorState";
import LeaderboardTable from "../../components/leaderboard/LeaderboardTable";
import leaderboardService from "../../services/leaderboardService";
import { useCompetitions } from "../../hooks/useCompetitions";
import { useAuth } from "../../hooks/useAuth";

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs shadow-xl">
      <p className="font-medium text-white">{item.username}</p>
      <p className="text-emerald-300">Score: {item.score.toFixed(4)}</p>
    </div>
  );
}

export default function Leaderboard() {
  const { user } = useAuth();
  const [competitionId, setCompetitionId] = useState("");
  const { data: competitionsData } = useCompetitions();

  const competitions = useMemo(() => {
    if (!competitionsData) return [];
    return Array.isArray(competitionsData)
      ? competitionsData
      : competitionsData.items ?? [];
  }, [competitionsData]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["leaderboard", "view", competitionId || "global"],
    queryFn: () =>
      competitionId
        ? leaderboardService.getByCompetition(competitionId)
        : leaderboardService.getGlobal(),
  });

  const entries = useMemo(() => {
    if (!data) return [];
    return Array.isArray(data) ? data : data.entries ?? [];
  }, [data]);

  const chartData = useMemo(
    () =>
      entries
        .slice(0, 10)
        .map((e, i) => ({
          username: e.username || `User ${i + 1}`,
          score: Number(e.score) || 0,
        })),
    [entries]
  );

  const competitionOptions = [
    { value: "", label: "Global ranking" },
    ...competitions.map((c) => ({ value: String(c.id), label: c.title })),
  ];

  const selectedMetric = competitionId
    ? competitions.find((c) => String(c.id) === competitionId)?.metric
    : undefined;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        icon={Award}
        title="Leaderboard"
        description="See who's leading across the IndabaXHub community."
        actions={
          <div className="w-56">
            <Select
              options={competitionOptions}
              value={competitionId}
              onChange={(e) => setCompetitionId(e.target.value)}
              aria-label="Filter by competition"
            />
          </div>
        }
      />

      <div className="mt-6 space-y-8">
        {isLoading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <Spinner size="lg" label="Loading rankings…" />
          </div>
        ) : isError ? (
          <ErrorState
            message="We couldn't load the leaderboard. Check that the API is running."
            onRetry={refetch}
          />
        ) : (
          <>
            {chartData.length > 0 && (
              <Card>
                <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  <BarChart3 className="h-4 w-4" />
                  Top {chartData.length} scores
                </h2>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                    >
                      <XAxis
                        dataKey="username"
                        tick={{ fill: "#94a3b8", fontSize: 11 }}
                        tickLine={false}
                        axisLine={{ stroke: "#1e293b" }}
                        interval={0}
                        angle={-25}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis
                        tick={{ fill: "#94a3b8", fontSize: 11 }}
                        tickLine={false}
                        axisLine={{ stroke: "#1e293b" }}
                      />
                      <Tooltip
                        content={<ChartTooltip />}
                        cursor={{ fill: "rgba(99,102,241,0.08)" }}
                      />
                      <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                        {chartData.map((_, idx) => (
                          <Cell
                            key={idx}
                            fill={idx === 0 ? "#10b981" : "#6366f1"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}

            <LeaderboardTable
              entries={entries}
              metric={selectedMetric}
              currentUserId={user?.id}
            />
          </>
        )}
      </div>
    </div>
  );
}

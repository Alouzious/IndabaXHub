import { useParams, Link } from "react-router-dom";
import {
  Trophy,
  Target,
  Calendar,
  Users,
  ArrowLeft,
  ListChecks,
  Lock,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import ErrorState from "../../components/ui/ErrorState";
import SubmissionForm from "../../components/competitions/SubmissionForm";
import LeaderboardTable from "../../components/leaderboard/LeaderboardTable";
import { Skeleton } from "../../components/ui/Skeleton";
import {
  useCompetition,
  useCompetitionLeaderboard,
} from "../../hooks/useCompetitions";
import { useAuth } from "../../hooks/useAuth";
import { EVALUATION_METRICS } from "../../utils/constants";
import {
  formatDateTime,
  isDeadlinePassed,
  timeUntil,
  formatNumber,
} from "../../utils/helpers";

export default function CompetitionDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { data: competition, isLoading, isError, refetch } = useCompetition(id);
  const {
    data: leaderboard,
    isLoading: lbLoading,
    refetch: refetchLeaderboard,
  } = useCompetitionLeaderboard(id);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" label="Loading competition…" />
      </div>
    );
  }

  if (isError || !competition) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <ErrorState
          title="Competition unavailable"
          message="This competition could not be found or failed to load."
          onRetry={refetch}
        />
      </div>
    );
  }

  const closed =
    isDeadlinePassed(competition.deadline) || !competition.is_active;
  const metric = EVALUATION_METRICS.find((m) => m.value === competition.metric);
  const entries = Array.isArray(leaderboard)
    ? leaderboard
    : leaderboard?.entries ?? [];

  const rules =
    competition.rules ||
    "Submissions are scored automatically against a hidden test set. Each member may submit multiple times; only your best score counts toward the ranking. Be respectful and do not attempt to reverse-engineer the ground truth.";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/competitions"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        All competitions
      </Link>

      <div className="flex flex-col gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
            <Trophy className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              {competition.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant={closed ? "slate" : "emerald"}>
                {closed ? "Closed" : "Active"}
              </Badge>
              <Badge variant="indigo" icon={Target}>
                {metric?.label || competition.metric}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <Card>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Overview
            </h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-300">
              {competition.description || "No description provided."}
            </p>
          </Card>

          <Card>
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
              <ListChecks className="h-4 w-4" />
              Rules & evaluation
            </h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-300">
              {rules}
            </p>
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-sm">
              <span className="text-slate-500">Evaluation metric: </span>
              <span className="font-medium text-indigo-300">
                {metric?.label || competition.metric}
              </span>
              {metric && (
                <span className="text-slate-500">
                  {" "}
                  ({metric.higherIsBetter ? "higher is better" : "lower is better"})
                </span>
              )}
            </div>
          </Card>

          {/* Leaderboard */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Live leaderboard
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => refetchLeaderboard()}
              >
                Refresh
              </Button>
            </div>
            {lbLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <LeaderboardTable
                entries={entries}
                metric={competition.metric}
                currentUserId={user?.id}
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="inline-flex items-center gap-2 text-slate-500">
                  <Calendar className="h-4 w-4" />
                  Deadline
                </dt>
                <dd className="font-medium text-slate-200">
                  {formatDateTime(competition.deadline)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="inline-flex items-center gap-2 text-slate-500">
                  <Calendar className="h-4 w-4" />
                  Status
                </dt>
                <dd className="font-medium text-slate-200">
                  {closed ? "Ended" : timeUntil(competition.deadline)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="inline-flex items-center gap-2 text-slate-500">
                  <Users className="h-4 w-4" />
                  Participants
                </dt>
                <dd className="font-medium text-slate-200">
                  {formatNumber(competition.participants ?? entries.length)}
                </dd>
              </div>
            </dl>
          </Card>

          <Card>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Submit predictions
            </h3>
            {!isAuthenticated ? (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-5 text-center">
                <Lock className="h-6 w-6 text-slate-500" />
                <p className="text-sm text-slate-400">
                  Sign in to submit your predictions.
                </p>
                <Button to="/login" size="sm" className="w-full">
                  Sign in
                </Button>
              </div>
            ) : (
              <SubmissionForm
                competitionId={id}
                disabled={closed}
                onSubmitted={() => refetchLeaderboard()}
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

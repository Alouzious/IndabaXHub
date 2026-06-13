import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Database,
  Send,
  Trophy,
  Award,
  Upload,
  Plus,
  Activity,
  ArrowRight,
  Menu,
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import { Skeleton } from "../components/ui/Skeleton";
import { useMe, useAuth } from "../hooks/useAuth";
import { useMyDatasets } from "../hooks/useDatasets";
import { useMySubmissions, useCompetitions } from "../hooks/useCompetitions";
import {
  formatNumber,
  timeAgo,
  isDeadlinePassed,
  formatScore,
  classNames,
} from "../utils/helpers";

const SIDEBAR_LINKS = [
  { label: "Overview", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Datasets", icon: Database, to: "/datasets" },
  { label: "Competitions", icon: Trophy, to: "/competitions" },
  { label: "Leaderboard", icon: Award, to: "/leaderboard" },
];

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <Card hover className="flex items-center gap-4">
      <div
        className={classNames(
          "flex h-12 w-12 items-center justify-center rounded-xl",
          accent
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-slate-400">{label}</p>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  useMe();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: datasetsData, isLoading: dsLoading } = useMyDatasets();
  const { data: submissionsData, isLoading: subLoading } = useMySubmissions();
  const { data: competitionsData } = useCompetitions();

  const myDatasets = useMemo(() => {
    if (!datasetsData) return [];
    return Array.isArray(datasetsData) ? datasetsData : datasetsData.items ?? [];
  }, [datasetsData]);

  const mySubmissions = useMemo(() => {
    if (!submissionsData) return [];
    return Array.isArray(submissionsData)
      ? submissionsData
      : submissionsData.items ?? [];
  }, [submissionsData]);

  const activeCompetitions = useMemo(() => {
    const list = Array.isArray(competitionsData)
      ? competitionsData
      : competitionsData?.items ?? [];
    return list.filter((c) => !isDeadlinePassed(c.deadline) && c.is_active);
  }, [competitionsData]);

  const bestRank = useMemo(() => {
    const ranks = mySubmissions
      .map((s) => s.rank)
      .filter((r) => typeof r === "number");
    return ranks.length ? Math.min(...ranks) : null;
  }, [mySubmissions]);

  const activity = useMemo(() => {
    const items = [
      ...myDatasets.map((d) => ({
        id: `ds-${d.id}`,
        type: "dataset",
        title: `Uploaded dataset "${d.name}"`,
        time: d.created_at,
        icon: Database,
        to: `/datasets/${d.id}`,
      })),
      ...mySubmissions.map((s) => ({
        id: `sub-${s.id}`,
        type: "submission",
        title: `Submitted to ${s.competition?.title || `competition #${s.competition_id}`}`,
        meta:
          s.score !== null && s.score !== undefined
            ? `Score ${formatScore(s.score, s.metric)}`
            : null,
        time: s.submitted_at,
        icon: Send,
        to: `/competitions/${s.competition_id}`,
      })),
    ];
    return items
      .filter((i) => i.time)
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 8);
  }, [myDatasets, mySubmissions]);

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Sidebar */}
      <aside
        className={classNames(
          "fixed inset-y-0 left-0 z-30 w-64 transform border-r border-slate-800 bg-slate-950 p-4 pt-20 transition-transform lg:static lg:z-0 lg:w-56 lg:translate-x-0 lg:border-0 lg:bg-transparent lg:p-0 lg:pt-2",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="sticky top-24 space-y-1">
          {SIDEBAR_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800/60 hover:text-white"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
          <div className="mt-4 space-y-2 border-t border-slate-800 pt-4">
            <Button to="/datasets/upload" size="sm" className="w-full">
              <Plus className="h-4 w-4" />
              Upload dataset
            </Button>
          </div>
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main */}
      <div className="min-w-0 flex-1">
        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            className="rounded-lg border border-slate-800 p-2 text-slate-400 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {user?.username || "builder"}
            </h1>
            <p className="text-sm text-slate-400">
              Here's what's happening with your work.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Database}
            label="My datasets"
            value={dsLoading ? "—" : formatNumber(myDatasets.length)}
            accent="bg-indigo-500/15 text-indigo-400"
          />
          <StatCard
            icon={Send}
            label="My submissions"
            value={subLoading ? "—" : formatNumber(mySubmissions.length)}
            accent="bg-emerald-500/15 text-emerald-400"
          />
          <StatCard
            icon={Trophy}
            label="Active competitions"
            value={formatNumber(activeCompetitions.length)}
            accent="bg-amber-500/15 text-amber-400"
          />
          <StatCard
            icon={Award}
            label="Best rank"
            value={bestRank ? `#${bestRank}` : "—"}
            accent="bg-purple-500/15 text-purple-400"
          />
        </div>

        {/* Quick actions */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Card hover className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-white">Upload a dataset</p>
                <p className="text-xs text-slate-400">
                  Share your data with the community
                </p>
              </div>
            </div>
            <Button to="/datasets/upload" size="sm" variant="secondary">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Card>
          <Card hover className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-white">Join a competition</p>
                <p className="text-xs text-slate-400">
                  {activeCompetitions.length} active right now
                </p>
              </div>
            </div>
            <Button to="/competitions" size="sm" variant="secondary">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Card>
        </div>

        {/* Recent activity */}
        <div className="mt-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <Activity className="h-5 w-5 text-indigo-400" />
            Recent activity
          </h2>
          {dsLoading || subLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : activity.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="No activity yet"
              description="Upload a dataset or submit to a competition to see your activity here."
              action={
                <Button to="/datasets/upload">
                  <Plus className="h-4 w-4" />
                  Upload your first dataset
                </Button>
              }
            />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-800 divide-y divide-slate-800">
              {activity.map((item) => (
                <Link
                  key={item.id}
                  to={item.to}
                  className="flex items-center gap-4 bg-slate-900/40 px-4 py-3 transition-colors hover:bg-slate-800/40"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-indigo-400">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-slate-200">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500">{timeAgo(item.time)}</p>
                  </div>
                  {item.meta && <Badge variant="emerald">{item.meta}</Badge>}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

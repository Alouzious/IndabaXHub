import { useQuery } from "@tanstack/react-query";
import {
  Database,
  Trophy,
  Upload,
  BrainCircuit,
  Send,
  ArrowRight,
  Users,
  FileStack,
  Layers,
  Download,
  Code2,
  Globe,
  ShieldCheck,
} from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import CodeBlock from "../components/ui/CodeBlock";
import api from "../services/api";
import { formatNumber } from "../utils/helpers";

const SDK_SNIPPET = `pip install indabaxhub

from indabaxhub import load_dataset

# Stream a dataset straight into your notebook
data = load_dataset("uganda-crop-disease")

print(data.shape)
# -> (12480, 17)`;

const FEATURES = [
  {
    icon: Database,
    title: "Open dataset hub",
    description:
      "Discover, version, and download curated African datasets — agriculture, health, language, and more.",
  },
  {
    icon: Trophy,
    title: "Live competitions",
    description:
      "Run model-evaluation challenges with automated scoring and real-time leaderboards.",
  },
  {
    icon: Code2,
    title: "Python SDK",
    description:
      "Load any dataset in one line, directly from Google Colab or Jupyter. No manual downloads.",
  },
  {
    icon: Globe,
    title: "Built for Africa",
    description:
      "Purpose-built for university AI clubs, researchers, and students across the continent.",
  },
];

const STEPS = [
  {
    icon: Upload,
    title: "Upload",
    description:
      "Publish your dataset with rich metadata, tags, and a license — or browse thousands already shared.",
  },
  {
    icon: BrainCircuit,
    title: "Train",
    description:
      "Pull data into your environment with the SDK and build your model with the tools you love.",
  },
  {
    icon: Send,
    title: "Submit",
    description:
      "Submit predictions to a competition and watch your rank update live on the leaderboard.",
  },
];

function StatItem({ icon: Icon, value, label }) {
  return (
    <div className="flex flex-col items-center gap-1 px-4 py-2 text-center">
      <Icon className="mb-1 h-5 w-5 text-indigo-400" />
      <span className="text-2xl font-bold text-white sm:text-3xl">{value}</span>
      <span className="text-xs uppercase tracking-wider text-slate-500">
        {label}
      </span>
    </div>
  );
}

export default function Home() {
  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const { data } = await api.get("/stats");
      return data;
    },
    retry: 0,
    staleTime: 1000 * 60,
  });

  const display = {
    datasets: stats?.datasets ?? 0,
    users: stats?.users ?? 0,
    submissions: stats?.submissions ?? 0,
    competitions: stats?.competitions ?? 0,
  };

  return (
    <div className="bg-slate-950">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <div className="absolute left-1/2 top-[-10rem] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute right-[-8rem] top-40 h-80 w-80 rounded-full bg-emerald-600/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 text-center sm:px-6 lg:px-8 lg:pt-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-4 py-1.5 text-xs font-medium text-slate-300 animate-fade-in">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            IndabaX AI Club Kabale · Kabale University, Uganda
          </span>

          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl animate-fade-up">
            The African AI community's home for{" "}
            <span className="text-gradient">datasets & competitions</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 animate-fade-up">
            Upload and discover datasets, run model-evaluation competitions, and
            climb the leaderboard. Pull data into Colab in a single line of
            Python — purpose-built for researchers and students across Africa.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button to="/datasets" size="lg">
              Explore datasets
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button to="/register" size="lg" variant="secondary">
              Get started
            </Button>
          </div>

          {/* Stats bar */}
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-2 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:grid-cols-4">
            <StatItem
              icon={FileStack}
              value={formatNumber(display.datasets)}
              label="Datasets"
            />
            <StatItem
              icon={Users}
              value={formatNumber(display.users)}
              label="Members"
            />
            <StatItem
              icon={Send}
              value={formatNumber(display.submissions)}
              label="Submissions"
            />
            <StatItem
              icon={Trophy}
              value={formatNumber(display.competitions)}
              label="Competitions"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white">
            Everything you need to do AI research
          </h2>
          <p className="mt-3 text-slate-400">
            A complete platform for sharing data, benchmarking models, and
            collaborating with the community.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <Card key={feature.title} hover className="text-left">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-400">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* SDK quickstart */}
      <section className="border-y border-slate-800 bg-slate-900/30">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
              <Code2 className="h-3.5 w-3.5" />
              Python SDK
            </span>
            <h2 className="mt-4 text-3xl font-bold text-white">
              From dataset to notebook in seconds
            </h2>
            <p className="mt-3 text-slate-400">
              No more manual downloads or broken links. Install the SDK and
              stream any dataset straight into Google Colab, Jupyter, or your
              training pipeline.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <Download className="h-4 w-4 text-emerald-400" />
                One-line dataset loading
              </li>
              <li className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-400" />
                Automatic caching and versioning
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Token-authenticated, secure access
              </li>
            </ul>
          </div>
          <CodeBlock code={SDK_SNIPPET} title="quickstart.py" />
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white">How it works</h2>
          <p className="mt-3 text-slate-400">
            Three simple steps from raw data to a ranked submission.
          </p>
        </div>
        <div className="relative mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, idx) => (
            <Card key={step.title} className="relative text-center">
              <span className="absolute right-4 top-4 font-mono text-sm text-slate-700">
                0{idx + 1}
              </span>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 text-indigo-300">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-slate-400">{step.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-indigo-600/20 via-slate-900 to-emerald-600/10 px-6 py-14 text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to build with IndabaXHub?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">
            Join a growing community of African AI builders. Publish your first
            dataset or jump into a live competition today.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button to="/register" size="lg">
              Create free account
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button to="/competitions" size="lg" variant="secondary">
              Browse competitions
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

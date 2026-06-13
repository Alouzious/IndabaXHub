import { useEffect, useState } from "react";
import {
  Rocket,
  Upload,
  Download,
  Trophy,
  Send,
  Code2,
  BookOpen,
} from "lucide-react";
import CodeBlock from "../components/ui/CodeBlock";

const SECTIONS = [
  {
    id: "getting-started",
    label: "Getting Started",
    icon: Rocket,
    title: "Getting Started",
    body: (
      <>
        <p>
          IndabaXHub is the African AI community's hub for datasets and model
          evaluation competitions. This guide walks you through everything you
          need — from installing the SDK to submitting your first prediction.
        </p>
        <p>
          Start by creating a free account, then generate an API token from your
          dashboard. The token authenticates the Python SDK so you can stream
          private and public datasets directly into your environment.
        </p>
        <CodeBlock
          title="install.sh"
          language="bash"
          code={`# Install the IndabaXHub Python SDK
pip install indabaxhub

# Authenticate (paste the token from your dashboard)
indabaxhub login`}
        />
      </>
    ),
  },
  {
    id: "uploading-datasets",
    label: "Uploading Datasets",
    icon: Upload,
    title: "Uploading Datasets",
    body: (
      <>
        <p>
          You can publish a dataset from the web UI or programmatically with the
          SDK. Every dataset needs a name, description, category, and license so
          the community knows how it can be used.
        </p>
        <CodeBlock
          title="upload.py"
          code={`from indabaxhub import Client

client = Client()  # reads token from ~/.indabaxhub

client.upload_dataset(
    name="Uganda Crop Disease",
    description="Labeled leaf images for crop disease detection.",
    category="Agriculture",
    license="CC BY 4.0",
    tags=["agriculture", "vision", "uganda"],
    path="./crop_disease.zip",
)`}
        />
        <p>
          Prefer the UI? Head to{" "}
          <span className="text-indigo-300">Datasets → Upload dataset</span>,
          drag in your file, and fill out the form.
        </p>
      </>
    ),
  },
  {
    id: "downloading-via-sdk",
    label: "Downloading via SDK",
    icon: Download,
    title: "Downloading via SDK",
    body: (
      <>
        <p>
          Load any dataset into Google Colab or Jupyter in a single line. The
          SDK streams the files, caches them locally, and returns a ready-to-use
          object.
        </p>
        <CodeBlock
          title="download.py"
          code={`from indabaxhub import load_dataset

# Load by its slug (shown on every dataset page)
data = load_dataset("uganda-crop-disease")

print(data.shape)
print(data.head())`}
        />
        <p>
          Datasets are cached under <code>~/.indabaxhub/cache</code>, so repeated
          loads are instant.
        </p>
      </>
    ),
  },
  {
    id: "running-competitions",
    label: "Running Competitions",
    icon: Trophy,
    title: "Running Competitions",
    body: (
      <>
        <p>
          Competitions let club organizers benchmark models against a hidden
          test set. Each competition defines an evaluation metric — accuracy, F1
          score, RMSE, or log loss — and a deadline.
        </p>
        <CodeBlock
          title="competition.py"
          code={`from indabaxhub import Client

client = Client()

comp = client.create_competition(
    title="Crop Disease Challenge 2026",
    description="Classify crop diseases from leaf images.",
    metric="f1_score",
    deadline="2026-09-30T23:59:00Z",
)

print("Competition ID:", comp.id)`}
        />
      </>
    ),
  },
  {
    id: "submitting-predictions",
    label: "Submitting Predictions",
    icon: Send,
    title: "Submitting Predictions",
    body: (
      <>
        <p>
          Submit a predictions file and IndabaXHub scores it automatically
          against the ground truth. Your best score is what appears on the
          leaderboard.
        </p>
        <CodeBlock
          title="submit.py"
          code={`from indabaxhub import Client

client = Client()

result = client.submit(
    competition_id=42,
    file="./predictions.csv",
)

print("Your score:", result.score)
print("Current rank:", result.rank)`}
        />
        <p>
          You can also submit from the competition page using the drag-and-drop
          uploader.
        </p>
      </>
    ),
  },
  {
    id: "api-reference",
    label: "API Reference",
    icon: Code2,
    title: "API Reference",
    body: (
      <>
        <p>
          The REST API is available at{" "}
          <code>http://localhost:8001/api</code>. All authenticated routes expect
          a <code>Authorization: Bearer &lt;token&gt;</code> header.
        </p>
        <CodeBlock
          title="endpoints"
          language="http"
          code={`POST   /api/auth/register        Create an account
POST   /api/auth/login           Obtain a JWT access token
GET    /api/auth/me              Get the current user

GET    /api/datasets             List datasets
POST   /api/datasets             Upload a dataset (multipart)
GET    /api/datasets/{id}        Get dataset detail
GET    /api/datasets/{id}/download  Get a presigned download URL

GET    /api/competitions         List competitions
GET    /api/competitions/{id}    Get competition detail

POST   /api/submissions          Submit predictions (multipart)
GET    /api/submissions/me       List your submissions

GET    /api/leaderboard          Global leaderboard
GET    /api/leaderboard/{id}     Competition leaderboard`}
        />
      </>
    ),
  },
];

function getInitialSection() {
  const hash =
    typeof window !== "undefined"
      ? window.location.hash.replace("#", "")
      : "";
  return SECTIONS.some((s) => s.id === hash) ? hash : SECTIONS[0].id;
}

export default function Docs() {
  const [active, setActive] = useState(getInitialSection);

  useEffect(() => {
    if (active !== SECTIONS[0].id) {
      document.getElementById(active)?.scrollIntoView({ behavior: "smooth" });
    }
    // Only run on mount to honor an incoming hash link.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNav = (id) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Documentation</h1>
          <p className="mt-1 text-sm text-slate-400">
            Everything you need to use IndabaXHub effectively.
          </p>
        </div>
      </div>

      <div className="mt-8 gap-10 lg:flex">
        {/* Sidebar */}
        <aside className="mb-8 lg:mb-0 lg:w-64 lg:shrink-0">
          <nav className="sticky top-24 space-y-1">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive = active === section.id;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => handleNav(section.id)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {section.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <div className="min-w-0 flex-1 space-y-16">
          {SECTIONS.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24"
            >
              <h2 className="text-2xl font-bold text-white">{section.title}</h2>
              <div className="mt-4 space-y-4 leading-relaxed text-slate-300 [&_code]:rounded [&_code]:bg-slate-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_code]:text-indigo-300">
                {section.body}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

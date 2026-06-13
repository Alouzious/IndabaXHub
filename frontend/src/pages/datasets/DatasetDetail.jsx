import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Database,
  Download,
  HardDrive,
  Calendar,
  User,
  Scale,
  FileText,
  ArrowLeft,
  Tag,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import ErrorState from "../../components/ui/ErrorState";
import CodeBlock from "../../components/ui/CodeBlock";
import DatasetCard from "../../components/datasets/DatasetCard";
import { useDataset, useDatasets, useDownloadDataset } from "../../hooks/useDatasets";
import {
  formatBytes,
  formatDate,
  formatNumber,
  parseTags,
  getErrorMessage,
} from "../../utils/helpers";

function slugify(name = "") {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function DatasetDetail() {
  const { id } = useParams();
  const { data: dataset, isLoading, isError, refetch } = useDataset(id);
  const { data: allData } = useDatasets();
  const download = useDownloadDataset();

  const slug = dataset ? dataset.slug || slugify(dataset.name) : "dataset";
  const tags = parseTags(dataset?.tags);

  const related = useMemo(() => {
    const list = Array.isArray(allData) ? allData : allData?.items ?? [];
    return list
      .filter((d) => String(d.id) !== String(id) && d.category === dataset?.category)
      .slice(0, 3);
  }, [allData, dataset, id]);

  const sdkSnippet = `from indabaxhub import load_dataset

# Load "${dataset?.name || slug}" directly into your notebook
data = load_dataset("${slug}")

print(data.head())`;

  const handleDownload = () => {
    download.mutate(id, {
      onSuccess: (res) => {
        const url = res?.url || res?.download_url;
        if (url) window.open(url, "_blank", "noopener");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" label="Loading dataset…" />
      </div>
    );
  }

  if (isError || !dataset) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <ErrorState
          title="Dataset unavailable"
          message="This dataset could not be found or failed to load."
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/datasets"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        All datasets
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-8 lg:col-span-2">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-400">
              <Database className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                {dataset.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {dataset.category && (
                  <Badge variant="indigo">{dataset.category}</Badge>
                )}
                {dataset.license && (
                  <Badge variant="slate" icon={Scale}>
                    {dataset.license}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Card>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              About this dataset
            </h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-300">
              {dataset.description || "No description provided for this dataset."}
            </p>

            {tags.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Tag className="h-4 w-4 text-slate-500" />
                {tags.map((tag) => (
                  <Badge key={tag} variant="slate">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </Card>

          {/* SDK usage */}
          <div>
            <h2 className="mb-3 text-lg font-semibold text-white">
              Load with the SDK
            </h2>
            <CodeBlock code={sdkSnippet} title="usage.py" />
          </div>

          {/* File preview */}
          <div>
            <h2 className="mb-3 text-lg font-semibold text-white">
              File preview
            </h2>
            <Card>
              {dataset.preview ? (
                <pre className="overflow-x-auto font-mono text-xs text-slate-300">
                  {dataset.preview}
                </pre>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="mb-2 h-8 w-8 text-slate-600" />
                  <p className="text-sm text-slate-400">
                    Download the dataset to preview its contents.
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    {dataset.file_name || `${slug}.zip`} ·{" "}
                    {formatBytes(dataset.size)}
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <Button
              className="w-full"
              onClick={handleDownload}
              loading={download.isPending}
            >
              <Download className="h-4 w-4" />
              Download dataset
            </Button>
            {download.isError && (
              <p className="mt-2 text-center text-xs text-red-400">
                {getErrorMessage(download.error, "Download failed.")}
              </p>
            )}

            <dl className="mt-5 space-y-3 border-t border-slate-800 pt-5 text-sm">
              <div className="flex items-center justify-between">
                <dt className="inline-flex items-center gap-2 text-slate-500">
                  <User className="h-4 w-4" />
                  Author
                </dt>
                <dd className="font-medium text-slate-200">
                  {dataset.owner?.username || dataset.author || "community"}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="inline-flex items-center gap-2 text-slate-500">
                  <HardDrive className="h-4 w-4" />
                  Size
                </dt>
                <dd className="font-medium text-slate-200">
                  {formatBytes(dataset.size)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="inline-flex items-center gap-2 text-slate-500">
                  <Download className="h-4 w-4" />
                  Downloads
                </dt>
                <dd className="font-medium text-slate-200">
                  {formatNumber(dataset.downloads)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="inline-flex items-center gap-2 text-slate-500">
                  <Calendar className="h-4 w-4" />
                  Published
                </dt>
                <dd className="font-medium text-slate-200">
                  {formatDate(dataset.created_at)}
                </dd>
              </div>
            </dl>
          </Card>

          {related.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Related datasets
              </h3>
              <div className="space-y-4">
                {related.map((d) => (
                  <DatasetCard key={d.id} dataset={d} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

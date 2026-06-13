import { useState } from "react";
import { UploadCloud, FileText, X, CheckCircle2, AlertCircle } from "lucide-react";
import Button from "../ui/Button";
import ProgressBar from "../ui/ProgressBar";
import { formatBytes, getErrorMessage } from "../../utils/helpers";
import { useSubmit } from "../../hooks/useCompetitions";

export default function SubmissionForm({ competitionId, disabled, onSubmitted }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState(null);

  const submit = useSubmit((e) => {
    if (e.total) setProgress(Math.round((e.loaded * 100) / e.total));
  });

  const handleFile = (selected) => {
    if (!selected) return;
    setResult(null);
    setFile(selected);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return;
    setProgress(0);
    submit.mutate(
      { competitionId, file },
      {
        onSuccess: (data) => {
          setResult(data);
          setProgress(100);
          onSubmitted?.(data);
        },
      }
    );
  };

  if (disabled) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-400">
        <AlertCircle className="h-5 w-5 text-amber-400" />
        This competition is closed. Submissions are no longer accepted.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          dragging
            ? "border-indigo-500 bg-indigo-500/5"
            : "border-slate-700 bg-slate-900/40 hover:border-slate-600"
        }`}
      >
        <input
          type="file"
          accept=".csv,.json,.txt,.parquet"
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <UploadCloud className="mb-3 h-9 w-9 text-indigo-400" />
        <p className="text-sm font-medium text-slate-200">
          Drop your predictions file here
        </p>
        <p className="mt-1 text-xs text-slate-500">
          CSV, JSON or Parquet · click to browse
        </p>
      </label>

      {file && (
        <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
          <FileText className="h-5 w-5 text-indigo-400" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-slate-200">{file.name}</p>
            <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={() => setFile(null)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {submit.isPending && <ProgressBar value={progress} />}

      {submit.isError && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-300">
          <AlertCircle className="h-4 w-4" />
          {getErrorMessage(submit.error, "Submission failed.")}
        </div>
      )}

      {result && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-300">
          <CheckCircle2 className="h-4 w-4" />
          Submission scored:{" "}
          <span className="font-mono font-semibold">
            {result.score !== null && result.score !== undefined
              ? Number(result.score).toFixed(4)
              : "pending"}
          </span>
        </div>
      )}

      <Button type="submit" loading={submit.isPending} disabled={!file}>
        Submit predictions
      </Button>
    </form>
  );
}

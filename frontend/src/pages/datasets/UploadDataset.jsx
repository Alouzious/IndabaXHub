import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UploadCloud,
  FileText,
  X,
  AlertCircle,
  CheckCircle2,
  Upload as UploadIcon,
} from "lucide-react";
import PageHeader from "../../components/PageHeader";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import ProgressBar from "../../components/ui/ProgressBar";
import { useUploadDataset } from "../../hooks/useDatasets";
import {
  DATASET_CATEGORIES,
  LICENSES,
  MAX_UPLOAD_BYTES,
} from "../../utils/constants";
import { formatBytes, getErrorMessage } from "../../utils/helpers";

export default function UploadDataset() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    license: "",
    tags: "",
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);

  const upload = useUploadDataset((e) => {
    if (e.total) setProgress(Math.round((e.loaded * 100) / e.total));
  });

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleFile = (selected) => {
    if (!selected) return;
    if (selected.size > MAX_UPLOAD_BYTES) {
      setErrors((prev) => ({ ...prev, file: "File exceeds the 2 GB limit." }));
      return;
    }
    setErrors((prev) => ({ ...prev, file: undefined }));
    setFile(selected);
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Dataset name is required.";
    if (!form.description.trim())
      next.description = "A short description is required.";
    if (!form.category) next.category = "Choose a category.";
    if (!form.license) next.license = "Choose a license.";
    if (!file) next.file = "Attach a dataset file.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("license", form.license);
    formData.append("tags", form.tags);
    formData.append("file", file);

    setProgress(0);
    upload.mutate(formData, {
      onSuccess: (data) => {
        const newId = data?.id;
        setTimeout(() => navigate(newId ? `/datasets/${newId}` : "/datasets"), 600);
      },
    });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        icon={UploadIcon}
        title="Upload a dataset"
        description="Share your data with the IndabaXHub community."
      />

      <form onSubmit={handleSubmit} className="mt-6 space-y-6" noValidate>
        {upload.isError && (
          <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {getErrorMessage(upload.error, "Upload failed. Please try again.")}
          </div>
        )}

        {upload.isSuccess && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Dataset uploaded successfully. Redirecting…
          </div>
        )}

        <Card className="space-y-4">
          <Input
            name="name"
            label="Dataset name"
            placeholder="e.g. Uganda Crop Disease"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            error={errors.name}
          />
          <Textarea
            name="description"
            label="Description"
            rows={4}
            placeholder="What does this dataset contain? How was it collected? What problems can it solve?"
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            error={errors.description}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              name="category"
              label="Category"
              placeholder="Select a category"
              options={DATASET_CATEGORIES}
              value={form.category}
              onChange={(e) => setField("category", e.target.value)}
              error={errors.category}
            />
            <Select
              name="license"
              label="License"
              placeholder="Select a license"
              options={LICENSES}
              value={form.license}
              onChange={(e) => setField("license", e.target.value)}
              error={errors.license}
            />
          </div>
          <Input
            name="tags"
            label="Tags"
            placeholder="comma, separated, tags"
            hint="Add up to 5 comma-separated tags to help others find your dataset."
            value={form.tags}
            onChange={(e) => setField("tags", e.target.value)}
          />
        </Card>

        <Card>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Dataset file
          </label>
          {!file ? (
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
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
                dragging
                  ? "border-indigo-500 bg-indigo-500/5"
                  : "border-slate-700 bg-slate-900/40 hover:border-slate-600"
              }`}
            >
              <input
                type="file"
                accept=".csv,.json,.zip,.parquet,.tar,.gz,.txt"
                className="sr-only"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              <UploadCloud className="mb-3 h-10 w-10 text-indigo-400" />
              <p className="text-sm font-medium text-slate-200">
                Drag & drop your file here
              </p>
              <p className="mt-1 text-xs text-slate-500">
                CSV, JSON, Parquet, ZIP or TAR · up to 2 GB
              </p>
            </label>
          ) : (
            <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-200">
                  {file.name}
                </p>
                <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
              </div>
              {!upload.isPending && (
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
          {errors.file && (
            <p className="mt-2 text-xs text-red-400">{errors.file}</p>
          )}

          {upload.isPending && (
            <div className="mt-4">
              <div className="mb-1.5 flex justify-between text-xs text-slate-400">
                <span>Uploading…</span>
                <span>{progress}%</span>
              </div>
              <ProgressBar value={progress} />
            </div>
          )}
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/datasets")}
          >
            Cancel
          </Button>
          <Button type="submit" loading={upload.isPending}>
            <UploadCloud className="h-4 w-4" />
            Publish dataset
          </Button>
        </div>
      </form>
    </div>
  );
}

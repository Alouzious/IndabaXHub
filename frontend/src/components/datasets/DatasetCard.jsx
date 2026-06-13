import { Link } from "react-router-dom";
import { Database, Download, HardDrive } from "lucide-react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import { formatBytes, formatNumber, parseTags, timeAgo } from "../../utils/helpers";

export default function DatasetCard({ dataset }) {
  const tags = parseTags(dataset.tags);
  return (
    <Card hover as={Link} to={`/datasets/${dataset.id}`} className="group flex flex-col">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
          <Database className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-white transition-colors group-hover:text-indigo-300">
            {dataset.name}
          </h3>
          <p className="text-xs text-slate-500">
            by {dataset.owner?.username || dataset.author || "community"} ·{" "}
            {timeAgo(dataset.created_at)}
          </p>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 flex-1 text-sm text-slate-400">
        {dataset.description || "No description provided."}
      </p>

      {dataset.category && (
        <div className="mt-3">
          <Badge variant="indigo">{dataset.category}</Badge>
        </div>
      )}

      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="slate">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="slate">+{tags.length - 3}</Badge>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center gap-4 border-t border-slate-800 pt-3 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">
          <HardDrive className="h-3.5 w-3.5" />
          {formatBytes(dataset.size)}
        </span>
        <span className="inline-flex items-center gap-1">
          <Download className="h-3.5 w-3.5" />
          {formatNumber(dataset.downloads)}
        </span>
        {dataset.license && (
          <span className="ml-auto truncate text-slate-600">
            {dataset.license}
          </span>
        )}
      </div>
    </Card>
  );
}

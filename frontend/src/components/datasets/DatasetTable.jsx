import { Link } from "react-router-dom";
import { Database, Download } from "lucide-react";
import { formatBytes, formatNumber, formatDate } from "../../utils/helpers";

export default function DatasetTable({ datasets = [] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800">
      <table className="min-w-full divide-y divide-slate-800 text-sm">
        <thead className="bg-slate-900/80">
          <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
            <th className="px-4 py-3 font-medium">Dataset</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Size</th>
            <th className="px-4 py-3 font-medium">Downloads</th>
            <th className="px-4 py-3 font-medium">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 bg-slate-900/30">
          {datasets.map((d) => (
            <tr key={d.id} className="transition-colors hover:bg-slate-800/40">
              <td className="px-4 py-3">
                <Link
                  to={`/datasets/${d.id}`}
                  className="inline-flex items-center gap-2 font-medium text-slate-100 hover:text-indigo-300"
                >
                  <Database className="h-4 w-4 text-indigo-400" />
                  {d.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-slate-400">{d.category || "—"}</td>
              <td className="px-4 py-3 text-slate-400">{formatBytes(d.size)}</td>
              <td className="px-4 py-3 text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <Download className="h-3.5 w-3.5" />
                  {formatNumber(d.downloads)}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-400">
                {formatDate(d.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

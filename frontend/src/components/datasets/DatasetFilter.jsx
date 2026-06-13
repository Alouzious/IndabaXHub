import { Search, SlidersHorizontal, X } from "lucide-react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import { DATASET_CATEGORIES, LICENSES } from "../../utils/constants";

const SORT_OPTIONS = [
  { value: "recent", label: "Most recent" },
  { value: "downloads", label: "Most downloaded" },
  { value: "name", label: "Name (A–Z)" },
];

export default function DatasetFilter({ filters, onChange, onReset }) {
  const hasActiveFilters =
    filters.search || filters.category || filters.license;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="grid gap-3 md:grid-cols-12">
        <div className="md:col-span-5">
          <Input
            name="search"
            icon={Search}
            placeholder="Search datasets..."
            value={filters.search}
            onChange={(e) => onChange("search", e.target.value)}
            aria-label="Search datasets"
          />
        </div>
        <div className="md:col-span-3">
          <Select
            name="category"
            placeholder="All categories"
            options={DATASET_CATEGORIES}
            value={filters.category}
            onChange={(e) => onChange("category", e.target.value)}
            aria-label="Filter by category"
          />
        </div>
        <div className="md:col-span-2">
          <Select
            name="license"
            placeholder="All licenses"
            options={LICENSES}
            value={filters.license}
            onChange={(e) => onChange("license", e.target.value)}
            aria-label="Filter by license"
          />
        </div>
        <div className="md:col-span-2">
          <Select
            name="sort"
            options={SORT_OPTIONS}
            value={filters.sort}
            onChange={(e) => onChange("sort", e.target.value)}
            aria-label="Sort datasets"
          />
        </div>
      </div>
      {hasActiveFilters && (
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters applied
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto h-7 px-2"
            onClick={onReset}
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}

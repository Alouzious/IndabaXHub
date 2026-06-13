import { useMemo, useState } from "react";
import { Database, Plus, LayoutGrid, Rows3 } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import Button from "../../components/ui/Button";
import { SkeletonCard } from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import Pagination from "../../components/ui/Pagination";
import DatasetCard from "../../components/datasets/DatasetCard";
import DatasetTable from "../../components/datasets/DatasetTable";
import DatasetFilter from "../../components/datasets/DatasetFilter";
import { useDatasets } from "../../hooks/useDatasets";
import { useDatasetStore } from "../../store/datasetStore";
import { useAuth } from "../../hooks/useAuth";
import { parseTags } from "../../utils/helpers";
import { PAGE_SIZE } from "../../utils/constants";

export default function DatasetList() {
  const { filters, setFilter, resetFilters, page, setPage } = useDatasetStore();
  const { isAuthenticated } = useAuth();
  const [view, setView] = useState("grid");

  const { data, isLoading, isError, refetch } = useDatasets();

  const allDatasets = useMemo(() => {
    if (!data) return [];
    return Array.isArray(data) ? data : data.items ?? [];
  }, [data]);

  // Client-side filtering + sorting so the page is fully functional
  // regardless of which query params the API honors.
  const filtered = useMemo(() => {
    let list = [...allDatasets];
    const term = filters.search.trim().toLowerCase();
    if (term) {
      list = list.filter((d) => {
        const tags = parseTags(d.tags).join(" ").toLowerCase();
        return (
          d.name?.toLowerCase().includes(term) ||
          d.description?.toLowerCase().includes(term) ||
          tags.includes(term)
        );
      });
    }
    if (filters.category) {
      list = list.filter((d) => d.category === filters.category);
    }
    if (filters.license) {
      list = list.filter((d) => d.license === filters.license);
    }
    if (filters.sort === "downloads") {
      list.sort((a, b) => (b.downloads ?? 0) - (a.downloads ?? 0));
    } else if (filters.sort === "name") {
      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else {
      list.sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
      );
    }
    return list;
  }, [allDatasets, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        icon={Database}
        title="Datasets"
        description="Discover and download community datasets from across Africa."
        actions={
          isAuthenticated && (
            <Button to="/datasets/upload" size="sm">
              <Plus className="h-4 w-4" />
              Upload dataset
            </Button>
          )
        }
      />

      <div className="mt-6">
        <DatasetFilter
          filters={filters}
          onChange={setFilter}
          onReset={resetFilters}
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {isLoading ? "Loading…" : `${filtered.length} dataset${filtered.length === 1 ? "" : "s"}`}
        </p>
        <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/60 p-1">
          <button
            type="button"
            onClick={() => setView("grid")}
            className={`rounded-md p-1.5 ${view === "grid" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-white"}`}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setView("table")}
            className={`rounded-md p-1.5 ${view === "table" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-white"}`}
            aria-label="Table view"
          >
            <Rows3 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4">
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : isError ? (
          <ErrorState
            message="We couldn't load datasets. Check that the API is running."
            onRetry={refetch}
          />
        ) : paginated.length === 0 ? (
          <EmptyState
            icon={Database}
            title="No datasets found"
            description="Try adjusting your filters, or be the first to upload a dataset to the hub."
            action={
              isAuthenticated && (
                <Button to="/datasets/upload">
                  <Plus className="h-4 w-4" />
                  Upload a dataset
                </Button>
              )
            }
          />
        ) : view === "grid" ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map((dataset) => (
              <DatasetCard key={dataset.id} dataset={dataset} />
            ))}
          </div>
        ) : (
          <DatasetTable datasets={paginated} />
        )}
      </div>

      {!isLoading && !isError && (
        <Pagination
          page={safePage}
          totalPages={totalPages}
          onChange={setPage}
        />
      )}
    </div>
  );
}

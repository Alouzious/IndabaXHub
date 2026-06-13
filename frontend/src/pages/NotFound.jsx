import { Compass, Home as HomeIcon, ArrowLeft } from "lucide-react";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-500/15 text-indigo-400">
          <Compass className="h-10 w-10" />
        </div>
        <p className="font-mono text-sm font-medium uppercase tracking-widest text-indigo-400">
          Error 404
        </p>
        <h1 className="mt-2 text-4xl font-bold text-white">Page not found</h1>
        <p className="mx-auto mt-3 max-w-md text-slate-400">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back on track.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button to="/">
            <HomeIcon className="h-4 w-4" />
            Back to home
          </Button>
          <Button to="/datasets" variant="secondary">
            <ArrowLeft className="h-4 w-4" />
            Browse datasets
          </Button>
        </div>
      </div>
    </div>
  );
}

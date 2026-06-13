import { Link } from "react-router-dom";
import { Code2 } from "lucide-react";
import Logo from "./Logo";
import { APP_TAGLINE } from "../utils/constants";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-slate-400">{APP_TAGLINE}</p>
          <p className="mt-3 text-xs text-slate-600">
            Built by IndabaX AI Club Kabale · Kabale University, Uganda
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Platform</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>
              <Link to="/datasets" className="hover:text-indigo-300">
                Datasets
              </Link>
            </li>
            <li>
              <Link to="/competitions" className="hover:text-indigo-300">
                Competitions
              </Link>
            </li>
            <li>
              <Link to="/leaderboard" className="hover:text-indigo-300">
                Leaderboard
              </Link>
            </li>
            <li>
              <Link to="/docs" className="hover:text-indigo-300">
                Documentation
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white">Community</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-indigo-300"
              >
                <Code2 className="h-4 w-4" />
                GitHub
              </a>
            </li>
            <li>
              <Link to="/docs#getting-started" className="hover:text-indigo-300">
                About
              </Link>
            </li>
            <li>
              <a
                href="mailto:hello@indabaxhub.org"
                className="hover:text-indigo-300"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4">
        <p className="mx-auto max-w-7xl px-4 text-center text-xs text-slate-600 sm:px-6 lg:px-8">
          © {year} IndabaXHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

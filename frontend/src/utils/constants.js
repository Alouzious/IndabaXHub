export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8001/api";

export const TOKEN_STORAGE_KEY = "indabaxhub_token";

export const APP_NAME = "IndabaXHub";
export const APP_TAGLINE =
  "The African AI community's hub for datasets, competitions, and collaboration.";

export const DATASET_CATEGORIES = [
  "Agriculture",
  "Healthcare",
  "Computer Vision",
  "Natural Language Processing",
  "Audio & Speech",
  "Tabular",
  "Climate",
  "Finance",
  "Education",
  "Other",
];

export const LICENSES = [
  "CC BY 4.0",
  "CC BY-SA 4.0",
  "CC0 1.0",
  "MIT",
  "Apache 2.0",
  "GPL 3.0",
  "Proprietary",
];

export const EVALUATION_METRICS = [
  { value: "accuracy", label: "Accuracy", higherIsBetter: true },
  { value: "f1_score", label: "F1 Score", higherIsBetter: true },
  { value: "rmse", label: "RMSE", higherIsBetter: false },
  { value: "log_loss", label: "Log Loss", higherIsBetter: false },
];

export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Datasets", to: "/datasets" },
  { label: "Competitions", to: "/competitions" },
  { label: "Leaderboard", to: "/leaderboard" },
  { label: "Docs", to: "/docs" },
];

export const PAGE_SIZE = 9;

export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024 * 1024; // 2 GB

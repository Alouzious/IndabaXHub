import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Docs from "./pages/Docs";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DatasetList from "./pages/datasets/DatasetList";
import DatasetDetail from "./pages/datasets/DatasetDetail";
import UploadDataset from "./pages/datasets/UploadDataset";
import CompetitionList from "./pages/competitions/CompetitionList";
import CompetitionDetail from "./pages/competitions/CompetitionDetail";
import Leaderboard from "./pages/leaderboard/Leaderboard";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/datasets", element: <DatasetList /> },
      { path: "/datasets/:id", element: <DatasetDetail /> },
      {
        path: "/datasets/upload",
        element: (
          <ProtectedRoute>
            <UploadDataset />
          </ProtectedRoute>
        ),
      },
      { path: "/competitions", element: <CompetitionList /> },
      { path: "/competitions/:id", element: <CompetitionDetail /> },
      { path: "/leaderboard", element: <Leaderboard /> },
      { path: "/docs", element: <Docs /> },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
]);

export default router;

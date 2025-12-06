import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

// Layout (not lazy-loaded as it's needed immediately)
import DashboardLayout from "../components/layout/DashboardLayout/DashboardLayout";
import Loader from "../components/common/loader/Loader/Loader";

// Lazy load all page components for code splitting
const LandingPage = lazy(() => import("../pages/landing/LandingPage"));
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const Workspaces = lazy(() => import("../pages/workspaces/Workspaces"));
const WorkspaceDetails = lazy(() =>
  import("../pages/workspaces/WorkspaceDetails")
);
const ProjectDetails = lazy(() =>
  import("../pages/projects/ProjectDetails/index")
);
const ProjectGantt = lazy(() => import("../pages/projects/ProjectGantt/index"));
const ProjectNetwork = lazy(() =>
  import("../pages/projects/ProjectNetwork/index")
);
const Members = lazy(() => import("../pages/members/Members"));
const Settings = lazy(() => import("../pages/settings/Settings"));
const Chat = lazy(() => import("../pages/chat/Chat"));
const AIChat = lazy(() => import("../pages/chat/AIChat"));
const Archived = lazy(() => import("../pages/archived/Archived"));
const Profile = lazy(() => import("../pages/profile/Profile"));
const Notifications = lazy(() =>
  import("../pages/notifications/Notifications")
);
const NotFound = lazy(() => import("../pages/not-found/index"));

// Route Guards
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        {/* Protected Routes with Layout */}
        <Route
          path="/app"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="workspaces" element={<Workspaces />} />
          <Route
            path="workspaces/:workspaceId"
            element={<WorkspaceDetails />}
          />
          <Route
            path="workspaces/:workspaceId/projects/:projectId"
            element={<ProjectDetails />}
          />
          <Route
            path="workspaces/:workspaceId/projects/:projectId/gantt"
            element={<ProjectGantt />}
          />
          <Route
            path="workspaces/:workspaceId/projects/:projectId/network"
            element={<ProjectNetwork />}
          />
          <Route path="workspaces/:workspaceId/members" element={<Members />} />
          <Route
            path="workspaces/:workspaceId/settings"
            element={<Settings />}
          />
          <Route
            path="workspaces/:workspaceId/archived"
            element={<Archived />}
          />
          <Route path="chat" element={<Chat />} />
          <Route path="chat/ai" element={<AIChat />} />
          <Route path="chat/:chatId" element={<Chat />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

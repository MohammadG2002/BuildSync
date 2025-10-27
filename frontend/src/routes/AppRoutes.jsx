import { Routes, Route, Navigate } from "react-router-dom";

// Layout
import DashboardLayout from "../components/layout/DashboardLayout";

// Public Pages
import LandingPage from "../pages/landing/LandingPage";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

// Protected Pages
import Dashboard from "../pages/dashboard/Dashboard";
import Workspaces from "../pages/workspaces/Workspaces";
import WorkspaceDetails from "../pages/workspaces/WorkspaceDetails";
import ProjectDetails from "../pages/projects/ProjectDetails";
import Members from "../pages/members/Members";
import Settings from "../pages/settings/Settings";
import Chat from "../pages/chat/Chat";
import Archived from "../pages/archived/Archived";
import Profile from "../pages/profile/Profile";
import NotFound from "../pages/NotFound";

// Route Guards
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

const AppRoutes = () => {
  return (
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
        <Route path="workspaces/:workspaceId" element={<WorkspaceDetails />} />
        <Route
          path="workspaces/:workspaceId/projects/:projectId"
          element={<ProjectDetails />}
        />
        <Route path="workspaces/:workspaceId/members" element={<Members />} />
        <Route path="workspaces/:workspaceId/settings" element={<Settings />} />
        <Route path="chat" element={<Chat />} />
        <Route path="archived" element={<Archived />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

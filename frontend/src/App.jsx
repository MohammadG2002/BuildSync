import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { WorkspaceProvider } from "./context/WorkspaceContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ThemeProvider } from "./context/ThemeContext";
import RealtimeProvider from "./context/RealtimeProvider";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import ErrorBoundary from "./components/common/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <WorkspaceProvider>
              <RealtimeProvider>
                <NotificationProvider>
                  <AppRoutes />
                  <Toaster position="top-right" />
                </NotificationProvider>
              </RealtimeProvider>
            </WorkspaceProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

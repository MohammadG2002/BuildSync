import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import styles from "./Routes.module.css";

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return user ? <Navigate to="/app/dashboard" replace /> : children;
};

export default PublicRoute;

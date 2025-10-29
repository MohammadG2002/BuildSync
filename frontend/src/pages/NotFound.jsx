import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import Button from "../components/common/Button";
import styles from "./NotFound.module.css";

const NotFound = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.title}>Page Not Found</h2>
        <p className={styles.description}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className={styles.actions}>
          <Link to="/">
            <Button variant="primary" className="gap-2">
              <Home className="w-5 h-5" />
              Go Home
            </Button>
          </Link>
          <Button
            variant="secondary"
            onClick={() => window.history.back()}
            className="gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

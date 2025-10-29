import { AlertTriangle, Trash2 } from "lucide-react";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import styles from "./Settings.module.css";

const DangerZone = ({ onDeleteClick }) => {
  return (
    <Card>
      <div className={styles.dangerZone}>
        <div className={styles.dangerContent}>
          <div className={styles.dangerIcon}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className={styles.dangerDetails}>
            <h3 className={styles.dangerTitle}>Danger Zone</h3>
            <p className={styles.dangerDescription}>
              Deleting this workspace is permanent and cannot be undone. All
              projects, tasks, and data will be permanently deleted.
            </p>
            <Button variant="danger" onClick={onDeleteClick} className="gap-2">
              <Trash2 className="w-5 h-5" />
              Delete Workspace
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DangerZone;

import { AlertTriangle, Trash2 } from "lucide-react";
import Button from "../common/Button";
import Card from "../common/Card";
import styles from "./Settings.module.css";

const DangerZone = ({ onDeleteClick }) => {
  return (
    <Card>
      <div className={styles.dangerZone}>
        <div className={styles.dangerContent}>
          <div className={styles.dangerIcon}>
            <AlertTriangle className={styles.dangerIconImage} />
          </div>
          <div className={styles.dangerDetails}>
            <h3 className={styles.dangerTitle}>Danger Zone</h3>
            <p className={styles.dangerDescription}>
              Deleting this workspace is permanent and cannot be undone. All
              projects, tasks, and data will be permanently deleted.
            </p>
            <Button
              variant="danger"
              onClick={onDeleteClick}
              className={styles.dangerDeleteButton}
            >
              <Trash2 className={styles.dangerDeleteIcon} />
              Delete Workspace
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DangerZone;

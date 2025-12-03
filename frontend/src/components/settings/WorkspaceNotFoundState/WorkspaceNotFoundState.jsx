import Button from "../../common/button/Button";
import Card from "../../common/card/Card";
import styles from "./WorkspaceNotFoundState.module.css";

const WorkspaceNotFoundState = ({ onBackClick }) => {
  return (
    <div className={styles.container}>
      <Card className={styles.notFoundCard}>
        <h3 className={styles.notFoundTitle}>Workspace not found</h3>
        <Button variant="primary" onClick={onBackClick}>
          Back to Workspaces
        </Button>
      </Card>
    </div>
  );
};

export default WorkspaceNotFoundState;

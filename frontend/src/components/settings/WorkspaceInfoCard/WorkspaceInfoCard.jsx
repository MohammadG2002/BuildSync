import Card from "../../common/card/Card";
import styles from "./WorkspaceInfoCard.module.css";

const WorkspaceInfoCard = ({ workspaceId, createdDate, memberCount }) => {
  return (
    <Card title="Workspace Information">
      <div className={styles.infoList}>
        <div className={styles.infoItem}>
          <div className={styles.infoLabel}>
            <p className={styles.infoLabelTitle}>Workspace ID</p>
            <p className={styles.infoLabelDesc}>
              Unique identifier for this workspace
            </p>
          </div>
          <code className={styles.infoCode}>{workspaceId}</code>
        </div>

        <div className={styles.infoItem}>
          <div className={styles.infoLabel}>
            <p className={styles.infoLabelTitle}>Created Date</p>
            <p className={styles.infoLabelDesc}>
              When this workspace was created
            </p>
          </div>
          <p className={styles.infoValue}>
            {createdDate
              ? new Date(createdDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "N/A"}
          </p>
        </div>

        <div className={styles.infoItem}>
          <div className={styles.infoLabel}>
            <p className={styles.infoLabelTitle}>Total Members</p>
            <p className={styles.infoLabelDesc}>
              Number of members in this workspace
            </p>
          </div>
          <p className={styles.infoValue}>{memberCount || 0}</p>
        </div>
      </div>
    </Card>
  );
};

export default WorkspaceInfoCard;

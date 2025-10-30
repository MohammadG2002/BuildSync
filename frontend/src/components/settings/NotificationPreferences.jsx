import Card from "../../../components/common/Card";
import styles from "./Settings.module.css";

const NotificationPreferences = () => {
  return (
    <Card title="Notification Preferences">
      <div className={styles.preferencesList}>
        <label className={styles.preferenceItem}>
          <input
            type="checkbox"
            defaultChecked
            className={styles.preferenceCheckbox}
          />
          <div className={styles.preferenceLabel}>
            <p className={styles.preferenceLabelTitle}>Task Assignments</p>
            <p className={styles.preferenceLabelDesc}>
              Get notified when you're assigned to a task
            </p>
          </div>
        </label>

        <label className={styles.preferenceItem}>
          <input
            type="checkbox"
            defaultChecked
            className={styles.preferenceCheckbox}
          />
          <div className={styles.preferenceLabel}>
            <p className={styles.preferenceLabelTitle}>Project Updates</p>
            <p className={styles.preferenceLabelDesc}>
              Get notified about project changes and updates
            </p>
          </div>
        </label>

        <label className={styles.preferenceItem}>
          <input
            type="checkbox"
            defaultChecked
            className={styles.preferenceCheckbox}
          />
          <div className={styles.preferenceLabel}>
            <p className={styles.preferenceLabelTitle}>New Members</p>
            <p className={styles.preferenceLabelDesc}>
              Get notified when new members join the workspace
            </p>
          </div>
        </label>

        <label className={styles.preferenceItem}>
          <input type="checkbox" className={styles.preferenceCheckbox} />
          <div className={styles.preferenceLabel}>
            <p className={styles.preferenceLabelTitle}>Daily Digest</p>
            <p className={styles.preferenceLabelDesc}>
              Receive a daily summary of workspace activity
            </p>
          </div>
        </label>
      </div>
    </Card>
  );
};

export default NotificationPreferences;

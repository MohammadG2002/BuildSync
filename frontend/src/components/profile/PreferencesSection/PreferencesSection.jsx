import styles from "./PreferencesSection.module.css";

const PreferencesSection = () => {
  return (
    <div className={styles.preferences}>
      <label className={styles.preferenceItem}>
        <input
          type="checkbox"
          defaultChecked
          className={styles.preferenceCheckbox}
        />
        <div className={styles.preferenceLabel}>
          <p className={styles.preferenceLabelTitle}>Email Notifications</p>
          <p className={styles.preferenceLabelDesc}>
            Receive email notifications about your activity
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
          <p className={styles.preferenceLabelTitle}>Weekly Summary</p>
          <p className={styles.preferenceLabelDesc}>
            Get a weekly summary of your projects and tasks
          </p>
        </div>
      </label>

      <label className={styles.preferenceItem}>
        <input type="checkbox" className={styles.preferenceCheckbox} />
        <div className={styles.preferenceLabel}>
          <p className={styles.preferenceLabelTitle}>Marketing Emails</p>
          <p className={styles.preferenceLabelDesc}>
            Receive updates about new features and tips
          </p>
        </div>
      </label>
    </div>
  );
};

export default PreferencesSection;

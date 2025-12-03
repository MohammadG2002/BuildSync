import Card from "../../common/card/Card";
import styles from "./PrivacySettings.module.css";

const PrivacySettings = () => {
  return (
    <Card title="Privacy & Access">
      <div className={styles.privacyList}>
        <label className={styles.privacyItem}>
          <input type="checkbox" className={styles.privacyCheckbox} />
          <div className={styles.privacyLabel}>
            <p className={styles.privacyLabelTitle}>Private Workspace</p>
            <p className={styles.privacyLabelDesc}>
              Only invited members can access this workspace
            </p>
          </div>
        </label>

        <label className={styles.privacyItem}>
          <input
            type="checkbox"
            defaultChecked
            className={styles.privacyCheckbox}
          />
          <div className={styles.privacyLabel}>
            <p className={styles.privacyLabelTitle}>Allow Member Invites</p>
            <p className={styles.privacyLabelDesc}>
              Let members invite other people to this workspace
            </p>
          </div>
        </label>
      </div>
    </Card>
  );
};

export default PrivacySettings;

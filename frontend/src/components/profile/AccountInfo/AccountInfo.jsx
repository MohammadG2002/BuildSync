import styles from "./AccountInfo.module.css";

const AccountInfo = ({ user }) => {
  return (
    <div className={styles.accountInfo}>
      <div className={styles.infoItem}>
        <div className={styles.infoLabel}>
          <p className={styles.infoLabelTitle}>Account Status</p>
          <p className={styles.infoLabelDesc}>
            Your account is active and in good standing
          </p>
        </div>
        <span className={styles.infoBadge}>Active</span>
      </div>

      <div className={styles.infoItem}>
        <div className={styles.infoLabel}>
          <p className={styles.infoLabelTitle}>Member Since</p>
          <p className={styles.infoLabelDesc}>When you joined the platform</p>
        </div>
        <p className={styles.infoValue}>
          {user?.createdDate
            ? new Date(user.createdDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "January 2024"}
        </p>
      </div>

      <div className={`${styles.infoItem} ${styles.infoItemLast}`}>
        <div className={styles.infoLabel}>
          <p className={styles.infoLabelTitle}>Email Verified</p>
          <p className={styles.infoLabelDesc}>
            Your email address has been verified
          </p>
        </div>
        <span className={styles.infoBadge}>Verified</span>
      </div>
    </div>
  );
};

export default AccountInfo;

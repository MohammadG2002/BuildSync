import styles from "./Profile.module.css";

const ProfileTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "profile", label: "Profile Information" },
    { id: "security", label: "Security" },
  ];

  return (
    <div className={styles.tabs}>
      <div className={styles.tabList}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`${styles.tab} ${
              activeTab === tab.id ? styles.tabActive : styles.tabInactive
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileTabs;

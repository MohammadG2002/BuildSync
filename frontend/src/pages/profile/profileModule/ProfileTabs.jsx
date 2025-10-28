const ProfileTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "profile", label: "Profile Information" },
    { id: "security", label: "Security" },
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <div className="flex gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
              activeTab === tab.id
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-gray-600 dark:text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:text-gray-100"
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

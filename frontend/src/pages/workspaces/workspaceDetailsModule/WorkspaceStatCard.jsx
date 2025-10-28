import Card from "../../../components/common/Card";

const WorkspaceStatCard = ({ label, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-1">
            {label}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </p>
        </div>
        <div
          className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
};

export default WorkspaceStatCard;

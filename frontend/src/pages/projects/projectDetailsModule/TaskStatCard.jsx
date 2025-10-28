import Card from "../../../components/common/Card";

const TaskStatCard = ({ label, value, icon: Icon, color = "gray" }) => {
  const colorClasses = {
    gray: "text-gray-400 dark:text-gray-500",
    blue: "text-blue-400",
    yellow: "text-yellow-400",
    green: "text-green-400",
  };

  const valueColorClasses = {
    gray: "text-gray-900 dark:text-gray-100",
    blue: "text-blue-600",
    yellow: "text-yellow-600",
    green: "text-green-600",
  };

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-1">
            {label}
          </p>
          <p className={`text-2xl font-bold ${valueColorClasses[color]}`}>
            {value}
          </p>
        </div>
        <Icon className={`w-8 h-8 ${colorClasses[color]}`} />
      </div>
    </Card>
  );
};

export default TaskStatCard;

import Card from "../../../components/common/Card";
import { TrendingUp } from "lucide-react";
import { colorClasses } from "./colors";

const StatCard = ({ stat }) => {
  const Icon = stat.icon;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-1">
            {stat.title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {stat.value}
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
            {stat.trend === "up" && (
              <TrendingUp className="w-3 h-3 text-green-600" />
            )}
            <span>{stat.change}</span>
          </div>
        </div>
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            colorClasses[stat.color]
          }`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;

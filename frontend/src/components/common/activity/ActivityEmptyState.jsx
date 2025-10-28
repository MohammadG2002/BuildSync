import { Clock } from "lucide-react";

const ActivityEmptyState = () => {
  return (
    <div className="text-center py-12">
      <Clock className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
      <p className="text-gray-600 dark:text-gray-400">No activities yet</p>
    </div>
  );
};

export default ActivityEmptyState;

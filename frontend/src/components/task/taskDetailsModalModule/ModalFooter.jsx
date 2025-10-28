import { formatDate } from "../../../utils/helpers";

const ModalFooter = ({ createdAt, updatedAt }) => {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Created {formatDate(createdAt)}</span>
        <span>Updated {formatDate(updatedAt)}</span>
      </div>
    </div>
  );
};

export default ModalFooter;

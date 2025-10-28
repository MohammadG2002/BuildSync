import { Tag } from "lucide-react";

const TagsSection = ({ tags }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Tag className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Tags
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs font-medium rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagsSection;

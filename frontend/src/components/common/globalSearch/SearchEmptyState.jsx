import { Search } from "lucide-react";

const SearchEmptyState = () => {
  return (
    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
      <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
      <p className="font-medium mb-1">Search anything</p>
      <p className="text-sm">
        Find workspaces, projects, tasks, or team members
      </p>
    </div>
  );
};

export default SearchEmptyState;

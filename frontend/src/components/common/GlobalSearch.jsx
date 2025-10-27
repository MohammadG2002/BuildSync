import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  Briefcase,
  FileText,
  Users,
  CheckSquare,
} from "lucide-react";
import { useWorkspace } from "../../hooks/useWorkspace";

const GlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState({
    workspaces: [],
    projects: [],
    tasks: [],
    members: [],
  });
  const [activeCategory, setActiveCategory] = useState("all");
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { workspaces } = useWorkspace();

  // Toggle search with Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Mock search function (replace with real API call)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults({ workspaces: [], projects: [], tasks: [], members: [] });
      return;
    }

    // Simulate API call with timeout
    const timer = setTimeout(() => {
      const query = searchQuery.toLowerCase();

      // Mock data - replace with real search
      const mockResults = {
        workspaces: workspaces.filter((w) =>
          w.name.toLowerCase().includes(query)
        ),
        projects: [
          {
            id: "1",
            name: "Website Redesign",
            workspace: "Design Team",
            type: "project",
          },
          {
            id: "2",
            name: "Mobile App",
            workspace: "Development",
            type: "project",
          },
        ].filter((p) => p.name.toLowerCase().includes(query)),
        tasks: [
          {
            id: "1",
            title: "Update homepage design",
            project: "Website Redesign",
            type: "task",
          },
          {
            id: "2",
            title: "Fix login bug",
            project: "Mobile App",
            type: "task",
          },
        ].filter((t) => t.title.toLowerCase().includes(query)),
        members: [
          { id: "1", name: "John Doe", role: "Developer", type: "member" },
          { id: "2", name: "Jane Smith", role: "Designer", type: "member" },
        ].filter((m) => m.name.toLowerCase().includes(query)),
      };

      setResults(mockResults);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, workspaces]);

  const handleResultClick = (result, type) => {
    setIsOpen(false);
    setSearchQuery("");

    // Navigate based on type
    switch (type) {
      case "workspace":
        navigate(`/app/workspaces/${result.id}`);
        break;
      case "project":
        navigate(`/app/workspaces/1/projects/${result.id}`);
        break;
      case "task":
        navigate(`/app/workspaces/1/projects/1`);
        break;
      case "member":
        navigate(`/app/workspaces/1/members`);
        break;
      default:
        break;
    }
  };

  const categories = [
    { id: "all", label: "All", count: 0 },
    {
      id: "workspaces",
      label: "Workspaces",
      icon: Briefcase,
      count: results.workspaces.length,
    },
    {
      id: "projects",
      label: "Projects",
      icon: FileText,
      count: results.projects.length,
    },
    {
      id: "tasks",
      label: "Tasks",
      icon: CheckSquare,
      count: results.tasks.length,
    },
    {
      id: "members",
      label: "Members",
      icon: Users,
      count: results.members.length,
    },
  ];

  const filteredResults = () => {
    if (activeCategory === "all") {
      return [
        ...results.workspaces.map((r) => ({ ...r, type: "workspace" })),
        ...results.projects.map((r) => ({ ...r, type: "project" })),
        ...results.tasks.map((r) => ({ ...r, type: "task" })),
        ...results.members.map((r) => ({ ...r, type: "member" })),
      ];
    }
    return results[activeCategory].map((r) => ({ ...r, type: activeCategory }));
  };

  const getResultIcon = (type) => {
    switch (type) {
      case "workspace":
        return Briefcase;
      case "project":
        return FileText;
      case "task":
        return CheckSquare;
      case "member":
        return Users;
      default:
        return FileText;
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm hidden md:inline">Search...</span>
        <kbd className="hidden md:inline px-2 py-0.5 text-xs bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded">
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black bg-opacity-50 animate-fade-in"
      data-onboarding="global-search"
    >
      <div
        ref={searchRef}
        className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-2xl animate-scale-in"
      >
        {/* Search Input */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search workspaces, projects, tasks, members..."
              className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Categories */}
        {searchQuery && (
          <div className="flex gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === category.id
                      ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{category.label}</span>
                  {category.count > 0 && (
                    <span className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">
                      {category.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {!searchQuery ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium mb-1">Search anything</p>
              <p className="text-sm">
                Find workspaces, projects, tasks, or team members
              </p>
            </div>
          ) : filteredResults().length > 0 ? (
            <div className="py-2">
              {filteredResults().map((result, index) => {
                const Icon = getResultIcon(result.type);
                return (
                  <button
                    key={`${result.type}-${result.id || index}`}
                    onClick={() => handleResultClick(result, result.type)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {result.name || result.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {result.workspace ||
                          result.project ||
                          result.role ||
                          result.type}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 capitalize">
                      {result.type}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <p className="font-medium mb-1">No results found</p>
              <p className="text-sm">Try searching with different keywords</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                ↑↓
              </kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                ↵
              </kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                ESC
              </kbd>
              Close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;

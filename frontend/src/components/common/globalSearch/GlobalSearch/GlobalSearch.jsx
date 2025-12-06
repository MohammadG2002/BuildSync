import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspace } from "../../../../hooks/useWorkspace";
import {
  categoriesConfig,
  filterResults,
  handleResultClick as handleResultClickUtil,
  performSearch,
} from "../index";
import SearchTriggerButton from "../SearchTriggerButton/SearchTriggerButton";
import SearchModal from "../SearchModal/SearchModal";

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

  // Perform search
  useEffect(() => {
    const timer = setTimeout(() => {
      setResults(performSearch(searchQuery, workspaces));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, workspaces]);

  const handleResultClick = (result, type) => {
    handleResultClickUtil(result, type, navigate, setIsOpen, setSearchQuery);
  };

  const filteredResults = filterResults(results, activeCategory);

  if (!isOpen) {
    return <SearchTriggerButton onClick={() => setIsOpen(true)} />;
  }

  return (
    <SearchModal
      searchRef={searchRef}
      inputRef={inputRef}
      searchQuery={searchQuery}
      onSearchChange={(e) => setSearchQuery(e.target.value)}
      onClose={() => setIsOpen(false)}
      categories={categoriesConfig}
      activeCategory={activeCategory}
      onCategoryChange={setActiveCategory}
      results={results}
      filteredResults={filteredResults}
      onResultClick={handleResultClick}
    />
  );
};

export default GlobalSearch;

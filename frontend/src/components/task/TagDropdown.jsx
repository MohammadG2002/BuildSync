import { useEffect, useState, useRef } from "react";
import { Plus, ChevronDown, X } from "lucide-react";
import styles from "./taskFormModule/TaskForm.module.css"; // reuse form styles for consistency
import dropdownStyles from "./taskFormModule/TagDropdown.module.css";
import { getTags } from "../../services/tagService";
import { useContext } from "react";
import { WorkspaceContext } from "../../context/WorkspaceContext";

// Contract:
// Props: selected (array of tag names), onChange(newArray), onOpenManager() to open full manager overlay
// Displays: Pills for selected tags, a button that opens dropdown listing all tags; each list item selectable.
// Tag object shape from API: { _id, name, color, backgroundColor }

const TagDropdown = ({
  selected = [],
  onChange,
  onOpenManager,
  readOnly = false,
  variant = "form", // 'form' | 'select'
  showLabel = true,
}) => {
  const { currentWorkspace } = useContext(WorkspaceContext);
  const [allTags, setAllTags] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const fetchTags = async () => {
      const wsId = currentWorkspace?.id || currentWorkspace?._id;
      if (!wsId) return;
      setLoading(true);
      try {
        const tags = await getTags(wsId);
        setAllTags(Array.isArray(tags) ? tags : []);
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, [currentWorkspace?.id, currentWorkspace?._id, reloadKey]);

  useEffect(() => {
    const refresh = () => setReloadKey((k) => k + 1);
    window.addEventListener("tags:changed", refresh);
    return () => window.removeEventListener("tags:changed", refresh);
  }, []);

  useEffect(() => {
    const handle = (e) => {
      if (
        open &&
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const toggleTag = (tagName) => {
    if (!onChange) return;
    if (selected.includes(tagName)) {
      onChange(selected.filter((t) => t !== tagName));
    } else {
      onChange([...selected, tagName]);
    }
  };

  const removeTag = (tagName) => {
    if (!onChange) return;
    onChange(selected.filter((t) => t !== tagName));
  };

  const summaryText = () => {
    if (!selected || selected.length === 0) return "Select tags";
    if (selected.length <= 2) return selected.join(", ");
    return `${selected.slice(0, 2).join(", ")} +${selected.length - 2}`;
  };

  return (
    <div className={dropdownStyles.wrapper} ref={containerRef}>
      {showLabel && <label className={styles.fieldLabel}>Tags</label>}

      {variant === "form" ? (
        <div className={dropdownStyles.selectedArea}>
          {selected.length === 0 && (
            <span className={dropdownStyles.placeholder}>No tags selected</span>
          )}
          {selected.map((tag) => {
            const def = allTags.find((t) => t.name === tag);
            const style = {
              backgroundColor: def?.backgroundColor || "#E5E7EB",
              color: def?.color || "#1F2937",
              border: "1px solid rgba(0,0,0,0.05)",
            };
            return (
              <span key={tag} className={dropdownStyles.tagPill} style={style}>
                {tag}
                {!readOnly && (
                  <button
                    type="button"
                    className={dropdownStyles.removeTagButton}
                    onClick={() => removeTag(tag)}
                    aria-label={`Remove ${tag}`}
                  >
                    <X className={dropdownStyles.removeIcon} />
                  </button>
                )}
              </span>
            );
          })}
          {!readOnly && (
            <button
              type="button"
              className={dropdownStyles.toggleButton}
              onClick={() => setOpen((o) => !o)}
            >
              <ChevronDown className={dropdownStyles.toggleIcon} />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          className={dropdownStyles.selectLike}
          onClick={() => !readOnly && setOpen((o) => !o)}
          disabled={readOnly}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className={dropdownStyles.selectLikeText}>{summaryText()}</span>
          <ChevronDown className={dropdownStyles.selectLikeIcon} />
        </button>
      )}

      {open && !readOnly && (
        <div className={dropdownStyles.dropdown}>
          <div className={dropdownStyles.listHeader}>Available Tags</div>
          <div className={dropdownStyles.listBody}>
            {loading && <div className={dropdownStyles.empty}>Loading...</div>}
            {!loading && allTags.length === 0 && (
              <div className={dropdownStyles.empty}>
                No tags defined
                <div style={{ marginTop: "0.25rem" }}>
                  <button
                    type="button"
                    className={dropdownStyles.inlineManage}
                    onClick={() => {
                      setOpen(false);
                      if (onOpenManager) onOpenManager();
                      else {
                        try {
                          window.dispatchEvent(
                            new CustomEvent("tags:openManager")
                          );
                        } catch {}
                      }
                    }}
                  >
                    Create one
                  </button>
                </div>
              </div>
            )}
            {!loading &&
              allTags.map((tag) => {
                const active = selected.includes(tag.name);
                return (
                  <button
                    key={tag._id || tag.name}
                    type="button"
                    className={`${dropdownStyles.item} ${
                      active ? dropdownStyles.itemActive : ""
                    }`}
                    onClick={() => toggleTag(tag.name)}
                  >
                    <span
                      className={dropdownStyles.colorSwatch}
                      style={{
                        backgroundColor: tag.backgroundColor,
                        color: tag.color,
                        border: "1px solid rgba(0,0,0,0.08)",
                      }}
                    >
                      {tag.name}
                    </span>
                  </button>
                );
              })}
          </div>
          <div className={dropdownStyles.footer}>
            <button
              type="button"
              className={dropdownStyles.manageButton}
              onClick={() => {
                setOpen(false);
                if (onOpenManager) {
                  onOpenManager();
                } else {
                  try {
                    window.dispatchEvent(new CustomEvent("tags:openManager"));
                  } catch {}
                }
              }}
            >
              <Plus className={dropdownStyles.manageIcon} /> Manage Tags
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagDropdown;

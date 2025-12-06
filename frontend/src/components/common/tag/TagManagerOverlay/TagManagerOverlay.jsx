import { useEffect, useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import {
  getTags,
  createTag,
  updateTag,
  deleteTag,
} from "../../../../services/tagService";
import { useContext } from "react";
import { WorkspaceContext } from "../../../../context/WorkspaceContext";
import toast from "react-hot-toast";
import styles from "./tagManagerOverlay.module.css";

const hexOk = (hex) => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex || "");

const TagRow = ({ tag, onSave, onDelete }) => {
  const [name, setName] = useState(tag?.name || "");
  const [color, setColor] = useState(tag?.color || "#111827");
  const [bg, setBg] = useState(tag?.backgroundColor || "#E5E7EB");
  const canSave = name.trim() && hexOk(color) && hexOk(bg);
  return (
    <div className={styles.row}>
      <div className={styles.preview} style={{ backgroundColor: bg, color }}>
        {name || "tag"}
      </div>
      <input
        className={styles.nameInput}
        value={name}
        onChange={(e) => setName(e.target.value.toLowerCase())}
        placeholder="name"
      />
      <input
        type="color"
        className={styles.colorInput}
        value={color}
        onChange={(e) => setColor(e.target.value)}
        title="Text color"
      />
      <input
        type="color"
        className={styles.colorInput}
        value={bg}
        onChange={(e) => setBg(e.target.value)}
        title="Background color"
      />
      <button
        className={styles.saveBtn}
        onClick={() =>
          onSave({ name: name.trim(), color, backgroundColor: bg })
        }
        disabled={!canSave}
      >
        <Save className={styles.icon} />
      </button>
      {tag?._id && (
        <button className={styles.deleteBtn} onClick={() => onDelete(tag)}>
          <Trash2 className={styles.icon} />
        </button>
      )}
    </div>
  );
};

const TagManagerOverlay = ({ isOpen, onClose, onChanged }) => {
  const { currentWorkspace } = useContext(WorkspaceContext);
  const wsId = currentWorkspace?.id || currentWorkspace?._id;
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  // Single draft row for creating new tags (removed auto-replacement behavior)
  const [showDraft, setShowDraft] = useState(false);

  const load = async () => {
    if (!wsId) return;
    setLoading(true);
    try {
      const list = await getTags(wsId);
      setTags(Array.isArray(list) ? list : []);
    } catch (e) {
      toast.error("Failed to load tags");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentWorkspace?.id, currentWorkspace?._id]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>Manage Tags</h3>
          <button className={styles.close} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.body}>
          {loading ? (
            <div className={styles.empty}>Loading...</div>
          ) : (
            <>
              <div className={styles.rows}>
                {tags.map((t) => (
                  <TagRow
                    key={t._id}
                    tag={t}
                    onSave={async (payload) => {
                      try {
                        await updateTag(t._id, payload);
                        toast.success("Updated");
                        await load();
                        try {
                          window.dispatchEvent(new CustomEvent("tags:changed"));
                        } catch {}
                        onChanged?.();
                      } catch (e) {
                        toast.error("Update failed");
                      }
                    }}
                    onDelete={async (tag) => {
                      if (!confirm(`Delete tag "${tag.name}"?`)) return;
                      try {
                        await deleteTag(tag._id);
                        toast.success("Deleted");
                        await load();
                        try {
                          window.dispatchEvent(new CustomEvent("tags:changed"));
                        } catch {}
                        onChanged?.();
                      } catch (e) {
                        toast.error("Delete failed");
                      }
                    }}
                  />
                ))}
              </div>
              <div className={styles.addRowWrapper}>
                {showDraft && (
                  <TagRow
                    tag={{
                      name: "",
                      color: "#111827",
                      backgroundColor: "#E5E7EB",
                    }}
                    onSave={async (payload) => {
                      try {
                        await createTag({
                          ...payload,
                          workspace: wsId,
                        });
                        toast.success("Created");
                        await load();
                        try {
                          window.dispatchEvent(new CustomEvent("tags:changed"));
                        } catch {}
                        onChanged?.();
                        // Hide draft after successful create
                        setShowDraft(false);
                      } catch (e) {
                        const msg =
                          e?.response?.data?.message || "Create failed";
                        toast.error(msg);
                      }
                    }}
                    onDelete={() => setShowDraft(false)}
                  />
                )}
                <button
                  className={styles.addBtn}
                  onClick={() => setShowDraft(true)}
                  disabled={showDraft}
                  title={showDraft ? "Finish current tag first" : undefined}
                >
                  <Plus className={styles.icon} /> Add Tag
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagManagerOverlay;

import { useEffect, useState, useRef } from "react";
import {
  addSubtask,
  updateSubtask,
  deleteSubtask,
} from "../../services/taskService";
import {
  ModalHeader,
  DescriptionSection,
  MetadataGrid,
  TagsSection,
  AttachmentsSection,
  CommentsSection,
  ModalFooter,
  SubtasksSection,
  ActivitySection,
} from "./taskDetailsModalModule";
import styles from "./taskDetailsModalModule/TaskDetailsModal.module.css";

const TaskDetailsModal = ({
  task,
  onClose,
  onUpdate,
  onAddComment,
  onDeleteAttachment,
  onAddAttachment,
  readOnly = false,
}) => {
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'subtasks' | 'comments' | 'files' | 'activity'
  const [activity, setActivity] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(
    task?.description || ""
  );
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  // Comments tab (Test-like) upload state
  const [isUploadingTest, setIsUploadingTest] = useState(false);
  const fileInputRef = useRef(null);
  const commentFileInputRef = useRef(null);
  const [subtasks, setSubtasks] = useState(() => {
    // Seed from task if present; otherwise empty UI-only list for now
    const initial = Array.isArray(task?.subtasks) ? task.subtasks : [];
    // Normalize to expected shape with id/title/completed
    return initial.map((s, idx) => ({
      id: s.id || s._id || String(idx),
      title: s.title || s.name || "",
      completed: !!(s.completed ?? s.done ?? false),
    }));
  });

  // Broadcast helper to update task cards' progress bars live
  const broadcastSubtasksUpdate = (nextSubtasks) => {
    try {
      window.dispatchEvent(
        new CustomEvent("task:subtasksUpdated", {
          detail: { taskId: task._id, subtasks: nextSubtasks },
        })
      );
    } catch (e) {
      // no-op
    }
  };

  // After any subtasks state change, broadcast once (avoids dispatch during render/updaters)
  useEffect(() => {
    const minimal = (Array.isArray(subtasks) ? subtasks : []).map(
      ({ id, title, completed }) => ({ id, title, completed })
    );
    broadcastSubtasksUpdate(minimal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtasks, task._id]);

  const subtasksCount = Array.isArray(subtasks) ? subtasks.length : 0;
  const completedSubtasksCount = Array.isArray(subtasks)
    ? subtasks.filter((s) => !!s.completed).length
    : 0;
  const commentsCount = Array.isArray(task?.comments)
    ? task.comments.length
    : 0;

  if (!task) return null;

  const handleStatusChange = (newStatus) => {
    onUpdate?.({ _id: task._id, status: newStatus });
  };

  const handlePriorityChange = (newPriority) => {
    onUpdate?.({ _id: task._id, priority: newPriority });
  };

  const handleRenameTitle = (newTitle) => {
    if (readOnly) return;
    const title = (newTitle ?? "").trim();
    if (!title) return; // ignore empty
    onUpdate?.({ _id: task._id, title });
  };

  const handleSaveDescription = () => {
    if (readOnly) return;
    onUpdate?.({ _id: task._id, description: editedDescription });
    setIsEditingDescription(false);
  };

  // Comments tab (Test-like): upload selected files directly to testAttachments
  const handleAddTestFiles = async (e) => {
    const files = Array.from(e.target?.files || []);
    if (files.length === 0) return;
    setIsUploadingTest(true);
    try {
      for (const file of files) {
        await onAddAttachment?.(file, "test");
      }
    } catch (err) {
      console.error("Failed to upload test attachments:", err);
    } finally {
      setIsUploadingTest(false);
      if (commentFileInputRef.current) commentFileInputRef.current.value = "";
    }
  };

  // Load activity when switching to the Activity tab
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoadingActivity(true);
        const { getTaskActivity } = await import("../../services/taskService");
        const wsId = getWorkspaceId();
        const prId = getProjectId();
        const items = await getTaskActivity(wsId, prId, task._id);
        setActivity(Array.isArray(items) ? items : []);
      } catch (e) {
        console.error("Failed to load task activity", e);
        setActivity([]);
      } finally {
        setLoadingActivity(false);
      }
    };
    if (activeTab === "activity") {
      fetchActivity();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, task._id]);

  // Helpers to derive ids
  const getWorkspaceId = () =>
    typeof task.workspace === "object" ? task.workspace._id : task.workspace;
  const getProjectId = () =>
    typeof task.project === "object" ? task.project._id : task.project;

  // Subtasks handlers (persisted)
  const handleAddSubtask = () => {
    if (readOnly) return;
    const id = `tmp-${Date.now()}`;
    setSubtasks((prev) => [
      ...prev,
      { id, title: "", completed: false, editing: true },
    ]);
  };

  const handleToggleSubtask = async (id) => {
    if (readOnly) return;
    // If any subtask is being edited, don't toggle (avoid blur/commit races)
    if (subtasks.some((s) => s.editing)) return;
    const sub = subtasks.find((s) => s.id === id);
    if (!sub) return;

    const nextCompleted = !sub.completed;

    // If this is a temp subtask (shouldn't be toggled while editing), ensure it has a title then create it with completed flag
    if (id.startsWith("tmp-")) {
      const title = (sub.title || "").trim();
      if (!title) return;
      try {
        const updatedTask = await addSubtask(
          getWorkspaceId(),
          getProjectId(),
          task._id,
          { title, completed: nextCompleted }
        );
        const normalized = (updatedTask.subtasks || []).map((s, idx) => ({
          id: s._id || s.id || String(idx),
          title: s.title || "",
          completed: !!s.completed,
        }));
        setSubtasks(normalized);
      } catch (e) {
        console.error("Failed to create subtask on toggle:", e);
      }
      return;
    }

    // Existing subtask: optimistic toggle and persist
    // Optimistic UI update
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: nextCompleted } : s))
    );
    try {
      const updatedTask = await updateSubtask(
        getWorkspaceId(),
        getProjectId(),
        task._id,
        sub.id || sub._id || id,
        { completed: nextCompleted }
      );
      const normalized = (updatedTask.subtasks || []).map((s, idx) => ({
        id: s._id || s.id || String(idx),
        title: s.title || "",
        completed: !!s.completed,
      }));
      setSubtasks(normalized);
    } catch (e) {
      // revert on error
      setSubtasks((prev) =>
        prev.map((s) => (s.id === id ? { ...s, completed: sub.completed } : s))
      );
      console.error("Failed to update subtask:", e);
    }
  };

  const handleChangeSubtaskTitle = (id, value) => {
    if (readOnly) return;
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: value } : s))
    );
  };

  const handleCommitSubtask = async (id) => {
    if (readOnly) return;
    const current = subtasks.find((s) => s.id === id);
    if (!current) return;
    const title = (current.title || "").trim();
    // If empty, drop (UI only)
    if (title.length === 0) {
      setSubtasks((prev) => prev.filter((s) => s.id !== id));
      return;
    }
    // mark not editing
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, editing: false } : s))
    );

    try {
      if (id.startsWith("tmp-")) {
        // create
        const updatedTask = await addSubtask(
          getWorkspaceId(),
          getProjectId(),
          task._id,
          title
        );
        const normalized = (updatedTask.subtasks || []).map((s, idx) => ({
          id: s._id || s.id || String(idx),
          title: s.title || "",
          completed: !!s.completed,
        }));
        setSubtasks(normalized);
      } else {
        // update existing title
        const updatedTask = await updateSubtask(
          getWorkspaceId(),
          getProjectId(),
          task._id,
          id,
          { title }
        );
        const normalized = (updatedTask.subtasks || []).map((s, idx) => ({
          id: s._id || s.id || String(idx),
          title: s.title || "",
          completed: !!s.completed,
        }));
        setSubtasks(normalized);
      }
    } catch (e) {
      console.error("Failed to save subtask:", e);
    }
  };

  const handleDeleteSubtask = async (id) => {
    if (readOnly) return;
    const sub = subtasks.find((s) => s.id === id);
    if (!sub) return;
    // If temp/unsaved, just drop locally
    if (id.startsWith("tmp-")) {
      setSubtasks((prev) => prev.filter((s) => s.id !== id));
      return;
    }
    try {
      const updatedTask = await deleteSubtask(
        getWorkspaceId(),
        getProjectId(),
        task._id,
        id
      );
      const normalized = (updatedTask.subtasks || []).map((s, idx) => ({
        id: s._id || s.id || String(idx),
        title: s.title || "",
        completed: !!s.completed,
      }));
      setSubtasks(normalized);
    } catch (e) {
      console.error("Failed to delete subtask:", e);
    }
  };

  const handleStartEditSubtask = (id) => {
    if (readOnly) return;
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, editing: true } : s))
    );
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploadingFile(true);
    try {
      // Upload files one by one
      for (const file of files) {
        await onAddAttachment?.(file);
      }
    } catch (error) {
      console.error("Failed to upload file:", error);
    } finally {
      setIsUploadingFile(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Comments tab: classic flow (files are sent with the comment on submit)

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <ModalHeader
          task={task}
          onClose={onClose}
          onStatusChange={handleStatusChange}
          onPriorityChange={handlePriorityChange}
          onRename={handleRenameTitle}
          readOnly={readOnly}
        />

        {/* Tabs */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabsList}>
            <button
              className={`${styles.tabButton} ${
                activeTab === "overview" ? styles.tabButtonActive : ""
              }`}
              onClick={() => setActiveTab("overview")}
              type="button"
            >
              Overview
            </button>
            <button
              className={`${styles.tabButton} ${
                activeTab === "subtasks" ? styles.tabButtonActive : ""
              }`}
              onClick={() => setActiveTab("subtasks")}
              type="button"
            >
              {`Subtasks (${completedSubtasksCount} of ${subtasksCount})`}
            </button>
            <button
              className={`${styles.tabButton} ${
                activeTab === "comments" ? styles.tabButtonActive : ""
              }`}
              onClick={() => setActiveTab("comments")}
              type="button"
            >
              {`Comments (${commentsCount})`}
            </button>
            {/* Files and Test tabs removed */}
            <button
              className={`${styles.tabButton} ${
                activeTab === "activity" ? styles.tabButtonActive : ""
              }`}
              onClick={() => setActiveTab("activity")}
              type="button"
            >
              Activity
            </button>
          </div>
        </div>

        <div className={styles.content}>
          {activeTab === "overview" && (
            <>
              <DescriptionSection
                description={task.description}
                isEditing={isEditingDescription}
                editedDescription={editedDescription}
                onEdit={() => setIsEditingDescription(true)}
                onSave={handleSaveDescription}
                onCancel={() => {
                  setIsEditingDescription(false);
                  setEditedDescription(task.description || "");
                }}
                onChange={(e) => setEditedDescription(e.target.value)}
                readOnly={readOnly}
              />

              <MetadataGrid task={task} />
              <TagsSection tags={task.tags} />

              <AttachmentsSection
                attachments={task.attachments}
                onAddFile={handleFileUpload}
                onDeleteAttachment={onDeleteAttachment}
                taskId={task._id}
                fileInputRef={fileInputRef}
                isUploading={isUploadingFile}
                readOnly={readOnly}
              />
            </>
          )}

          {activeTab === "subtasks" && (
            <SubtasksSection
              subtasks={subtasks}
              onAdd={handleAddSubtask}
              onToggle={handleToggleSubtask}
              onChangeTitle={handleChangeSubtaskTitle}
              onCommit={handleCommitSubtask}
              onDelete={handleDeleteSubtask}
              onStartEdit={handleStartEditSubtask}
              readOnly={readOnly}
            />
          )}

          {activeTab === "comments" && (
            <CommentsSection
              attachments={task.testAttachments}
              comments={task.comments}
              onAddFile={handleAddTestFiles}
              onDeleteAttachment={onDeleteAttachment}
              onAddComment={onAddComment}
              taskId={task._id}
              fileInputRef={commentFileInputRef}
              isUploading={isUploadingTest}
              readOnly={readOnly}
            />
          )}

          {activeTab === "activity" && (
            <ActivitySection items={activity} loading={loadingActivity} />
          )}

          {/* Files and Test tab content removed */}
        </div>

        <ModalFooter createdAt={task.createdAt} updatedAt={task.updatedAt} />
      </div>
    </div>
  );
};

export default TaskDetailsModal;

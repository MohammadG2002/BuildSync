export default async function handleSendQueuedFiles({
  readOnly,
  queuedFiles,
  onAddFile,
  setIsSendingQueued,
  setQueuedFiles,
  newComment,
  setIsSubmitting,
  setNewComment,
  onAddComment,
  taskId,
}) {
  if (readOnly || !queuedFiles || queuedFiles.length === 0) return;
  if (typeof onAddFile !== "function") return;
  setIsSendingQueued?.(true);
  try {
    // Build a synthetic event with a FileList so we can reuse onAddFile
    const dt = new DataTransfer();
    queuedFiles.forEach((f) => dt.items.add(f));
    const syntheticEvent = { target: { files: dt.files } };
    await onAddFile(syntheticEvent);
    setQueuedFiles?.([]);
    // After attachments upload, automatically send the comment (text optional)
    try {
      setIsSubmitting?.(true);
      const text = (newComment || "").trim();
      await onAddComment?.(taskId, text, []);
      setNewComment?.("");
    } catch (e) {
      console.error("Auto-send comment after attachments failed:", e);
    } finally {
      setIsSubmitting?.(false);
    }
  } catch (err) {
    console.error("Failed to send queued files (Comments tab):", err);
  } finally {
    setIsSendingQueued?.(false);
  }
}

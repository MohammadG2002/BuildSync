import handleSubmitComment from "./handleSubmitComment";

// Unified send: if files are queued, attach them to the newly created comment
export default async function handleUnifiedSend(e, params) {
  e?.preventDefault?.();
  const {
    readOnly,
    queuedFiles,
    onAddComment,
    taskId,
    newComment,
    setNewComment,
    setQueuedFiles,
    setIsSubmitting,
  } = params || {};
  if (readOnly) return;
  const files = Array.from(queuedFiles || []);

  // If there are files queued, create the comment and upload files with it
  if (files.length > 0) {
    try {
      setIsSubmitting?.(true);
      await onAddComment?.(taskId, newComment || "", files);
      setNewComment?.("");
      setQueuedFiles?.([]);
    } catch (err) {
      console.error("Failed to add comment with attachments:", err);
      throw err;
    } finally {
      setIsSubmitting?.(false);
    }
    return;
  }

  // Otherwise send text-only comment
  await handleSubmitComment(null, params);
}

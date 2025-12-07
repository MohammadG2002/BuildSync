export default async function handleSubmitComment(
  e,
  { readOnly, newComment, setNewComment, setIsSubmitting, onAddComment, taskId }
) {
  e?.preventDefault?.();
  if (readOnly) return;
  const text = (newComment || "").trim();
  if (!text) return;
  try {
    setIsSubmitting?.(true);
    await onAddComment?.(taskId, text, []);
    setNewComment?.("");
  } catch (err) {
    console.error("Failed to add comment from Comments tab:", err);
  } finally {
    setIsSubmitting?.(false);
  }
}

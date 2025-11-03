export default function handleFileSelect(e, { readOnly, setQueuedFiles }) {
  if (readOnly) return;
  const files = Array.from(e?.target?.files || []);
  if (!files.length) return;
  setQueuedFiles?.((prev) => [...prev, ...files]);
  try {
    if (e?.target) e.target.value = "";
  } catch (_) {}
}

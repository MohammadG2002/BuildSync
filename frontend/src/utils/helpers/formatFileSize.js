/**
 * Format file size in bytes to human-readable format.
 * Consolidated into main helpers export; prefer importing from `utils/helpers`.
 * @param {number} bytes
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.min(
    sizes.length - 1,
    Math.floor(Math.log(bytes) / Math.log(k))
  );
  const value = bytes / Math.pow(k, i);
  return `${value % 1 === 0 ? value : value.toFixed(2)} ${sizes[i]}`;
};

export default formatFileSize;

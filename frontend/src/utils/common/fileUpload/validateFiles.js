// Validate files based on size, type, and count restrictions
const validateFiles = (
  newFiles,
  existingFiles,
  maxFiles,
  maxSize,
  acceptedTypes
) => {
  const validationErrors = [];

  // Validate file count
  if (existingFiles.length + newFiles.length > maxFiles) {
    validationErrors.push(`Maximum ${maxFiles} files allowed`);
    return { validFiles: [], errors: validationErrors };
  }

  // Validate file size and type
  const validFiles = newFiles.filter((file) => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      validationErrors.push(`${file.name}: File size exceeds ${maxSize}MB`);
      return false;
    }

    // Check if file type is accepted
    const isAccepted = acceptedTypes.some((type) => {
      if (type.includes("*")) {
        // Handle wildcard types like "image/*"
        const baseType = type.split("/")[0];
        return file.type.startsWith(baseType);
      }
      // Handle specific extensions like ".pdf"
      if (type.startsWith(".")) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      // Handle MIME types like "application/pdf"
      return file.type === type;
    });

    if (!isAccepted) {
      validationErrors.push(`${file.name}: File type not supported`);
      return false;
    }

    return true;
  });

  return { validFiles, errors: validationErrors };
};

export default validateFiles;

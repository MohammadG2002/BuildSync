import {
  File,
  Image as ImageIcon,
  FileText,
  FileSpreadsheet,
} from "lucide-react";

// Get appropriate icon component for file type
const getFileIcon = (file) => {
  if (file.type.startsWith("image/")) return ImageIcon;
  if (file.type.includes("pdf")) return FileText;
  if (file.type.includes("sheet") || file.type.includes("excel"))
    return FileSpreadsheet;
  return File;
};

export default getFileIcon;

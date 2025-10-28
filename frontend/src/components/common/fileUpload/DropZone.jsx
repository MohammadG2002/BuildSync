import { Upload } from "lucide-react";
import Button from "../Button";
import getDropZoneClassName from "./getDropZoneClassName";
import getUploadIconClassName from "./getUploadIconClassName";

const DropZone = ({
  fileInputRef,
  dragActive,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onChange,
  multiple,
  acceptedTypes,
  maxFiles,
  maxSize,
}) => {
  return (
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={getDropZoneClassName(dragActive)}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={acceptedTypes.join(",")}
        onChange={onChange}
        className="hidden"
      />

      <Upload className={getUploadIconClassName(dragActive)} />

      <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">
        Drop files here or click to upload
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Maximum {maxFiles} files, up to {maxSize}MB each
      </p>

      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
      >
        Choose Files
      </Button>
    </div>
  );
};

export default DropZone;
